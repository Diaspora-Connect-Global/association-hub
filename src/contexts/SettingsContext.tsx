import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  AppSettings, 
  defaultSettings, 
  Language, 
  Theme, 
  FontSize, 
  SessionTimeout 
} from "@/types/settings";

interface SettingsContextType {
  settings: AppSettings;
  updateLanguage: (language: Language) => void;
  updateTheme: (theme: Theme) => void;
  updateNotifications: (key: "email" | "push" | "sms", value: boolean) => void;
  updateAccessibility: (key: keyof AppSettings["accessibility"], value: boolean | FontSize) => void;
  updateSecurity: (key: keyof AppSettings["security"], value: boolean | SessionTimeout) => void;
  saveSettings: () => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = "app_settings";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
    return defaultSettings;
  });

  // Apply theme on mount and when it changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (settings.theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(settings.theme);
    }
  }, [settings.theme]);

  // Apply font size
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("text-sm", "text-base", "text-lg", "text-xl");
    
    const fontSizeClasses: Record<FontSize, string> = {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
      "extra-large": "text-xl",
    };
    
    root.classList.add(fontSizeClasses[settings.accessibility.fontSize]);
  }, [settings.accessibility.fontSize]);

  // Apply high contrast
  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.accessibility.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  }, [settings.accessibility.highContrast]);

  // Apply language attribute
  useEffect(() => {
    document.documentElement.lang = settings.language;
  }, [settings.language]);

  const updateLanguage = (language: Language) => {
    setSettings((prev) => ({ ...prev, language }));
  };

  const updateTheme = (theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const updateNotifications = (key: "email" | "push" | "sms", value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  const updateAccessibility = (
    key: keyof AppSettings["accessibility"],
    value: boolean | FontSize
  ) => {
    setSettings((prev) => ({
      ...prev,
      accessibility: { ...prev.accessibility, [key]: value },
    }));
  };

  const updateSecurity = (
    key: keyof AppSettings["security"],
    value: boolean | SessionTimeout
  ) => {
    setSettings((prev) => ({
      ...prev,
      security: { ...prev.security, [key]: value },
    }));
  };

  const saveSettings = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Auto-save on change
  useEffect(() => {
    saveSettings();
  }, [settings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateLanguage,
        updateTheme,
        updateNotifications,
        updateAccessibility,
        updateSecurity,
        saveSettings,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}