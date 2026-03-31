import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import {
  Box,
  IconButton,
  Tooltip,
  Paper,
  Container,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  MarkEmailRead as MarkEmailReadIcon,
  MarkEmailUnread as MarkEmailUnreadIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { articleService } from '../services';
import { Article } from '../types';
import { ArticleContent } from '../components/article/article-content';
import { ArticleNavigation } from '../components/article/article-navigation';
import { Loading } from '../components/common/loading';
import { EmptyState } from '../components/common/empty-state';
import { useToast } from '../hooks';
import ArticleIcon from '@mui/icons-material/Article';

interface LocationState {
  articles?: Article[];
  currentIndex?: number;
}

export function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const locationState = location.state as LocationState;
  const articles = locationState?.articles || [];
  const currentIndex = locationState?.currentIndex || 0;

  useEffect(() => {
    if (!id) {
      setError('Article ID is required');
      setLoading(false);
      return;
    }

    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await articleService.getArticleById(id!);
      setArticle(data);
    } catch (err) {
      setError('Failed to load article');
      console.error('Failed to fetch article:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async () => {
    if (!article) return;

    const result = await articleService.toggleReadStatus(article);
    if (result.success && result.data) {
      setArticle(result.data);
      toast.showToast(
        article.isRead ? 'Marked as unread' : 'Marked as read',
        'success'
      );
    }
  };

  const handleToggleFavorite = async () => {
    if (!article) return;

    const result = await articleService.toggleFavoriteStatus(article);
    if (result.success && result.data) {
      setArticle(result.data);
      toast.showToast(
        article.isFavorite ? 'Removed from favorites' : 'Added to favorites',
        'success'
      );
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handlePrevious = () => {
    if (currentIndex > 0 && articles[currentIndex - 1]) {
      navigate(`/article/${articles[currentIndex - 1].id}`, {
        state: {
          articles,
          currentIndex: currentIndex - 1,
        },
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < articles.length - 1 && articles[currentIndex + 1]) {
      navigate(`/article/${articles[currentIndex + 1].id}`, {
        state: {
          articles,
          currentIndex: currentIndex + 1,
        },
      });
    }
  };

  if (loading) {
    return <Loading message="Loading article..." />;
  }

  if (error || !article) {
    return (
      <EmptyState
        title="Article not found"
        description={error || 'The requested article could not be found'}
        icon={<ArticleIcon sx={{ fontSize: 80 }} />}
        action={{
          label: 'Go back',
          onClick: handleBack,
        }}
      />
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Tooltip title="Back to feeds">
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title={article.isRead ? 'Mark as unread' : 'Mark as read'}>
          <IconButton onClick={handleToggleRead}>
            {article.isRead ? (
              <MarkEmailReadIcon />
            ) : (
              <MarkEmailUnreadIcon />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title={article.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          <IconButton onClick={handleToggleFavorite}>
            {article.isFavorite ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title="Open in new tab">
          <IconButton href={article.link} target="_blank">
            <OpenInNewIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {articles.length > 0 && (
        <ArticleNavigation
          hasNext={currentIndex < articles.length - 1}
          hasPrevious={currentIndex > 0}
          onNext={handleNext}
          onPrevious={handlePrevious}
          currentIndex={currentIndex + 1}
          totalCount={articles.length}
        />
      )}

      <Paper sx={{ p: 4, minHeight: '60vh' }}>
        <ArticleContent article={article} />
      </Paper>
    </Container>
  );
}
