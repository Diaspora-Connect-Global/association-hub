import { create } from "zustand";
import { persist } from "zustand/middleware";
import { adminLogin as adminLoginApi } from "@/services/graphql/adminAuth";
import type { AdminUserInfo } from "@/services/graphql/adminAuth";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = atob(padded);

    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getTokenExpiry(token: string | null): number | null {
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  const exp = payload?.exp;

  return typeof exp === "number" ? exp * 1000 : null;
}

interface AdminAuthState {
  accessToken: string | null;
  refreshToken: string | null;
  admin: AdminUserInfo | null;
  tokenExpiresAt: number | null;
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
      tokenExpiresAt: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await adminLoginApi({ email, password });
          if (
            response.success &&
            response.accessToken &&
            response.admin &&
            response.admin.scopeType === "ASSOCIATION"
          ) {
            set({
              accessToken: response.accessToken,
              refreshToken: response.refreshToken ?? null,
              admin: response.admin,
              tokenExpiresAt: getTokenExpiry(response.accessToken),
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return { success: true };
          }

          const fallbackError =
            response.error ??
            response.message ??
            (response.admin?.scopeType && response.admin.scopeType !== "ASSOCIATION"
              ? "This portal is restricted to association admin accounts."
              : "Login failed");

          set({
            isLoading: false,
            error: fallbackError,
          });
          return { success: false, error: fallbackError };
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
          tokenExpiresAt: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "admin-auth",
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        const expiry = getTokenExpiry(state.accessToken);
        const isExpired = typeof expiry === "number" ? Date.now() >= expiry : false;

        state.tokenExpiresAt = expiry;
        state.isAuthenticated = Boolean(state.accessToken && state.admin && !isExpired);

        if (isExpired) {
          state.accessToken = null;
          state.refreshToken = null;
          state.admin = null;
          state.tokenExpiresAt = null;
          state.isAuthenticated = false;
        }
      },
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        admin: state.admin,
        tokenExpiresAt: state.tokenExpiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/** Returns current access token (for GraphQL client auth getter). Use outside React. */
export function getAdminAccessToken(): string | null {
  return useAdminAuthStore.getState().accessToken;
}

export function getAdminAssociationId(): string | null {
  const admin = useAdminAuthStore.getState().admin;
  return admin?.scopeType === "ASSOCIATION" ? admin.scopeId : null;
}

export function getAdminPermissions(): string[] {
  return useAdminAuthStore.getState().admin?.role?.permissions ?? [];
}

export function getAdminTokenExpiry(): number | null {
  return useAdminAuthStore.getState().tokenExpiresAt;
}

export function isAdminSessionExpired(): boolean {
  const expiry = useAdminAuthStore.getState().tokenExpiresAt;
  return typeof expiry === "number" ? Date.now() >= expiry : false;
}

export function clearAdminSession(): void {
  useAdminAuthStore.getState().logout();
}
