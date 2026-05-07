import { getGraphQLClient } from "@/core/graphql-client";
import type {
  CancelMembershipSubscriptionInput,
  CancelMembershipSubscriptionResult,
  MyMembershipResult,
  RequestMembershipInput,
  RequestMembershipResult,
} from "./types";

const REQUEST_MEMBERSHIP = /* GraphQL */ `
  mutation RequestMembership($input: RequestMembershipInput!) {
    requestMembership(input: $input) {
      id
      status
      message
      requiresPayment
      clientSecret
    }
  }
`;

const CANCEL_MEMBERSHIP_SUBSCRIPTION = /* GraphQL */ `
  mutation CancelMembershipSubscription($input: CancelMembershipSubscriptionInput!) {
    cancelMembershipSubscription(input: $input) {
      success
      message
    }
  }
`;

const MY_MEMBERSHIP = /* GraphQL */ `
  query MyMembership($entityId: ID!, $entityType: String) {
    myMembership(entityId: $entityId, entityType: $entityType) {
      id
      status
      requiresPayment
      expiresAt
      subscriptionId
    }
  }
`;

export async function requestMembership(
  input: RequestMembershipInput
): Promise<RequestMembershipResult> {
  const client = getGraphQLClient();
  const data = await client.request<
    { requestMembership: RequestMembershipResult },
    { input: RequestMembershipInput }
  >(REQUEST_MEMBERSHIP, { input });
  return data.requestMembership;
}

export async function cancelMembershipSubscription(
  input: CancelMembershipSubscriptionInput
): Promise<CancelMembershipSubscriptionResult> {
  const client = getGraphQLClient();
  const data = await client.request<
    { cancelMembershipSubscription: CancelMembershipSubscriptionResult },
    { input: CancelMembershipSubscriptionInput }
  >(CANCEL_MEMBERSHIP_SUBSCRIPTION, { input });
  return data.cancelMembershipSubscription;
}

export async function getMyMembership(
  entityId: string,
  entityType: string
): Promise<MyMembershipResult | null> {
  const client = getGraphQLClient();
  const data = await client.request<
    { myMembership: MyMembershipResult | null },
    { entityId: string; entityType: string }
  >(MY_MEMBERSHIP, { entityId, entityType });
  return data.myMembership;
}
