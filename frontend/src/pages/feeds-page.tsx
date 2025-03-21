import {
  Box,
  Chip,
  CircularProgress,
  Container,
  Fab,
  Link,
  List,
  ListItem,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useArticles } from '../hooks/use-articles';

// TODO: Add filtering

export function FeedsPage() {
  const {
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
  } = useArticles();

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <div>
        <Box>
          <Typography>{error}</Typography>
        </Box>
      </div>
    );

  return (
    <Container>
      <List>
        {articles.map((article) => (
          <ListItem key={article.id}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexGrow: 1,
              }}
            >
              <Link href={article.link} target="_blank">
                <Typography>{article.title}</Typography>
              </Link>
              <Chip
                label={article.subscription.name}
                color="primary"
                size="small"
              ></Chip>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                variant="outlined"
                size="small"
                clickable={true}
                onClick={async () => {
                  handleChangeReadStatus(article);
                }}
                icon={
                  article.isRead ? (
                    <MarkEmailReadIcon />
                  ) : (
                    <MarkEmailUnreadIcon />
                  )
                }
              ></Chip>
              <Chip
                variant="outlined"
                size="small"
                clickable={true}
                onClick={async () => {
                  handleChangeFavoriteStatus(article);
                }}
                icon={
                  article.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />
                }
              ></Chip>
            </Box>
          </ListItem>
        ))}
      </List>
      <Stack spacing={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={updateArticles}
        />
      </Stack>
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: 'flex',
          gap: 2,
        }}
      >
        <Fab
          onClick={handleRefresh}
          variant="extended"
          size="small"
          color="primary"
        >
          <RefreshIcon /> Refresh
        </Fab>
        <Fab
          onClick={async () => handleMarkAllAsRead(articles)}
          variant="extended"
          size="small"
          color="secondary"
        >
          <MarkEmailReadIcon /> Mark All Read
        </Fab>
        <Fab
          onClick={handleCleanup}
          variant="extended"
          size="small"
          color="secondary"
        >
          <CleaningServicesIcon /> Cleanup
        </Fab>
      </Box>
    </Container>
  );
}
