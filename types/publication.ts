export interface Publication {
  id: number;
  content: string;
  image: string | null;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
  likes: number;
  liked: boolean;
  commentsCount: number;
  comments: unknown[];
}

export interface PublicationsResponse {
  data: Publication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
