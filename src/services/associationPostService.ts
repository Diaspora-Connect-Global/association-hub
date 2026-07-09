import {
  createAssociationPost,
  deletePost as deletePostMutation,
  editPost as editPostMutation,
  getAssociationFeed,
  hidePost as hidePostMutation,
  publishPost as publishPostMutation,
  post,
  postComments,
  createComment,
  deleteComment as deleteCommentMutation,
  addEngagement,
  removeEngagement,
  reportPost,
  requestUploadUrl,
  adminDeletePost,
  type AssociationFeedResponse,
  type Post,
  type Comment,
  type CreatedComment,
  type CreateAssociationPostInput,
  type CreateCommentInput,
  type AddEngagementInput,
  type ReportPostInput,
  type PostCommonResponse,
  type AttachmentType,
  type UploadUrlResponse,
  type EditPostInput,
  type EditPostResult,
  type PostVisibility,
} from "@/services/graphql/posts";
import { uploadFileToSignedUrl } from "@/services/uploadFileToSignedUrl";

interface UploadAttachmentInput {
  file: File;
  type: AttachmentType;
  vendorId?: string;
}

interface UploadedAttachment {
  objectKey: string;
  mimeType: string;
  type: AttachmentType;
  size: number;
}

async function withReadRetry<T>(operation: () => Promise<T>, retries = 2): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        throw error;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Request failed");
}

export class AssociationPostService {
  async requestUploadUrl(
    fileName: string,
    fileType: AttachmentType,
    contentType: string,
    vendorId?: string,
  ): Promise<UploadUrlResponse> {
    return requestUploadUrl(fileName, fileType, contentType, vendorId);
  }

  async uploadAttachment(input: UploadAttachmentInput): Promise<UploadedAttachment> {
    const upload = await this.requestUploadUrl(
      input.file.name,
      input.type,
      input.file.type,
      input.vendorId,
    );

    await uploadFileToSignedUrl(upload.uploadUrl, input.file, input.file.type);

    return {
      objectKey: upload.objectKey,
      mimeType: input.file.type,
      type: input.type,
      size: input.file.size,
    };
  }

  async createAssociationPost(input: CreateAssociationPostInput): Promise<{ id: string }> {
    const result = await createAssociationPost(input);
    return { id: result.id };
  }

  async getAssociationFeed(
    associationId: string,
    limit: number,
    offset: number,
  ): Promise<AssociationFeedResponse> {
    return withReadRetry(() => getAssociationFeed(associationId, limit, offset));
  }

  async post(postId: string): Promise<Post> {
    return withReadRetry(() => post(postId));
  }

  async postComments(
    postId: string,
    limit = 20,
    offset = 0,
    parentId?: string,
  ): Promise<Comment[]> {
    return withReadRetry(() => postComments(postId, limit, offset, parentId));
  }

  async createComment(input: CreateCommentInput): Promise<CreatedComment> {
    return createComment(input);
  }

  async deleteComment(commentId: string): Promise<PostCommonResponse> {
    return deleteCommentMutation(commentId);
  }

  async addEngagement(input: AddEngagementInput): Promise<boolean> {
    const result = await addEngagement(input);
    return result.success;
  }

  async removeEngagement(input: AddEngagementInput): Promise<boolean> {
    const result = await removeEngagement(input);
    return result.success;
  }

  async reportPost(input: ReportPostInput): Promise<boolean> {
    const result = await reportPost(input);
    return result.success;
  }

  async deletePost(postId: string): Promise<boolean> {
    const result = await deletePostMutation(postId);
    return result.success;
  }

  async editPost(input: EditPostInput): Promise<EditPostResult> {
    return editPostMutation(input);
  }

  async hidePost(postId: string): Promise<boolean> {
    const result = await hidePostMutation(postId);
    return result.success;
  }

  async publishPost(postId: string, visibility: PostVisibility): Promise<Post> {
    return publishPostMutation(postId, visibility);
  }

  async adminDeletePost(postId: string): Promise<boolean> {
    const result = await adminDeletePost(postId);
    return result.success;
  }
}

export const associationPostService = new AssociationPostService();
