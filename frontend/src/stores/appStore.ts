import { create } from 'zustand';

type NetworkStatus = 'online' | 'offline';

interface AppState {
  networkStatus: NetworkStatus;
  setNetworkStatus: (status: NetworkStatus) => void;
}

export const useAppStore = create<AppState>((set) => ({
  networkStatus: 'online',
  setNetworkStatus: (status) => set({ networkStatus: status }),
}));

if (typeof window !== 'undefined') {
  useAppStore.getState().setNetworkStatus(navigator.onLine ? 'online' : 'offline');
  window.addEventListener('online', () => useAppStore.getState().setNetworkStatus('online'));
  window.addEventListener('offline', () => useAppStore.getState().setNetworkStatus('offline'));
}
