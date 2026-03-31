# Phase 4: Hooks 层重构

## 🎯 阶段目标

重构 `use-articles` hook，创建 `use-subscriptions` hook，使用 Phase 3 重构后的 service，提供统一的 Hook API。

## 📦 文件清单

需要创建 3 个文件：

1. `frontend/src/hooks/use-articles.ts` - 文章管理 Hook（重构）
2. `frontend/src/hooks/use-subscriptions.ts` - 订阅管理 Hook（新建）
3. `frontend/src/hooks/index.ts` - 统一导出

**依赖：**
- Phase 1 已完成（类型定义）
- Phase 2 已完成（API 客户端和错误处理）
- Phase 3 已完成（Service 层）

**注意：** 本阶段会创建新的 hook 文件，暂时与旧的 hook 文件共存。Phase 5 会删除旧文件。

---

## 📝 完整代码实现

### 1. `frontend/src/hooks/use-articles.ts`

```typescript
import { useState, useCallback } from 'react';
import { Article, ArticleFilter } from '../types';
import { articleService, feedService } from '../services';

export function useArticles() {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterValue, setFilterValue] = useState('');

  /**
   * 更新文章列表
   */
  const updateArticles = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await articleService.getArticles({ page, perPage: 10 });
      setArticles(response.data);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 搜索文章
   */
  const searchArticles = useCallback(async (title: string, page: number = 1) => {
    if (!title.trim()) {
      await updateArticles(1);
      return;
    }

    setLoading(true);
    try {
      const response = await articleService.searchArticles({ title, page, perPage: 10 });
      setArticles(response.data);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to search articles:', error);
    } finally {
      setLoading(false);
    }
  }, [updateArticles]);

  /**
   * 刷新所有 Feed
   */
  const handleRefresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await feedService.updateAllFeeds();
      if (result.success) {
        console.log('Feeds updated:', result.data);
      }
      await updateArticles(currentPage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, updateArticles]);

  /**
   * 清理所有 Feed
   */
  const handleCleanup = useCallback(async () => {
    setLoading(true);
    try {
      const result = await feedService.cleanupAllFeeds();
      if (result.success) {
        console.log('Feeds cleaned up:', result.data);
      }
      await updateArticles(currentPage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, updateArticles]);

  /**
   * 切换文章已读状态
   */
  const toggleReadStatus = useCallback(async (article: Article) => {
    const result = await articleService.toggleReadStatus(article);
    if (result.success && result.data) {
      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? result.data! : a))
      );
    } else {
      console.error('Failed to toggle read status:', result.error);
    }
  }, []);

  /**
   * 切换文章收藏状态
   */
  const toggleFavoriteStatus = useCallback(async (article: Article) => {
    const result = await articleService.toggleFavoriteStatus(article);
    if (result.success && result.data) {
      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? result.data! : a))
      );
    } else {
      console.error('Failed to toggle favorite status:', result.error);
    }
  }, []);

  /**
   * 标记所有文章为已读
   */
  const markAllAsRead = useCallback(async () => {
    const unreadArticles = articles.filter((a) => !a.isRead);
    if (unreadArticles.length === 0) {
      console.log('All articles are already read');
      return;
    }

    const articleIds = unreadArticles.map((a) => a.id);
    const result = await articleService.markAllAsRead(articleIds);
    
    if (result.success) {
      setArticles((prev) => prev.map((a) => ({ ...a, isRead: true })));
      console.log('Marked all as read:', result.data);
    } else {
      console.error('Failed to mark all as read:', result.error);
    }
  }, [articles]);

  /**
   * 执行搜索过滤
   */
  const handleFilterArticles = useCallback(async () => {
    if (filterValue.trim()) {
      await searchArticles(filterValue);
    } else {
      await updateArticles(1);
    }
  }, [filterValue, searchArticles, updateArticles]);

  /**
   * 重置搜索
   */
  const resetFilter = useCallback(() => {
    setFilterValue('');
    updateArticles(1);
  }, [updateArticles]);

  return {
    loading,
    articles,
    currentPage,
    totalPages,
    filterValue,
    setFilterValue,
    updateArticles,
    searchArticles,
    handleRefresh,
    handleCleanup,
    toggleReadStatus,
    toggleFavoriteStatus,
    markAllAsRead,
    handleFilterArticles,
    resetFilter,
  };
}
```

**说明：**

#### 状态管理
- `loading` - 加载状态
- `articles` - 文章列表
- `currentPage` - 当前页码
- `totalPages` - 总页数
- `filterValue` - 搜索关键词

#### 核心方法
- `updateArticles(page)` - 更新文章列表（分页）
- `searchArticles(title, page)` - 搜索文章
- `handleRefresh()` - 刷新所有 Feed
- `handleCleanup()` - 清理所有 Feed

#### 状态操作方法
- `toggleReadStatus(article)` - 切换已读状态
- `toggleFavoriteStatus(article)` - 切换收藏状态
- `markAllAsRead()` - 标记全部已读

