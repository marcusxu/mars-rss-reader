import { apiClient } from './api-client';
import { handleApiError } from './error-handler';
import {
  Subscription,
  SubscriptionFilter,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  PaginationResponse,
  ServiceResult,
} from '../types';

interface DeleteSubscriptionResponse {
  id: string;
  message: string;
}

export const subscriptionService = {
  async getSubscriptions(filter?: SubscriptionFilter): Promise<PaginationResponse<Subscription>> {
    const params = new URLSearchParams();
    
    if (filter?.page) params.append('page', String(filter.page));
    if (filter?.perPage) params.append('perPage', String(filter.perPage));
    if (filter?.id) params.append('id', filter.id);
    if (filter?.url) params.append('url', filter.url);
    if (filter?.name) params.append('name', filter.name);
    if (filter?.category) params.append('category', filter.category);

    const response = await apiClient.get<PaginationResponse<Subscription>>(
      `/subscriptions?${params.toString()}`
    );
    return response.data;
  },

  async createSubscription(data: CreateSubscriptionRequest): Promise<ServiceResult<Subscription>> {
    try {
      const response = await apiClient.post<Subscription>('/subscriptions', data);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateSubscription(
    id: string,
    data: UpdateSubscriptionRequest
  ): Promise<ServiceResult<Subscription>> {
    try {
      const response = await apiClient.patch<Subscription>(`/subscriptions/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async deleteSubscription(id: string): Promise<ServiceResult<DeleteSubscriptionResponse>> {
    try {
      const response = await apiClient.delete<DeleteSubscriptionResponse>(
        `/subscriptions/${id}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
