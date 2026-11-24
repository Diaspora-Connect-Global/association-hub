import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAdminSession, useAdminAuthStore } from "@/stores/adminAuthStore";
import { silentRefreshAdminToken } from "@/core/graphql-client";
import {
  IDLE_CONFIG,
  applyRemoteMessage,
  evaluateIdleSession,
  isStoredActivityStale,
  shouldRecordActivity,
  type SignOutReason,
} from "@/lib/idleSession";
import {
  listenRemote,
  markSignOutReason,
  postRemote,
  readStoredActivity,
  rememberSignOutReason,
  withoutBroadcast,
  writeStoredActivity,
} from "@/lib/idleSessionChannel";

const TICK_MS = 1000;
const REFRESH_RETRY_MS = 30_000;
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll", "wheel", "mousemove"] as const;
const PERSIST_KEY = "admin-auth";

/**
 * The refresh token rotates, and this console persists to localStorage (shared by tabs).
 * If another tab already refreshed, adopt its fresh tokens instead of spending the old one.
 */
function adoptFreshTokensFromStorage(minExpiry: number): boolean {
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    const s = raw ? (JSON.parse(raw) as { state?: Record<string, unknown> }).state : null;
    if (
      s &&
      typeof s.accessToken === "string" &&
      typeof s.tokenExpiresAt === "number" &&
      s.tokenExpiresAt > minExpiry
    ) {
      useAdminAuthStore.setState({
        accessToken: s.accessToken,
        refreshToken: typeof s.refreshToken === "string" ? s.refreshToken : null,
        tokenExpiresAt: s.tokenExpiresAt,
      });
      return true;
    }
  } catch {
    // unreadable storage — fall through to a normal refresh
  }
  return false;
}

/**
 * Sliding idle session. While the admin is active the access token is refreshed silently;
 * after IDLE_CONFIG.idleTimeoutMs of no activity a warning shows for the last minute, then the
 * session is signed out. Returns the warning state for <IdleSessionDialog />.
 */
export function useIdleSession() {
  const navigate = useNavigate();
  const signedIn = useAdminAuthStore((s) => Boolean(s.accessToken));
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const stayRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!signedIn) {
      setSecondsLeft(null);
      return;
    }
    const cfg = IDLE_CONFIG;
    let disposed = false;
    let signedOut = false;
    let warningOpen = false;
    let refreshing = false;
    let nextRefreshAt = 0;
    let lastRecorded = 0;

    const stored = readStoredActivity();
    let lastActivity = Date.now();

    const signOut = (reason: SignOutReason, fromRemote = false) => {
      if (signedOut) return;
      signedOut = true;
      rememberSignOutReason(reason);
      const doLogout = () => {
        markSignOutReason(reason);
        clearAdminSession(); // forced sign-out path: keeps drafts, like an expired token
      };
      if (fromRemote) withoutBroadcast(doLogout);
      else doLogout();
      setSecondsLeft(null);
      navigate("/login", { replace: true });
    };

    // A previous page load / closed tab that has been idle past the timeout must not revive.
    if (isStoredActivityStale(stored, lastActivity, cfg)) {
      signOut("idle");
      return;
    }
    writeStoredActivity(lastActivity);

    const silentRefresh = async () => {
      if (refreshing || Date.now() < nextRefreshAt) return;
      refreshing = true;
      try {
        const run = async (): Promise<"ok" | "refused" | "transient"> => {
          const now = Date.now();
          const exp = useAdminAuthStore.getState().tokenExpiresAt;
          if (adoptFreshTokensFromStorage((exp ?? now) + 1)) return "ok";
          return silentRefreshAdminToken();
        };
        const result = navigator.locks
          ? await navigator.locks.request("admin-token-refresh", run)
          : await run();
        if (result === "transient") nextRefreshAt = Date.now() + REFRESH_RETRY_MS;
        if (result === "refused" && !disposed) signOut("expired");
      } catch {
        nextRefreshAt = Date.now() + REFRESH_RETRY_MS;
      } finally {
        refreshing = false;
      }
    };

    const tick = () => {
      if (disposed || signedOut) return;
      const now = Date.now();
      const e = evaluateIdleSession(
        { now, lastActivity, accessExpiresAt: useAdminAuthStore.getState().tokenExpiresAt },
        cfg,
      );
      if (e.phase === "expired") return signOut("idle");
      if (e.phase === "warning") {
        warningOpen = true;
        setSecondsLeft(e.secondsLeft);
      } else if (warningOpen) {
        warningOpen = false;
        setSecondsLeft(null);
      }
      if (e.phase === "refreshDue") void silentRefresh();
    };

    const record = () => {
      if (disposed || signedOut) return;
      const now = Date.now();
      // Check expiry BEFORE counting this event, so waking a sleeping tab cannot revive it.
      if (evaluateIdleSession({ now, lastActivity, accessExpiresAt: null }, cfg).phase === "expired") {
        return signOut("idle");
      }
      if (!shouldRecordActivity({ now, lastRecorded, warningOpen }, cfg)) return;
      lastRecorded = now;
      lastActivity = now;
      writeStoredActivity(now);
      postRemote({ type: "activity", at: now });
      tick();
    };

    stayRef.current = record;

    const onVisibility = () => {
      if (document.visibilityState === "visible") record();
    };

    ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, record, { passive: true, capture: true }));
    document.addEventListener("visibilitychange", onVisibility);
    const stopRemote = listenRemote((msg) => {
      const r = applyRemoteMessage({ lastActivity }, msg, Date.now());
      if (r.signOut) return signOut(r.signOut, true);
      lastActivity = r.lastActivity;
      tick();
    });
    const timer = window.setInterval(tick, TICK_MS);
    tick();

    return () => {
      disposed = true;
      window.clearInterval(timer);
      stopRemote();
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, record, { capture: true }));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [signedIn, navigate]);

  const stay = useCallback(() => stayRef.current(), []);
  return { secondsLeft, stay };
}
