import { useEffect, useState } from 'react';
import {
  cleanupAllFeeds,
  getArticles,
  refreshAllFeeds,
} from '../services/article-service';
import {
  Box,
  Chip,
  Container,
  Fab,
  Link,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

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

// TODO: Add pagination
// TODO: Add status of a feed
// TODO: Add filtering
// TODO: Add marking as read
// TODO: Add marking as favorite
// TODO: Add marking as unread
// TODO: Add marking as unfavorite
// TODO: Add marking as all read

export function FeedsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    const response = await getArticles();
    setArticles(response.data);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleRefresh = async () => {
    await refreshAllFeeds();
    await fetchArticles();
  };

  const handleCleanup = async () => {
    await cleanupAllFeeds();
    await fetchArticles();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container>
      <List>
        {articles.map((article) => (
          <ListItem key={article.id}>
            <Link href={article.link} target="_blank">
              <Typography>{article.title}</Typography>
            </Link>
            <Chip
              label={article.subscription.name}
              color="primary"
              size="small"
            ></Chip>
          </ListItem>
        ))}
      </List>
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
