import { appConfig } from '../../config/env';
import type { User } from '../../types';
import { api } from '../client';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authService = {
  async login(username: string, password: string) {
    try {
      return await api.post<LoginResponse>('/auth/login', { username, password });
    } catch (error) {
      if (!appConfig.demoMode) throw error;
      return {
        data: {
          access_token: `demo-token-${Date.now()}`,
          token_type: 'bearer',
          user: {
            id: '1', username: username || 'admin', role: 'commander',
            fullName: username === 'admin' ? 'Sector Commander' : `Commander ${username}`,
          },
        } satisfies LoginResponse,
      };
    }
  },
  getMe: () => api.get<User>('/auth/me'),
  refresh: () => api.post<LoginResponse>('/auth/refresh'),
};
