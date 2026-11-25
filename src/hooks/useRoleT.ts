import { useCallback } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { roleText } from "@/lib/roleText";

/** Translator for the custom-role screens (see src/lib/roleTexts.ts). */
export function useRoleT() {
  const { settings } = useSettings();
  return useCallback(
    (key: string, vars?: Record<string, string | number>, fallback?: string) =>
      roleText(settings.language, key, vars, fallback),
    [settings.language],
  );
}
