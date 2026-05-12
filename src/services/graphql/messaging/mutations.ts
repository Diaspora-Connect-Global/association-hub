import { getGraphQLClient } from "@/core/graphql-client";
import type { MessageAttachmentInput, SendMessageInput } from "./types";

/**
 * Returns the conversationId. Idempotent for groups — the server returns the
 * existing conversation if one exists for the given groupId.
 */
export async function findOrCreateGroupConversation(
  groupId: string,
  participantIds: string[] = [],
): Promise<string> {
  const mutation = `
    mutation CreateConversation(
      $type: String!
      $participantIds: [String!]!
      $groupId: String
    ) {
      createConversation(
        type: $type
        participantIds: $participantIds
        groupId: $groupId
      )
    }
  `;
  const client = getGraphQLClient();
  const data = await client.request<
    { createConversation: string },
    { type: string; participantIds: string[]; groupId: string }
  >(mutation, { type: "GROUP", participantIds, groupId });
  return data.createConversation;
}

export async function sendGroupMessage(input: SendMessageInput): Promise<string> {
  const mutation = `
    mutation SendMessage(
      $conversationId: String!
      $messageType: String!
      $content: String!
      $mentions: [String!]
      $replyToId: String
      $idempotencyKey: String
      $clientMessageId: String
      $attachments: [MessageAttachmentInput!]
    ) {
      sendMessage(
        conversationId: $conversationId
        messageType: $messageType
        content: $content
        mentions: $mentions
        replyToId: $replyToId
        idempotencyKey: $idempotencyKey
        clientMessageId: $clientMessageId
        attachments: $attachments
      )
    }
  `;
  const client = getGraphQLClient();
  const data = await client.request<
    { sendMessage: string },
    {
      conversationId: string;
      messageType: string;
      content: string;
      mentions?: string[];
      replyToId?: string;
      idempotencyKey?: string;
      clientMessageId?: string;
      attachments?: MessageAttachmentInput[];
    }
  >(mutation, {
    conversationId: input.conversationId,
    messageType: input.messageType,
    content: input.content,
    mentions: input.mentions,
    replyToId: input.replyToId,
    idempotencyKey: input.idempotencyKey,
    clientMessageId: input.clientMessageId,
    attachments: input.attachments,
  });
  return data.sendMessage;
}

export async function uploadChatFile(uploadUrl: string, file: File): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!response.ok) {
    throw new Error(`Upload failed (${response.status} ${response.statusText})`);
  }
}

export async function markGroupConversationAsRead(conversationId: string): Promise<boolean> {
  const mutation = `
    mutation MarkConversationAsRead($conversationId: String!) {
      markConversationAsRead(conversationId: $conversationId)
    }
  `;
  const client = getGraphQLClient();
  const data = await client.request<
    { markConversationAsRead: boolean },
    { conversationId: string }
  >(mutation, { conversationId });
  return data.markConversationAsRead;
}
