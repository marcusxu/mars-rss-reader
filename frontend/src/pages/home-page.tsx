import { useEffect, useState } from 'react';
import {
  cleanupAllFeeds,
  getArticles,
  refreshAllFeeds,
} from '../services/article-service';

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
}

export function HomePage() {
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
    <div>
      <h1>Mars RSS Reader</h1>
      <button onClick={handleRefresh}>Refresh</button>
      <button onClick={handleCleanup}>Cleanup</button>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <a href={article.link}>{article.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