#### 搜索相关方法
- `handleFilterArticles()` - 执行搜索
- `resetFilter()` - 重置搜索

#### 与旧版本的区别
- ✅ 使用重构后的 `articleService` 和 `feedService`
- ✅ 删除未使用的 `filterStatus` 状态
- ✅ 新增 `searchArticles` 方法，使用专用搜索端点
- ✅ 新增 `resetFilter` 方法
- ✅ 优化状态更新逻辑
- ✅ 统一错误处理

---

### 2. `frontend/src/hooks/use-subscriptions.ts`

```typescript
import { useState, useCallback, useEffect } from 'react';
import {
  Subscription,
  SubscriptionFilter,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
} from '../types';
import { subscriptionService } from '../services';

export function useSubscriptions(initialLoad: boolean = true) {
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  /**
   * 获取订阅列表
   */
  const fetchSubscriptions = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await subscriptionService.getSubscriptions({ page, perPage: 10 });
      setSubscriptions(response.data);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 初始化加载
   */
  useEffect(() => {
    if (initialLoad) {
      fetchSubscriptions();
    }
  }, [initialLoad, fetchSubscriptions]);

  /**
   * 创建订阅
   */
  const createSubscription = useCallback(
    async (data: CreateSubscriptionRequest) => {
      const result = await subscriptionService.createSubscription(data);
      if (result.success) {
        await fetchSubscriptions(currentPage);
        return { success: true };
      }
      console.error('Failed to create subscription:', result.error);
      return { success: false, error: result.error };
    },
    [currentPage, fetchSubscriptions]
  );

  /**
   * 更新订阅
   */
  const updateSubscription = useCallback(
    async (id: string, data: UpdateSubscriptionRequest) => {
      const result = await subscriptionService.updateSubscription(id, data);
      if (result.success) {
        await fetchSubscriptions(currentPage);
        return { success: true };
      }
      console.error('Failed to update subscription:', result.error);
      return { success: false, error: result.error };
    },
    [currentPage, fetchSubscriptions]
  );

  /**
   * 删除订阅
   */
  const deleteSubscription = useCallback(
    async (id: string) => {
      const result = await subscriptionService.deleteSubscription(id);
      if (result.success) {
        await fetchSubscriptions(currentPage);
        return { success: true };
      }
      console.error('Failed to delete subscription:', result.error);
      return { success: false, error: result.error };
    },
    [currentPage, fetchSubscriptions]
  );

  return {
    loading,
    subscriptions,
    currentPage,
    totalPages,
    fetchSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  };
}
```

**说明：**

#### 状态管理
- `loading` - 加载状态
- `subscriptions` - 订阅列表
- `currentPage` - 当前页码
- `totalPages` - 总页数

#### 核心方法
- `fetchSubscriptions(page)` - 获取订阅列表
- `createSubscription(data)` - 创建订阅
- `updateSubscription(id, data)` - 更新订阅
- `deleteSubscription(id)` - 删除订阅

#### 参数
- `initialLoad` - 是否在 hook 初始化时自动加载，默认 true

#### 设计原则
- 与 `useArticles` 风格保持一致
- 返回统一的错误处理结果
- 操作成功后自动刷新列表

---

### 3. `frontend/src/hooks/index.ts`

```typescript
export { useArticles } from './use-articles';
export { useSubscriptions } from './use-subscriptions';
```

**说明：**
- 统一导出所有 hooks
- 使用方式：`import { useArticles, useSubscriptions } from '../hooks'`

---

## 🔗 使用示例

### 在页面组件中使用 useArticles

```typescript
import { useArticles } from '../hooks';

function FeedsPage() {
  const {
    loading,
    articles,
    currentPage,
    totalPages,
    filterValue,
    setFilterValue,
    handleRefresh,
    handleCleanup,
    toggleReadStatus,
    toggleFavoriteStatus,
    markAllAsRead,
    handleFilterArticles,
    updateArticles,
  } = useArticles();

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      {/* 搜索栏 */}
      <TextField
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleFilterArticles();
          }
        }}
      />
      
      {/* 操作按钮 */}
      <Button onClick={handleRefresh}>Refresh</Button>
      <Button onClick={handleCleanup}>Cleanup</Button>
      <Button onClick={markAllAsRead}>Mark All as Read</Button>

      {/* 文章列表 */}
      {articles.map((article) => (
        <ArticleItem
          key={article.id}
          article={article}
          onToggleRead={() => toggleReadStatus(article)}
          onToggleFavorite={() => toggleFavoriteStatus(article)}
        />
      ))}

      {/* 分页 */}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => updateArticles(page)}
      />
    </Container>
  );
}
```

### 在页面组件中使用 useSubscriptions

