import { apiFetch } from '../client';

export const zoneService = {
  list: () => apiFetch('/zones'),
  get: (id: string) => apiFetch(`/zones/${encodeURIComponent(id)}`),
  create: (data: Record<string, unknown>) => apiFetch('/zones', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, unknown>) => apiFetch(`/zones/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/zones/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  toggle: (id: string) => apiFetch(`/zones/${encodeURIComponent(id)}/toggle`, { method: 'POST' }),
  getEvents: (id: string) => apiFetch(`/zones/${encodeURIComponent(id)}/events`),
};
