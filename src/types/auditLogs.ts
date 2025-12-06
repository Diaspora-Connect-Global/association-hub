export type UserType = "individual" | "association_admin" | "association_member";
export type ActionType = "create" | "update" | "delete" | "login" | "logout" | "upload" | "download" | "comment" | "approve" | "reject";
export type ModuleType = "users" | "groups" | "posts" | "opportunities" | "events" | "marketplace" | "orders" | "support_tickets" | "settings";

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserType;
  userPhoto?: string;
  actionType: ActionType;
  module: ModuleType;
  objectAffected: string;
  objectId?: string;
  detailsSummary: string;
  ipAddress: string;
  device: string;
  browser: string;
  previousValue?: string;
  newValue?: string;
  changesMade?: string;
  notes?: string;
}