import type { TranslationKeys } from "@/lib/translations";

/**
 * Translated text for the event registration feature. Keys are the snake_case
 * names used by the shared helpers ("type_text", "err_label_required"); the
 * translations file stores them as `evReg…` camelCase keys.
 */
export function evRegKey(key: string): keyof TranslationKeys {
  return ("evReg" + key.split("_").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("")) as keyof TranslationKeys;
}

export type EvRegText = (key: string, vars?: Record<string, string | number>) => string;

/** Build the translator from the console's `useT()` result. */
export function makeEvRegText(t: TranslationKeys): EvRegText {
  return (key, vars) => {
    const raw = String(t[evRegKey(key)] ?? key);
    return vars ? raw.replace(/\{\{(\w+)\}\}/g, (_, name: string) => String(vars[name] ?? "")) : raw;
  };
}

/** The translated name of a field: defaults by id, the organiser's own as typed. */
export function registrationFieldName(
  field: { builtin?: string | null; label: string },
  tx: EvRegText,
): string {
  return field.builtin ? tx(`default_${field.builtin}`) : field.label;
}
