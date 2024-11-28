import axios from 'axios';

interface ArticleResponse {
  page: number;
  perPage: number;
  total: number;
  data: Article[];
  totalPages: number;
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
