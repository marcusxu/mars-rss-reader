import axios from 'axios';

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
  const response = await axios.get<Subscription>(
    // TODO: use config instead of static url
    'http://localhost:3000/subscriptions',
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
    const response = await axios.post<Subscription>(
      'http://localhost:3000/subscriptions',
      {
        url: url,
        name: name,
        description: description,
        category: category,
      },
    );
    return { status: 201, message: response.data.message };
  } catch (error) {
    return { status: 500, message: error.toString() };
  }
};

export const deleteSubscription = async (id: string) => {
  const response = await axios.delete<Subscription>(
    'http://localhost:3000/subscriptions/' + id,
  );
  return response.data;
};
