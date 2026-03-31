import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useArticles, useSubscriptions, useToast } from '../hooks';
import { ArticleList } from '../components/article/article-list';
import { ArticleFilter } from '../components/article/article-filter';
import { ArticleActions } from '../components/article/article-actions';
import { ArticleSkeletonList } from '../components/article/article-skeleton';
import { EmptyState } from '../components/common/empty-state';
import { Loading } from '../components/common/loading';
import { ConfirmDialog } from '../components/common/confirm-dialog';
import ArticleIcon from '@mui/icons-material/Article';

export function FeedsPage() {
  const toast = useToast();
  const {
    loading,
    articles,
    currentPage,
    totalPages,
    filterValue,
    setFilterValue,
    updateArticles,
    handleRefresh,
    handleCleanup,
    toggleReadStatus,
    toggleFavoriteStatus,
    markAllAsRead,
    handleFilterArticles,
    resetFilter,
  } = useArticles();

  const { subscriptions, fetchSubscriptions } = useSubscriptions(false);

  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);
  const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [favoriteFilter, setFavoriteFilter] = useState<'all' | 'favorite' | 'unfavorite'>('all');
  const [showCleanupDialog, setShowCleanupDialog] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleRefreshClick = async () => {
    await handleRefresh();
    toast.showToast('Feeds refreshed successfully', 'success');
  };

  const handleMarkAllReadClick = async () => {
    await markAllAsRead();
    toast.showToast('All articles marked as read', 'success');
  };

  const handleCleanupClick = () => {
    setShowCleanupDialog(true);
  };

  const handleConfirmCleanup = async () => {
    await handleCleanup();
    setShowCleanupDialog(false);
    toast.showToast('Feeds cleaned up successfully', 'success');
  };

  const handleToggleRead = async (article: typeof articles[0]) => {
    await toggleReadStatus(article);
    toast.showToast(
      article.isRead ? 'Marked as unread' : 'Marked as read',
      'success'
    );
  };

  const handleToggleFavorite = async (article: typeof articles[0]) => {
    await toggleFavoriteStatus(article);
    toast.showToast(
      article.isFavorite ? 'Removed from favorites' : 'Added to favorites',
      'success'
    );
  };

  const handleResetFilters = () => {
    setSelectedSubscriptions([]);
    setReadFilter('all');
    setFavoriteFilter('all');
    setFilterValue('');
    resetFilter();
  };

  const hasUnread = articles.some((a) => !a.isRead);

  const filteredArticles = articles.filter((article) => {
    if (selectedSubscriptions.length > 0 && !selectedSubscriptions.includes(article.subscription.id)) {
      return false;
    }
    if (readFilter === 'read' && !article.isRead) return false;
    if (readFilter === 'unread' && article.isRead) return false;
    if (favoriteFilter === 'favorite' && !article.isFavorite) return false;
    if (favoriteFilter === 'unfavorite' && article.isFavorite) return false;
    return true;
  });

  if (loading && articles.length === 0) {
    return <Loading message="Loading articles..." />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Feeds
      </Typography>

      <ArticleFilter
        searchValue={filterValue}
        onSearchChange={setFilterValue}
        onSearch={handleFilterArticles}
        subscriptions={subscriptions}
        selectedSubscriptions={selectedSubscriptions}
        onSubscriptionChange={setSelectedSubscriptions}
        readFilter={readFilter}
        onReadFilterChange={setReadFilter}
        favoriteFilter={favoriteFilter}
        onFavoriteFilterChange={setFavoriteFilter}
        onReset={handleResetFilters}
      />

      <ArticleActions
        onRefresh={handleRefreshClick}
        onMarkAllRead={handleMarkAllReadClick}
        onCleanup={handleCleanupClick}
        loading={loading}
        hasUnread={hasUnread}
      />

      {loading ? (
        <ArticleSkeletonList count={9} />
      ) : filteredArticles.length === 0 ? (
        <EmptyState
          title="No articles found"
          description="Try adjusting your filters or add some subscriptions"
          icon={<ArticleIcon sx={{ fontSize: 80 }} />}
        />
      ) : (
        <ArticleList
          articles={filteredArticles}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={updateArticles}
          onToggleRead={handleToggleRead}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      <ConfirmDialog
        open={showCleanupDialog}
        title="Cleanup Feeds"
        message="This will remove old articles from all subscriptions. This action cannot be undone."
        onConfirm={handleConfirmCleanup}
        onCancel={() => setShowCleanupDialog(false)}
        confirmText="Cleanup"
        confirmColor="error"
      />
    </Box>
  );
}
