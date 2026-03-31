# Phase 3: 文章详情页实现

## 🎯 阶段目标

实现文章详情页，支持应用内阅读，提供文章导航和良好的阅读体验。

## 📦 文件清单

需要创建 3 个文件，更新 1 个文件：

### 新增组件（2 个文件）
1. `frontend/src/components/article/article-content.tsx` - 文章内容渲染
2. `frontend/src/components/article/article-navigation.tsx` - 文章导航

### 新增页面（1 个文件）
3. `frontend/src/pages/article-detail-page.tsx` - 文章详情页

### 需要更新的文件
4. `frontend/src/main.tsx` - 添加文章详情页路由

**依赖：**
- Phase 1 已完成（基础架构）
- Phase 2 已完成（文章列表页）

---

## 📝 完整代码实现

### 1. `frontend/src/components/article/article-content.tsx`

```typescript
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
```

---

### 2. `frontend/src/components/article/article-navigation.tsx`

```typescript
import { Box, Button, Typography } from '@mui/material';
import {
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';

interface ArticleNavigationProps {
  hasNext: boolean;
  hasPrevious: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  currentIndex: number;
  totalCount: number;
}

export function ArticleNavigation({
  hasNext,
  hasPrevious,
  onNext,
  onPrevious,
  currentIndex,
  totalCount,
}: ArticleNavigationProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2,
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'divider',
        mb: 3,
      }}
    >
      <Button
        startIcon={<NavigateBeforeIcon />}
        disabled={!hasPrevious}
        onClick={onPrevious}
        sx={{ minWidth: 120 }}
      >
        Previous
      </Button>

      <Typography variant="body2" color="text.secondary">
        {currentIndex} of {totalCount}
      </Typography>

      <Button
        endIcon={<NavigateNextIcon />}
        disabled={!hasNext}
        onClick={onNext}
        sx={{ minWidth: 120 }}
      >
        Next
      </Button>
    </Box>
  );
}
```

---

### 3. `frontend/src/pages/article-detail-page.tsx`

```typescript
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import {
  Box,
  IconButton,
  Tooltip,
  Paper,
  Container,
  Skeleton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  MarkEmailRead as MarkEmailReadIcon,
  MarkEmailUnread as MarkEmailUnreadIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { articleService } from '../services';
import { Article } from '../types';
import { ArticleContent } from '../components/article/article-content';
import { ArticleNavigation } from '../components/article/article-navigation';
import { Loading } from '../components/common/loading';
import { EmptyState } from '../components/common/empty-state';
import { useToast } from '../hooks';
import ArticleIcon from '@mui/icons-material/Article';

interface LocationState {
  articles?: Article[];
  currentIndex?: number;
}

export function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const locationState = location.state as LocationState;
  const articles = locationState?.articles || [];
  const currentIndex = locationState?.currentIndex || 0;

  useEffect(() => {
    if (!id) {
      setError('Article ID is required');
      setLoading(false);
      return;
    }

    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await articleService.getArticleById(id!);
      setArticle(data);
    } catch (err) {
      setError('Failed to load article');
      console.error('Failed to fetch article:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async () => {
    if (!article) return;

    const result = await articleService.toggleReadStatus(article);
    if (result.success && result.data) {
      setArticle(result.data);
      toast.showToast(
        article.isRead ? 'Marked as unread' : 'Marked as read',
        'success'
      );
    }
  };

  const handleToggleFavorite = async () => {
    if (!article) return;

    const result = await articleService.toggleFavoriteStatus(article);
    if (result.success && result.data) {
      setArticle(result.data);
      toast.showToast(
        article.isFavorite ? 'Removed from favorites' : 'Added to favorites',
        'success'
      );
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handlePrevious = () => {
    if (currentIndex > 0 && articles[currentIndex - 1]) {
      navigate(`/article/${articles[currentIndex - 1].id}`, {
        state: {
          articles,
          currentIndex: currentIndex - 1,
        },
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < articles.length - 1 && articles[currentIndex + 1]) {
      navigate(`/article/${articles[currentIndex + 1].id}`, {
        state: {
          articles,
          currentIndex: currentIndex + 1,
        },
      });
    }
  };

  if (loading) {
    return <Loading message="Loading article..." />;
  }

  if (error || !article) {
    return (
      <EmptyState
        title="Article not found"
        description={error || 'The requested article could not be found'}
        icon={<ArticleIcon sx={{ fontSize: 80 }} />}
        action={{
          label: 'Go back',
          onClick: handleBack,
        }}
      />
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Tooltip title="Back to feeds">
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title={article.isRead ? 'Mark as unread' : 'Mark as read'}>
          <IconButton onClick={handleToggleRead}>
            {article.isRead ? (
              <MarkEmailReadIcon />
            ) : (
              <MarkEmailUnreadIcon />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title={article.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          <IconButton onClick={handleToggleFavorite}>
            {article.isFavorite ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title="Open in new tab">
          <IconButton href={article.link} target="_blank">
            <OpenInNewIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {articles.length > 0 && (
        <ArticleNavigation
          hasNext={currentIndex < articles.length - 1}
          hasPrevious={currentIndex > 0}
          onNext={handleNext}
          onPrevious={handlePrevious}
          currentIndex={currentIndex + 1}
          totalCount={articles.length}
        />
      )}

      <Paper sx={{ p: 4, minHeight: '60vh' }}>
        <ArticleContent article={article} />
      </Paper>
    </Container>
  );
}
```

