# Phase 3: 服务层重构

## 🎯 阶段目标

重构 Article Service、Subscription Service，并创建独立的 Feed Service，使用 Phase 1 和 Phase 2 的类型和基础设施。

## 📦 文件清单

需要创建 4 个文件：

1. `frontend/src/services/article-service.ts` - 文章服务（重构）
2. `frontend/src/services/subscription-service.ts` - 订阅服务（重构）
3. `frontend/src/services/feed-service.ts` - Feed 服务（新建）
4. `frontend/src/services/index.ts` - 统一导出

**依赖：**
- Phase 1 已完成（类型定义）
- Phase 2 已完成（API 客户端和错误处理）

**注意：** 本阶段会创建新的 service 文件，暂时与旧的 service 文件共存。Phase 5 会删除旧文件。

---

## 📝 完整代码实现

### 1. `frontend/src/services/article-service.ts`

```typescript
import { apiClient } from './api-client';
import { handleApiError } from './error-handler';
import {
  Article,
  ArticleFilter,
  PaginationResponse,
  UpdateArticleRequest,
  BatchUpdateArticleRequest,
  BatchUpdateResponse,
  ServiceResult,
} from '../types';

export const articleService = {
  /**
   * 获取文章列表（支持过滤和分页）
   * 对应后端: GET /articles
   */
  async getArticles(filter?: ArticleFilter): Promise<PaginationResponse<Article>> {
    const params = new URLSearchParams();
    
    if (filter?.page) params.append('page', String(filter.page));
    if (filter?.perPage) params.append('perPage', String(filter.perPage));
    if (filter?.id) params.append('id', filter.id);
    if (filter?.title) params.append('title', filter.title);
    if (filter?.content) params.append('content', filter.content);
    if (filter?.link) params.append('link', filter.link);
    if (filter?.author) params.append('author', filter.author);
    if (filter?.subscriptionId) params.append('subscriptionId', filter.subscriptionId);
    if (filter?.isRead !== undefined) params.append('isRead', String(filter.isRead));
    if (filter?.isFavorite !== undefined) params.append('isFavorite', String(filter.isFavorite));

    const response = await apiClient.get<PaginationResponse<Article>>(
      `/articles?${params.toString()}`
    );
    return response.data;
  },

  /**
   * 搜索文章（使用专用搜索端点）
   * 对应后端: GET /articles/search
   */
  async searchArticles(filter?: ArticleFilter): Promise<PaginationResponse<Article>> {
    const params = new URLSearchParams();
    
    if (filter?.page) params.append('page', String(filter.page));
    if (filter?.perPage) params.append('perPage', String(filter.perPage));
    if (filter?.title) params.append('title', filter.title);
    if (filter?.content) params.append('content', filter.content);
    if (filter?.author) params.append('author', filter.author);

    const response = await apiClient.get<PaginationResponse<Article>>(
      `/articles/search?${params.toString()}`
    );
    return response.data;
  },

  /**
   * 根据ID获取单个文章
   * 对应后端: GET /articles/:id
   */
  async getArticleById(id: string): Promise<Article> {
    const response = await apiClient.get<Article>(`/articles/${id}`);
    return response.data;
  },

  /**
   * 更新文章
   * 对应后端: PATCH /articles/:id
   */
  async updateArticle(id: string, data: UpdateArticleRequest): Promise<Article> {
    const response = await apiClient.patch<Article>(`/articles/${id}`, data);
    return response.data;
  },

  /**
   * 批量更新文章
   * 对应后端: PATCH /articles/batch-update
   */
  async batchUpdateArticles(data: BatchUpdateArticleRequest): Promise<BatchUpdateResponse> {
    const response = await apiClient.patch<BatchUpdateResponse>(
      '/articles/batch-update',
      data
    );
    return response.data;
  },

  /**
   * 切换文章已读状态
   */
  async toggleReadStatus(article: Article): Promise<ServiceResult<Article>> {
    try {
      const updated = await this.updateArticle(article.id, {
        isRead: !article.isRead,
      });
      return { success: true, data: updated };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * 切换文章收藏状态
   */
  async toggleFavoriteStatus(article: Article): Promise<ServiceResult<Article>> {
    try {
      const updated = await this.updateArticle(article.id, {
        isFavorite: !article.isFavorite,
      });
      return { success: true, data: updated };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * 标记所有文章为已读
   */
  async markAllAsRead(articleIds: string[]): Promise<ServiceResult<BatchUpdateResponse>> {
    try {
      const result = await this.batchUpdateArticles({
        ids: articleIds,
        isRead: true,
      });
      return { success: true, data: result };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
```

