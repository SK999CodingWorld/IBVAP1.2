import { apiFetch } from '../client';

export const dashboardService = {
  getKPIs: () => apiFetch('/dashboard/kpis'),
  getRecentAlerts: () => apiFetch('/dashboard/recent-alerts'),
  getRecentEvents: () => apiFetch('/dashboard/recent-events'),
  getSystemMetrics: () => apiFetch('/system/performance-metrics'),
};
