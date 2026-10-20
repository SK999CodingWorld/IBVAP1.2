/** Public, build-time frontend configuration. Never place secrets in Vite variables. */
function normalizeApiBaseUrl(value: string | undefined): string {
  const baseUrl = (value || '/api/v1').trim().replace(/\/+$/, '');
  if (!baseUrl) return '/api/v1';
  if (baseUrl.startsWith('/')) return baseUrl;

  try {
    const parsed = new URL(baseUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('VITE_API_BASE_URL must use http or https.');
    }
    return baseUrl;
  } catch {
    throw new Error('Invalid VITE_API_BASE_URL. Use a relative path or an http(s) URL.');
  }
}

function parseTimeout(value: string | undefined): number {
  if (!value) return 20_000;
  const timeout = Number(value);
  if (!Number.isInteger(timeout) || timeout < 1_000 || timeout > 120_000) {
    throw new Error('VITE_API_TIMEOUT_MS must be an integer between 1000 and 120000.');
  }
  return timeout;
}

const legacyApiUrl = import.meta.env.VITE_API_URL;
const configuredApiUrl = import.meta.env.VITE_API_BASE_URL;

if (import.meta.env.DEV && legacyApiUrl && configuredApiUrl && legacyApiUrl !== configuredApiUrl) {
  console.warn('Both VITE_API_URL and VITE_API_BASE_URL are configured; VITE_API_BASE_URL takes precedence.');
}

export const appConfig = Object.freeze({
  apiBaseUrl: normalizeApiBaseUrl(configuredApiUrl || legacyApiUrl),
  apiTimeoutMs: parseTimeout(import.meta.env.VITE_API_TIMEOUT_MS),
  demoMode: import.meta.env.VITE_DEMO_MODE === 'true',
  isDevelopment: import.meta.env.DEV,
});
