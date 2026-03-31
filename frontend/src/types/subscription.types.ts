import { PaginationRequest } from './pagination.types';

export interface Subscription {
  id: string;
  url: string;
  name: string;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionRequest {
  url: string;
  name: string;
  description?: string;
  category?: string;
}

export interface UpdateSubscriptionRequest {
  url?: string;
  name?: string;
  description?: string;
  category?: string;
}

export interface SubscriptionFilter extends PaginationRequest {
  id?: string;
  url?: string;
  name?: string;
  category?: string;
}
