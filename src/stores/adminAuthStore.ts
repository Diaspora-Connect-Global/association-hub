import { create } from "zustand";
import { persist } from "zustand/middleware";
import { adminLogin as adminLoginApi } from "@/services/graphql/adminAuth";
import type { AdminUserInfo } from "@/services/graphql/adminAuth";

interface AdminAuthState {
  accessToken: string | null;
  refreshToken: string | null;
  admin: AdminUserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      admin: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await adminLoginApi({ email, password });
          if (response.success && response.accessToken && response.admin) {
            set({
              accessToken: response.accessToken,
              refreshToken: response.refreshToken ?? null,
              admin: response.admin,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return { success: true };
          }
          set({
            isLoading: false,
            error: response.error ?? response.message ?? "Login failed",
          });
          return { success: false, error: response.error ?? response.message ?? "Login failed" };
        } catch (err) {
          const message = err instanceof Error ? err.message : "Network error";
          set({ isLoading: false, error: message });
          return { success: false, error: message };
        }
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          admin: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "admin-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/** Returns current access token (for GraphQL client auth getter). Use outside React. */
export function getAdminAccessToken(): string | null {
  return useAdminAuthStore.getState().accessToken;
}
