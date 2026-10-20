import { apiFetch } from '../client';

export const anprService = {
  getReads: (limit = 60) => apiFetch(`/anpr/reads?limit=${encodeURIComponent(String(limit))}`),
  getStats: () => apiFetch('/anpr/stats'),
  getHotlist: () => apiFetch('/anpr/hotlist'),
  addToHotlist: (data: Record<string, unknown>) => apiFetch('/anpr/hotlist', { method: 'POST', body: JSON.stringify(data) }),
  removeFromHotlist: (plate: string) => apiFetch(`/anpr/hotlist/${encodeURIComponent(plate)}`, { method: 'DELETE' }),
  searchPlate: (plate: string) => apiFetch(`/anpr/search/${encodeURIComponent(plate)}`),
  vahanLookup: (plate: string) => apiFetch(`/anpr/vahan/${encodeURIComponent(plate)}`),
  simulateScan: (data: Record<string, unknown>) => apiFetch('/anpr/simulate-scan', { method: 'POST', body: JSON.stringify(data) }),
};
