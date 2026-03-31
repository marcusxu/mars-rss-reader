# 迁移指南

本文档提供从旧代码迁移到新代码的详细步骤和代码对比示例。

## 📋 目录

- [迁移概览](#迁移概览)
- [Service 层迁移](#service-层迁移)
- [Hook 层迁移](#hook-层迁移)
- [类型定义迁移](#类型定义迁移)
- [常见问题](#常见问题)

---

## 迁移概览

### 迁移原则

1. **一次性迁移** - 不保留旧代码，直接替换
2. **向后不兼容** - API 和返回格式有变化
3. **渐进式迁移** - 按 Phase 1-5 顺序执行

### 迁移影响范围

| 文件类型 | 旧文件 | 新文件 | 变更程度 |
|---------|--------|--------|---------|
| 类型定义 | `types/article-type.ts` | `types/*.ts` | ⭐⭐⭐ 完全重构 |
| Service | `services/article-service.ts` | `services/article-service.ts` | ⭐⭐⭐ 完全重构 |
| Service | `services/subscription-service.ts` | `services/subscription-service.ts` | ⭐⭐⭐ 完全重构 |
| Service | - | `services/feed-service.ts` | ⭐ 新增 |
| Hook | `hooks/use-articles.ts` | `hooks/use-articles.ts` | ⭐⭐ 部分重构 |
| Hook | - | `hooks/use-subscriptions.ts` | ⭐ 新增 |

---

## Service 层迁移

### 1. Article Service

#### 导入变更

**旧代码：**
```typescript
import { Article } from '../types/article-type';

const {
  getArticles,
  refreshAllFeeds,
  cleanupAllFeeds,
  changeReadStatus,
  changeFavoriteStatus,
  markAllAsRead,
} = require('../services/article-service');
```

**新代码：**
```typescript
import { Article, ArticleFilter } from '../types';
import { articleService } from '../services';
```

---

#### 获取文章列表

**旧代码：**
```typescript
const response = await getArticles(page, perPage, 'title=' + filterValue);
setArticles(response.data);
setCurrentPage(response.page);
setTotalPages(Math.ceil(response.total / response.perPage));
```

**新代码：**
```typescript
const filter: ArticleFilter = {
  page,
  perPage: 10,
  title: filterValue,
};

const response = await articleService.getArticles(filter);
setArticles(response.data);
setCurrentPage(response.page);
setTotalPages(response.totalPages); // 注意：totalPages 已计算好
```

**变更点：**
- ✅ 使用对象参数代替多个参数
- ✅ `totalPages` 已在响应中计算好，无需手动计算
- ✅ 过滤参数作为对象属性传递

---

#### 搜索文章（新增功能）

**旧代码：**
```typescript
// 使用 getArticles + 过滤参数实现搜索
const response = await getArticles(page, perPage, 'title=' + searchValue);
```

**新代码：**
```typescript
// 使用专用搜索端点
const response = await articleService.searchArticles({ 
  title: searchValue, 
  page, 
  perPage: 10 
});
```

**变更点：**
- ✅ 新增专用搜索方法
- ✅ 使用 `/articles/search` 端点

---

#### 切换已读状态

**旧代码：**
```typescript
await changeReadStatus(article);
setArticles(
  articles.map((a) => {
    if (a.id === article.id) {
      a.isRead = !a.isRead;
    }
    return a;
  }),
);
```

**新代码：**
```typescript
const result = await articleService.toggleReadStatus(article);

if (result.success && result.data) {
  setArticles((prev) =>
    prev.map((a) => (a.id === article.id ? result.data! : a))
  );
} else {
  console.error('Failed to toggle read status:', result.error);
}
```

**变更点：**
- ✅ 返回 `ServiceResult`，包含成功/失败状态
- ✅ 返回更新后的文章数据，直接使用
- ✅ 错误处理更友好

---

#### 切换收藏状态

**旧代码：**
```typescript
await changeFavoriteStatus(article);
setArticles(
  articles.map((a) => {
    if (a.id === article.id) {
      a.isFavorite = !a.isFavorite;
    }
    return a;
  }),
);
```

**新代码：**
```typescript
const result = await articleService.toggleFavoriteStatus(article);

if (result.success && result.data) {
  setArticles((prev) =>
    prev.map((a) => (a.id === article.id ? result.data! : a))
  );
} else {
  console.error('Failed to toggle favorite status:', result.error);
}
```

**变更点：**
- ✅ 与 `toggleReadStatus` 保持一致
- ✅ 返回更新后的数据

---

#### 标记全部已读

**旧代码：**
```typescript
await markAllAsRead(articles);
setArticles(
  articles.map((a) => {
    a.isRead = true;
    return a;
  }),
);
```

**新代码：**
```typescript
const articleIds = articles.filter((a) => !a.isRead).map((a) => a.id);
const result = await articleService.markAllAsRead(articleIds);

if (result.success) {
  setArticles((prev) => prev.map((a) => ({ ...a, isRead: true })));
} else {
  console.error('Failed to mark all as read:', result.error);
}
```

**变更点：**
- ✅ 只传递文章 ID 数组
- ✅ 过滤已读文章，减少不必要的 API 调用
- ✅ 返回 `ServiceResult`

---

#### Feed 操作（迁移到 Feed Service）

**旧代码：**
```typescript
import { refreshAllFeeds, cleanupAllFeeds } from '../services/article-service';

await refreshAllFeeds();
await cleanupAllFeeds();
```

**新代码：**
```typescript
import { feedService } from '../services';

const result = await feedService.updateAllFeeds();
const result = await feedService.cleanupAllFeeds();
```

**变更点：**
- ✅ Feed 操作独立到 `feedService`
- ✅ 返回 `ServiceResult<FeedResponse>`

---

### 2. Subscription Service

#### 导入变更

**旧代码：**
```typescript
import {
  getSubscriptions,
  addSubscription,
  deleteSubscription,
} from '../services/subscription-service';
```

**新代码：**
```typescript
import { subscriptionService } from '../services';
import { CreateSubscriptionRequest } from '../types';
```

---

#### 获取订阅列表

**旧代码：**
```typescript
const response = await getSubscriptions();
setSubscriptions(response);
```

**新代码：**
```typescript
const response = await subscriptionService.getSubscriptions({ page: 1, perPage: 10 });
setSubscriptions(response.data);
// 注意：现在返回分页数据
```

**变更点：**
- ✅ 返回 `PaginationResponse<Subscription>`
- ✅ 支持分页参数

---

#### 创建订阅

**旧代码：**
```typescript
const response = await addSubscription(
  newSubUrl,
  newSubName,
  newSubDescription,
  newSubCategory,
);

if (response.status == 201) {
  // 成功
  fetchSubscriptions();
} else {
  // 失败
  setInputErrorState(true);
}
```

**新代码：**
```typescript
const data: CreateSubscriptionRequest = {
  url: newSubUrl,
  name: newSubName,
  description: newSubDescription || undefined,
  category: newSubCategory || undefined,
};

const result = await subscriptionService.createSubscription(data);

if (result.success) {
  // 成功
  fetchSubscriptions();
} else {
  // 失败
  setInputErrorState(true);
  console.error('Failed:', result.error?.message);
}
```

**变更点：**
- ✅ 使用对象参数
- ✅ 返回 `ServiceResult`
- ✅ 错误信息更详细

---

#### 删除订阅

**旧代码：**
```typescript
await deleteSubscription(id);
fetchSubscriptions();
```

**新代码：**
```typescript
const result = await subscriptionService.deleteSubscription(id);

if (result.success) {
  console.log(result.data.message);
  fetchSubscriptions();
} else {
  console.error('Failed:', result.error?.message);
}
```

**变更点：**
- ✅ 返回 `ServiceResult`
- ✅ 返回删除确认消息

---

#### 更新订阅（新增功能）

**旧代码：**
```typescript
// 未实现
const handleModifySub = async (subscriptionId: string) => {
  console.log('Modify subscription with id:', subscriptionId);
};
```

**新代码：**
```typescript
const result = await subscriptionService.updateSubscription(id, {
  name: 'New Name',
  description: 'New Description',
  category: 'New Category',
});

if (result.success) {
  console.log('Updated:', result.data);
}
```

**变更点：**
- ✅ 新增更新订阅功能

---

## Hook 层迁移

### 1. useArticles

#### 导入变更

**旧代码：**
```typescript
import { useArticles } from '../hooks/use-articles';
```

**新代码：**
```typescript
import { useArticles } from '../hooks';
```

---

#### 使用方式变更

**旧代码：**
```typescript
const {
  loading,
  articles,
  currentPage,
  totalPages,
  filterValue,
  updateArticles,
  handleRefresh,
  handleCleanup,
  handleChangeReadStatus,
  handleChangeFavoriteStatus,
  handleMarkAllAsRead,
  handleFilterArticles,
  setFilterValue,
} = useArticles();
```

**新代码：**
```typescript
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
  toggleReadStatus,        // 名称变更
  toggleFavoriteStatus,    // 名称变更
  markAllAsRead,           // 名称变更
  handleFilterArticles,
  resetFilter,             // 新增
} = useArticles();
```

**变更点：**
- ❌ 删除未使用的 `filterStatus`
- ✅ 方法名称更清晰（toggleXxx, markAllAsRead）
- ✅ 新增 `resetFilter` 方法

---

#### 标记全部已读变更

**旧代码：**
```typescript
<Button onClick={async () => handleMarkAllAsRead(articles)}>
  Read All
</Button>
```

**新代码：**
```typescript
<Button onClick={markAllAsRead}>
  Read All
</Button>
```

**变更点：**
- ✅ 无需传递参数，hook 内部处理

---

#### 分页变更

**旧代码：**
```typescript
<Pagination
  count={totalPages}
  page={currentPage}
  onChange={updateArticles}
/>
```

**新代码：**
```typescript
<Pagination
  count={totalPages}
  page={currentPage}
  onChange={(_, page) => updateArticles(page)}
/>
```

**变更点：**
- ✅ `updateArticles` 现在只接受 `page` 参数

---

### 2. useSubscriptions（新增）

**旧代码：**
```typescript
// 在组件内部手动管理状态
const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

const fetchSubscriptions = async () => {
  const response = await getSubscriptions();
  setSubscriptions(response);
};

useEffect(() => {
  fetchSubscriptions();
}, []);
```

**新代码：**
```typescript
// 使用 hook 统一管理
const {
  loading,
  subscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} = useSubscriptions();
```

**变更点：**
- ✅ 状态管理统一到 hook
- ✅ 自动初始化加载
- ✅ 统一的错误处理

---

## 类型定义迁移

### 导入变更

**旧代码：**
```typescript
import { Article } from '../types/article-type';
```

**新代码：**
```typescript
import { Article, Subscription, FeedResponse } from '../types';
```

**变更点：**
- ✅ 统一从 `types/index.ts` 导入
- ✅ 类型定义更完整

---

### 新增类型使用示例

**旧代码：**
```typescript
// 没有明确的类型定义
const addSubscription = async (
  url: string,
  name: string,
  description: string,
  category: string,
) => {
  // ...
};
```

**新代码：**
```typescript
import { CreateSubscriptionRequest } from '../types';

const handleAddSub = async () => {
  const data: CreateSubscriptionRequest = {
    url: newSubUrl,
    name: newSubName,
    description: newSubDescription || undefined,
    category: newSubCategory || undefined,
  };
  
  const result = await createSubscription(data);
};
```

**变更点：**
- ✅ 使用明确的类型定义
- ✅ 类型安全

---

## 常见问题

### 1. 为什么返回值从直接数据变成 ServiceResult？

**原因：**
- 统一错误处理
- 明确成功/失败状态
- 避免使用 try-catch

**解决方案：**
```typescript
const result = await service.method();

if (result.success) {
  // 成功处理
  console.log(result.data);
} else {
  // 错误处理
  console.error(result.error?.message);
}
```

---

### 2. 为什么 totalPages 不需要手动计算了？

**原因：**
- 后端已返回 `totalPages`
- 避免前端重复计算
- 减少潜在错误

**旧代码：**
```typescript
setTotalPages(Math.ceil(response.total / response.perPage));
```

**新代码：**
```typescript
setTotalPages(response.totalPages); // 直接使用
```

---

### 3. 为什么 markAllAsRead 不需要传递 articles 参数了？

**原因：**
- Hook 内部已持有 articles 状态
- 自动过滤已读文章
- 减少不必要的参数传递

**旧代码：**
```typescript
await markAllAsRead(articles);
```

**新代码：**
```typescript
// Hook 内部自动过滤已读文章
await markAllAsRead();
```

---

### 4. 如何处理可选参数？

**问题：**
```typescript
// 如果 description 为空字符串，会发送空字符串
description: newSubDescription
```

**解决方案：**
```typescript
// 使用 || undefined 转换空字符串为 undefined
description: newSubDescription || undefined
```

---

### 5. 为什么 Feed 操作迁移到了 FeedService？

**原因：**
- Feed 操作与 Article 操作职责不同
- Feed 操作针对订阅源，Article 操作针对文章实例
- 更清晰的代码组织

**影响：**
```typescript
// 旧
import { refreshAllFeeds } from '../services/article-service';

// 新
import { feedService } from '../services';
await feedService.updateAllFeeds();
```

---

### 6. 如何在组件中显示错误信息？

**问题：**
```typescript
// 只在 console 中显示错误
console.error('Failed:', result.error?.message);
```

**解决方案：**

添加 SnackBar 或 Alert 组件：

```typescript
import { Snackbar, Alert } from '@mui/material';

const [error, setError] = useState<string | null>(null);

const handleCreate = async (data: CreateSubscriptionRequest) => {
  const result = await createSubscription(data);
  
  if (!result.success) {
    setError(result.error?.message || 'Unknown error');
  }
};

return (
  <>
    {/* 组件内容 */}
    
    <Snackbar
      open={!!error}
      autoHideDuration={6000}
      onClose={() => setError(null)}
    >
      <Alert severity="error" onClose={() => setError(null)}>
        {error}
      </Alert>
    </Snackbar>
  </>
);
```

---

### 7. 如何处理分页？

**问题：**
```typescript
// 后端返回的分页数据结构
{
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: T[];
}
```

**解决方案：**
```typescript
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(0);

const updateArticles = async (page: number = 1) => {
  const response = await articleService.getArticles({ page, perPage: 10 });
  setCurrentPage(response.page);
  setTotalPages(response.totalPages);
};

// Pagination 组件
<Pagination
  count={totalPages}
  page={currentPage}
  onChange={(_, page) => updateArticles(page)}
/>
```

---

## 📊 迁移检查清单

### Service 层
- [ ] 更新导入路径
- [ ] 使用对象参数代替多个参数
- [ ] 处理 `ServiceResult` 返回值
- [ ] 使用 `feedService` 代替 `articleService` 的 Feed 操作
- [ ] 处理 `PaginationResponse` 返回值

### Hook 层
- [ ] 更新导入路径
- [ ] 使用新的方法名称（toggleReadStatus, markAllAsRead 等）
- [ ] 使用 `useSubscriptions` hook
- [ ] 处理错误情况

### 类型定义
- [ ] 更新导入路径（从 `types` 导入）
- [ ] 使用新增的类型（CreateSubscriptionRequest 等）
- [ ] 删除旧的类型文件

---

## 🔗 相关文档

- [API 映射表](./api-mapping.md) - 前后端 API 对应关系
- [最佳实践](./best-practices.md) - 代码规范和建议
