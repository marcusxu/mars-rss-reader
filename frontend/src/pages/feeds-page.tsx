import { useEffect, useState } from 'react';
import {
  cleanupAllFeeds,
  getArticles,
  refreshAllFeeds,
} from '../services/article-service';
import Button from '@mui/material/Button';
import {
  Box,
  ButtonGroup,
  Chip,
  Link,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';

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
    <Box>
      <ButtonGroup size="small">
        <Button onClick={handleRefresh} startIcon={<Refresh />}>
          Refresh
        </Button>
        <Button onClick={handleCleanup}>Cleanup</Button>
      </ButtonGroup>
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
    </Box>
  );
}
