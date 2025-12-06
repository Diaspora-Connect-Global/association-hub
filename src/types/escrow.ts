export type EscrowStatus = "held" | "partially_released" | "fully_released" | "disputed" | "refunded";
export type MilestoneStatus = "pending" | "in_progress" | "completed" | "released" | "disputed";

export interface Milestone {
  id: string;
  orderId: string;
  name: string;
  description?: string;
  percentage: number; // Percentage of total order amount
  amount: number; // Calculated amount based on percentage
  status: MilestoneStatus;
  dueDate?: string;
  completedAt?: string;
  releasedAt?: string;
  confirmedByBuyer: boolean;
  notes?: string;
  createdAt: string;
}

export interface EscrowOrder {
  id: string;
  orderId: string;
  totalAmount: number;
  heldAmount: number;
  releasedAmount: number;
  currency: string;
  status: EscrowStatus;
  vendorId: string;
  vendorName: string;
  buyerId: string;
  buyerName: string;
  milestones: Milestone[];
  disputeReason?: string;
  disputedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMilestoneData {
  name: string;
  description?: string;
  percentage: number;
  dueDate?: string;
}
