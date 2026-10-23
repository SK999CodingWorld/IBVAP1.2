"""One-time production account bootstrap helpers."""

import logging

from sqlalchemy.exc import IntegrityError
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import get_password_hash_async
from app.models.user import User

logger = logging.getLogger(__name__)


async def bootstrap_initial_admin(session: AsyncSession) -> bool:
    """Create the first administrator only when a password was configured.

    This is safe to call on every startup: once any user exists, the bootstrap
    password is ignored. Remove INITIAL_ADMIN_PASSWORD from the service after
    the first administrator is created.
    """
    existing_user_id = await session.scalar(select(User.id).limit(1))
    if existing_user_id is not None:
        return False

    password = settings.INITIAL_ADMIN_PASSWORD
    if not password:
        logger.warning(
            "No application users exist. Set INITIAL_ADMIN_PASSWORD temporarily "
            "to create the first admin account."
        )
        return False

    session.add(
        User(
            username="admin",
            email="admin@ibvap.local",
            hashed_password=await get_password_hash_async(password),
            full_name="System Admin",
            role="admin",
            is_active=True,
        )
    )
    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        # Another instance may have completed the same one-time bootstrap.
        if await session.scalar(select(User.id).limit(1)) is not None:
            return False
        raise

    logger.info("Bootstrapped the initial administrator account.")
    return True
