import axios from 'axios';
import { API_BASE_URL } from '../config/api.config';

interface Subscription {
  id: string;
  url: string;
  name: string;
  description?: string;
  category?: string;
}

interface SubscriptionResult {
  status: number;
  message: string;
}
export const getSubscriptions = async () => {
  const response = await axios.get<Subscription[]>(
    `${API_BASE_URL}/subscriptions`,
  );
  return response.data;
};

export const addSubscription = async (
  url: string,
  name: string,
  description: string,
  category: string,
): Promise<SubscriptionResult> => {
  try {
    await axios.post<Subscription>(`${API_BASE_URL}/subscriptions`, {
      url: url,
      name: name,
      description: description,
      category: category,
    });
    return { status: 201, message: 'Subscription added successfully' };
  } catch (error) {
    return { status: 500, message: String(error) };
  }
};

export const deleteSubscription = async (id: string) => {
  const response = await axios.delete<Subscription>(
    `${API_BASE_URL}/subscriptions/${id}`,
  );
  return response.data;
};
