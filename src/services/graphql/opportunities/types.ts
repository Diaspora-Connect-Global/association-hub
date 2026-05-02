/** Opportunity type enum from API */
export type OpportunityTypeEnum =
  | "EMPLOYMENT"
  | "SCHOLARSHIP"
  | "INVESTMENT"
  | "FELLOWSHIP"
  | "INITIATIVE"
  | "GRANT"
  | "PROGRAM"
  | "VOLUNTEER"
  | "CONTRACT";

export type OpportunityCategoryEnum =
  | "EMPLOYMENT_CAREER"
  | "EDUCATION_TRAINING"
  | "FUNDING_GRANTS"
  | "FELLOWSHIPS_LEADERSHIP"
  | "BUSINESS_INVESTMENT"
  | "VOLUNTEERING_SOCIAL_IMPACT"
  | "EVENT_CREATIVE_INDUSTRY"
  | "AGRICULTURE_SUSTAINABILITY"
  | "REAL_ESTATE_INFRASTRUCTURE"
  | "GOVERNMENT_EMBASSY_INITIATIVES"
  | "INNOVATION_RESEARCH"
  | "FINANCE_ECONOMICS"
  | "RETURN_REINTEGRATION";

export type WorkModeEnum = "REMOTE" | "HYBRID" | "ONSITE";
export type EngagementTypeEnum = "FULL_TIME" | "PART_TIME" | "CONTRACT";
export type VisibilityEnum = "PUBLIC" | "COMMUNITY_ONLY" | "ASSOCIATION_ONLY";
export type ApplicationMethodEnum = "EXTERNAL_LINK" | "IN_PLATFORM_FORM" | "EMAIL_REQUEST";
export type OpportunityStatusEnum = "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED";
export type OwnerTypeEnum = "USER" | "COMMUNITY" | "ASSOCIATION";
export type PriorityLevelEnum = "HIGH" | "NORMAL" | "LOW";
export type ApplicationStatusEnum =
  | "PENDING"
  | "REVIEWING"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface OpportunityOwnerType {
  id: string;
  name: string;
  avatarUrl: string | null;
  type: string;
}

export interface OpportunityListItemType {
  id: string;
  title: string;
  status: OpportunityStatusEnum;
  type: OpportunityTypeEnum;
  category: OpportunityCategoryEnum;
  applicationMethod: ApplicationMethodEnum;
  applicationCount: number;
  priorityLevel: PriorityLevelEnum;
  createdAt: string;
  publishedAt: string | null;
  closedAt: string | null;
}

export interface OpportunityType extends OpportunityListItemType {
  id: string;
  ownerType: OwnerTypeEnum;
  ownerId: string;
  subCategory: string | null;
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  workMode: WorkModeEnum | null;
  engagementType: EngagementTypeEnum | null;
  location: string | null;
  visibility: VisibilityEnum;
  externalLink: string | null;
  applicationEmail: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  deadline: string | null;
  skills: string[];
  tags: string[];
  updatedAt: string;
}

export interface CreateOpportunityResponse {
  id: string;
}

export interface OpportunityListResponse {
  opportunities: OpportunityListItemType[];
  total: number;
}

/** List opportunities input (association admin: filter by ownerId/ownerType) */
export interface ListOpportunitiesInput {
  limit?: number;
  offset?: number;
  searchTerm?: string;
  type?: OpportunityTypeEnum;
  category?: OpportunityCategoryEnum;
  subCategory?: string;
  workMode?: WorkModeEnum;
  engagementType?: EngagementTypeEnum;
  location?: string;
  ownerType?: OwnerTypeEnum;
  ownerId?: string;
  status?: OpportunityStatusEnum;
  sortBy?: "CREATED_AT" | "DEADLINE" | "SALARY" | "RELEVANCE";
  sortOrder?: "ASC" | "DESC";
}

export interface FileRefType {
  path: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

export interface ApplicationOpportunityRef {
  id: string;
  title: string;
}

export interface ApplicationType {
  id: string;
  opportunityId: string;
  applicantId: string;
  status: ApplicationStatusEnum;
  coverLetter: string | null;
  reviewNotes: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface ApplicationDetailType extends ApplicationType {
  resumeFileRef: FileRefType | null;
  customAnswers: string | null;
  opportunity: ApplicationOpportunityRef | null;
}

export interface ApplicationListResponse {
  applications: ApplicationType[];
  total: number;
}

/** Get applications for an opportunity (association admin) */
export interface GetApplicationsInput {
  opportunityId: string;
  limit?: number;
  offset?: number;
  status?: ApplicationStatusEnum | string;
}

/** Create opportunity input (association admin: ownerType ASSOCIATION, ownerId = associationId) */
export interface CreateOpportunityInput {
  ownerType: OwnerTypeEnum;
  ownerId: string;
  type: OpportunityTypeEnum;
  category: OpportunityCategoryEnum;
  title: string;
  description: string;
  visibility: VisibilityEnum;
  applicationMethod: ApplicationMethodEnum;
  responsibilities?: string | null;
  requirements?: string | null;
  workMode?: WorkModeEnum | null;
  engagementType?: EngagementTypeEnum | null;
  location?: string | null;
  externalLink?: string | null;
  applicationEmail?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  deadline?: string | null;
  subCategory?: string | null;
  skills?: string[] | null;
  tags?: string[] | null;
}

/** Update opportunity input (partial) */
export interface UpdateOpportunityInput {
  title?: string;
  description?: string;
  responsibilities?: string;
  requirements?: string;
  applicationMethod?: ApplicationMethodEnum;
  externalLink?: string;
  applicationEmail?: string;
  workMode?: WorkModeEnum;
  engagementType?: EngagementTypeEnum;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  deadline?: string;
  subCategory?: string;
  skills?: string[];
  tags?: string[];
}

export interface GetApplicationResult {
  getApplication: ApplicationDetailType | null;
}

/** Review application input */
export interface ReviewApplicationInput {
  applicationId: string;
  notes?: string | null;
}
