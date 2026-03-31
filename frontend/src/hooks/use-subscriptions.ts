import { useState, useCallback, useEffect } from 'react';
import {
  Subscription,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
} from '../types';
import { subscriptionService } from '../services';

export function useSubscriptions(initialLoad: boolean = true) {
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchSubscriptions = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await subscriptionService.getSubscriptions({ page, perPage: 10 });
      setSubscriptions(response.data);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialLoad) {
      fetchSubscriptions();
    }
  }, [initialLoad, fetchSubscriptions]);

  const createSubscription = useCallback(
    async (data: CreateSubscriptionRequest) => {
      const result = await subscriptionService.createSubscription(data);
      if (result.success) {
        await fetchSubscriptions(currentPage);
        return { success: true };
      }
      console.error('Failed to create subscription:', result.error);
      return { success: false, error: result.error };
    },
    [currentPage, fetchSubscriptions]
  );

  const updateSubscription = useCallback(
    async (id: string, data: UpdateSubscriptionRequest) => {
      const result = await subscriptionService.updateSubscription(id, data);
      if (result.success) {
        await fetchSubscriptions(currentPage);
        return { success: true };
      }
      console.error('Failed to update subscription:', result.error);
      return { success: false, error: result.error };
    },
    [currentPage, fetchSubscriptions]
  );

  const deleteSubscription = useCallback(
    async (id: string) => {
      const result = await subscriptionService.deleteSubscription(id);
      if (result.success) {
        await fetchSubscriptions(currentPage);
        return { success: true };
      }
      console.error('Failed to delete subscription:', result.error);
      return { success: false, error: result.error };
    },
    [currentPage, fetchSubscriptions]
  );

  return {
    loading,
    subscriptions,
    currentPage,
    totalPages,
    fetchSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  };
}
