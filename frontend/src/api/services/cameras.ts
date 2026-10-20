import { api } from '../client';

export const cameraService = {
  list: (params?: { zone?: string; status?: string; skip?: number; limit?: number }) => api.get('/cameras', { params }),
  get: (id: string) => api.get(`/cameras/${encodeURIComponent(id)}`),
  create: (data: unknown) => api.post('/cameras', data),
  update: (id: string, data: unknown) => api.put(`/cameras/${encodeURIComponent(id)}`, data),
  delete: (id: string) => api.delete(`/cameras/${encodeURIComponent(id)}`),
  test: (id: string) => api.post(`/cameras/${encodeURIComponent(id)}/test`),
  restart: (id: string) => api.post(`/cameras/${encodeURIComponent(id)}/restart`),
  getHealth: (id: string) => api.get(`/cameras/${encodeURIComponent(id)}/health`),
  getHealthSummary: () => api.get('/cameras/health/summary'),
  ptzStatus: (id: string) => api.get(`/ptz/cameras/${encodeURIComponent(id)}/status`),
  ptzInit: (id: string) => api.post(`/ptz/cameras/${encodeURIComponent(id)}/initialize`),
  ptzMoveAbsolute: (id: string, pan: number, tilt: number, zoom: number) => api.post(`/ptz/cameras/${encodeURIComponent(id)}/move/absolute`, { pan, tilt, zoom }),
  ptzMoveRelative: (id: string, pan: number, tilt: number, zoom: number) => api.post(`/ptz/cameras/${encodeURIComponent(id)}/move/relative`, { pan, tilt, zoom }),
  ptzStop: (id: string) => api.post(`/ptz/cameras/${encodeURIComponent(id)}/stop`),
  ptzGetPresets: (id: string) => api.get(`/ptz/cameras/${encodeURIComponent(id)}/presets`),
  ptzGotoPreset: (id: string, presetName: string) => api.post(`/ptz/cameras/${encodeURIComponent(id)}/preset`, { preset_name: presetName }),
};
