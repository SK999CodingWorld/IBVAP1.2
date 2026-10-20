import { apiFetch } from '../client';

export const trackingService = {
  list: () => apiFetch('/tracks'),
};
