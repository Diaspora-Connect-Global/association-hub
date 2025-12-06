import { AdminLayout } from "@/components/layout/AdminLayout";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { languages } from "@/i18n";
import { Sun, Moon, Monitor, Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("language", langCode);
  };

  const themeOptions = [
    { value: "light" as const, label: t("settings.lightMode"), icon: Sun },
    { value: "dark" as const, label: t("settings.darkMode"), icon: Moon },
    { value: "system" as const, label: t("settings.systemMode"), icon: Monitor },
  ];

  return (
    <AdminLayout title={t("settings.title")} subtitle={t("settings.subtitle")}>
      <div className="mx-auto max-w-2xl">
        {/* Language & Appearance Card */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="label-medium text-foreground">
                {t("settings.languageAppearance")}
              </h2>
              <p className="body-small text-muted-foreground">
                {t("settings.subtitle")}
              </p>
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-8">
            <label className="label-small mb-3 block text-foreground">
              {t("settings.language")}
            </label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                    i18n.language === lang.code
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted"
                  )}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="body-small flex-1 text-foreground">
                    {lang.name}
                  </span>
                  {i18n.language === lang.code && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <label className="label-small mb-3 block text-foreground">
              {t("settings.appearance")}
            </label>
            <div className="grid gap-2 sm:grid-cols-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      "flex flex-col items-center gap-3 rounded-lg border p-4 transition-all",
                      theme === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                        theme === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="body-small text-foreground">
                      {option.label}
                    </span>
                    {theme === option.value && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