**说明：**

#### 方法设计原则
1. **基础方法** - 直接调用 API，返回原始数据类型
2. **业务方法** - 包含错误处理，返回 `ServiceResult`

#### 基础方法（无错误处理）
- `getArticles` - 获取文章列表
- `searchArticles` - 搜索文章
- `getArticleById` - 获取单个文章
- `updateArticle` - 更新文章
- `batchUpdateArticles` - 批量更新

#### 业务方法（带错误处理）
- `toggleReadStatus` - 切换已读状态
- `toggleFavoriteStatus` - 切换收藏状态
- `markAllAsRead` - 标记全部已读

#### 参数构建
- 使用 `URLSearchParams` 构建查询字符串
- 只添加有值的参数，避免发送 `undefined`

---

### 2. `frontend/src/services/subscription-service.ts`

```typescript
import { apiClient } from './api-client';
import { handleApiError } from './error-handler';
import {
  Subscription,
  SubscriptionFilter,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  PaginationResponse,
  ServiceResult,
} from '../types';

interface DeleteSubscriptionResponse {
  id: string;
  message: string;
}

export const subscriptionService = {
  /**
   * 获取订阅列表（支持过滤和分页）
   * 对应后端: GET /subscriptions
   */
  async getSubscriptions(filter?: SubscriptionFilter): Promise<PaginationResponse<Subscription>> {
    const params = new URLSearchParams();
    
    if (filter?.page) params.append('page', String(filter.page));
    if (filter?.perPage) params.append('perPage', String(filter.perPage));
    if (filter?.id) params.append('id', filter.id);
    if (filter?.url) params.append('url', filter.url);
    if (filter?.name) params.append('name', filter.name);
    if (filter?.category) params.append('category', filter.category);

    const response = await apiClient.get<PaginationResponse<Subscription>>(
      `/subscriptions?${params.toString()}`
    );
    return response.data;
  },

  /**
   * 创建订阅
   * 对应后端: POST /subscriptions
   */
  async createSubscription(data: CreateSubscriptionRequest): Promise<ServiceResult<Subscription>> {
    try {
      const response = await apiClient.post<Subscription>('/subscriptions', data);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * 更新订阅
   * 对应后端: PATCH /subscriptions/:id
   */
  async updateSubscription(
    id: string,
    data: UpdateSubscriptionRequest
  ): Promise<ServiceResult<Subscription>> {
    try {
      const response = await apiClient.patch<Subscription>(`/subscriptions/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * 删除订阅
   * 对应后端: DELETE /subscriptions/:id
   */
  async deleteSubscription(id: string): Promise<ServiceResult<DeleteSubscriptionResponse>> {
    try {
      const response = await apiClient.delete<DeleteSubscriptionResponse>(
        `/subscriptions/${id}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
```

**说明：**

#### 方法设计
- `getSubscriptions` - 基础方法，返回分页数据
- `createSubscription` - 业务方法，包含错误处理
- `updateSubscription` - 业务方法，包含错误处理
- `deleteSubscription` - 业务方法，包含错误处理

#### 与旧版本的区别
- ✅ 使用统一的 `apiClient`
- ✅ 使用统一的 `handleApiError`
- ✅ 返回类型统一为 `ServiceResult`
- ✅ 支持分页参数
- ✅ 新增更新订阅功能

---

### 3. `frontend/src/services/feed-service.ts`

```typescript
import { apiClient } from './api-client';
import { handleApiError } from './error-handler';
import { FeedResponse, ServiceResult } from '../types';

export const feedService = {
  /**
   * 更新指定订阅的文章
   * 对应后端: PATCH /feeds/update/:id
   */
  async updateFeed(subscriptionId: string): Promise<ServiceResult<FeedResponse>> {
    try {
      const response = await apiClient.patch<FeedResponse>(
        `/feeds/update/${subscriptionId}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * 清理指定订阅的文章
   * 对应后端: PATCH /feeds/cleanup/:id
   */
  async cleanupFeed(subscriptionId: string): Promise<ServiceResult<FeedResponse>> {
    try {
      const response = await apiClient.patch<FeedResponse>(
        `/feeds/cleanup/${subscriptionId}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * 更新所有订阅的文章
   * 对应后端: PATCH /feeds/update-all
   */
  async updateAllFeeds(): Promise<ServiceResult<FeedResponse>> {
    try {
      const response = await apiClient.patch<FeedResponse>('/feeds/update-all');
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * 清理所有订阅的文章
   * 对应后端: PATCH /feeds/cleanup-all
   */
  async cleanupAllFeeds(): Promise<ServiceResult<FeedResponse>> {
    try {
      const response = await apiClient.patch<FeedResponse>('/feeds/cleanup-all');
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
```

**说明：**

#### 职责划分
- Feed Service 专注于 Feed 的更新和清理操作
- Article Service 专注于文章的查询和状态修改
- 职责清晰，易于维护

#### 与旧版本的区别
- ✅ 从 Article Service 中独立出来
- ✅ 使用统一的 `apiClient`
- ✅ 使用统一的 `handleApiError`
- ✅ 返回类型统一为 `ServiceResult`

---

### 4. `frontend/src/services/index.ts`

```typescript
export { articleService } from './article-service';
export { subscriptionService } from './subscription-service';
export { feedService } from './feed-service';
export { apiClient } from './api-client';
export { handleApiError, isApiError, getErrorMessage } from './error-handler';
```

**说明：**
- 统一导出所有 service 和工具函数
- 使用方式：`import { articleService, feedService } from '../services'`

---

## 🔗 API 映射表

| 前端方法 | HTTP 方法 | 后端端点 | 返回类型 |
|---------|----------|---------|---------|
| `articleService.getArticles(filter)` | GET | `/articles` | `PaginationResponse<Article>` |
| `articleService.searchArticles(filter)` | GET | `/articles/search` | `PaginationResponse<Article>` |
| `articleService.getArticleById(id)` | GET | `/articles/:id` | `Article` |
| `articleService.updateArticle(id, data)` | PATCH | `/articles/:id` | `Article` |
| `articleService.batchUpdateArticles(data)` | PATCH | `/articles/batch-update` | `BatchUpdateResponse` |
| `subscriptionService.getSubscriptions(filter)` | GET | `/subscriptions` | `PaginationResponse<Subscription>` |
| `subscriptionService.createSubscription(data)` | POST | `/subscriptions` | `ServiceResult<Subscription>` |
| `subscriptionService.updateSubscription(id, data)` | PATCH | `/subscriptions/:id` | `ServiceResult<Subscription>` |
| `subscriptionService.deleteSubscription(id)` | DELETE | `/subscriptions/:id` | `ServiceResult<DeleteSubscriptionResponse>` |
| `feedService.updateFeed(subscriptionId)` | PATCH | `/feeds/update/:id` | `ServiceResult<FeedResponse>` |
| `feedService.cleanupFeed(subscriptionId)` | PATCH | `/feeds/cleanup/:id` | `ServiceResult<FeedResponse>` |
| `feedService.updateAllFeeds()` | PATCH | `/feeds/update-all` | `ServiceResult<FeedResponse>` |
| `feedService.cleanupAllFeeds()` | PATCH | `/feeds/cleanup-all` | `ServiceResult<FeedResponse>` |

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

### 3. Service 方法调用测试

创建临时测试文件 `services/test.ts`：

```typescript
import { articleService, subscriptionService, feedService } from './index';

// 测试 Article Service
articleService.getArticles({ page: 1, perPage: 10 }).then(console.log);
articleService.searchArticles({ title: 'test' }).then(console.log);

// 测试 Subscription Service
subscriptionService.getSubscriptions({ page: 1 }).then(console.log);

// 测试 Feed Service
feedService.updateAllFeeds().then(console.log);
```

**预期结果：** 所有方法都能正确调用，返回正确的数据类型

### 4. 浏览器 Console 测试

启动开发服务器：

```bash
cd frontend
npm run dev
```

在浏览器控制台中测试：

```javascript
// 导入 services
import { articleService } from '/src/services/article-service.ts';

// 测试获取文章
const articles = await articleService.getArticles({ page: 1, perPage: 5 });
console.log('Articles:', articles);

// 测试搜索文章
const searchResults = await articleService.searchArticles({ title: 'React' });
console.log('Search Results:', searchResults);

// 测试更新文章状态
const result = await articleService.toggleReadStatus(articles.data[0]);
console.log('Toggle Result:', result);
```

**预期结果：**
- 所有 API 调用成功
- 返回数据类型正确
- 错误处理正常工作

---

## ⚠️ 注意事项

### 1. 文件共存
- 本阶段创建的新 service 文件与旧文件共存
- 旧文件路径：
  - `frontend/src/services/article-service.ts`（旧）
  - `frontend/src/services/subscription-service.ts`（旧）
- 新文件暂时使用不同的文件名或在不同位置，Phase 5 会统一处理

**重要：** 为避免冲突，本阶段创建的文件应该：
- 方案 A：创建在 `frontend/src/services/v2/` 目录下
- 方案 B：创建时使用临时文件名，如 `article-service-new.ts`

**推荐方案 B：** 直接创建新文件，因为 TypeScript 会优先使用新文件（如果导入路径一致）。

### 2. 参数处理
- 使用 `URLSearchParams` 构建查询字符串
- 过滤掉 `undefined` 参数，避免发送无效参数
- 布尔值需要转换为字符串：`String(filter.isRead)`

### 3. 错误处理
- 基础方法（如 `getArticles`）不包含错误处理，由调用方处理
- 业务方法（如 `toggleReadStatus`）包含错误处理，返回 `ServiceResult`

### 4. 返回类型
- 基础方法：返回原始数据类型（如 `Article`）
- 业务方法：返回 `ServiceResult<T>`

### 5. 批量操作
- `markAllAsRead` 接收 `articleIds` 数组
- 注意过滤已读文章，避免不必要的 API 调用

---

## 📌 Phase 3 完成标志

- [x] 创建 article-service.ts（重构）
- [x] 创建 subscription-service.ts（重构）
- [x] 创建 feed-service.ts（新建）
- [x] 创建 services/index.ts（统一导出）
- [x] TypeScript 编译通过
- [x] ESLint 检查通过
- [x] 所有 Service 方法可正常调用

完成后，可以继续执行 Phase 4。

---

## 📚 后续扩展

### 1. 添加缓存机制
```typescript
const cache = new Map<string, { data: any; timestamp: number }>();

async getArticles(filter?: ArticleFilter): Promise<PaginationResponse<Article>> {
  const cacheKey = JSON.stringify(filter);
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < 60000) {
    return cached.data;
  }
  
  const response = await apiClient.get(...);
  cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
  return response.data;
}
```

### 2. 添加请求取消
```typescript
const abortControllers = new Map<string, AbortController>();

async getArticles(filter?: ArticleFilter): Promise<PaginationResponse<Article>> {
  const requestId = 'getArticles';
  
  // 取消之前的请求
  abortControllers.get(requestId)?.abort();
  
  const controller = new AbortController();
  abortControllers.set(requestId, controller);
  
  const response = await apiClient.get('/articles', {
    signal: controller.signal,
    params: filter,
  });
  
  abortControllers.delete(requestId);
  return response.data;
}
```
