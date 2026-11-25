/**
 * Translations for the custom-role screens (permission catalogue labels and
 * descriptions, modules, ready-made role templates, role form). The catalogue
 * itself comes from the backend (`entityRoleCatalogue`); this file only holds
 * words, in every language the console supports (en, fr, de, es, it).
 *
 * Looked up by dotted path with {{var}} interpolation and _one/_other plurals;
 * see `roleText` in src/lib/roleText.ts.
 */
import type { Language } from "@/types/settings";

export type RoleTextTree = { [key: string]: string | RoleTextTree };

export const ROLE_TEXTS: Record<Language, RoleTextTree> = {
  "en": {
    "roles": {
      "description": "Roles bundle permissions that you can assign to admins.",
      "create": "New Role",
      "empty": "No roles defined for this association yet.",
      "system": "System",
      "noPermissions": "No permissions",
      "roleAssigned": "Role assigned.",
      "form": {
        "title": "Create Role",
        "subtitle": "Give the role a name and choose the permissions it grants.",
        "name": "Name",
        "namePlaceholder": "e.g. Content Moderator",
        "nameRequired": "A role name is required.",
        "descriptionLabel": "Description",
        "descriptionPlaceholder": "What is this role for?",
        "permissions": "Permissions",
        "permissionsRequired": "Select at least one permission.",
        "submit": "Create role",
        "created": "Role created.",
        "editTitle": "Edit role",
        "template": "Start from a template",
        "templateNone": "No template — choose permissions yourself",
        "templateHint": "A template fills in the permissions; you can change them before saving and at any time after.",
        "selectedCount_one": "{{count}} selected",
        "selectedCount_other": "{{count}} selected",
        "ownPermissionsOnly": "You can only give a role permissions your own role has.",
        "selectModule": "Select all",
        "clearModule": "Clear",
        "save": "Save changes",
        "updated": "Role updated."
      },
      "edit": "Edit role {{name}}",
      "delete": "Delete role {{name}}",
      "deleted": "Role deleted.",
      "deleteTitle": "Delete “{{name}}”?",
      "deleteDescription": "Admins who hold this role lose its permissions straight away. This cannot be undone.",
      "deleteConfirm": "Delete role",
      "otherPermission": "Other permission",
      "yours": "Your roles",
      "readyMade": {
        "title": "Ready-made roles",
        "description": "Start from one of these. You can change the name and permissions before saving.",
        "use": "Use this role",
        "useLabel": "Use the {{name}} role",
        "inUse": "Added",
        "more_one": "+{{count}} more",
        "more_other": "+{{count}} more"
      }
    },
    "readOnly": "Only the association admin can add admins or change their roles.",
    "errors": {
      "loadCatalogue": "Could not load the list of permissions. Try again later.",
      "updateRole": "Failed to update role.",
      "deleteRole": "Failed to delete role.",
      "createRole": "Failed to create role.",
      "loadRoles": "Failed to load roles."
    },
    "rolePermissions": {
      "posts": {
        "publish": {
          "label": "Publish posts",
          "description": "Post, edit and delete announcements as the association."
        },
        "moderate": {
          "label": "Moderate posts",
          "description": "Approve or reject posts waiting for review."
        }
      },
      "events": {
        "manage": {
          "label": "Manage events",
          "description": "Create, edit, publish and cancel events; tickets, registration forms, attendees and check-in."
        }
      },
      "opportunities": {
        "manage": {
          "label": "Manage opportunities",
          "description": "Create, edit, publish and close opportunities, and review applications."
        }
      },
      "marketplace": {
        "manage": {
          "label": "Manage the marketplace",
          "description": "Run the association shop: products, services, orders and marketplace settings."
        }
      },
      "groups": {
        "manage": {
          "label": "Manage groups",
          "description": "Create and edit groups, and manage their members, invitations and join requests."
        }
      },
      "members": {
        "approve": {
          "label": "Approve members",
          "description": "Review join requests and invite new members."
        },
        "moderate": {
          "label": "Moderate members",
          "description": "Suspend, ban or remove members, and lift suspensions and bans."
        }
      },
      "registries": {
        "manage": {
          "label": "Manage registries",
          "description": "Keep the member registries: entries, verification, imports and broadcasts."
        }
      },
      "associations": {
        "manage": {
          "label": "Manage community links",
          "description": "Link and unlink communities, and approve or reject link requests."
        }
      },
      "service_requests": {
        "manage": {
          "label": "Handle service requests",
          "description": "Review, assign, approve, reject and complete members’ requests."
        },
        "types": {
          "label": "Manage request types",
          "description": "Set up the request forms members can fill in, with their fees."
        }
      },
      "resources": {
        "manage": {
          "label": "Manage resources",
          "description": "Publish and organise documents, guides and media in the library."
        }
      },
      "directory": {
        "manage": {
          "label": "Manage the directory",
          "description": "Add, edit, publish and archive directory listings."
        }
      },
      "support_cases": {
        "manage": {
          "label": "Handle support cases",
          "description": "Work on cases: assign them, change their status and add notes and evidence."
        },
        "types": {
          "label": "Manage case types",
          "description": "Set up the kinds of cases members can open."
        }
      },
      "reports": {
        "manage": {
          "label": "Handle reports & complaints",
          "description": "Review what members report and resolve or dismiss it."
        }
      },
      "settings": {
        "manage": {
          "label": "Change settings",
          "description": "Edit the association details, images, visibility, join policy and enabled services."
        }
      },
      "roles": {
        "manage": {
          "label": "Manage roles",
          "description": "Create, edit and delete roles — only with permissions your own role has. Admin accounts stay with the association admin."
        }
      },
      "audit": {
        "view": {
          "label": "View the audit log",
          "description": "See the record of moderation and admin actions."
        }
      }
    },
    "roleModules": {
      "posts": "Posts",
      "events": "Events",
      "opportunities": "Opportunities",
      "marketplace": "Marketplace",
      "groups": "Groups",
      "members": "Members",
      "associations": "Community links",
      "service_requests": "Service requests",
      "resources": "Resources",
      "directory": "Directory",
      "support": "Support cases",
      "reports": "Reports & complaints",
      "settings": "Settings",
      "roles": "Roles & admins",
      "audit": "Audit log"
    },
    "roleTemplates": {
      "co_administrator": {
        "name": "Co-administrator",
        "description": "Runs the whole association with you, except managing roles."
      },
      "commerce_manager": {
        "name": "Commerce manager",
        "description": "Works with the marketplace, events and opportunities."
      },
      "content_publisher": {
        "name": "Content publisher",
        "description": "Only posts announcements for the association."
      },
      "resources_requests_manager": {
        "name": "Resources & requests manager",
        "description": "Manages resources, service requests and their types, and the directory."
      },
      "community_moderator": {
        "name": "Association moderator",
        "description": "Moderates members, posts, and reports & complaints."
      },
      "support_agent": {
        "name": "Support agent",
        "description": "Handles support cases."
      }
    },
    "admins": {
      "builtInRoles": "Built-in roles",
      "customRoles": "Custom roles",
      "passwordHint": "At least 12 characters. Passwords that have appeared in a known data breach are refused.",
      "passwordTooShort": "The password must be at least 12 characters long.",
      "noCustomRoles": "No custom roles yet. Create one in the Roles tab to offer it here."
    }
  },
  "de": {
    "roles": {
      "description": "Rollen bündeln Berechtigungen, die Sie Admins zuweisen können.",
      "create": "Neue Rolle",
      "empty": "Für diesen Verein sind noch keine Rollen definiert.",
      "system": "System",
      "noPermissions": "Keine Berechtigungen",
      "roleAssigned": "Rolle zugewiesen.",
      "form": {
        "title": "Rolle erstellen",
        "subtitle": "Geben Sie der Rolle einen Namen und wählen Sie die Berechtigungen.",
        "name": "Name",
        "namePlaceholder": "z. B. Inhaltsmoderator",
        "nameRequired": "Ein Rollenname ist erforderlich.",
        "descriptionLabel": "Beschreibung",
        "descriptionPlaceholder": "Wofür ist diese Rolle?",
        "permissions": "Berechtigungen",
        "permissionsRequired": "Wählen Sie mindestens eine Berechtigung.",
        "submit": "Rolle erstellen",
        "created": "Rolle erstellt.",
        "editTitle": "Rolle bearbeiten",
        "template": "Mit einer Vorlage beginnen",
        "templateNone": "Keine Vorlage – Berechtigungen selbst wählen",
        "templateHint": "Eine Vorlage füllt die Berechtigungen aus; Sie können sie vor dem Speichern und jederzeit danach ändern.",
        "selectedCount_one": "{{count}} ausgewählt",
        "selectedCount_other": "{{count}} ausgewählt",
        "ownPermissionsOnly": "Sie können einer Rolle nur Berechtigungen geben, die Ihre eigene Rolle hat.",
        "selectModule": "Alle auswählen",
        "clearModule": "Leeren",
        "save": "Änderungen speichern",
        "updated": "Rolle aktualisiert."
      },
      "edit": "Rolle {{name}} bearbeiten",
      "delete": "Rolle {{name}} löschen",
      "deleted": "Rolle gelöscht.",
      "deleteTitle": "„{{name}}“ löschen?",
      "deleteDescription": "Admins mit dieser Rolle verlieren ihre Berechtigungen sofort. Das kann nicht rückgängig gemacht werden.",
      "deleteConfirm": "Rolle löschen",
      "otherPermission": "Andere Berechtigung",
      "yours": "Ihre Rollen",
      "readyMade": {
        "title": "Vorgefertigte Rollen",
        "description": "Beginnen Sie mit einer dieser Rollen. Name und Berechtigungen können Sie vor dem Speichern ändern.",
        "use": "Diese Rolle verwenden",
        "useLabel": "Rolle {{name}} verwenden",
        "inUse": "Hinzugefügt",
        "more_one": "+{{count}} weitere",
        "more_other": "+{{count}} weitere"
      }
    },
    "readOnly": "Nur der Vereins-Admin kann Admins hinzufügen oder ihre Rollen ändern.",
    "errors": {
      "loadCatalogue": "Die Liste der Berechtigungen konnte nicht geladen werden. Bitte später erneut versuchen.",
      "updateRole": "Rolle konnte nicht aktualisiert werden.",
      "deleteRole": "Rolle konnte nicht gelöscht werden.",
      "createRole": "Rolle konnte nicht erstellt werden.",
      "loadRoles": "Rollen konnten nicht geladen werden."
    },
    "rolePermissions": {
      "posts": {
        "publish": {
          "label": "Beiträge veröffentlichen",
          "description": "Ankündigungen im Namen des Vereins posten, bearbeiten und löschen."
        },
        "moderate": {
          "label": "Beiträge moderieren",
          "description": "Beiträge, die auf Prüfung warten, freigeben oder ablehnen."
        }
      },
      "events": {
        "manage": {
          "label": "Veranstaltungen verwalten",
          "description": "Veranstaltungen erstellen, bearbeiten, veröffentlichen und absagen; Tickets, Anmeldeformulare, Teilnehmende und Check-in."
        }
      },
      "opportunities": {
        "manage": {
          "label": "Gelegenheiten verwalten",
          "description": "Gelegenheiten erstellen, bearbeiten, veröffentlichen und schließen sowie Bewerbungen prüfen."
        }
      },
      "marketplace": {
        "manage": {
          "label": "Marktplatz verwalten",
          "description": "Den Vereins-Shop führen: Produkte, Dienstleistungen, Bestellungen und Marktplatz-Einstellungen."
        }
      },
      "groups": {
        "manage": {
          "label": "Gruppen verwalten",
          "description": "Gruppen erstellen und bearbeiten sowie deren Mitglieder, Einladungen und Beitrittsanfragen verwalten."
        }
      },
      "members": {
        "approve": {
          "label": "Mitglieder aufnehmen",
          "description": "Beitrittsanfragen prüfen und neue Mitglieder einladen."
        },
        "moderate": {
          "label": "Mitglieder moderieren",
          "description": "Mitglieder sperren, ausschließen oder entfernen sowie Sperren aufheben."
        }
      },
      "registries": {
        "manage": {
          "label": "Register verwalten",
          "description": "Die Mitgliederregister führen: Einträge, Verifizierung, Importe und Rundsendungen."
        }
      },
      "associations": {
        "manage": {
          "label": "Community-Verknüpfungen verwalten",
          "description": "Communities verknüpfen und trennen sowie Verknüpfungsanfragen annehmen oder ablehnen."
        }
      },
      "service_requests": {
        "manage": {
          "label": "Serviceanfragen bearbeiten",
          "description": "Anfragen von Mitgliedern prüfen, zuweisen, genehmigen, ablehnen und abschließen."
        },
        "types": {
          "label": "Anfragetypen verwalten",
          "description": "Die Anfrageformulare einrichten, die Mitglieder ausfüllen können, samt Gebühren."
        }
      },
      "resources": {
        "manage": {
          "label": "Ressourcen verwalten",
          "description": "Dokumente, Leitfäden und Medien in der Bibliothek veröffentlichen und ordnen."
        }
      },
      "directory": {
        "manage": {
          "label": "Verzeichnis verwalten",
          "description": "Verzeichniseinträge hinzufügen, bearbeiten, veröffentlichen und archivieren."
        }
      },
      "support_cases": {
        "manage": {
          "label": "Supportfälle bearbeiten",
          "description": "Fälle bearbeiten: zuweisen, Status ändern sowie Notizen und Nachweise hinzufügen."
        },
        "types": {
          "label": "Falltypen verwalten",
          "description": "Die Arten von Fällen einrichten, die Mitglieder eröffnen können."
        }
      },
      "reports": {
        "manage": {
          "label": "Meldungen & Beschwerden bearbeiten",
          "description": "Meldungen von Mitgliedern prüfen und erledigen oder verwerfen."
        }
      },
      "settings": {
        "manage": {
          "label": "Einstellungen ändern",
          "description": "Vereinsangaben, Bilder, Sichtbarkeit, Beitrittsregeln und aktivierte Dienste bearbeiten."
        }
      },
      "roles": {
        "manage": {
          "label": "Rollen verwalten",
          "description": "Rollen erstellen, bearbeiten und löschen – nur mit Berechtigungen, die Ihre eigene Rolle hat. Admin-Konten bleiben beim Vereins-Admin."
        }
      },
      "audit": {
        "view": {
          "label": "Audit-Protokoll ansehen",
          "description": "Das Protokoll der Moderations- und Admin-Aktionen einsehen."
        }
      }
    },
    "roleModules": {
      "posts": "Beiträge",
      "events": "Veranstaltungen",
      "opportunities": "Gelegenheiten",
      "marketplace": "Marktplatz",
      "groups": "Gruppen",
      "members": "Mitglieder",
      "associations": "Community-Verknüpfungen",
      "service_requests": "Serviceanfragen",
      "resources": "Ressourcen",
      "directory": "Verzeichnis",
      "support": "Supportfälle",
      "reports": "Meldungen & Beschwerden",
      "settings": "Einstellungen",
      "roles": "Rollen & Admins",
      "audit": "Audit-Protokoll"
    },
    "roleTemplates": {
      "co_administrator": {
        "name": "Co-Administrator",
        "description": "Führt den ganzen Verein mit Ihnen, außer der Rollenverwaltung."
      },
      "commerce_manager": {
        "name": "Commerce-Manager",
        "description": "Kümmert sich um Marktplatz, Veranstaltungen und Gelegenheiten."
      },
      "content_publisher": {
        "name": "Inhalte-Redakteur",
        "description": "Veröffentlicht nur Ankündigungen für den Verein."
      },
      "resources_requests_manager": {
        "name": "Ressourcen- & Anfragen-Manager",
        "description": "Verwaltet Ressourcen, Serviceanfragen samt Typen und das Verzeichnis."
      },
      "community_moderator": {
        "name": "Vereins-Moderator",
        "description": "Moderiert Mitglieder, Beiträge sowie Meldungen & Beschwerden."
      },
      "support_agent": {
        "name": "Support-Mitarbeiter",
        "description": "Bearbeitet Supportfälle."
      }
    },
    "admins": {
      "builtInRoles": "Integrierte Rollen",
      "customRoles": "Eigene Rollen",
      "passwordHint": "Mindestens 12 Zeichen. Passwörter, die in einem bekannten Datenleck aufgetaucht sind, werden abgelehnt.",
      "passwordTooShort": "Das Passwort muss mindestens 12 Zeichen lang sein.",
      "noCustomRoles": "Noch keine eigenen Rollen. Erstellen Sie im Tab „Rollen“ eine, um sie hier anzubieten."
    }
  },
  "es": {
    "roles": {
      "description": "Los roles agrupan permisos que puedes asignar a los admins.",
      "create": "Nuevo rol",
      "empty": "Aún no hay roles definidos para esta asociación.",
      "system": "Sistema",
      "noPermissions": "Sin permisos",
      "roleAssigned": "Rol asignado.",
      "form": {
        "title": "Crear rol",
        "subtitle": "Dale un nombre al rol y elige los permisos que otorga.",
        "name": "Nombre",
        "namePlaceholder": "p. ej. Moderador de contenido",
        "nameRequired": "Se requiere un nombre de rol.",
        "descriptionLabel": "Descripción",
        "descriptionPlaceholder": "¿Para qué sirve este rol?",
        "permissions": "Permisos",
        "permissionsRequired": "Selecciona al menos un permiso.",
        "submit": "Crear rol",
        "created": "Rol creado.",
        "editTitle": "Editar rol",
        "template": "Empezar con una plantilla",
        "templateNone": "Sin plantilla: elige tú los permisos",
        "templateHint": "Una plantilla rellena los permisos; puedes cambiarlos antes de guardar y en cualquier momento después.",
        "selectedCount_one": "{{count}} seleccionado",
        "selectedCount_other": "{{count}} seleccionados",
        "ownPermissionsOnly": "Solo puedes dar a un rol los permisos que tiene tu propio rol.",
        "selectModule": "Seleccionar todo",
        "clearModule": "Quitar",
        "save": "Guardar cambios",
        "updated": "Rol actualizado."
      },
      "edit": "Editar el rol {{name}}",
      "delete": "Eliminar el rol {{name}}",
      "deleted": "Rol eliminado.",
      "deleteTitle": "¿Eliminar «{{name}}»?",
      "deleteDescription": "Los administradores con este rol pierden sus permisos de inmediato. No se puede deshacer.",
      "deleteConfirm": "Eliminar rol",
      "otherPermission": "Otro permiso",
      "yours": "Tus roles",
      "readyMade": {
        "title": "Roles predefinidos",
        "description": "Empieza con uno de estos. Puedes cambiar el nombre y los permisos antes de guardar.",
        "use": "Usar este rol",
        "useLabel": "Usar el rol {{name}}",
        "inUse": "Añadido",
        "more_one": "+{{count}} más",
        "more_other": "+{{count}} más"
      }
    },
    "readOnly": "Solo el administrador de la asociación puede añadir administradores o cambiar sus roles.",
    "errors": {
      "loadCatalogue": "No se pudo cargar la lista de permisos. Inténtalo más tarde.",
      "updateRole": "No se pudo actualizar el rol.",
      "deleteRole": "No se pudo eliminar el rol.",
      "createRole": "Error al crear el rol.",
      "loadRoles": "Error al cargar los roles."
    },
    "rolePermissions": {
      "posts": {
        "publish": {
          "label": "Publicar entradas",
          "description": "Publicar, editar y eliminar anuncios en nombre de la asociación."
        },
        "moderate": {
          "label": "Moderar entradas",
          "description": "Aprobar o rechazar las entradas pendientes de revisión."
        }
      },
      "events": {
        "manage": {
          "label": "Gestionar eventos",
          "description": "Crear, editar, publicar y cancelar eventos; entradas, formularios de inscripción, asistentes y registro de llegada."
        }
      },
      "opportunities": {
        "manage": {
          "label": "Gestionar oportunidades",
          "description": "Crear, editar, publicar y cerrar oportunidades, y revisar candidaturas."
        }
      },
      "marketplace": {
        "manage": {
          "label": "Gestionar el mercado",
          "description": "Llevar la tienda de la asociación: productos, servicios, pedidos y ajustes del mercado."
        }
      },
      "groups": {
        "manage": {
          "label": "Gestionar grupos",
          "description": "Crear y editar grupos, y gestionar sus miembros, invitaciones y solicitudes."
        }
      },
      "members": {
        "approve": {
          "label": "Aprobar miembros",
          "description": "Revisar solicitudes de ingreso e invitar a nuevos miembros."
        },
        "moderate": {
          "label": "Moderar miembros",
          "description": "Suspender, expulsar o eliminar miembros, y levantar suspensiones y expulsiones."
        }
      },
      "registries": {
        "manage": {
          "label": "Gestionar registros",
          "description": "Mantener los registros de miembros: entradas, verificación, importaciones y envíos masivos."
        }
      },
      "associations": {
        "manage": {
          "label": "Gestionar vínculos con comunidades",
          "description": "Vincular y desvincular comunidades, y aprobar o rechazar solicitudes de vínculo."
        }
      },
      "service_requests": {
        "manage": {
          "label": "Atender solicitudes de servicio",
          "description": "Revisar, asignar, aprobar, rechazar y completar las solicitudes de los miembros."
        },
        "types": {
          "label": "Gestionar tipos de solicitud",
          "description": "Configurar los formularios de solicitud que pueden rellenar los miembros, con sus tarifas."
        }
      },
      "resources": {
        "manage": {
          "label": "Gestionar recursos",
          "description": "Publicar y organizar documentos, guías y archivos multimedia en la biblioteca."
        }
      },
      "directory": {
        "manage": {
          "label": "Gestionar el directorio",
          "description": "Añadir, editar, publicar y archivar fichas del directorio."
        }
      },
      "support_cases": {
        "manage": {
          "label": "Atender casos de soporte",
          "description": "Trabajar los casos: asignarlos, cambiar su estado y añadir notas y pruebas."
        },
        "types": {
          "label": "Gestionar tipos de caso",
          "description": "Configurar los tipos de caso que pueden abrir los miembros."
        }
      },
      "reports": {
        "manage": {
          "label": "Gestionar denuncias y quejas",
          "description": "Revisar lo que denuncian los miembros y resolverlo o descartarlo."
        }
      },
      "settings": {
        "manage": {
          "label": "Cambiar la configuración",
          "description": "Editar los datos de la asociación, imágenes, visibilidad, política de ingreso y servicios activos."
        }
      },
      "roles": {
        "manage": {
          "label": "Gestionar roles",
          "description": "Crear, editar y eliminar roles, solo con permisos que tenga tu propio rol. Las cuentas de administrador siguen en manos del administrador de la asociación."
        }
      },
      "audit": {
        "view": {
          "label": "Ver el registro de auditoría",
          "description": "Consultar el historial de acciones de moderación y administración."
        }
      }
    },
    "roleModules": {
      "posts": "Entradas",
      "events": "Eventos",
      "opportunities": "Oportunidades",
      "marketplace": "Mercado",
      "groups": "Grupos",
      "members": "Miembros",
      "associations": "Vínculos con comunidades",
      "service_requests": "Solicitudes de servicio",
      "resources": "Recursos",
      "directory": "Directorio",
      "support": "Casos de soporte",
      "reports": "Denuncias y quejas",
      "settings": "Configuración",
      "roles": "Roles y administradores",
      "audit": "Registro de auditoría"
    },
    "roleTemplates": {
      "co_administrator": {
        "name": "Coadministrador",
        "description": "Gestiona toda la asociación contigo, excepto los roles."
      },
      "commerce_manager": {
        "name": "Responsable de comercio",
        "description": "Se ocupa del mercado, los eventos y las oportunidades."
      },
      "content_publisher": {
        "name": "Editor de contenido",
        "description": "Solo publica anuncios para la asociación."
      },
      "resources_requests_manager": {
        "name": "Responsable de recursos y solicitudes",
        "description": "Gestiona los recursos, las solicitudes de servicio y sus tipos, y el directorio."
      },
      "community_moderator": {
        "name": "Moderador de la asociación",
        "description": "Modera miembros, entradas y denuncias y quejas."
      },
      "support_agent": {
        "name": "Agente de soporte",
        "description": "Atiende los casos de soporte."
      }
    },
    "admins": {
      "builtInRoles": "Roles integrados",
      "customRoles": "Roles personalizados",
      "passwordHint": "Al menos 12 caracteres. Se rechazan las contraseñas que han aparecido en una filtración de datos conocida.",
      "passwordTooShort": "La contraseña debe tener al menos 12 caracteres.",
      "noCustomRoles": "Aún no hay roles personalizados. Crea uno en la pestaña Roles para ofrecerlo aquí."
    }
  },
  "fr": {
    "roles": {
      "description": "Les rôles regroupent des permissions que vous pouvez attribuer aux admins.",
      "create": "Nouveau rôle",
      "empty": "Aucun rôle défini pour cette association pour l'instant.",
      "system": "Système",
      "noPermissions": "Aucune permission",
      "roleAssigned": "Rôle attribué.",
      "form": {
        "title": "Créer un rôle",
        "subtitle": "Donnez un nom au rôle et choisissez les permissions qu'il accorde.",
        "name": "Nom",
        "namePlaceholder": "ex. Modérateur de contenu",
        "nameRequired": "Un nom de rôle est requis.",
        "descriptionLabel": "Description",
        "descriptionPlaceholder": "À quoi sert ce rôle ?",
        "permissions": "Permissions",
        "permissionsRequired": "Sélectionnez au moins une permission.",
        "submit": "Créer le rôle",
        "created": "Rôle créé.",
        "editTitle": "Modifier le rôle",
        "template": "Partir d’un modèle",
        "templateNone": "Aucun modèle — choisir les permissions soi-même",
        "templateHint": "Un modèle coche les permissions ; vous pouvez les changer avant d’enregistrer, puis à tout moment.",
        "selectedCount_one": "{{count}} sélectionnée",
        "selectedCount_other": "{{count}} sélectionnées",
        "ownPermissionsOnly": "Vous ne pouvez donner à un rôle que les permissions de votre propre rôle.",
        "selectModule": "Tout sélectionner",
        "clearModule": "Effacer",
        "save": "Enregistrer",
        "updated": "Rôle mis à jour."
      },
      "edit": "Modifier le rôle {{name}}",
      "delete": "Supprimer le rôle {{name}}",
      "deleted": "Rôle supprimé.",
      "deleteTitle": "Supprimer « {{name}} » ?",
      "deleteDescription": "Les admins qui ont ce rôle perdent immédiatement ses permissions. Cette action est définitive.",
      "deleteConfirm": "Supprimer le rôle",
      "otherPermission": "Autre permission",
      "yours": "Vos rôles",
      "readyMade": {
        "title": "Rôles prêts à l’emploi",
        "description": "Partez de l’un de ces rôles. Vous pouvez modifier le nom et les autorisations avant d’enregistrer.",
        "use": "Utiliser ce rôle",
        "useLabel": "Utiliser le rôle {{name}}",
        "inUse": "Ajouté",
        "more_one": "+{{count}} autre",
        "more_other": "+{{count}} autres"
      }
    },
    "readOnly": "Seul l’admin de l’association peut ajouter des admins ou changer leurs rôles.",
    "errors": {
      "loadCatalogue": "Impossible de charger la liste des permissions. Réessayez plus tard.",
      "updateRole": "Impossible de mettre à jour le rôle.",
      "deleteRole": "Impossible de supprimer le rôle.",
      "createRole": "Échec de la création du rôle.",
      "loadRoles": "Échec du chargement des rôles."
    },
    "rolePermissions": {
      "posts": {
        "publish": {
          "label": "Publier des posts",
          "description": "Publier, modifier et supprimer des annonces au nom de l’association."
        },
        "moderate": {
          "label": "Modérer les posts",
          "description": "Approuver ou refuser les posts en attente de validation."
        }
      },
      "events": {
        "manage": {
          "label": "Gérer les événements",
          "description": "Créer, modifier, publier et annuler des événements ; billets, formulaires d’inscription, participants et accueil."
        }
      },
      "opportunities": {
        "manage": {
          "label": "Gérer les opportunités",
          "description": "Créer, modifier, publier et clôturer des opportunités, et examiner les candidatures."
        }
      },
      "marketplace": {
        "manage": {
          "label": "Gérer la marketplace",
          "description": "Gérer la boutique de l’association : produits, services, commandes et réglages de la marketplace."
        }
      },
      "groups": {
        "manage": {
          "label": "Gérer les groupes",
          "description": "Créer et modifier des groupes, et gérer leurs membres, invitations et demandes d’adhésion."
        }
      },
      "members": {
        "approve": {
          "label": "Approuver les membres",
          "description": "Examiner les demandes d’adhésion et inviter de nouveaux membres."
        },
        "moderate": {
          "label": "Modérer les membres",
          "description": "Suspendre, bannir ou retirer des membres, et lever suspensions et bannissements."
        }
      },
      "registries": {
        "manage": {
          "label": "Gérer les registres",
          "description": "Tenir les registres des membres : fiches, vérification, imports et diffusions."
        }
      },
      "associations": {
        "manage": {
          "label": "Gérer les liens avec les communautés",
          "description": "Lier et délier des communautés, et accepter ou refuser les demandes de lien."
        }
      },
      "service_requests": {
        "manage": {
          "label": "Traiter les demandes de service",
          "description": "Examiner, attribuer, approuver, refuser et clôturer les demandes des membres."
        },
        "types": {
          "label": "Gérer les types de demande",
          "description": "Configurer les formulaires de demande proposés aux membres, avec leurs frais."
        }
      },
      "resources": {
        "manage": {
          "label": "Gérer les ressources",
          "description": "Publier et organiser documents, guides et médias dans la bibliothèque."
        }
      },
      "directory": {
        "manage": {
          "label": "Gérer l’annuaire",
          "description": "Ajouter, modifier, publier et archiver des fiches de l’annuaire."
        }
      },
      "support_cases": {
        "manage": {
          "label": "Traiter les dossiers d’assistance",
          "description": "Traiter les dossiers : les attribuer, changer leur statut, ajouter des notes et des pièces."
        },
        "types": {
          "label": "Gérer les types de dossier",
          "description": "Configurer les types de dossier que les membres peuvent ouvrir."
        }
      },
      "reports": {
        "manage": {
          "label": "Traiter les signalements et plaintes",
          "description": "Examiner ce que signalent les membres et le résoudre ou le classer."
        }
      },
      "settings": {
        "manage": {
          "label": "Modifier les paramètres",
          "description": "Modifier les informations de l’association, les images, la visibilité, les règles d’adhésion et les services activés."
        }
      },
      "roles": {
        "manage": {
          "label": "Gérer les rôles",
          "description": "Créer, modifier et supprimer des rôles, uniquement avec les permissions de votre propre rôle. Les comptes admin restent gérés par l’admin de l’association."
        }
      },
      "audit": {
        "view": {
          "label": "Consulter le journal d’audit",
          "description": "Voir l’historique des actions de modération et d’administration."
        }
      }
    },
    "roleModules": {
      "posts": "Posts",
      "events": "Événements",
      "opportunities": "Opportunités",
      "marketplace": "Marketplace",
      "groups": "Groupes",
      "members": "Membres",
      "associations": "Liens avec les communautés",
      "service_requests": "Demandes de service",
      "resources": "Ressources",
      "directory": "Annuaire",
      "support": "Dossiers d’assistance",
      "reports": "Signalements et plaintes",
      "settings": "Paramètres",
      "roles": "Rôles et admins",
      "audit": "Journal d’audit"
    },
    "roleTemplates": {
      "co_administrator": {
        "name": "Co-administrateur",
        "description": "Gère toute l’association avec vous, sauf les rôles."
      },
      "commerce_manager": {
        "name": "Responsable commerce",
        "description": "S’occupe de la marketplace, des événements et des opportunités."
      },
      "content_publisher": {
        "name": "Rédacteur de contenu",
        "description": "Publie uniquement des annonces pour l’association."
      },
      "resources_requests_manager": {
        "name": "Responsable ressources et demandes",
        "description": "Gère les ressources, les demandes de service et leurs types, et l’annuaire."
      },
      "community_moderator": {
        "name": "Modérateur de l’association",
        "description": "Modère les membres, les posts et les signalements et plaintes."
      },
      "support_agent": {
        "name": "Agent d’assistance",
        "description": "Traite les dossiers d’assistance."
      }
    },
    "admins": {
      "builtInRoles": "Rôles intégrés",
      "customRoles": "Rôles personnalisés",
      "passwordHint": "Au moins 12 caractères. Les mots de passe apparus dans une fuite de données connue sont refusés.",
      "passwordTooShort": "Le mot de passe doit contenir au moins 12 caractères.",
      "noCustomRoles": "Aucun rôle personnalisé pour l’instant. Créez-en un dans l’onglet Rôles pour le proposer ici."
    }
  },
  "it": {
    "roles": {
      "description": "I ruoli raggruppano permessi che puoi assegnare agli admin.",
      "create": "Nuovo ruolo",
      "empty": "Nessun ruolo definito per questa associazione.",
      "system": "Sistema",
      "noPermissions": "Nessun permesso",
      "roleAssigned": "Ruolo assegnato.",
      "form": {
        "title": "Crea ruolo",
        "subtitle": "Dai un nome al ruolo e scegli i permessi che concede.",
        "name": "Nome",
        "namePlaceholder": "es. Moderatore di contenuti",
        "nameRequired": "Il nome del ruolo è obbligatorio.",
        "descriptionLabel": "Descrizione",
        "descriptionPlaceholder": "A cosa serve questo ruolo?",
        "permissions": "Permessi",
        "permissionsRequired": "Seleziona almeno un permesso.",
        "submit": "Crea ruolo",
        "created": "Ruolo creato.",
        "editTitle": "Modifica ruolo",
        "template": "Parti da un modello",
        "templateNone": "Nessun modello: scegli tu i permessi",
        "templateHint": "Un modello compila i permessi; puoi cambiarli prima di salvare e in qualsiasi momento dopo.",
        "selectedCount_one": "{{count}} selezionato",
        "selectedCount_other": "{{count}} selezionati",
        "ownPermissionsOnly": "Puoi assegnare a un ruolo solo i permessi che ha il tuo ruolo.",
        "selectModule": "Seleziona tutto",
        "clearModule": "Deseleziona",
        "save": "Salva modifiche",
        "updated": "Ruolo aggiornato."
      },
      "edit": "Modifica il ruolo {{name}}",
      "delete": "Elimina il ruolo {{name}}",
      "deleted": "Ruolo eliminato.",
      "deleteTitle": "Eliminare «{{name}}»?",
      "deleteDescription": "Gli admin con questo ruolo perdono subito i suoi permessi. L’operazione non può essere annullata.",
      "deleteConfirm": "Elimina ruolo",
      "otherPermission": "Altro permesso",
      "yours": "I tuoi ruoli",
      "readyMade": {
        "title": "Ruoli predefiniti",
        "description": "Parti da uno di questi. Puoi cambiare nome e permessi prima di salvare.",
        "use": "Usa questo ruolo",
        "useLabel": "Usa il ruolo {{name}}",
        "inUse": "Aggiunto",
        "more_one": "+{{count}} altro",
        "more_other": "+{{count}} altri"
      }
    },
    "readOnly": "Solo l’admin dell’associazione può aggiungere admin o cambiarne i ruoli.",
    "errors": {
      "loadCatalogue": "Impossibile caricare l’elenco dei permessi. Riprova più tardi.",
      "updateRole": "Impossibile aggiornare il ruolo.",
      "deleteRole": "Impossibile eliminare il ruolo.",
      "createRole": "Impossibile creare il ruolo.",
      "loadRoles": "Impossibile caricare i ruoli."
    },
    "rolePermissions": {
      "posts": {
        "publish": {
          "label": "Pubblicare post",
          "description": "Pubblicare, modificare ed eliminare annunci a nome dell’associazione."
        },
        "moderate": {
          "label": "Moderare i post",
          "description": "Approvare o rifiutare i post in attesa di revisione."
        }
      },
      "events": {
        "manage": {
          "label": "Gestire gli eventi",
          "description": "Creare, modificare, pubblicare e annullare eventi; biglietti, moduli di iscrizione, partecipanti e check-in."
        }
      },
      "opportunities": {
        "manage": {
          "label": "Gestire le opportunità",
          "description": "Creare, modificare, pubblicare e chiudere opportunità e valutare le candidature."
        }
      },
      "marketplace": {
        "manage": {
          "label": "Gestire il marketplace",
          "description": "Gestire il negozio dell’associazione: prodotti, servizi, ordini e impostazioni del marketplace."
        }
      },
      "groups": {
        "manage": {
          "label": "Gestire i gruppi",
          "description": "Creare e modificare gruppi e gestirne membri, inviti e richieste di adesione."
        }
      },
      "members": {
        "approve": {
          "label": "Approvare i membri",
          "description": "Esaminare le richieste di adesione e invitare nuovi membri."
        },
        "moderate": {
          "label": "Moderare i membri",
          "description": "Sospendere, bandire o rimuovere membri e revocare sospensioni e ban."
        }
      },
      "registries": {
        "manage": {
          "label": "Gestire i registri",
          "description": "Tenere i registri dei membri: schede, verifica, importazioni e invii."
        }
      },
      "associations": {
        "manage": {
          "label": "Gestire i collegamenti con le community",
          "description": "Collegare e scollegare community e approvare o rifiutare le richieste di collegamento."
        }
      },
      "service_requests": {
        "manage": {
          "label": "Gestire le richieste di servizio",
          "description": "Esaminare, assegnare, approvare, rifiutare e completare le richieste dei membri."
        },
        "types": {
          "label": "Gestire i tipi di richiesta",
          "description": "Configurare i moduli di richiesta che i membri possono compilare, con le relative tariffe."
        }
      },
      "resources": {
        "manage": {
          "label": "Gestire le risorse",
          "description": "Pubblicare e organizzare documenti, guide e contenuti multimediali nella biblioteca."
        }
      },
      "directory": {
        "manage": {
          "label": "Gestire la rubrica",
          "description": "Aggiungere, modificare, pubblicare e archiviare le schede della rubrica."
        }
      },
      "support_cases": {
        "manage": {
          "label": "Gestire i casi di assistenza",
          "description": "Lavorare sui casi: assegnarli, cambiarne lo stato e aggiungere note e prove."
        },
        "types": {
          "label": "Gestire i tipi di caso",
          "description": "Configurare i tipi di caso che i membri possono aprire."
        }
      },
      "reports": {
        "manage": {
          "label": "Gestire segnalazioni e reclami",
          "description": "Esaminare le segnalazioni dei membri e risolverle o archiviarle."
        }
      },
      "settings": {
        "manage": {
          "label": "Modificare le impostazioni",
          "description": "Modificare i dati dell’associazione, le immagini, la visibilità, le regole di adesione e i servizi attivi."
        }
      },
      "roles": {
        "manage": {
          "label": "Gestire i ruoli",
          "description": "Creare, modificare ed eliminare ruoli, solo con i permessi del proprio ruolo. Gli account admin restano all’admin dell’associazione."
        }
      },
      "audit": {
        "view": {
          "label": "Vedere il registro di controllo",
          "description": "Consultare lo storico delle azioni di moderazione e amministrazione."
        }
      }
    },
    "roleModules": {
      "posts": "Post",
      "events": "Eventi",
      "opportunities": "Opportunità",
      "marketplace": "Marketplace",
      "groups": "Gruppi",
      "members": "Membri",
      "associations": "Collegamenti con le community",
      "service_requests": "Richieste di servizio",
      "resources": "Risorse",
      "directory": "Rubrica",
      "support": "Casi di assistenza",
      "reports": "Segnalazioni e reclami",
      "settings": "Impostazioni",
      "roles": "Ruoli e admin",
      "audit": "Registro di controllo"
    },
    "roleTemplates": {
      "co_administrator": {
        "name": "Co-amministratore",
        "description": "Gestisce con te l’intera associazione, tranne i ruoli."
      },
      "commerce_manager": {
        "name": "Responsabile commerciale",
        "description": "Si occupa di marketplace, eventi e opportunità."
      },
      "content_publisher": {
        "name": "Redattore di contenuti",
        "description": "Pubblica solo annunci per l’associazione."
      },
      "resources_requests_manager": {
        "name": "Responsabile risorse e richieste",
        "description": "Gestisce risorse, richieste di servizio e relativi tipi, e la rubrica."
      },
      "community_moderator": {
        "name": "Moderatore dell’associazione",
        "description": "Modera membri, post e segnalazioni e reclami."
      },
      "support_agent": {
        "name": "Operatore di assistenza",
        "description": "Gestisce i casi di assistenza."
      }
    },
    "admins": {
      "builtInRoles": "Ruoli integrati",
      "customRoles": "Ruoli personalizzati",
      "passwordHint": "Almeno 12 caratteri. Le password comparse in una violazione di dati nota vengono rifiutate.",
      "passwordTooShort": "La password deve contenere almeno 12 caratteri.",
      "noCustomRoles": "Nessun ruolo personalizzato per ora. Creane uno nella scheda Ruoli per proporlo qui."
    }
  }
};
