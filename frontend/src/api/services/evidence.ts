import { apiFetch } from '../client';

export const evidenceService = {
  search: (query = '') => apiFetch(`/evidence/search${query ? `?${query}` : ''}`),
  getStats: () => apiFetch('/evidence/stats'),
  getManifest: (caseId: string) => apiFetch(`/evidence/${encodeURIComponent(caseId)}/manifest`),
  resolveCase: (caseId: string) => apiFetch(`/evidence/${encodeURIComponent(caseId)}/resolve`, { method: 'POST' }),
};
