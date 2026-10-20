import { apiFetch } from '../client';

export const analyticsService = {
  heatmap: () => apiFetch('/analytics/heatmap'),
};
