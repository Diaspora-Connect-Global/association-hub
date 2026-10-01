import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/**
 * Long-lived vendor chunks: libraries change far less often than the app, so a
 * deploy only invalidates the app chunks and returning admins keep these cached.
 * Anything not listed is left to Rollup's default (shared-module) splitting, so
 * a library used by one page stays in that page's chunk.
 *
 * Trap: a manual chunk also absorbs unassigned dependencies it shares with the
 * app (recharts pulled in `clsx`), and the entry then statically imports the
 * whole chunk. Shared utilities are therefore pinned to an always-loaded chunk;
 * after changing this list, check that index.html does not preload
 * vendor-charts / vendor-stripe / vendor-socket.
 */
const VENDOR_CHUNKS: Array<[name: string, pattern: RegExp]> = [
  [
    "vendor-react",
    /[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|@remix-run[\\/]router|use-sync-external-store|react-is|prop-types|object-assign)[\\/]/,
  ],
  [
    "vendor-ui",
    /[\\/]node_modules[\\/](@radix-ui|@floating-ui|react-remove-scroll|react-remove-scroll-bar|react-style-singleton|use-callback-ref|use-sidecar|aria-hidden|get-nonce|clsx|tailwind-merge|class-variance-authority)[\\/]/,
  ],
  ["vendor-data", /[\\/]node_modules[\\/](@tanstack|graphql|graphql-request|zustand)[\\/]/],
  [
    "vendor-charts",
    /[\\/]node_modules[\\/](recharts|recharts-scale|react-smooth|victory-vendor|d3-[^\\/]+|internmap|decimal\.js-light)[\\/]/,
  ],
  ["vendor-stripe", /[\\/]node_modules[\\/]@stripe[\\/]/],
  [
    "vendor-socket",
    /[\\/]node_modules[\\/](socket\.io-client|socket\.io-parser|engine\.io-client|engine\.io-parser|@socket\.io)[\\/]/,
  ],
  ["vendor-icons", /[\\/]node_modules[\\/]lucide-react[\\/]/],
];

function manualChunks(id: string): string | undefined {
  // Rollup's CommonJS interop helpers are shared by every CJS package. Left
  // unassigned they land in whichever manual chunk claims them first (the charts
  // chunk), and the entry then statically imports 400 kB of charts it never uses.
  if (id.includes("commonjsHelpers")) return "vendor-react";
  if (!id.includes("node_modules")) return undefined;
  for (const [name, pattern] of VENDOR_CHUNKS) {
    if (pattern.test(id)) return name;
  }
  return undefined;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: { manualChunks },
    },
  },
}));
