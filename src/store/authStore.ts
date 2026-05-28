import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types';

interface AuthState {
  token: string | null;
  user: User | null;
  sidebarCollapsed: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      sidebarCollapsed: false,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: 'payflow-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

export function useCurrentRole(): UserRole | null {
  return useAuthStore((s) => s.user?.role ?? null);
}
