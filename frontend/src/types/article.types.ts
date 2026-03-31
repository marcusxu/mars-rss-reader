import { PaginationRequest } from './pagination.types';
import { Subscription } from './subscription.types';

export interface Article {
  id: string;
  title: string;
  content: string;
  link: string;
  author?: string;
  pubDate: string;
  isRead: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  subscription: Subscription;
}

export interface ArticleFilter extends PaginationRequest {
  id?: string;
  title?: string;
  content?: string;
  link?: string;
  author?: string;
  pubDate?: string;
  subscriptionId?: string;
  isRead?: boolean;
  isFavorite?: boolean;
}

export interface UpdateArticleRequest {
  isRead?: boolean;
  isFavorite?: boolean;
}

export interface BatchUpdateArticleRequest {
  ids: string[];
  isRead?: boolean;
  isFavorite?: boolean;
}

export interface BatchUpdateResponse {
  updatedCount: number;
  failedIds: string[];
  message: string;
}
