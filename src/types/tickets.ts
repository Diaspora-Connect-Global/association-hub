export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketCategory = "technical" | "billing" | "product_inquiry" | "general";

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhoto?: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  description: string;
  attachments?: string[];
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

export interface TicketFormData {
  userName: string;
  userEmail: string;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  description: string;
  attachments?: File[];
}