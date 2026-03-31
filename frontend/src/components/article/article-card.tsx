import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  CardActionArea,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  MarkEmailRead as MarkEmailReadIcon,
  MarkEmailUnread as MarkEmailUnreadIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { Article } from '../../types';
import { formatDate } from '../../utils/date-util';

interface ArticleCardProps {
  article: Article;
  onToggleRead: (article: Article) => void;
  onToggleFavorite: (article: Article) => void;
  allArticles?: Article[];
  currentIndex?: number;
}

export function ArticleCard({
  article,
  onToggleRead,
  onToggleFavorite,
  allArticles = [],
  currentIndex = 0,
}: ArticleCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/article/${article.id}`, {
      state: {
        articles: allArticles,
        currentIndex: currentIndex,
      },
    });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        opacity: article.isRead ? 0.7 : 1,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip
              label={article.subscription.name}
              size="small"
              color="primary"
              variant="outlined"
            />
            {article.isRead && (
              <Chip label="Read" size="small" color="default" />
            )}
            {article.isFavorite && (
              <Chip label="Favorite" size="small" color="secondary" />
            )}
          </Box>

          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: article.isRead ? 400 : 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
              mb: 1,
            }}
          >
            {article.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              mb: 2,
            }}
          >
            {article.content.substring(0, 200)}...
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {article.author && (
              <Typography variant="caption" color="text.secondary">
                By {article.author}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              {formatDate(article.pubDate)}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box>
          <Tooltip title={article.isRead ? 'Mark as unread' : 'Mark as read'}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onToggleRead(article);
              }}
            >
              {article.isRead ? (
                <MarkEmailReadIcon fontSize="small" />
              ) : (
                <MarkEmailUnreadIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title={article.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(article);
              }}
            >
              {article.isFavorite ? (
                <FavoriteIcon fontSize="small" color="error" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        <Tooltip title="Open in new tab">
          <IconButton
            size="small"
            href={article.link}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
