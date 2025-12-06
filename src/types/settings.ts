export type Language = "en" | "fr" | "de" | "nl" | "es";
export type Theme = "light" | "dark" | "system";
export type FontSize = "small" | "medium" | "large" | "extra-large";
export type SessionTimeout = "15min" | "30min" | "1hour" | "4hours" | "never";

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface AccessibilitySettings {
  fontSize: FontSize;
  highContrast: boolean;
  screenReaderSupport: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: SessionTimeout;
}

export interface AppSettings {
  language: Language;
  theme: Theme;
  notifications: NotificationSettings;
  accessibility: AccessibilitySettings;
  security: SecuritySettings;
}

export const defaultSettings: AppSettings = {
  language: "en",
  theme: "light",
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  accessibility: {
    fontSize: "medium",
    highContrast: false,
    screenReaderSupport: true,
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeout: "1hour",
  },
};

export const languageLabels: Record<Language, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  nl: "Nederlands",
  es: "Español",
};

export const themeLabels: Record<Theme, string> = {
  light: "Light Mode",
  dark: "Dark Mode",
  system: "System Default",
};

export const fontSizeLabels: Record<FontSize, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
  "extra-large": "Extra Large",
};

export const sessionTimeoutLabels: Record<SessionTimeout, string> = {
  "15min": "15 minutes",
  "30min": "30 minutes",
  "1hour": "1 hour",
  "4hours": "4 hours",
  never: "Never",
};