import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuthStore } from "@/stores/adminAuthStore";

export function RequireAdminAuth() {
  const location = useLocation();
  const { accessToken, admin, tokenExpiresAt, isAuthenticated, logout } = useAdminAuthStore(
    (state) => ({
      accessToken: state.accessToken,
      admin: state.admin,
      tokenExpiresAt: state.tokenExpiresAt,
      isAuthenticated: state.isAuthenticated,
      logout: state.logout,
    })
  );

  const isExpired = typeof tokenExpiresAt === "number" ? Date.now() >= tokenExpiresAt : false;
  const hasAssociationScope = admin?.scopeType === "ASSOCIATION" && Boolean(admin.scopeId);
  const canAccess = Boolean(accessToken && isAuthenticated && hasAssociationScope && !isExpired);

  useEffect(() => {
    if (!canAccess && (accessToken || admin)) {
      logout();
    }
  }, [accessToken, admin, canAccess, logout]);

  if (!canAccess) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
