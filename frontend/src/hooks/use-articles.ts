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
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterStatus, setFilterStatus] = useState(false);
  const [filterValue, setFilterValue] = useState<string>('');

  useEffect(() => {
    updateArticles();
  }, []);

  const updateArticles = async (
    _event?: React.ChangeEvent<unknown>,
    newPage?: number,
  ) => {
    setLoading(true);
    const response = await getArticles(newPage || 1);
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

  const handleFilterArticles = async (
    _event?: React.ChangeEvent<unknown>,
    newPage?: number,
  ) => {
    setLoading(true);
    const response = await getArticles(
      newPage || 1,
      10,
      'title=' + filterValue,
    );
    setArticles(response.data);
    setCurrentPage(response.page);
    setTotalPages(Math.ceil(response.total / response.perPage));
    setLoading(false);
    setFilterStatus(true);
  };

  return {
    loading,
    articles,
    currentPage,
    totalPages,
    filterStatus,
    filterValue,
    updateArticles,
    handleRefresh,
    handleCleanup,
    handleChangeReadStatus,
    handleChangeFavoriteStatus,
    handleMarkAllAsRead,
    handleFilterArticles,
    setFilterValue,
  };
}
