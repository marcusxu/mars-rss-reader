export interface Article {
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