```typescript
import { useSubscriptions } from '../hooks';

function SubscriptionsPage() {
  const {
    loading,
    subscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  } = useSubscriptions();

  const handleCreate = async (data: CreateSubscriptionRequest) => {
    const result = await createSubscription(data);
    if (result.success) {
      console.log('Created successfully');
    } else {
      console.error('Failed:', result.error);
    }
  };

  const handleUpdate = async (id: string, data: UpdateSubscriptionRequest) => {
    const result = await updateSubscription(id, data);
    if (result.success) {
      console.log('Updated successfully');
    } else {
      console.error('Failed:', result.error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteSubscription(id);
    if (result.success) {
      console.log('Deleted successfully');
    } else {
      console.error('Failed:', result.error);
    }
  };

  return (
    <Container>
      {/* 订阅列表 */}
      {subscriptions.map((sub) => (
        <SubscriptionItem
          key={sub.id}
          subscription={sub}
          onUpdate={(data) => handleUpdate(sub.id, data)}
          onDelete={() => handleDelete(sub.id)}
        />
      ))}
    </Container>
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

### 2. ESLint 检查

```bash
cd frontend
npm run lint
```

**预期结果：** 无 ESLint 错误

### 3. Hook 功能测试

启动开发服务器：

```bash
cd frontend
npm run dev
```

在浏览器中测试：

**测试 useArticles:**
1. 打开首页 `/`
2. 验证文章列表加载
3. 测试搜索功能
4. 测试分页功能
5. 测试切换已读/收藏状态
6. 测试标记全部已读
7. 测试刷新/清理 Feed

**测试 useSubscriptions:**
1. 打开订阅页面 `/subscriptions`
2. 验证订阅列表加载
3. 测试创建订阅
4. 测试更新订阅
5. 测试删除订阅

**预期结果：** 所有功能正常工作

### 4. 错误处理测试

测试错误场景：
1. 网络断开时刷新文章
2. 创建订阅时输入无效 URL
3. 删除不存在的订阅

**预期结果：** 错误能正确显示在 console，不会导致页面崩溃

---

## ⚠️ 注意事项

### 1. 文件共存
- 本阶段创建的新 hook 文件与旧文件共存
- 旧文件路径：`frontend/src/hooks/use-articles.ts`（旧）
- 新文件暂时使用不同的文件名或在不同位置，Phase 5 会统一处理

**推荐方案：** 直接创建新文件，更新导入路径即可。

### 2. 初始加载
- `useSubscriptions` 默认自动加载
- 如果需要手动控制加载时机，设置 `initialLoad: false`：
  ```typescript
  const { fetchSubscriptions } = useSubscriptions(false);
  
  useEffect(() => {
    // 手动触发加载
    fetchSubscriptions();
  }, []);
  ```

### 3. 状态更新
- 使用 `useCallback` 包装所有方法，避免不必要的重渲染
- 状态更新使用函数式更新：`setArticles(prev => ...)`

### 4. 错误处理
- 所有错误都记录到 console
- 操作方法返回 `{ success: boolean, error?: ApiError }`
- 页面组件可以根据返回值显示错误提示

### 5. 分页参数
- 默认 `perPage: 10`
- 如需修改，可以在 hook 中添加参数：
  ```typescript
  export function useArticles(perPage: number = 10) {
    // ...
    const response = await articleService.getArticles({ page, perPage });
    // ...
  }
  ```

---

## 📌 Phase 4 完成标志

- [x] 创建 use-articles.ts（重构）
- [x] 创建 use-subscriptions.ts（新建）
- [x] 创建 hooks/index.ts（统一导出）
- [x] TypeScript 编译通过
- [x] ESLint 检查通过
- [x] 所有 Hook 功能测试通过

完成后，可以继续执行 Phase 5。

---

## 📚 后续扩展

### 1. 添加数据缓存
```typescript
const [lastFetchTime, setLastFetchTime] = useState(0);

const updateArticles = useCallback(async (page: number = 1, forceRefresh = false) => {
  const now = Date.now();
  const cacheDuration = 60000; // 1 分钟

  if (!forceRefresh && now - lastFetchTime < cacheDuration) {
    console.log('Using cached data');
    return;
  }

  // ... fetch data
  setLastFetchTime(now);
}, [lastFetchTime]);
```

### 2. 添加实时更新
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    updateArticles(currentPage);
  }, 300000); // 每 5 分钟更新一次

  return () => clearInterval(interval);
}, [currentPage, updateArticles]);
```

### 3. 添加本地状态持久化
```typescript
const [articles, setArticles] = useState<Article[]>(() => {
  const saved = localStorage.getItem('articles');
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem('articles', JSON.stringify(articles));
}, [articles]);
```

### 4. 添加乐观更新
```typescript
const toggleReadStatus = useCallback(async (article: Article) => {
  // 乐观更新
  setArticles((prev) =>
    prev.map((a) => (a.id === article.id ? { ...a, isRead: !a.isRead } : a))
  );

  // 发送请求
  const result = await articleService.toggleReadStatus(article);
  
  if (!result.success) {
    // 回滚
    setArticles((prev) =>
      prev.map((a) => (a.id === article.id ? article : a))
    );
    console.error('Failed:', result.error);
  }
}, []);
```
