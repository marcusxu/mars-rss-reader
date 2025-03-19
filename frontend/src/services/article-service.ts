import axios from 'axios';

interface ArticleResponse {
  page: number;
  perPage: number;
  total: number;
  data: Article[];
  totalPages: number;
}

interface FeedResponse {
  subscriptionId: string;
  updatedAt: string;
  articlesCount: number;
}
interface Article {
  id: string;
  title: string;
  content: string;
  publishDate: string;
  link: string;
  author: string | null;
  pubDate: string;
  isRead: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getArticles = async () => {
  const response = await axios.get<ArticleResponse>(
    'http://localhost:3000/articles',
  );
  return response.data;
};

export const refreshAllFeeds = async () => {
  const response = await axios.patch<FeedResponse>(
    'http://localhost:3000/feeds/update-all',
  );
  return response.data;
};

export const cleanupAllFeeds = async () => {
  const response = await axios.patch<FeedResponse>(
    'http://localhost:3000/feeds/cleanup-all',
  );
  return response.data;
};
