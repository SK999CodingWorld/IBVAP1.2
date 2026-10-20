import { api } from '../client';

export const alertService = {
  list: (params?: { severity?: string; status?: string; skip?: number; limit?: number }) => api.get('/alerts', { params }),
  get: (id: number | string) => api.get(`/alerts/${encodeURIComponent(String(id))}`),
  getStats: () => api.get('/alerts/stats/summary'),
  acknowledge: (id: number | string) => api.post(`/alerts/${encodeURIComponent(String(id))}/acknowledge`),
  escalate: (id: number | string) => api.post(`/alerts/${encodeURIComponent(String(id))}/escalate`),
  resolve: (id: number | string, notes?: string) => api.post(`/alerts/${encodeURIComponent(String(id))}/resolve`, { resolution_notes: notes }),
  markFalsePositive: (id: number | string) => api.post(`/alerts/${encodeURIComponent(String(id))}/false-positive`),
};

export const incidentService = {
  list: (params?: { status?: string; severity?: string; skip?: number; limit?: number }) => api.get('/incidents', { params }),
  get: (id: number | string) => api.get(`/incidents/${encodeURIComponent(String(id))}`),
  getStats: () => api.get('/incidents/stats/summary'),
  create: (data: unknown) => api.post('/incidents', data),
  update: (id: number | string, data: unknown) => api.put(`/incidents/${encodeURIComponent(String(id))}`, data),
};
