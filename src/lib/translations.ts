import { Language } from "@/types/settings";

type TranslationKeys = {
  // Navigation
  dashboard: string;
  members: string;
  posts: string;
  events: string;
  marketplace: string;
  orders: string;
  groups: string;
  opportunities: string;
  tickets: string;
  auditLogs: string;
  settings: string;
  profile: string;
  logout: string;

  // Settings page
  settingsTitle: string;
  settingsSubtitle: string;
  languageAppearance: string;
  languageAppearanceDesc: string;
  language: string;
  theme: string;
  notifications: string;
  notificationsDesc: string;
  emailNotifications: string;
  pushNotifications: string;
  smsNotifications: string;
  accessibility: string;
  accessibilityDesc: string;
  fontSize: string;
  highContrastMode: string;
  screenReaderSupport: string;
  securityPrivacy: string;
  securityPrivacyDesc: string;
  changePassword: string;
  twoFactorAuth: string;
  sessionTimeout: string;
  saveSettings: string;
  cancel: string;
  settingsSaved: string;

  // Common
  save: string;
  search: string;
  filter: string;
  export: string;
  create: string;
  edit: string;
  delete: string;
  view: string;
  close: string;
  confirm: string;
  loading: string;
  noResults: string;
};

const translations: Record<Language, TranslationKeys> = {
  en: {
    dashboard: "Dashboard",
    members: "Members",
    posts: "Posts",
    events: "Events",
    marketplace: "Marketplace",
    orders: "Orders",
    groups: "Groups",
    opportunities: "Opportunities",
    tickets: "Support Tickets",
    auditLogs: "Audit Logs",
    settings: "Settings",
    profile: "Profile",
    logout: "Logout",
    settingsTitle: "Settings",
    settingsSubtitle: "Manage your preferences and account settings",
    languageAppearance: "Language & Appearance",
    languageAppearanceDesc: "Control the interface language and theme of your dashboard.",
    language: "Language",
    theme: "Theme",
    notifications: "Notifications",
    notificationsDesc: "Manage notification preferences for your account.",
    emailNotifications: "Email Notifications",
    pushNotifications: "Push Notifications",
    smsNotifications: "SMS Notifications",
    accessibility: "Accessibility",
    accessibilityDesc: "Accessibility settings to improve usability.",
    fontSize: "Font Size",
    highContrastMode: "High Contrast Mode",
    screenReaderSupport: "Screen Reader Support",
    securityPrivacy: "Security & Privacy",
    securityPrivacyDesc: "Manage account security settings.",
    changePassword: "Change Password",
    twoFactorAuth: "Two-Factor Authentication",
    sessionTimeout: "Session Timeout",
    saveSettings: "Save Settings",
    cancel: "Cancel",
    settingsSaved: "Settings saved successfully",
    save: "Save",
    search: "Search",
    filter: "Filter",
    export: "Export",
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    close: "Close",
    confirm: "Confirm",
    loading: "Loading...",
    noResults: "No results found",
  },
  fr: {
    dashboard: "Tableau de bord",
    members: "Membres",
    posts: "Publications",
    events: "Événements",
    marketplace: "Marché",
    orders: "Commandes",
    groups: "Groupes",
    opportunities: "Opportunités",
    tickets: "Tickets de support",
    auditLogs: "Journaux d'audit",
    settings: "Paramètres",
    profile: "Profil",
    logout: "Déconnexion",
    settingsTitle: "Paramètres",
    settingsSubtitle: "Gérez vos préférences et paramètres de compte",
    languageAppearance: "Langue et Apparence",
    languageAppearanceDesc: "Contrôlez la langue et le thème de votre tableau de bord.",
    language: "Langue",
    theme: "Thème",
    notifications: "Notifications",
    notificationsDesc: "Gérez vos préférences de notification.",
    emailNotifications: "Notifications par email",
    pushNotifications: "Notifications push",
    smsNotifications: "Notifications SMS",
    accessibility: "Accessibilité",
    accessibilityDesc: "Paramètres d'accessibilité pour améliorer l'utilisation.",
    fontSize: "Taille de police",
    highContrastMode: "Mode contraste élevé",
    screenReaderSupport: "Support lecteur d'écran",
    securityPrivacy: "Sécurité et Confidentialité",
    securityPrivacyDesc: "Gérez les paramètres de sécurité de votre compte.",
    changePassword: "Changer le mot de passe",
    twoFactorAuth: "Authentification à deux facteurs",
    sessionTimeout: "Délai d'expiration de session",
    saveSettings: "Enregistrer",
    cancel: "Annuler",
    settingsSaved: "Paramètres enregistrés avec succès",
    save: "Enregistrer",
    search: "Rechercher",
    filter: "Filtrer",
    export: "Exporter",
    create: "Créer",
    edit: "Modifier",
    delete: "Supprimer",
    view: "Voir",
    close: "Fermer",
    confirm: "Confirmer",
    loading: "Chargement...",
    noResults: "Aucun résultat trouvé",
  },
  de: {
    dashboard: "Dashboard",
    members: "Mitglieder",
    posts: "Beiträge",
    events: "Veranstaltungen",
    marketplace: "Marktplatz",
    orders: "Bestellungen",
    groups: "Gruppen",
    opportunities: "Möglichkeiten",
    tickets: "Support-Tickets",
    auditLogs: "Audit-Protokolle",
    settings: "Einstellungen",
    profile: "Profil",
    logout: "Abmelden",
    settingsTitle: "Einstellungen",
    settingsSubtitle: "Verwalten Sie Ihre Präferenzen und Kontoeinstellungen",
    languageAppearance: "Sprache & Erscheinungsbild",
    languageAppearanceDesc: "Steuern Sie die Sprache und das Thema Ihres Dashboards.",
    language: "Sprache",
    theme: "Thema",
    notifications: "Benachrichtigungen",
    notificationsDesc: "Verwalten Sie Ihre Benachrichtigungseinstellungen.",
    emailNotifications: "E-Mail-Benachrichtigungen",
    pushNotifications: "Push-Benachrichtigungen",
    smsNotifications: "SMS-Benachrichtigungen",
    accessibility: "Barrierefreiheit",
    accessibilityDesc: "Barrierefreiheitseinstellungen zur Verbesserung der Benutzerfreundlichkeit.",
    fontSize: "Schriftgröße",
    highContrastMode: "Hoher Kontrastmodus",
    screenReaderSupport: "Screenreader-Unterstützung",
    securityPrivacy: "Sicherheit & Datenschutz",
    securityPrivacyDesc: "Verwalten Sie die Sicherheitseinstellungen Ihres Kontos.",
    changePassword: "Passwort ändern",
    twoFactorAuth: "Zwei-Faktor-Authentifizierung",
    sessionTimeout: "Sitzungszeitüberschreitung",
    saveSettings: "Einstellungen speichern",
    cancel: "Abbrechen",
    settingsSaved: "Einstellungen erfolgreich gespeichert",
    save: "Speichern",
    search: "Suchen",
    filter: "Filter",
    export: "Exportieren",
    create: "Erstellen",
    edit: "Bearbeiten",
    delete: "Löschen",
    view: "Ansehen",
    close: "Schließen",
    confirm: "Bestätigen",
    loading: "Laden...",
    noResults: "Keine Ergebnisse gefunden",
  },
  nl: {
    dashboard: "Dashboard",
    members: "Leden",
    posts: "Berichten",
    events: "Evenementen",
    marketplace: "Marktplaats",
    orders: "Bestellingen",
    groups: "Groepen",
    opportunities: "Kansen",
    tickets: "Supporttickets",
    auditLogs: "Auditlogboeken",
    settings: "Instellingen",
    profile: "Profiel",
    logout: "Uitloggen",
    settingsTitle: "Instellingen",
    settingsSubtitle: "Beheer uw voorkeuren en accountinstellingen",
    languageAppearance: "Taal & Uiterlijk",
    languageAppearanceDesc: "Beheer de taal en het thema van uw dashboard.",
    language: "Taal",
    theme: "Thema",
    notifications: "Meldingen",
    notificationsDesc: "Beheer uw meldingsvoorkeuren.",
    emailNotifications: "E-mailmeldingen",
    pushNotifications: "Pushmeldingen",
    smsNotifications: "SMS-meldingen",
    accessibility: "Toegankelijkheid",
    accessibilityDesc: "Toegankelijkheidsinstellingen voor betere bruikbaarheid.",
    fontSize: "Lettergrootte",
    highContrastMode: "Hoog contrastmodus",
    screenReaderSupport: "Schermlezerondersteuning",
    securityPrivacy: "Beveiliging & Privacy",
    securityPrivacyDesc: "Beheer de beveiligingsinstellingen van uw account.",
    changePassword: "Wachtwoord wijzigen",
    twoFactorAuth: "Tweefactorauthenticatie",
    sessionTimeout: "Sessie-timeout",
    saveSettings: "Instellingen opslaan",
    cancel: "Annuleren",
    settingsSaved: "Instellingen succesvol opgeslagen",
    save: "Opslaan",
    search: "Zoeken",
    filter: "Filter",
    export: "Exporteren",
    create: "Maken",
    edit: "Bewerken",
    delete: "Verwijderen",
    view: "Bekijken",
    close: "Sluiten",
    confirm: "Bevestigen",
    loading: "Laden...",
    noResults: "Geen resultaten gevonden",
  },
  es: {
    dashboard: "Panel",
    members: "Miembros",
    posts: "Publicaciones",
    events: "Eventos",
    marketplace: "Mercado",
    orders: "Pedidos",
    groups: "Grupos",
    opportunities: "Oportunidades",
    tickets: "Tickets de soporte",
    auditLogs: "Registros de auditoría",
    settings: "Configuración",
    profile: "Perfil",
    logout: "Cerrar sesión",
    settingsTitle: "Configuración",
    settingsSubtitle: "Gestiona tus preferencias y configuración de cuenta",
    languageAppearance: "Idioma y Apariencia",
    languageAppearanceDesc: "Controla el idioma y el tema de tu panel.",
    language: "Idioma",
    theme: "Tema",
    notifications: "Notificaciones",
    notificationsDesc: "Gestiona tus preferencias de notificación.",
    emailNotifications: "Notificaciones por correo",
    pushNotifications: "Notificaciones push",
    smsNotifications: "Notificaciones SMS",
    accessibility: "Accesibilidad",
    accessibilityDesc: "Configuración de accesibilidad para mejorar la usabilidad.",
    fontSize: "Tamaño de fuente",
    highContrastMode: "Modo alto contraste",
    screenReaderSupport: "Soporte para lector de pantalla",
    securityPrivacy: "Seguridad y Privacidad",
    securityPrivacyDesc: "Gestiona la configuración de seguridad de tu cuenta.",
    changePassword: "Cambiar contraseña",
    twoFactorAuth: "Autenticación de dos factores",
    sessionTimeout: "Tiempo de espera de sesión",
    saveSettings: "Guardar configuración",
    cancel: "Cancelar",
    settingsSaved: "Configuración guardada exitosamente",
    save: "Guardar",
    search: "Buscar",
    filter: "Filtrar",
    export: "Exportar",
    create: "Crear",
    edit: "Editar",
    delete: "Eliminar",
    view: "Ver",
    close: "Cerrar",
    confirm: "Confirmar",
    loading: "Cargando...",
    noResults: "No se encontraron resultados",
  },
};

export function getTranslation(language: Language): TranslationKeys {
  return translations[language] || translations.en;
}

export function useTranslation(language: Language) {
  return getTranslation(language);
}