---

### 4. 更新 `frontend/src/main.tsx`

**在 Routes 中添加新路由：**

```typescript
import { ArticleDetailPage } from './pages/article-detail-page';

// 在 Routes 中添加
<Routes>
  <Route path="/" element={<FeedsPage />} />
  <Route path="/article/:id" element={<ArticleDetailPage />} />
  <Route path="/subscriptions" element={<SubscriptionsPage />} />
  <Route path="/settings" element={<SettingsPage />} />
</Routes>
```

---

### 5. 更新 ArticleCard 组件（支持导航）

需要修改 `frontend/src/components/article/article-card.tsx`，传递文章列表和索引：

**修改 ArticleCard 的 onClick：**

```typescript
// 在 ArticleList 中，传递文章列表
<ArticleCard
  article={article}
  onToggleRead={onToggleRead}
  onToggleFavorite={onToggleFavorite}
  allArticles={articles}
  currentIndex={index}
/>
```

**修改 ArticleCard 组件：**

```typescript
interface ArticleCardProps {
  article: Article;
  onToggleRead: (article: Article) => void;
  onToggleFavorite: (article: Article) => void;
  allArticles?: Article[];
  currentIndex?: number;
}

export function ArticleCard({
  article,
  onToggleRead,
  onToggleFavorite,
  allArticles = [],
  currentIndex = 0,
}: ArticleCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/article/${article.id}`, {
      state: {
        articles: allArticles,
        currentIndex: currentIndex,
      },
    });
  };

  // ... 其余代码保持不变
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

**测试文章详情页访问：**
- [ ] 点击文章卡片跳转到详情页
- [ ] 文章内容正常显示
- [ ] 文章标题、作者、日期正确
- [ ] 文章格式化样式正确

**测试文章操作：**
- [ ] 切换已读状态正常
- [ ] 切换收藏状态正常
- [ ] 在新标签页打开原文正常
- [ ] Toast 提示正常

**测试文章导航：**
- [ ] 上一篇/下一篇导航正常
- [ ] 文章计数显示正确
- [ ] 首篇/末篇禁用导航按钮

**测试返回功能：**
- [ ] 返回按钮正常工作
- [ ] 返回后文章列表状态保持

**测试错误处理：**
- [ ] 无效文章 ID 显示错误页面
- [ ] 加载失败显示错误提示

**测试样式：**
- [ ] 文章内容排版美观
- [ ] 响应式布局正常
- [ ] 深色模式下显示正常

---

## ⚠️ 注意事项

### 1. 文章内容安全
- 使用 `dangerouslySetInnerHTML` 渲染 HTML 内容
- 确保后端已对内容进行 XSS 过滤

### 2. 文章导航
- 文章列表通过 location state 传递
- 如果直接访问详情页 URL，导航功能不可用

### 3. 样式处理
- 文章内容使用全局 CSS 选择器
- 确保样式不影响其他组件

### 4. 性能优化
- 如果文章内容很大，考虑虚拟滚动
- 可以添加阅读进度指示器

---

## 📌 Phase 3 完成标志

- [x] 创建文章内容渲染组件
- [x] 创建文章导航组件
- [x] 创建文章详情页
- [x] 更新路由配置
- [x] 更新 ArticleCard 支持导航
- [x] TypeScript 编译通过
- [x] 所有功能测试通过

完成后，可以继续执行 Phase 4（订阅管理页）或 Phase 5（设置和优化）。
