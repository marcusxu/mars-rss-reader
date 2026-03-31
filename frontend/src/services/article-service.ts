import axios from 'axios';
import { API_BASE_URL } from '../config/api.config';

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

interface BatchUpdateResponse {
  updatedCount: number;
  failedIds: string[];
  message: string;
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
  subscription: {
    id: string;
    name: string;
    url: string;
    category: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const getArticles = async (
  page: number = 1,
  perPage: number = 10,
  filter = '',
) => {
  const filterParam = filter ? '&' + filter : '';
  const response = await axios.get<ArticleResponse>(
    `${API_BASE_URL}/articles?page=${page}&perPage=${perPage}` + filterParam,
  );
  return response.data;
};

export const refreshAllFeeds = async () => {
  const response = await axios.patch<FeedResponse>(
    `${API_BASE_URL}/feeds/update-all`,
  );
  return response.data;
};

export const cleanupAllFeeds = async () => {
  const response = await axios.patch<FeedResponse>(
    `${API_BASE_URL}/feeds/cleanup-all`,
  );
  return response.data;
};

export const changeReadStatus = async (article: Article) => {
  const response = await axios.patch<Article>(
    `${API_BASE_URL}/articles/${article.id}`,
    {
      isRead: !article.isRead,
    },
  );
  return response.data;
};

export const changeFavoriteStatus = async (article: Article) => {
  const response = await axios.patch<Article>(
    `${API_BASE_URL}/articles/${article.id}`,
    {
      isFavorite: !article.isFavorite,
    },
  );
  return response.data;
};

export const markAllAsRead = async (articles: Article[]) => {
  const articleIds = articles.map((article) => article.id);
  const response = await axios.patch<BatchUpdateResponse>(
    `${API_BASE_URL}/articles/batch-update`,
    {
      ids: articleIds,
      isRead: true,
    },
  );
  return response.data;
};
