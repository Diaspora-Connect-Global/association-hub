import { create } from "zustand";
import { persist } from "zustand/middleware";
import { adminLogin as adminLoginApi } from "@/services/graphql/adminAuth";
import type { AdminUserInfo } from "@/services/graphql/adminAuth";
import { useAssociationAdminStore } from "@/stores/associationAdminStore";

type JwtRole = "ASSOCIATION_ADMIN";
type JwtScopeType = "ASSOCIATION";

export interface DecodedAdminJwt {
  sub?: string;
  userId?: string;
  role?: JwtRole;
  scopeType?: JwtScopeType;
  scopeId?: string;
  exp?: number;
}

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

export function decodeAdminJwt(token: string | null): DecodedAdminJwt | null {
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  return {
    role: typeof payload.role === "string" ? (payload.role as JwtRole) : undefined,
    scopeType: typeof payload.scopeType === "string" ? (payload.scopeType as JwtScopeType) : undefined,
    scopeId: typeof payload.scopeId === "string" ? payload.scopeId : undefined,
    exp: typeof payload.exp === "number" ? payload.exp : undefined,
    sub: typeof payload.sub === "string" ? payload.sub : undefined,
    userId: typeof payload.userId === "string" ? payload.userId : undefined,
  };
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
  myAssociationId: string | null;
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
      myAssociationId: null,
      tokenExpiresAt: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await adminLoginApi({ email, password });

          if (response.success && response.admin?.isActive === false) {
            const inactiveMessage = "Your account has been disabled. Contact the system administrator.";
            set({ isLoading: false, error: inactiveMessage });
            return { success: false, error: inactiveMessage };
          }

          const decodedJwt = decodeAdminJwt(response.accessToken ?? null);
          const jwtScopeId = decodedJwt?.scopeId;
          const jwtScopeType = decodedJwt?.scopeType;
          const jwtRole = decodedJwt?.role;
          const derivedAssociationId =
            jwtScopeType === "ASSOCIATION" && jwtScopeId ? jwtScopeId : response.admin?.scopeId ?? null;

          if (
            response.success &&
            response.accessToken &&
            response.admin &&
            response.admin.scopeType === "ASSOCIATION" &&
            response.admin.isActive &&
            derivedAssociationId &&
            jwtScopeType === "ASSOCIATION" &&
            jwtRole === "ASSOCIATION_ADMIN"
          ) {
            set({
              accessToken: response.accessToken,
              refreshToken: response.refreshToken ?? null,
              admin: response.admin,
              myAssociationId: derivedAssociationId,
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
              : !response.admin?.isActive
                ? "Your account has been disabled. Contact the system administrator."
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
          myAssociationId: null,
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
        const decoded = decodeAdminJwt(state.accessToken);
        const associationId =
          decoded?.scopeType === "ASSOCIATION" && decoded.scopeId
            ? decoded.scopeId
            : state.admin?.scopeType === "ASSOCIATION"
              ? state.admin.scopeId
              : null;
        const isExpired = typeof expiry === "number" ? Date.now() >= expiry : false;

        state.tokenExpiresAt = expiry;
        state.myAssociationId = associationId;
        state.isAuthenticated = Boolean(state.accessToken && state.admin && associationId && !isExpired);

        if (isExpired) {
          state.accessToken = null;
          state.refreshToken = null;
          state.admin = null;
          state.myAssociationId = null;
          state.tokenExpiresAt = null;
          state.isAuthenticated = false;
        }
      },
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        admin: state.admin,
        myAssociationId: state.myAssociationId,
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
  const state = useAdminAuthStore.getState();
  if (state.myAssociationId) return state.myAssociationId;

  const decoded = decodeAdminJwt(state.accessToken);
  if (decoded?.scopeType === "ASSOCIATION" && decoded.scopeId) return decoded.scopeId;

  return state.admin?.scopeType === "ASSOCIATION" ? state.admin.scopeId : null;
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
  useAssociationAdminStore.getState().clear();
}

export function getAdminRefreshToken(): string | null {
  return useAdminAuthStore.getState().refreshToken;
}

export function updateAdminTokens(accessToken: string, refreshToken?: string | null): void {
  const state = useAdminAuthStore.getState();
  const decoded = decodeAdminJwt(accessToken);
  const associationId =
    decoded?.scopeType === "ASSOCIATION" && decoded.scopeId
      ? decoded.scopeId
      : state.myAssociationId ?? (state.admin?.scopeType === "ASSOCIATION" ? state.admin.scopeId : null);

  useAdminAuthStore.setState({
    accessToken,
    refreshToken: refreshToken ?? state.refreshToken,
    myAssociationId: associationId,
    tokenExpiresAt: getTokenExpiry(accessToken),
    isAuthenticated: Boolean(state.admin && associationId),
    error: null,
  });
}
