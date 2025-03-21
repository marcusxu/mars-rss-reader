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

export const getArticles = async (page: number = 1, perPage: number = 10) => {
  const response = await axios.get<ArticleResponse>(
    `http://localhost:3000/articles?page=${page}&perPage=${perPage}`,
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

export const changeReadStatus = async (article: Article) => {
  const response = await axios.patch<Article>(
    'http://localhost:3000/articles/' + article.id,
    {
      isRead: !article.isRead,
    },
  );
  return response.data;
};

export const changeFavoriteStatus = async (article: Article) => {
  const response = await axios.patch<Article>(
    'http://localhost:3000/articles/' + article.id,
    {
      isFavorite: !article.isFavorite,
    },
  );
  return response.data;
};

export const markAllAsRead = async (articles: Article[]) => {
  articles.forEach(async (article) => {
    await axios.patch<Article>('http://localhost:3000/articles/' + article.id, {
      isRead: true,
    });
  });
};
