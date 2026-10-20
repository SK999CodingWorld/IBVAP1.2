import axios,{ AxiosError,AxiosInstance } from 'axios';
import { appConfig } from '../config/env';
import { clearSessionToken,readSessionToken } from '../lib/session';
import { useAppStore } from '../stores/appStore';

export interface ApiErrorPayload {
  detail?: unknown;
  message?: string;
  error?: { code?: string; message?: string; details?: unknown } | string;
  request_id?: string;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly requestId?: string;
  readonly details?: unknown;

  constructor(message: string, options: { status?: number; code?: string; requestId?: string; details?: unknown } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.requestId = options.requestId;
    this.details = options.details;
  }
}

function getMessage(detail: unknown): string | undefined {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((entry) => typeof entry?.msg === 'string' ? entry.msg : '').filter(Boolean).join('; ');
  }
  return undefined;
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (!axios.isAxiosError<ApiErrorPayload>(error)) {
    return new ApiError(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
  const payload = error.response?.data;
  const nestedError = typeof payload?.error === 'object' ? payload.error : undefined;
  const message = nestedError?.message || payload?.message || getMessage(payload?.detail) || error.message;
  return new ApiError(message || 'The request could not be completed', {
    status: error.response?.status,
    code: nestedError?.code,
    requestId: payload?.request_id || error.response?.headers?.['x-request-id'],
    details: nestedError?.details,
  });
}

const API_BASE_URL = appConfig.apiBaseUrl;

/** Build a browser-loadable URL for authenticated media endpoints (img/video cannot set headers). */
export function getAuthenticatedMediaUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const apiOrigin = new URL(API_BASE_URL, window.location.origin).origin;
  const url = new URL(path, apiOrigin);
  const token = readSessionToken();
  if (token) url.searchParams.set('token', token);
  return url.toString();
}

/** Use the configured API host for realtime connections, with the token as a WebSocket subprotocol. */
export function getAuthenticatedWebSocket(path: string): WebSocket | null {
  const token = readSessionToken();
  if (!token) return null;
  const url = new URL(path, new URL(API_BASE_URL, window.location.origin));
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return new WebSocket(url, ['ibvap', token]);
}

function handleUnauthorized(): void {
  if (window.location.pathname === '/login') return;
  clearSessionToken();
  window.location.assign('/login');
}

function resolveApiUrl(input: RequestInfo | URL): RequestInfo | URL {
  if (input instanceof Request) return input;
  const value = input.toString();
  if (!value.startsWith('/')) return input;
  const resourcePath = value.replace(/^\/api\/v1\//, '').replace(/^\/api\//, '').replace(/^\//, '');
  return `${API_BASE_URL}/${resourcePath}`;
}

export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = readSessionToken();
  if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !headers.has('Content-Type') && typeof init.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const controller = new AbortController();
  const abortFromCaller = () => controller.abort(init.signal?.reason);
  if (init.signal?.aborted) abortFromCaller();
  else init.signal?.addEventListener('abort', abortFromCaller, { once: true });
  const timeoutId = window.setTimeout(
    () => controller.abort(new DOMException('The request timed out.', 'TimeoutError')),
    appConfig.apiTimeoutMs,
  );

  try {
    const response = await window.fetch(resolveApiUrl(input), { ...init, headers, signal: controller.signal });
    useAppStore.getState().setNetworkStatus('online');

    if (!response.ok) {
      const payload = await response.clone().json().catch(() => null) as ApiErrorPayload | null;
      const nestedError = typeof payload?.error === 'object' ? payload.error : undefined;
      const message = nestedError?.message || payload?.message || getMessage(payload?.detail) || response.statusText;
      if (response.status === 401) handleUnauthorized();
      throw new ApiError(message || 'The request could not be completed', {
        status: response.status,
        code: nestedError?.code,
        requestId: payload?.request_id || response.headers.get('x-request-id') || undefined,
        details: nestedError?.details,
      });
    }
    return response;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (!(error instanceof DOMException && error.name === 'AbortError')) {
      useAppStore.getState().setNetworkStatus('offline');
    }
    throw toApiError(error);
  } finally {
    window.clearTimeout(timeoutId);
    init.signal?.removeEventListener('abort', abortFromCaller);
  }
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: appConfig.apiTimeoutMs,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = readSessionToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    useAppStore.getState().setNetworkStatus('online');
    return response;
  },
  (error: AxiosError<ApiErrorPayload>) => {
    if (!error.response) useAppStore.getState().setNetworkStatus('offline');
    if (error.response?.status === 401) handleUnauthorized();
    return Promise.reject(toApiError(error));
  },
);

export default api;
