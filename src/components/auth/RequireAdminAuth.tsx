import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { clearAdminSession, useAdminAuthStore } from "@/stores/adminAuthStore";

export function RequireAdminAuth() {
  const location = useLocation();
  const accessToken = useAdminAuthStore((state) => state.accessToken);
  const admin = useAdminAuthStore((state) => state.admin);
  const myAssociationId = useAdminAuthStore((state) => state.myAssociationId);
  const tokenExpiresAt = useAdminAuthStore((state) => state.tokenExpiresAt);
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);

  const isExpired = typeof tokenExpiresAt === "number" ? Date.now() >= tokenExpiresAt : false;
  const hasAssociationScope = admin?.scopeType === "ASSOCIATION" && Boolean(myAssociationId);
  const canAccess = Boolean(accessToken && isAuthenticated && hasAssociationScope && !isExpired);

  useEffect(() => {
    if (!canAccess && (accessToken || admin)) {
      clearAdminSession();
    }
  }, [accessToken, admin, canAccess]);

  if (!canAccess) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
