import { apiClient } from './api-client';
import { handleApiError } from './error-handler';
import { FeedResponse, ServiceResult } from '../types';

export const feedService = {
  async updateFeed(subscriptionId: string): Promise<ServiceResult<FeedResponse>> {
    try {
      const response = await apiClient.patch<FeedResponse>(
        `/feeds/update/${subscriptionId}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async cleanupFeed(subscriptionId: string): Promise<ServiceResult<FeedResponse>> {
    try {
      const response = await apiClient.patch<FeedResponse>(
        `/feeds/cleanup/${subscriptionId}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateAllFeeds(): Promise<ServiceResult<FeedResponse>> {
    try {
      const response = await apiClient.patch<FeedResponse>('/feeds/update-all');
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async cleanupAllFeeds(): Promise<ServiceResult<FeedResponse>> {
    try {
      const response = await apiClient.patch<FeedResponse>('/feeds/cleanup-all');
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
