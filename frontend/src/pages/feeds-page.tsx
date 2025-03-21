import { useEffect, useState } from 'react';
import {
  cleanupAllFeeds,
  getArticles,
  changeReadStatus,
  refreshAllFeeds,
  changeFavoriteStatus,
  markAllAsRead,
} from '../services/article-service';
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
  subscription: {
    id: string;
    name: string;
    url: string;
    category: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}

// TODO: Add filtering
// TODO: Add marking as all read

export function FeedsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  };
  const handleChangeFavoriteStatus = async (article: Article) => {
    await changeFavoriteStatus(article);
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
  if (error) return <div>Error: {error}</div>;

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
                  setArticles(
                    articles.map((a) => {
                      if (a.id === article.id) {
                        a.isRead = !a.isRead;
                      }
                      return a;
                    }),
                  );
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
                  setArticles(
                    articles.map((a) => {
                      if (a.id === article.id) {
                        a.isFavorite = !a.isFavorite;
                      }
                      return a;
                    }),
                  );
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
