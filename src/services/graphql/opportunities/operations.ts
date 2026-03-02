import { getGraphQLClient } from "@/core/graphql-client";
import type {
  OpportunityType,
  OpportunityListResponse,
  ListOpportunitiesInput,
  ApplicationListResponse,
  GetApplicationsInput,
  CreateOpportunityInput,
  CreateOpportunityResponse,
  UpdateOpportunityInput,
  ReviewApplicationInput,
} from "./types";

const OPPORTUNITY_FIELDS = `
  id
  ownerType ownerId
  owner { id name avatarUrl type }
  type category subCategory
  title description responsibilities requirements
  workMode engagementType location
  visibility applicationMethod externalLink applicationEmail
  status priorityLevel
  salaryMin salaryMax salaryCurrency
  deadline applicationCount skills tags
  isSavedByCurrentUser hasCurrentUserApplied currentUserApplicationId
  createdAt updatedAt publishedAt closedAt
`;

const GET_OPPORTUNITY = /* GraphQL */ `
  query GetOpportunity($id: String!) {
    opportunity(id: $id) {
      ${OPPORTUNITY_FIELDS}
    }
  }
`;

const LIST_OPPORTUNITIES = /* GraphQL */ `
  query ListOpportunities($input: ListOpportunitiesInput) {
    opportunities(input: $input) {
      total
      opportunities {
        ${OPPORTUNITY_FIELDS}
      }
    }
  }
`;

const GET_APPLICATIONS = /* GraphQL */ `
  query GetApplications($input: GetApplicationsInput!) {
    getApplications(input: $input) {
      total
      applications {
        id opportunityId applicantId status
        coverLetter customAnswers reviewNotes reviewedBy reviewedAt
        createdAt updatedAt
        resumeFileRef { path filename mimeType sizeBytes }
        opportunity {
          id title type category status
          owner { id name avatarUrl type }
        }
      }
    }
  }
`;

const CREATE_OPPORTUNITY = /* GraphQL */ `
  mutation CreateOpportunity($input: CreateOpportunityInput!) {
    createOpportunity(input: $input) {
      id title status createdAt
    }
  }
`;

const UPDATE_OPPORTUNITY = /* GraphQL */ `
  mutation UpdateOpportunity($id: String!, $input: UpdateOpportunityInput!) {
    updateOpportunity(id: $id, input: $input)
  }
`;

const PUBLISH_OPPORTUNITY = /* GraphQL */ `
  mutation PublishOpportunity($id: String!) {
    publishOpportunity(id: $id)
  }
`;

const CLOSE_OPPORTUNITY = /* GraphQL */ `
  mutation CloseOpportunity($id: String!, $reason: String) {
    closeOpportunity(id: $id, reason: $reason)
  }
`;

const DELETE_OPPORTUNITY = /* GraphQL */ `
  mutation DeleteOpportunity($id: String!) {
    deleteOpportunity(id: $id)
  }
`;

const ACCEPT_APPLICATION = /* GraphQL */ `
  mutation AcceptApplication($id: String!) {
    acceptApplication(id: $id)
  }
`;

const REJECT_APPLICATION = /* GraphQL */ `
  mutation RejectApplication($id: String!, $reason: String) {
    rejectApplication(id: $id, reason: $reason)
  }
`;

const REVIEW_APPLICATION = /* GraphQL */ `
  mutation ReviewApplication($input: ReviewApplicationInput!) {
    reviewApplication(input: $input)
  }
`;

// --- Query operations

export interface GetOpportunityVariables {
  id: string;
}
export interface GetOpportunityResult {
  opportunity: OpportunityType | null;
}

export async function getOpportunity(id: string): Promise<OpportunityType | null> {
  const client = getGraphQLClient();
  const data = await client.request<GetOpportunityResult, GetOpportunityVariables>(
    GET_OPPORTUNITY,
    { id }
  );
  return data.opportunity;
}

export interface ListOpportunitiesVariables {
  input?: ListOpportunitiesInput | null;
}
export interface ListOpportunitiesResult {
  opportunities: OpportunityListResponse;
}

export async function listOpportunities(
  input?: ListOpportunitiesInput | null
): Promise<OpportunityListResponse> {
  const client = getGraphQLClient();
  const data = await client.request<ListOpportunitiesResult, ListOpportunitiesVariables>(
    LIST_OPPORTUNITIES,
    { input: input ?? undefined }
  );
  return data.opportunities;
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

export async function acceptApplication(id: string): Promise<boolean> {
  const client = getGraphQLClient();
  const data = await client.request<{ acceptApplication: boolean }>(ACCEPT_APPLICATION, {
    id,
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
  const data = await client.request<{ reviewApplication: boolean }>(REVIEW_APPLICATION, {
    input,
  });
  return data.reviewApplication;
}
