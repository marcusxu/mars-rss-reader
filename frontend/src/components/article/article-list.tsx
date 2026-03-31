import { Box, Grid, Pagination } from '@mui/material';
import { Article } from '../../types';
import { ArticleCard } from './article-card';

interface ArticleListProps {
  articles: Article[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onToggleRead: (article: Article) => void;
  onToggleFavorite: (article: Article) => void;
}

export function ArticleList({
  articles,
  currentPage,
  totalPages,
  onPageChange,
  onToggleRead,
  onToggleFavorite,
}: ArticleListProps) {
  return (
    <Box>
      <Grid container spacing={3}>
        {articles.map((article, index) => (
          <Grid item xs={12} sm={6} md={4} key={article.id}>
            <ArticleCard
              article={article}
              onToggleRead={onToggleRead}
              onToggleFavorite={onToggleFavorite}
              allArticles={articles}
              currentIndex={index}
            />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
}
