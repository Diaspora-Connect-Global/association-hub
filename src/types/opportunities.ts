export type OpportunityType = "job" | "volunteer" | "training" | "funding" | "scholarship" | "other";
export type OpportunityStatus = "draft" | "scheduled" | "published" | "closed" | "archived" | "removed";
export type ApplicantStatus = "pending" | "shortlisted" | "rejected" | "hired" | "withdrawn";

export interface Opportunity {
  id: string;
  title: string;
  shortDescription: string;
  description?: string;
  type: OpportunityType;
  status: OpportunityStatus;
  visibility: "members" | "public";
  location?: string;
  deadline?: string | null;
  maxApplicants?: number | null;
  applicantsCount: number;
  shortlistCount: number;
  hireCount: number;
  publishedAt: string | null;
  scheduledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  requireCv: boolean;
  allowAnonymous: boolean;
  autoAcknowledge: boolean;
  notifyMembers: boolean;
  searchable: boolean;
  formType: "simple" | "structured";
  reviewWorkflow: "manual" | "auto_sort" | "assign_reviewer";
  reviewers?: string[];
}

export interface Applicant {
  id: string;
  opportunityId: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  status: ApplicantStatus;
  appliedAt: string;
  screeningScore?: number;
  cvUrl?: string;
  coverLetter?: string;
  responses?: Record<string, string>;
  notes?: ApplicantNote[];
}

export interface ApplicantNote {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
}

export interface FormField {
  id: string;
  label: string;
  type: "text" | "email" | "textarea" | "dropdown" | "checkbox" | "file_upload";
  required: boolean;
  helpText?: string;
  options?: string[];
  accept?: string[];
}

export interface ScreeningQuestion {
  id: string;
  question: string;
  answerType: "yes_no" | "multiple_choice" | "text";
  options?: string[];
  passCriteria?: string;
}
