export interface Post {
  id: string;
  title: string;
  excerpt: string;
  body?: string;
  author: string;
  authorAvatar: string;
  media: "none" | "text" | "image" | "video" | "link";
  comments: number;
  reactions: number;
  saves?: number;
  impressions?: number;
  status: "published" | "draft" | "scheduled" | "archived" | "removed" | "pending_review";
  visibility: "members" | "public";
  pinned: boolean;
  allowComments: boolean;
  allowReactions: boolean;
  publishedAt: string | null;
  scheduledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  contentWarning?: "none" | "sensitive" | "age_restricted";
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  flagged: boolean;
  flagReason?: string;
  reportCount?: number;
  parentId?: string;
}

export interface PostVersion {
  id: string;
  postId: string;
  version: number;
  title: string;
  body: string;
  modifiedBy: string;
  modifiedAt: string;
}
