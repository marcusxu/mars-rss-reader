import { useEffect, useState } from 'react';
import { Article } from '../types/article-type';
import {
  getArticles,
  refreshAllFeeds,
  cleanupAllFeeds,
  changeReadStatus,
  changeFavoriteStatus,
  markAllAsRead,
} from '../services/article-service';

export function useArticles() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    updateArticles();
  }, []);

  const updateArticles = async (
    event?: React.ChangeEvent<unknown>,
    newPage?: number,
  ) => {
    setLoading(true);
    const response = await getArticles(newPage | 1);
    setArticles(response.data);
    setCurrentPage(response.page);
    setTotalPages(Math.ceil(response.total / response.perPage));
    setLoading(false);
  };
  const handleRefresh = async () => {
    setLoading(true);
    await refreshAllFeeds();
    await updateArticles();
  };
  const handleCleanup = async () => {
    setLoading(true);
    await cleanupAllFeeds();
    await updateArticles();
  };
  const handleChangeReadStatus = async (article: Article) => {
    await changeReadStatus(article);
    setArticles(
      articles.map((a) => {
        if (a.id === article.id) {
          a.isRead = !a.isRead;
        }
        return a;
      }),
    );
  };
  const handleChangeFavoriteStatus = async (article: Article) => {
    await changeFavoriteStatus(article);
    setArticles(
      articles.map((a) => {
        if (a.id === article.id) {
          a.isFavorite = !a.isFavorite;
        }
        return a;
      }),
    );
  };
  const handleMarkAllAsRead = async (articles: Article[]) => {
    await markAllAsRead(articles);
    setArticles(
      articles.map((a) => {
        a.isRead = true;
        return a;
      }),
    );
  };

  return {
    loading,
    error,
    articles,
    currentPage,
    totalPages,
    updateArticles,
    handleRefresh,
    handleCleanup,
    handleChangeReadStatus,
    handleChangeFavoriteStatus,
    handleMarkAllAsRead,
  };
}
