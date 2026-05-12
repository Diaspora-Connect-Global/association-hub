import { getGraphQLClient } from "@/core/graphql-client";
import type {
  Post,
  CreatedComment,
  PostCommonResponse,
  CreatePostInput,
  CreateAssociationPostInput,
  CreateCommentInput,
  AddEngagementInput,
  ReportPostInput,
  UploadUrlResponse,
  FileType,
  EditPostInput,
  EditPostResult,
  PostPriorityLevel,
} from "./types";

export async function deletePost(id: string): Promise<PostCommonResponse> {
  const mutation = `
    mutation DeletePost($id: String!) {
      deletePost(id: $id) {
        success
      }
    }
  `;
  const data = await getGraphQLClient().request<{ deletePost: PostCommonResponse }>(mutation, {
    id,
  });
  return data.deletePost;
}

export async function deleteComment(commentId: string): Promise<PostCommonResponse> {
  const mutation = `
    mutation DeleteComment($input: DeleteCommentInput!) {
      deleteComment(input: $input) {
        success
        message
      }
    }
  `;
  const data = await getGraphQLClient().request<{ deleteComment: PostCommonResponse }>(
    mutation,
    { input: { commentId } },
  );
  return data.deleteComment;
}

export async function adminSetPostPriority(
  postId: string,
  level: PostPriorityLevel,
): Promise<PostCommonResponse> {
  const mutation = `
    mutation AdminSetPostPriority($input: SetPostPriorityInput!) {
      adminSetPostPriority(input: $input) {
        success
      }
    }
  `;
  const data = await getGraphQLClient().request<{
    adminSetPostPriority: PostCommonResponse;
  }>(mutation, { input: { postId, level } });
  return data.adminSetPostPriority;
}

export async function reportPost(input: ReportPostInput): Promise<PostCommonResponse> {
  const mutation = `
    mutation ReportPost($input: ReportPostInput!) {
      reportPost(input: $input) {
        success
        message
      }
    }
  `;
  const data = await getGraphQLClient().request<{ reportPost: PostCommonResponse }>(mutation, {
    input,
  });
  return data.reportPost;
}

/**
 * Request a signed GCS upload URL.
 * Flow:
 *   1. Call this to get { uploadUrl, objectKey, fileUrl }
 *   2. PUT binary to uploadUrl with the matching Content-Type header
 *   3. Use objectKey in CreatePostInput.attachments
 */
export async function requestUploadUrl(
  fileName: string,
  fileType: FileType,
  contentType: string,
  vendorId?: string,
): Promise<UploadUrlResponse> {
  const mutation = `
    mutation RequestUploadUrl($fileName: String!, $fileType: String!, $contentType: String!, $vendorId: String) {
      requestUploadUrl(fileName: $fileName, fileType: $fileType, contentType: $contentType, vendorId: $vendorId) {
        uploadUrl
        objectKey
      }
    }
  `;
  const data = await getGraphQLClient().request<{ requestUploadUrl: UploadUrlResponse }>(
    mutation,
    { fileName, fileType, contentType, vendorId },
  );
  return data.requestUploadUrl;
}

/**
 * Publish as an association: uses `createPost` with `authorType: ASSOCIATION` and
 * `authorId` = association id (same as admin `scopeId`).
 */
export async function createAssociationPost(
  input: CreateAssociationPostInput,
): Promise<Post> {
  return createPost({
    text: input.text,
    authorType: "ASSOCIATION",
    authorId: input.associationId,
    visibility: input.visibility ?? "ASSOCIATION",
    attachments: input.attachments?.map((a) => ({
      objectKey: a.objectKey,
      type: a.type,
      mimeType: a.mimeType,
      size: a.size,
    })),
    mentionedUserIds: input.mentionedUserIds,
    mentions: input.mentions,
  });
}

export async function createComment(input: CreateCommentInput): Promise<CreatedComment> {
  const mutation = `
    mutation CreateComment($input: CreateCommentInput!) {
      createComment(input: $input) {
        id
        postId
        userId
        text
        parentId
        createdAt
      }
    }
  `;
  const data = await getGraphQLClient().request<{ createComment: CreatedComment }>(mutation, {
    input,
  });
  return data.createComment;
}

export async function addEngagement(input: AddEngagementInput): Promise<PostCommonResponse> {
  const mutation = `
    mutation AddEngagement($input: AddEngagementInput!) {
      addEngagement(input: $input) {
        success
        message
      }
    }
  `;
  const data = await getGraphQLClient().request<{ addEngagement: PostCommonResponse }>(
    mutation,
    { input },
  );
  return data.addEngagement;
}

export async function removeEngagement(
  input: AddEngagementInput,
): Promise<PostCommonResponse> {
  const mutation = `
    mutation RemoveEngagement($input: RemoveEngagementInput!) {
      removeEngagement(input: $input) {
        success
        message
      }
    }
  `;
  const data = await getGraphQLClient().request<{ removeEngagement: PostCommonResponse }>(
    mutation,
    { input },
  );
  return data.removeEngagement;
}

export async function adminDeletePost(postId: string): Promise<PostCommonResponse> {
  const mutation = `
    mutation AdminDeletePost($input: PostIdInput!) {
      adminDeletePost(input: $input) {
        success
      }
    }
  `;
  const data = await getGraphQLClient().request<{ adminDeletePost: PostCommonResponse }>(
    mutation,
    { input: { postId } },
  );
  return data.adminDeletePost;
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const mutation = `
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        id
        authorType
        authorId
        text
        visibility
        status
        createdAt
        attachments {
          id
          type
          url
        }
      }
    }
  `;
  const data = await getGraphQLClient().request<{ createPost: Post }>(mutation, { input });
  return data.createPost;
}

export async function editPost(input: EditPostInput): Promise<EditPostResult> {
  const mutation = `
    mutation EditPost($input: EditPostInput!) {
      editPost(input: $input) {
        id
        text
        visibility
        updatedAt
      }
    }
  `;
  const data = await getGraphQLClient().request<{ editPost: EditPostResult }>(mutation, {
    input,
  });
  return data.editPost;
}

export async function hidePost(id: string): Promise<PostCommonResponse> {
  const mutation = `
    mutation HidePost($id: String!) {
      hidePost(id: $id) {
        success
        message
      }
    }
  `;
  const data = await getGraphQLClient().request<{ hidePost: PostCommonResponse }>(mutation, {
    id,
  });
  return data.hidePost;
}

export async function publishPost(id: string, visibility: string): Promise<Post> {
  const mutation = `
    mutation PublishPost($id: String!, $visibility: String!) {
      publishPost(id: $id, visibility: $visibility) {
        id
        text
        visibility
        status
        createdAt
        updatedAt
      }
    }
  `;
  const data = await getGraphQLClient().request<{ publishPost: Post }>(mutation, {
    id,
    visibility,
  });
  return data.publishPost;
}
