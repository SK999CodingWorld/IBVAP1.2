from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict
from pydantic import field_validator, model_validator
from pathlib import Path
from typing import Annotated, Any, List
import json

PROJECT_ROOT = Path(__file__).resolve().parents[3]

class Settings(BaseSettings):
    # Environment & Host
    ENVIRONMENT: str = "development"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Security & Tokens
    SECRET_KEY: str = "supersecretkey-change-in-production-ibvap-safe-dev-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    WEBHOOK_SECRET: str = "ibvap_default_webhook_secret_32bytes_min"

    # Database Configuration & Pool Sizing
    DATABASE_URL: str = "sqlite+aiosqlite:///./ibvap.db"
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_RECYCLE: int = 1800
    DB_SSL: bool = False
    DB_STATEMENT_CACHE_SIZE: int = 100

    # Cache & Messaging
    REDIS_URL: str = "redis://localhost:6379"

    # CORS & Limits
    CORS_ORIGINS: Annotated[List[str], NoDecode] = ["*"]
    RATE_LIMIT_PER_MINUTE: int = 120
    MAX_REQUEST_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB

    # Feature Flags & Demo Mode
    DEMO_MODE: bool = True
    DEMO_ADMIN_USERNAME: str = "admin"
    DEMO_ADMIN_PASSWORD: str = "admin123"
    ENABLE_KEY_HEALTH_CHECK: bool = False
    ENABLE_BACKGROUND_WORKERS: bool = True

    # Edge & AI
    AI_BACKEND: str = "mock"
    EDGE_NODE_ID: str = "EDGE-001"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: Any) -> Any:
        """Accept JSON arrays or comma-separated origins from deployment envs."""
        if isinstance(value, (list, tuple)):
            origins = list(value)
        elif isinstance(value, str):
            raw_value = value.strip()
            if not raw_value:
                return []
            try:
                decoded = json.loads(raw_value)
            except json.JSONDecodeError as exc:
                if raw_value.startswith("[") or raw_value.endswith("]"):
                    raise ValueError(
                        "CORS_ORIGINS must be a valid JSON array or comma-separated HTTPS origins."
                    ) from exc
                origins = raw_value.split(",")
            else:
                origins = decoded if isinstance(decoded, list) else [decoded]
        else:
            return value

        if not all(isinstance(origin, str) for origin in origins):
            raise ValueError("CORS_ORIGINS entries must all be strings.")
        return [origin.strip().rstrip("/") for origin in origins if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=PROJECT_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    @model_validator(mode="after")
    def validate_production_readiness(self) -> "Settings":
        # Fail fast in production environment
        if self.ENVIRONMENT.lower() == "production":
            insecure_keys = {
                "supersecretkey-change-in-production",
                "supersecretkey-change-in-production-ibvap-safe-dev-key",
                "secret",
                "change-me",
                "admin123"
            }
            if not self.SECRET_KEY or self.SECRET_KEY in insecure_keys or len(self.SECRET_KEY) < 32:
                raise ValueError(
                    "FATAL: In production, SECRET_KEY must be a cryptographically strong secret "
                    "with at least 32 characters. Found default or insecure secret."
                )
            if not self.DATABASE_URL or self.DATABASE_URL.startswith("sqlite"):
                raise ValueError(
                    "FATAL: In production, DATABASE_URL must be configured with a PostgreSQL database "
                    "(e.g. postgresql+asyncpg://user:pass@host:port/dbname). SQLite is not permitted."
                )
            if self.DEMO_MODE:
                raise ValueError("FATAL: DEMO_MODE must be false in production.")
            if self.ENABLE_BACKGROUND_WORKERS:
                raise ValueError(
                    "FATAL: ENABLE_BACKGROUND_WORKERS must be false for the web API. "
                    "Run camera and AI workers as separate services."
                )
            if not self.WEBHOOK_SECRET or len(self.WEBHOOK_SECRET) < 32 or self.WEBHOOK_SECRET == "ibvap_webhook_signature_secret_32bytes_change_in_prod":
                raise ValueError("FATAL: WEBHOOK_SECRET must be a unique secret with at least 32 characters.")
            if not self.DB_SSL:
                raise ValueError("FATAL: DB_SSL must be enabled for production database connections.")
            if not self.CORS_ORIGINS or "*" in self.CORS_ORIGINS:
                raise ValueError("FATAL: Set explicit frontend origins in CORS_ORIGINS for production.")
            if any(not origin.startswith("https://") for origin in self.CORS_ORIGINS):
                raise ValueError("FATAL: Production CORS_ORIGINS must contain HTTPS origins only.")
        return self

settings = Settings()
