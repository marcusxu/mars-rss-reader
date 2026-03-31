import { useState, useCallback } from 'react';
import { Article } from '../types';
import { articleService, feedService } from '../services';

export function useArticles() {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterValue, setFilterValue] = useState('');

  const updateArticles = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await articleService.getArticles({ page, perPage: 10 });
      setArticles(response.data);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchArticles = useCallback(async (title: string, page: number = 1) => {
    if (!title.trim()) {
      await updateArticles(1);
      return;
    }

    setLoading(true);
    try {
      const response = await articleService.searchArticles({ title, page, perPage: 10 });
      setArticles(response.data);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to search articles:', error);
    } finally {
      setLoading(false);
    }
  }, [updateArticles]);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await feedService.updateAllFeeds();
      if (result.success) {
        console.log('Feeds updated:', result.data);
      }
      await updateArticles(currentPage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, updateArticles]);

  const handleCleanup = useCallback(async () => {
    setLoading(true);
    try {
      const result = await feedService.cleanupAllFeeds();
      if (result.success) {
        console.log('Feeds cleaned up:', result.data);
      }
      await updateArticles(currentPage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, updateArticles]);

  const toggleReadStatus = useCallback(async (article: Article) => {
    const result = await articleService.toggleReadStatus(article);
    if (result.success && result.data) {
      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? result.data! : a))
      );
    } else {
      console.error('Failed to toggle read status:', result.error);
    }
  }, []);

  const toggleFavoriteStatus = useCallback(async (article: Article) => {
    const result = await articleService.toggleFavoriteStatus(article);
    if (result.success && result.data) {
      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? result.data! : a))
      );
    } else {
      console.error('Failed to toggle favorite status:', result.error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const unreadArticles = articles.filter((a) => !a.isRead);
    if (unreadArticles.length === 0) {
      console.log('All articles are already read');
      return;
    }

    const articleIds = unreadArticles.map((a) => a.id);
    const result = await articleService.markAllAsRead(articleIds);
    
    if (result.success) {
      setArticles((prev) => prev.map((a) => ({ ...a, isRead: true })));
      console.log('Marked all as read:', result.data);
    } else {
      console.error('Failed to mark all as read:', result.error);
    }
  }, [articles]);

  const handleFilterArticles = useCallback(async () => {
    if (filterValue.trim()) {
      await searchArticles(filterValue);
    } else {
      await updateArticles(1);
    }
  }, [filterValue, searchArticles, updateArticles]);

  const resetFilter = useCallback(() => {
    setFilterValue('');
    updateArticles(1);
  }, [updateArticles]);

  return {
    loading,
    articles,
    currentPage,
    totalPages,
    filterValue,
    setFilterValue,
    updateArticles,
    searchArticles,
    handleRefresh,
    handleCleanup,
    toggleReadStatus,
    toggleFavoriteStatus,
    markAllAsRead,
    handleFilterArticles,
    resetFilter,
  };
}
