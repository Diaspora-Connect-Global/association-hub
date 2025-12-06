import { useSettings } from "@/contexts/SettingsContext";
import { getTranslation, TranslationKeys } from "@/lib/translations";

export function useT(): TranslationKeys {
  const { settings } = useSettings();
  return getTranslation(settings.language);
}
