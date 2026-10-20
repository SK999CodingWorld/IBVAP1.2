import { apiFetch } from '../client';

export const securityService = {
  getOverview: () => apiFetch('/security/overview'),
  getActiveSessions: () => apiFetch('/security/active-sessions'),
  terminateSession: (id: string) => apiFetch(`/security/active-sessions/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  getAuthEvents: () => apiFetch('/security/auth-events'),
  rotateKms: () => apiFetch('/security/kms/rotate', { method: 'POST' }),
  getIntegrations: () => apiFetch('/security/integrations'),
  createIntegration: (data: unknown) => apiFetch('/security/integrations', { method: 'POST', body: JSON.stringify(data) }),
  toggleIntegration: (id: string) => apiFetch(`/security/integrations/${encodeURIComponent(id)}/toggle`, { method: 'PUT' }),
  testIntegration: (id: string) => apiFetch(`/security/integrations/${encodeURIComponent(id)}/test`, { method: 'POST' }),
  deleteIntegration: (id: string) => apiFetch(`/security/integrations/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  getEncryptionStatus: () => apiFetch('/security/encryption-status'),
};
