import { getGraphQLClient } from "@/core/graphql-client";
import type {
  OpportunityType,
  OpportunityListItemType,
  OpportunityListResponse,
  ListOpportunitiesInput,
  ApplicationListResponse,
  GetApplicationsInput,
  ApplicationDetailType,
  CreateOpportunityInput,
  CreateOpportunityResponse,
  UpdateOpportunityInput,
  ReviewApplicationInput,
  PriorityLevelEnum,
} from "./types";

const OPPORTUNITY_LIST_FIELDS = `
  id
  title
  status
  type
  category
  applicationMethod
  applicationCount
  priorityLevel
  createdAt
  publishedAt
  closedAt
`;

const OPPORTUNITY_DETAIL_FIELDS = `
  id
  title
  description
  responsibilities
  requirements
  status
  priorityLevel
  applicationMethod
  externalLink
  applicationEmail
  workMode
  engagementType
  location
  salaryMin
  salaryMax
  salaryCurrency
  deadline
  skills
  tags
  applicationCount
  ownerType
  ownerId
  createdAt
  updatedAt
  publishedAt
  closedAt
  type category subCategory
  visibility
`;

const GET_OPPORTUNITY = /* GraphQL */ `
  query GetOpportunity($id: ID!) {
    getOpportunity(id: $id) {
      ${OPPORTUNITY_DETAIL_FIELDS}
    }
  }
`;

const LIST_OPPORTUNITIES = /* GraphQL */ `
  query ListOpportunities($input: ListOpportunitiesInput) {
    listOpportunities(input: $input) {
      total
      opportunities {
        ${OPPORTUNITY_LIST_FIELDS}
      }
    }
  }
`;

const GET_APPLICATION = /* GraphQL */ `
  query GetApplication($id: ID!) {
    getApplication(id: $id) {
      id
      opportunityId
      applicantId
      status
      coverLetter
      reviewNotes
      reviewedBy
      reviewedAt
      createdAt
      updatedAt
      customAnswers
      resumeFileRef { path filename mimeType sizeBytes }
      opportunity { id title }
    }
  }
`;

const GET_APPLICATIONS = /* GraphQL */ `
  query GetApplications($input: GetApplicationsInput!) {
    getApplications(input: $input) {
      total
      applications {
        id opportunityId applicantId status
        coverLetter reviewNotes reviewedBy reviewedAt
        createdAt updatedAt
      }
    }
  }
`;

const CREATE_OPPORTUNITY = /* GraphQL */ `
  mutation CreateOpportunity($input: CreateOpportunityInput!) {
    createOpportunity(input: $input) {
      id
    }
  }
`;

const UPDATE_OPPORTUNITY = /* GraphQL */ `
  mutation UpdateOpportunity($id: ID!, $input: UpdateOpportunityInput!) {
    updateOpportunity(id: $id, input: $input)
  }
`;

const PUBLISH_OPPORTUNITY = /* GraphQL */ `
  mutation PublishOpportunity($id: ID!) {
    publishOpportunity(id: $id)
  }
`;

const CLOSE_OPPORTUNITY = /* GraphQL */ `
  mutation CloseOpportunity($id: ID!, $reason: String) {
    closeOpportunity(id: $id, reason: $reason)
  }
`;

const DELETE_OPPORTUNITY = /* GraphQL */ `
  mutation DeleteOpportunity($id: ID!) {
    deleteOpportunity(id: $id)
  }
`;

const SET_OPPORTUNITY_PRIORITY = /* GraphQL */ `
  mutation SetOpportunityPriority($opportunityId: ID!, $priority: String!) {
    setOpportunityPriority(opportunityId: $opportunityId, priority: $priority)
  }
`;

const ACCEPT_APPLICATION = /* GraphQL */ `
  mutation AcceptApplication($id: ID!, $notes: String) {
    acceptApplication(id: $id, notes: $notes)
  }
`;

const REJECT_APPLICATION = /* GraphQL */ `
  mutation RejectApplication($id: ID!, $reason: String) {
    rejectApplication(id: $id, reason: $reason)
  }
`;

const REVIEW_APPLICATION = /* GraphQL */ `
  mutation ReviewApplication($applicationId: ID!, $notes: String) {
    reviewApplication(applicationId: $applicationId, notes: $notes)
  }
`;

// --- Query operations

export interface GetOpportunityVariables {
  id: string;
}
export interface GetOpportunityResult {
  getOpportunity: OpportunityType | null;
}

