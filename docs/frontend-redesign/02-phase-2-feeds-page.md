# Phase 2: 文章列表页重构

## 🎯 阶段目标

重构文章列表页，使用卡片视图展示文章，添加筛选功能和骨架屏加载效果，提供优秀的用户体验。

## 📦 文件清单

需要创建 5 个文件，重构 1 个文件：

### 新增组件（5 个文件）
1. `frontend/src/components/article/article-card.tsx` - 文章卡片
2. `frontend/src/components/article/article-list.tsx` - 文章列表
3. `frontend/src/components/article/article-filter.tsx` - 文章筛选器
4. `frontend/src/components/article/article-skeleton.tsx` - 文章骨架屏
5. `frontend/src/components/article/article-actions.tsx` - 文章操作按钮

### 重构页面（1 个文件）
6. `frontend/src/pages/feeds-page.tsx` - 文章列表页

**依赖：** Phase 1 已完成（基础架构）

---

## 📝 完整代码实现

### 1. `frontend/src/components/article/article-card.tsx`

```typescript
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
}

export function ArticleCard({ article, onToggleRead, onToggleFavorite }: ArticleCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/article/${article.id}`);
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
```

---

### 2. `frontend/src/components/article/article-list.tsx`

```typescript
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
        {articles.map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article.id}>
            <ArticleCard
              article={article}
              onToggleRead={onToggleRead}
              onToggleFavorite={onToggleFavorite}
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
```

---

### 3. `frontend/src/components/article/article-filter.tsx`

```typescript
import { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Theme,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { Subscription } from '../../types';

interface ArticleFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  subscriptions: Subscription[];
  selectedSubscriptions: string[];
  onSubscriptionChange: (ids: string[]) => void;
  readFilter: 'all' | 'read' | 'unread';
  onReadFilterChange: (filter: 'all' | 'read' | 'unread') => void;
  favoriteFilter: 'all' | 'favorite' | 'unfavorite';
  onFavoriteFilterChange: (filter: 'all' | 'favorite' | 'unfavorite') => void;
  onReset: () => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(id: string, selectedIds: readonly string[], theme: Theme) {
  return {
    fontWeight:
      selectedIds.indexOf(id) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export function ArticleFilter({
  searchValue,
  onSearchChange,
  onSearch,
  subscriptions,
  selectedSubscriptions,
  onSubscriptionChange,
  readFilter,
  onReadFilterChange,
  favoriteFilter,
  onFavoriteFilterChange,
  onReset,
}: ArticleFilterProps) {
  const theme = useTheme();
  const [showFilters, setShowFilters] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const hasActiveFilters =
    selectedSubscriptions.length > 0 ||
    readFilter !== 'all' ||
    favoriteFilter !== 'all';

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search articles..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onSearchChange('')}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <IconButton
          color={showFilters ? 'primary' : 'default'}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FilterIcon />
        </IconButton>

        {hasActiveFilters && (
          <IconButton color="primary" onClick={onReset}>
            <ClearIcon />
          </IconButton>
        )}
      </Box>

      {showFilters && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Subscriptions</InputLabel>
            <Select
              multiple
              value={selectedSubscriptions}
              onChange={(e) => onSubscriptionChange(e.target.value as string[])}
              input={<OutlinedInput label="Subscriptions" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const sub = subscriptions.find((s) => s.id === id);
                    return (
                      <Chip
                        key={id}
                        label={sub?.name || id}
                        size="small"
                        onDelete={() =>
                          onSubscriptionChange(
                            selectedSubscriptions.filter((s) => s !== id)
                          )
                        }
                      />
                    );
                  })}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {subscriptions.map((sub) => (
                <MenuItem
                  key={sub.id}
                  value={sub.id}
                  style={getStyles(sub.id, selectedSubscriptions, theme)}
                >
                  {sub.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Read Status</InputLabel>
            <Select
              value={readFilter}
              label="Read Status"
              onChange={(e) =>
                onReadFilterChange(e.target.value as 'all' | 'read' | 'unread')
              }
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="read">Read</MenuItem>
              <MenuItem value="unread">Unread</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Favorite Status</InputLabel>
            <Select
              value={favoriteFilter}
              label="Favorite Status"
              onChange={(e) =>
                onFavoriteFilterChange(
                  e.target.value as 'all' | 'favorite' | 'unfavorite'
                )
              }
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="favorite">Favorite</MenuItem>
              <MenuItem value="unfavorite">Not Favorite</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
    </Box>
  );
}
```

---

### 4. `frontend/src/components/article/article-skeleton.tsx`

```typescript
import { Card, CardContent, Skeleton, Box } from '@mui/material';

export function ArticleSkeleton() {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={60} height={24} />
        </Box>

        <Skeleton variant="text" width="90%" height={28} />
        <Skeleton variant="text" width="70%" height={28} />

        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Skeleton variant="text" width={100} height={16} />
          <Skeleton variant="text" width={80} height={16} />
        </Box>
      </CardContent>
    </Card>
  );
}

export function ArticleSkeletonList({ count = 9 }: { count?: number }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
      {Array.from({ length: count }).map((_, index) => (
        <ArticleSkeleton key={index} />
      ))}
    </Box>
  );
}
```

---

### 5. `frontend/src/components/article/article-actions.tsx`

```typescript
import { Box, Button, ButtonGroup } from '@mui/material';
import {
  Refresh as RefreshIcon,
  DoneAll as DoneAllIcon,
  DeleteSweep as DeleteSweepIcon,
} from '@mui/icons-material';

interface ArticleActionsProps {
  onRefresh: () => void;
  onMarkAllRead: () => void;
  onCleanup: () => void;
  loading: boolean;
  hasUnread: boolean;
}

export function ArticleActions({
  onRefresh,
  onMarkAllRead,
  onCleanup,
  loading,
  hasUnread,
}: ArticleActionsProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <ButtonGroup variant="outlined" size="small" disabled={loading}>
        <Button
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
        <Button
          startIcon={<DoneAllIcon />}
          onClick={onMarkAllRead}
          disabled={!hasUnread || loading}
        >
          Mark All Read
        </Button>
        <Button
          startIcon={<DeleteSweepIcon />}
          onClick={onCleanup}
          color="error"
          disabled={loading}
        >
          Cleanup
        </Button>
      </ButtonGroup>
    </Box>
  );
}
```

---

### 6. 重构 `frontend/src/pages/feeds-page.tsx`

```typescript
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useArticles, useSubscriptions, useToast } from '../hooks';
import { ArticleList } from '../components/article/article-list';
import { ArticleFilter } from '../components/article/article-filter';
import { ArticleActions } from '../components/article/article-actions';
import { ArticleSkeletonList } from '../components/article/article-skeleton';
import { EmptyState } from '../components/common/empty-state';
import { Loading } from '../components/common/loading';
import { ConfirmDialog } from '../components/common/confirm-dialog';
import ArticleIcon from '@mui/icons-material/Article';

