import { Box, Typography, Link, Chip } from '@mui/material';
import { Article } from '../../types';
import { formatDate } from '../../utils/date-util';

interface ArticleContentProps {
  article: Article;
}

export function ArticleContent({ article }: ArticleContentProps) {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip
            label={article.subscription.name}
            color="primary"
            size="small"
          />
          {article.isRead && (
            <Chip label="Read" size="small" variant="outlined" />
          )}
          {article.isFavorite && (
            <Chip label="Favorite" size="small" color="secondary" variant="outlined" />
          )}
        </Box>

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          {article.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          {article.author && (
            <Typography variant="body2" color="text.secondary">
              By <strong>{article.author}</strong>
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            {formatDate(article.pubDate)}
          </Typography>
          <Link
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            View Original
          </Link>
        </Box>
      </Box>

      <Box
        sx={{
          '& p': {
            mb: 2,
            lineHeight: 1.8,
          },
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            mt: 3,
            mb: 2,
            fontWeight: 600,
          },
          '& ul, & ol': {
            mb: 2,
            pl: 3,
          },
          '& li': {
            mb: 1,
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 1,
            my: 2,
          },
          '& a': {
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
          '& blockquote': {
            borderLeft: 4,
            borderColor: 'primary.main',
            pl: 2,
            py: 1,
            my: 2,
            bgcolor: 'action.hover',
            fontStyle: 'italic',
          },
          '& pre': {
            bgcolor: 'action.selected',
            p: 2,
            borderRadius: 1,
            overflow: 'auto',
            my: 2,
          },
          '& code': {
            bgcolor: 'action.selected',
            px: 0.5,
            py: 0.25,
            borderRadius: 0.5,
            fontSize: '0.9em',
          },
        }}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <Box
        sx={{
          mt: 4,
          pt: 3,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Source:{' '}
          <Link
            href={article.subscription.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {article.subscription.name}
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
