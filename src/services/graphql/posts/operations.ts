import { getGraphQLClient } from "@/core/graphql-client";

// -------------------------------------------------------------------------
// Types
// -------------------------------------------------------------------------

export type PostStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED"
  | "REMOVED"
  | "PENDING_REVIEW";

export type PostVisibility = "PUBLIC" | "MEMBERS_ONLY" | "PRIVATE";

export interface PostType {
  id: string;
  authorId: string;
  authorType: string;
  text: string;
  status: PostStatus;
  visibility: PostVisibility;
  createdAt: string;
  updatedAt: string;
  // Engagement counts (may be absent depending on backend version)
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  viewsCount?: number;
}

export interface CreatePostInput {
  authorId: string;
  authorType: string;
  text: string;
  visibility?: string;
}

export interface EditPostInput {
  postId: string;
  text?: string;
  visibility?: string;
}

// -------------------------------------------------------------------------
// GraphQL Documents
// -------------------------------------------------------------------------

const POST_FIELDS = /* GraphQL */ `
  id
  authorId
  authorType
  text
  status
  visibility
  createdAt
  updatedAt
  likesCount
  commentsCount
  sharesCount
  viewsCount
`;

const GET_ASSOCIATION_POSTS = /* GraphQL */ `
  query UserPosts(
    $authorType: String!
    $authorId: String!
    $limit: Int!
    $offset: Int!
  ) {
    userPosts(
      authorType: $authorType
      authorId: $authorId
      limit: $limit
      offset: $offset
    ) {
      ${POST_FIELDS}
    }
  }
`;

const CREATE_POST = /* GraphQL */ `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ${POST_FIELDS}
    }
  }
`;

const PUBLISH_POST = /* GraphQL */ `
  mutation PublishPost($postId: ID!) {
    publishPost(postId: $postId) {
      success
    }
  }
`;

const DELETE_POST = /* GraphQL */ `
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId) {
      success
    }
  }
`;

const EDIT_POST = /* GraphQL */ `
  mutation EditPost($input: EditPostInput!) {
    editPost(input: $input) {
      ${POST_FIELDS}
    }
  }
`;

const HIDE_POST = /* GraphQL */ `
  mutation HidePost($postId: ID!, $reason: String) {
    hidePost(postId: $postId, reason: $reason) {
      success
    }
  }
`;

// -------------------------------------------------------------------------
// Operations
// -------------------------------------------------------------------------

/**
 * Fetch posts authored by an association. Maps to the `userPosts` backend query
 * with authorType fixed to "ASSOCIATION".
 */
export async function getAssociationPosts(
  associationId: string,
  limit = 50,
  offset = 0,
): Promise<PostType[]> {
  const client = getGraphQLClient();
  try {
    const data = await client.request<{ userPosts: PostType[] }>(
      GET_ASSOCIATION_POSTS,
      {
        authorType: "ASSOCIATION",
        authorId: associationId,
        limit,
        offset,
      },
    );
    return data.userPosts ?? [];
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch posts");
  }
}

export async function createPost(input: CreatePostInput): Promise<PostType> {
  const client = getGraphQLClient();
  try {
    const data = await client.request<{ createPost: PostType }>(CREATE_POST, {
      input,
    });
    return data.createPost;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to create post");
  }
}

export async function publishPost(
  postId: string,
): Promise<{ success: boolean }> {
  const client = getGraphQLClient();
  try {
    const data = await client.request<{ publishPost: { success: boolean } }>(
      PUBLISH_POST,
      { postId },
    );
    return data.publishPost;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to publish post");
  }
}

export async function deletePost(
  postId: string,
): Promise<{ success: boolean }> {
  const client = getGraphQLClient();
  try {
    const data = await client.request<{ deletePost: { success: boolean } }>(
      DELETE_POST,
      { postId },
    );
    return data.deletePost;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to delete post");
  }
}

export async function editPost(input: EditPostInput): Promise<PostType> {
  const client = getGraphQLClient();
  try {
    const data = await client.request<{ editPost: PostType }>(EDIT_POST, {
      input,
    });
    return data.editPost;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to edit post");
  }
}

export async function hidePost(
  postId: string,
  reason?: string,
): Promise<{ success: boolean }> {
  const client = getGraphQLClient();
  try {
    const data = await client.request<{ hidePost: { success: boolean } }>(
      HIDE_POST,
      { postId, reason: reason ?? null },
    );
    return data.hidePost;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to hide post");
  }
}
