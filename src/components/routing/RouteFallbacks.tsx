import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/useT";

/** Shown while a route's code chunk downloads. */
export function PageLoadingFallback() {
  const t = useT();
  return (
    <div role="status" className="flex h-screen w-full items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary"
        aria-hidden="true"
      />
      <span className="sr-only">{t.loading}</span>
    </div>
  );
}

function PageLoadErrorFallback() {
  const t = useT();
  return (
    <div role="alert" className="flex h-screen w-full flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-lg font-semibold text-foreground">{t.pageLoadFailed}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{t.pageLoadFailedHint}</p>
      <Button onClick={() => window.location.reload()}>{t.reloadPage}</Button>
    </div>
  );
}

interface RouteErrorBoundaryProps {
  /** Changing this (the current path) clears a previous error. */
  resetKey: string;
  children: ReactNode;
}

interface RouteErrorBoundaryState {
  error: Error | null;
  resetKey: string;
}

/**
 * Catches a route that fails to load or render, so a missing chunk shows a
 * reload prompt instead of a blank screen. Navigating elsewhere clears it.
 */
export class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = { error: null, resetKey: this.props.resetKey };

  static getDerivedStateFromError(error: Error): Partial<RouteErrorBoundaryState> {
    return { error };
  }

  static getDerivedStateFromProps(
    props: RouteErrorBoundaryProps,
    state: RouteErrorBoundaryState,
  ): Partial<RouteErrorBoundaryState> | null {
    return props.resetKey !== state.resetKey ? { error: null, resetKey: props.resetKey } : null;
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[route] failed to load or render", error.message, info.componentStack);
  }

  render(): ReactNode {
    return this.state.error ? <PageLoadErrorFallback /> : this.props.children;
  }
}