export async function getOpportunity(id: string): Promise<OpportunityType | null> {
  const client = getGraphQLClient();
  const data = await client.request<GetOpportunityResult, GetOpportunityVariables>(
    GET_OPPORTUNITY,
    { id }
  );
  return data.getOpportunity;
}

export interface ListOpportunitiesVariables {
  input?: ListOpportunitiesInput | null;
}
export interface ListOpportunitiesResult {
  listOpportunities: OpportunityListResponse;
}

export async function listOpportunities(
  input?: ListOpportunitiesInput | null
): Promise<OpportunityListResponse> {
  const client = getGraphQLClient();
  const data = await client.request<ListOpportunitiesResult, ListOpportunitiesVariables>(
    LIST_OPPORTUNITIES,
    { input: input ?? undefined }
  );
  return data.listOpportunities;
}

export interface GetApplicationVariables {
  id: string;
}
export interface GetApplicationResult {
  getApplication: ApplicationDetailType | null;
}

export async function getApplication(id: string): Promise<ApplicationDetailType | null> {
  const client = getGraphQLClient();
  const data = await client.request<GetApplicationResult, GetApplicationVariables>(
    GET_APPLICATION,
    { id }
  );
  return data.getApplication;
}

export interface GetApplicationsVariables {
  input: GetApplicationsInput;
}
export interface GetApplicationsResult {
  getApplications: ApplicationListResponse;
}

export async function getApplications(
  input: GetApplicationsInput
): Promise<ApplicationListResponse> {
  const client = getGraphQLClient();
  const data = await client.request<GetApplicationsResult, GetApplicationsVariables>(
    GET_APPLICATIONS,
    { input }
  );
  return data.getApplications;
}

// --- Mutation operations (association admin)

export async function createOpportunity(
  input: CreateOpportunityInput
): Promise<CreateOpportunityResponse> {
  const client = getGraphQLClient();
  const data = await client.request<{ createOpportunity: CreateOpportunityResponse }>(
    CREATE_OPPORTUNITY,
    { input }
  );
  return data.createOpportunity;
}

export async function updateOpportunity(
  id: string,
  input: UpdateOpportunityInput
): Promise<boolean> {
  const client = getGraphQLClient();
  const data = await client.request<{ updateOpportunity: boolean }>(UPDATE_OPPORTUNITY, {
    id,
    input,
  });
  return data.updateOpportunity;
}

export async function publishOpportunity(id: string): Promise<boolean> {
  const client = getGraphQLClient();
  const data = await client.request<{ publishOpportunity: boolean }>(PUBLISH_OPPORTUNITY, {
    id,
  });
  return data.publishOpportunity;
}

export async function closeOpportunity(id: string, reason?: string | null): Promise<boolean> {
  const client = getGraphQLClient();
  const data = await client.request<{ closeOpportunity: boolean }>(CLOSE_OPPORTUNITY, {
    id,
    reason: reason ?? undefined,
  });
  return data.closeOpportunity;
}

export async function deleteOpportunity(id: string): Promise<boolean> {
  const client = getGraphQLClient();
  const data = await client.request<{ deleteOpportunity: boolean }>(DELETE_OPPORTUNITY, {
    id,
  });
  return data.deleteOpportunity;
}

export async function setOpportunityPriority(
  opportunityId: string,
  priority: PriorityLevelEnum
): Promise<boolean> {
  const client = getGraphQLClient();
  const data = await client.request<{ setOpportunityPriority: boolean }>(
    SET_OPPORTUNITY_PRIORITY,
    {
      opportunityId,
      priority,
    }
  );
  return data.setOpportunityPriority;
}

export async function acceptApplication(id: string, notes?: string | null): Promise<boolean> {
  const client = getGraphQLClient();
  const data = await client.request<{ acceptApplication: boolean }>(ACCEPT_APPLICATION, {
    id,
    notes: notes ?? undefined,
  });
  return data.acceptApplication;
}

export async function rejectApplication(id: string, reason?: string | null): Promise<boolean> {
  const client = getGraphQLClient();
  const data = await client.request<{ rejectApplication: boolean }>(REJECT_APPLICATION, {
    id,
    reason: reason ?? undefined,
  });
  return data.rejectApplication;
}

export async function reviewApplication(input: ReviewApplicationInput): Promise<boolean> {
  const client = getGraphQLClient();
  const data = await client.request<{ reviewApplication: boolean }>(
    REVIEW_APPLICATION,
    {
      applicationId: input.applicationId,
      notes: input.notes ?? undefined,
    }
  );
  return data.reviewApplication;
}
