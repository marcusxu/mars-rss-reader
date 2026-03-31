import { Grid } from 'react-window';
import { Article } from '../../types';
import { ArticleCard } from './article-card';

interface CellProps {
  articles: Article[];
  columnCount: number;
  gap: number;
  onToggleRead: (article: Article) => void;
  onToggleFavorite: (article: Article) => void;
}

interface VirtualizedArticleListProps {
  articles: Article[];
  columnCount: number;
  containerWidth: number;
  containerHeight: number;
  onToggleRead: (article: Article) => void;
  onToggleFavorite: (article: Article) => void;
}

export function VirtualizedArticleList({
  articles,
  columnCount,
  containerWidth,
  containerHeight,
  onToggleRead,
  onToggleFavorite,
}: VirtualizedArticleListProps) {
  const cardWidth = 350;
  const cardHeight = 400;
  const gap = 24;

  const CellComponent = ({
    columnIndex,
    rowIndex,
    style,
    articles: cellArticles,
    columnCount: cellColumnCount,
    gap: cellGap,
    onToggleRead: cellOnToggleRead,
    onToggleFavorite: cellOnToggleFavorite,
  }: {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
    articles: Article[];
    columnCount: number;
    gap: number;
    onToggleRead: (article: Article) => void;
    onToggleFavorite: (article: Article) => void;
  }) => {
    const index = rowIndex * cellColumnCount + columnIndex;
    if (index >= cellArticles.length) return null;

    const article = cellArticles[index];

    return (
      <div style={{ ...style, padding: cellGap / 2 }}>
        <ArticleCard
          article={article}
          onToggleRead={cellOnToggleRead}
          onToggleFavorite={cellOnToggleFavorite}
          allArticles={cellArticles}
          currentIndex={index}
        />
      </div>
    );
  };

  return (
    <Grid<CellProps>
      cellComponent={CellComponent}
      cellProps={{
        articles,
        columnCount,
        gap,
        onToggleRead,
        onToggleFavorite,
      }}
      columnCount={columnCount}
      columnWidth={cardWidth + gap}
      rowCount={Math.ceil(articles.length / columnCount)}
      rowHeight={cardHeight + gap}
      style={{
        width: containerWidth,
        height: containerHeight,
      }}
    />
  );
}