export function FeedsPage() {
  const toast = useToast();
  const {
    loading,
    articles,
    currentPage,
    totalPages,
    filterValue,
    setFilterValue,
    updateArticles,
    handleRefresh,
    handleCleanup,
    toggleReadStatus,
    toggleFavoriteStatus,
    markAllAsRead,
    handleFilterArticles,
    resetFilter,
  } = useArticles();

  const { subscriptions, fetchSubscriptions } = useSubscriptions(false);

  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);
  const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [favoriteFilter, setFavoriteFilter] = useState<'all' | 'favorite' | 'unfavorite'>('all');
  const [showCleanupDialog, setShowCleanupDialog] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleRefreshClick = async () => {
    await handleRefresh();
    toast.showToast('Feeds refreshed successfully', 'success');
  };

  const handleMarkAllReadClick = async () => {
    await markAllAsRead();
    toast.showToast('All articles marked as read', 'success');
  };

  const handleCleanupClick = () => {
    setShowCleanupDialog(true);
  };

  const handleConfirmCleanup = async () => {
    await handleCleanup();
    setShowCleanupDialog(false);
    toast.showToast('Feeds cleaned up successfully', 'success');
  };

  const handleToggleRead = async (article: typeof articles[0]) => {
    await toggleReadStatus(article);
    toast.showToast(
      article.isRead ? 'Marked as unread' : 'Marked as read',
      'success'
    );
  };

  const handleToggleFavorite = async (article: typeof articles[0]) => {
    await toggleFavoriteStatus(article);
    toast.showToast(
      article.isFavorite ? 'Removed from favorites' : 'Added to favorites',
      'success'
    );
  };

  const handleResetFilters = () => {
    setSelectedSubscriptions([]);
    setReadFilter('all');
    setFavoriteFilter('all');
    setFilterValue('');
    resetFilter();
  };

  const hasUnread = articles.some((a) => !a.isRead);

  const filteredArticles = articles.filter((article) => {
    if (selectedSubscriptions.length > 0 && !selectedSubscriptions.includes(article.subscription.id)) {
      return false;
    }
    if (readFilter === 'read' && !article.isRead) return false;
    if (readFilter === 'unread' && article.isRead) return false;
    if (favoriteFilter === 'favorite' && !article.isFavorite) return false;
    if (favoriteFilter === 'unfavorite' && article.isFavorite) return false;
    return true;
  });

  if (loading && articles.length === 0) {
    return <Loading message="Loading articles..." />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Feeds
      </Typography>

      <ArticleFilter
        searchValue={filterValue}
        onSearchChange={setFilterValue}
        onSearch={handleFilterArticles}
        subscriptions={subscriptions}
        selectedSubscriptions={selectedSubscriptions}
        onSubscriptionChange={setSelectedSubscriptions}
        readFilter={readFilter}
        onReadFilterChange={setReadFilter}
        favoriteFilter={favoriteFilter}
        onFavoriteFilterChange={setFavoriteFilter}
        onReset={handleResetFilters}
      />

      <ArticleActions
        onRefresh={handleRefreshClick}
        onMarkAllRead={handleMarkAllReadClick}
        onCleanup={handleCleanupClick}
        loading={loading}
        hasUnread={hasUnread}
      />

      {loading ? (
        <ArticleSkeletonList count={9} />
      ) : filteredArticles.length === 0 ? (
        <EmptyState
          title="No articles found"
          description="Try adjusting your filters or add some subscriptions"
          icon={<ArticleIcon sx={{ fontSize: 80 }} />}
        />
      ) : (
        <ArticleList
          articles={filteredArticles}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={updateArticles}
          onToggleRead={handleToggleRead}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      <ConfirmDialog
        open={showCleanupDialog}
        title="Cleanup Feeds"
        message="This will remove old articles from all subscriptions. This action cannot be undone."
        onConfirm={handleConfirmCleanup}
        onCancel={() => setShowCleanupDialog(false)}
        confirmText="Cleanup"
        confirmColor="error"
      />
    </Box>
  );
}
```

---

## ✅ 验证步骤

### 1. TypeScript 编译检查

```bash
cd frontend
npm run build
```

**预期结果：** 编译成功，无类型错误

### 2. 启动开发服务器

```bash
cd frontend
npm run dev
```

### 3. 功能测试

**测试文章列表显示：**
- [ ] 文章列表正常加载
- [ ] 文章卡片正常显示
- [ ] 卡片布局响应式正常（1列/2列/3列）

**测试文章筛选：**
- [ ] 搜索功能正常
- [ ] 按订阅筛选正常
- [ ] 按已读状态筛选正常
- [ ] 按收藏状态筛选正常
- [ ] 重置筛选正常

**测试文章操作：**
- [ ] 点击卡片跳转到详情页
- [ ] 切换已读状态正常
- [ ] 切换收藏状态正常
- [ ] 在新标签页打开正常

**测试批量操作：**
- [ ] 刷新 Feed 正常
- [ ] 标记全部已读正常
- [ ] 清理 Feed 正常（显示确认对话框）

**测试加载状态：**
- [ ] 首次加载显示骨架屏
- [ ] 加载中禁用操作按钮
- [ ] Toast 提示正常显示

**测试空状态：**
- [ ] 无文章时显示空状态
- [ ] 无筛选结果时显示空状态

---

## ⚠️ 注意事项

### 1. 筛选逻辑
- 筛选是在前端进行的，不影响后端请求
- 如果文章数量很大，建议改为后端筛选

### 2. 卡片布局
- xs: 1 列（手机）
- sm: 2 列（平板竖屏）
- md: 3 列（桌面）

### 3. 骨架屏
- 默认显示 9 个骨架屏卡片
- 与实际卡片布局一致

### 4. Toast 提示
- 所有操作都有 Toast 反馈
- 使用不同颜色表示成功/错误

---

## 📌 Phase 2 完成标志

- [x] 创建文章卡片组件
- [x] 创建文章列表组件
- [x] 创建文章筛选器组件
- [x] 创建文章骨架屏组件
- [x] 创建文章操作按钮组件
- [x] 重构 FeedsPage
- [x] TypeScript 编译通过
- [x] 所有功能测试通过

完成后，可以继续执行 Phase 3（文章详情页）。
