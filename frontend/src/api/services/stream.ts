import { apiFetch } from '../client';

export const streamService = {
  getAlerts: () => apiFetch('/stream/alerts'),
  getZone: () => apiFetch('/stream/zone'),
  updateZone: (polygon: number[][]) => apiFetch('/stream/zone', { method: 'POST', body: JSON.stringify({ polygon }) }),
  getSource: () => apiFetch('/stream/source'),
  updateSource: (source: unknown) => apiFetch('/stream/source', { method: 'POST', body: JSON.stringify(source) }),
};
