# API 映射表

本文档列出了前端 Service 方法与后端 API 端点的完整映射关系。

## 📋 目录

- [Articles API](#articles-api)
- [Subscriptions API](#subscriptions-api)
- [Feeds API](#feeds-api)
- [请求参数构建示例](#请求参数构建示例)
- [响应数据处理示例](#响应数据处理示例)

---

## Articles API

### 获取文章列表

| 项目 | 内容 |
|------|------|
| **前端方法** | `articleService.getArticles(filter?: ArticleFilter)` |
| **HTTP 方法** | `GET` |
| **后端端点** | `/articles` |
| **Controller** | `ArticlesController.getAllArticles()` |
| **请求参数** | `ArticleFilter` (query params) |
| **返回类型** | `PaginationResponse<Article>` |
| **后端 DTO** | `FindArticleDto` → `PaginationResponseDto<Article>` |

**参数说明：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| perPage | number | 否 | 每页数量，默认 10 |
| id | string | 否 | 文章 ID (UUID) |
| title | string | 否 | 文章标题（模糊匹配） |
| content | string | 否 | 文章内容（模糊匹配） |
| link | string | 否 | 文章链接 |
| author | string | 否 | 作者 |
| pubDate | string | 否 | 发布日期 |
| subscriptionId | string | 否 | 订阅 ID (UUID) |
| isRead | boolean | 否 | 已读状态 |
| isFavorite | boolean | 否 | 收藏状态 |

**使用示例：**

```typescript
// 获取第 1 页，每页 10 条
const result = await articleService.getArticles({ page: 1, perPage: 10 });

// 获取未读文章
const unread = await articleService.getArticles({ isRead: false });

// 获取指定订阅的文章
const subArticles = await articleService.getArticles({ subscriptionId: 'uuid' });

// 获取收藏的文章
const favorites = await articleService.getArticles({ isFavorite: true });
```

---

### 搜索文章

| 项目 | 内容 |
|------|------|
| **前端方法** | `articleService.searchArticles(filter?: ArticleFilter)` |
| **HTTP 方法** | `GET` |
| **后端端点** | `/articles/search` |
| **Controller** | `ArticlesController.searchArticles()` |
| **请求参数** | `ArticleFilter` (query params) |
| **返回类型** | `PaginationResponse<Article>` |
| **后端 DTO** | `FindArticleDto` → `PaginationResponseDto<Article>` |

**参数说明：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| perPage | number | 否 | 每页数量，默认 10 |
| title | string | 否 | 搜索标题 |
| content | string | 否 | 搜索内容 |
| author | string | 否 | 搜索作者 |

**使用示例：**

```typescript
// 搜索标题包含 "React" 的文章
const results = await articleService.searchArticles({ title: 'React' });

// 搜索内容包含 "TypeScript" 的文章
const results = await articleService.searchArticles({ content: 'TypeScript' });
```

---

### 根据 ID 获取文章

| 项目 | 内容 |
|------|------|
| **前端方法** | `articleService.getArticleById(id: string)` |
| **HTTP 方法** | `GET` |
| **后端端点** | `/articles/:id` |
| **Controller** | `ArticlesController.getArticleById()` |
| **请求参数** | `id` (path param) |
| **返回类型** | `Article` |
| **后端 DTO** | - → `Article` |

**使用示例：**

```typescript
const article = await articleService.getArticleById('article-uuid');
console.log(article.title);
```

---

### 更新文章

| 项目 | 内容 |
|------|------|
| **前端方法** | `articleService.updateArticle(id: string, data: UpdateArticleRequest)` |
| **HTTP 方法** | `PATCH` |
| **后端端点** | `/articles/:id` |
| **Controller** | `ArticlesController.updateArticle()` |
| **请求参数** | `id` (path param), `UpdateArticleRequest` (body) |
| **返回类型** | `Article` |
| **后端 DTO** | `UpdateArticleDto` → `Article` |

**参数说明：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| isRead | boolean | 否 | 已读状态 |
| isFavorite | boolean | 否 | 收藏状态 |

**使用示例：**

```typescript
// 标记为已读
await articleService.updateArticle('article-uuid', { isRead: true });

// 标记为收藏
await articleService.updateArticle('article-uuid', { isFavorite: true });

// 同时更新多个状态
await articleService.updateArticle('article-uuid', { 
  isRead: true, 
  isFavorite: true 
});
```

---

### 批量更新文章

| 项目 | 内容 |
|------|------|
| **前端方法** | `articleService.batchUpdateArticles(data: BatchUpdateArticleRequest)` |
| **HTTP 方法** | `PATCH` |
| **后端端点** | `/articles/batch-update` |
| **Controller** | `ArticlesController.batchUpdateArticles()` |
| **请求参数** | `BatchUpdateArticleRequest` (body) |
| **返回类型** | `BatchUpdateResponse` |
| **后端 DTO** | `UpdateArticleDto` → `BatchUpdateResponseDto` |

**参数说明：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ids | string[] | 是 | 文章 ID 数组 |
| isRead | boolean | 否 | 已读状态 |
| isFavorite | boolean | 否 | 收藏状态 |

**使用示例：**

```typescript
// 批量标记为已读
const result = await articleService.batchUpdateArticles({
  ids: ['id1', 'id2', 'id3'],
  isRead: true,
});

console.log(`Updated ${result.updatedCount} articles`);
if (result.failedIds.length > 0) {
  console.log(`Failed IDs: ${result.failedIds.join(', ')}`);
}
```

---

## Subscriptions API

### 获取订阅列表

| 项目 | 内容 |
|------|------|
| **前端方法** | `subscriptionService.getSubscriptions(filter?: SubscriptionFilter)` |
| **HTTP 方法** | `GET` |
| **后端端点** | `/subscriptions` |
| **Controller** | `SubscriptionsController.getAllSubscriptions()` |
| **请求参数** | `SubscriptionFilter` (query params) |
| **返回类型** | `PaginationResponse<Subscription>` |
| **后端 DTO** | `FindSubscriptionDto` → `PaginationResponseDto<Subscription>` |

**参数说明：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| perPage | number | 否 | 每页数量，默认 10 |
| id | string | 否 | 订阅 ID (UUID) |
| url | string | 否 | 订阅 URL |
| name | string | 否 | 订阅名称 |
| category | string | 否 | 分类 |

**使用示例：**

```typescript
// 获取第 1 页订阅
const result = await subscriptionService.getSubscriptions({ page: 1 });

// 获取指定分类的订阅
const techSubs = await subscriptionService.getSubscriptions({ category: 'Tech' });

// 根据名称查找订阅
const result = await subscriptionService.getSubscriptions({ name: 'Tech Blog' });
```

---

### 创建订阅

| 项目 | 内容 |
|------|------|
| **前端方法** | `subscriptionService.createSubscription(data: CreateSubscriptionRequest)` |
| **HTTP 方法** | `POST` |
| **后端端点** | `/subscriptions` |
| **Controller** | `SubscriptionsController.createSubscription()` |
| **请求参数** | `CreateSubscriptionRequest` (body) |
| **返回类型** | `ServiceResult<Subscription>` |
| **后端 DTO** | `CreateSubscriptionDto` → `Subscription` |

**参数说明：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| url | string | 是 | RSS Feed URL |
| name | string | 是 | 订阅名称 |
| description | string | 否 | 描述 |
| category | string | 否 | 分类 |

**使用示例：**

```typescript
const result = await subscriptionService.createSubscription({
  url: 'https://example.com/feed.xml',
  name: 'Example Blog',
  description: 'A great blog',
  category: 'Tech',
});

if (result.success) {
  console.log('Created:', result.data);
} else {
  console.error('Failed:', result.error?.message);
}
```

---

### 更新订阅

| 项目 | 内容 |
|------|------|
| **前端方法** | `subscriptionService.updateSubscription(id: string, data: UpdateSubscriptionRequest)` |
| **HTTP 方法** | `PATCH` |
| **后端端点** | `/subscriptions/:id` |
| **Controller** | `SubscriptionsController.updateSubscription()` |
| **请求参数** | `id` (path param), `UpdateSubscriptionRequest` (body) |
| **返回类型** | `ServiceResult<Subscription>` |
| **后端 DTO** | `UpdateSubscriptionDto` → `Subscription` |

**参数说明：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| url | string | 否 | RSS Feed URL |
| name | string | 否 | 订阅名称 |
| description | string | 否 | 描述 |
| category | string | 否 | 分类 |

**使用示例：**

```typescript
const result = await subscriptionService.updateSubscription('sub-uuid', {
  name: 'New Name',
  category: 'News',
});

if (result.success) {
  console.log('Updated:', result.data);
}
```

---

### 删除订阅

| 项目 | 内容 |
|------|------|
| **前端方法** | `subscriptionService.deleteSubscription(id: string)` |
| **HTTP 方法** | `DELETE` |
| **后端端点** | `/subscriptions/:id` |
| **Controller** | `SubscriptionsController.deleteSubscription()` |
| **请求参数** | `id` (path param) |
| **返回类型** | `ServiceResult<{ id: string, message: string }>` |
| **后端 DTO** | - → `DeleteSubscriptionResponseDto` |

**使用示例：**

```typescript
const result = await subscriptionService.deleteSubscription('sub-uuid');

if (result.success) {
  console.log(result.data.message); // "Subscription deleted successfully"
}
```

---

## Feeds API

### 更新指定订阅的文章

| 项目 | 内容 |
|------|------|
| **前端方法** | `feedService.updateFeed(subscriptionId: string)` |
| **HTTP 方法** | `PATCH` |
| **后端端点** | `/feeds/update/:id` |
| **Controller** | `FeedsController.updateFeedForSub()` |
| **请求参数** | `subscriptionId` (path param) |
| **返回类型** | `ServiceResult<FeedResponse>` |
| **后端 DTO** | - → `FeedResponseDto` |

**使用示例：**

```typescript
const result = await feedService.updateFeed('sub-uuid');

if (result.success) {
  console.log(`Updated ${result.data.articlesCount} articles`);
}
```

---

### 清理指定订阅的文章

| 项目 | 内容 |
|------|------|
| **前端方法** | `feedService.cleanupFeed(subscriptionId: string)` |
| **HTTP 方法** | `PATCH` |
| **后端端点** | `/feeds/cleanup/:id` |
| **Controller** | `FeedsController.cleanupFeedForSub()` |
| **请求参数** | `subscriptionId` (path param) |
| **返回类型** | `ServiceResult<FeedResponse>` |
| **后端 DTO** | - → `FeedResponseDto` |

**使用示例：**

```typescript
const result = await feedService.cleanupFeed('sub-uuid');

if (result.success) {
  console.log(`Cleaned ${result.data.articlesCount} articles`);
}
```

---

### 更新所有订阅的文章

| 项目 | 内容 |
|------|------|
| **前端方法** | `feedService.updateAllFeeds()` |
| **HTTP 方法** | `PATCH` |
| **后端端点** | `/feeds/update-all` |
| **Controller** | `FeedsController.updateFeedForAll()` |
| **请求参数** | 无 |
| **返回类型** | `ServiceResult<FeedResponse>` |
| **后端 DTO** | - → `FeedResponseDto` |

**使用示例：**

```typescript
const result = await feedService.updateAllFeeds();

if (result.success) {
  console.log(`Updated ${result.data.articlesCount} articles from all feeds`);
}
```

---

### 清理所有订阅的文章

| 项目 | 内容 |
|------|------|
| **前端方法** | `feedService.cleanupAllFeeds()` |
| **HTTP 方法** | `PATCH` |
| **后端端点** | `/feeds/cleanup-all` |
| **Controller** | `FeedsController.cleanupFeedForAll()` |
| **请求参数** | 无 |
| **返回类型** | `ServiceResult<FeedResponse>` |
| **后端 DTO** | - → `FeedResponseDto` |

**使用示例：**

```typescript
const result = await feedService.cleanupAllFeeds();

if (result.success) {
  console.log(`Cleaned ${result.data.articlesCount} articles from all feeds`);
}
```

---

## 请求参数构建示例

### 使用 URLSearchParams

```typescript
const params = new URLSearchParams();

// 添加基本参数
if (filter?.page) params.append('page', String(filter.page));
if (filter?.perPage) params.append('perPage', String(filter.perPage));

// 添加过滤条件
if (filter?.title) params.append('title', filter.title);
if (filter?.isRead !== undefined) params.append('isRead', String(filter.isRead));

// 构建完整 URL
const url = `/articles?${params.toString()}`;
// 结果: /articles?page=1&perPage=10&title=React&isRead=false
```

### 处理布尔值

```typescript
// ❌ 错误：直接传递布尔值
params.append('isRead', filter.isRead); // 结果: "isRead=true" (字符串)

// ✅ 正确：转换为字符串
params.append('isRead', String(filter.isRead)); // 结果: "isRead=true"

// ✅ 正确：后端会自动转换
// 后端使用 @Transform 装饰器处理字符串转布尔值
```

### 处理可选参数

```typescript
// ✅ 只添加有值的参数
if (filter?.title) {
  params.append('title', filter.title);
}

// ❌ 避免添加 undefined 或 null
params.append('title', filter.title); // 如果 title 为 undefined，会发送 "title=undefined"
```

---

## 响应数据处理示例

### 处理分页响应

```typescript
const response = await articleService.getArticles({ page: 1 });

console.log('当前页:', response.page);           // 1
console.log('每页数量:', response.perPage);      // 10
console.log('总数:', response.total);            // 100
console.log('总页数:', response.totalPages);     // 10
console.log('数据:', response.data);             // Article[]
```

### 处理 ServiceResult

```typescript
const result = await subscriptionService.createSubscription(data);

if (result.success) {
  // 成功处理
  const subscription = result.data;
  console.log('Created:', subscription.name);
} else {
  // 错误处理
  const error = result.error;
  console.error('Error:', error?.message);
  console.error('Status:', error?.statusCode);
  
  // 显示给用户
  alert(`Failed to create subscription: ${error?.message}`);
}
```

### 处理批量更新响应

```typescript
const result = await articleService.markAllAsRead(articleIds);

if (result.success) {
  const { updatedCount, failedIds, message } = result.data;
  
  console.log(`Updated ${updatedCount} articles`);
  
  if (failedIds.length > 0) {
    console.warn(`Failed to update ${failedIds.length} articles:`);
    console.warn(failedIds);
  }
}
```

### 处理 Feed 操作响应

```typescript
const result = await feedService.updateAllFeeds();

if (result.success) {
  const { subscriptionId, updatedAt, articlesCount } = result.data;
  
  if (subscriptionId) {
    console.log(`Updated feed for subscription: ${subscriptionId}`);
  } else {
    console.log('Updated all feeds');
  }
  
  console.log(`Articles count: ${articlesCount}`);
  console.log(`Updated at: ${updatedAt}`);
}
```

---

## 📊 完整 API 列表

| Service | 方法 | HTTP | 端点 | 说明 |
|---------|------|------|------|------|
| articleService | getArticles | GET | /articles | 获取文章列表 |
| articleService | searchArticles | GET | /articles/search | 搜索文章 |
| articleService | getArticleById | GET | /articles/:id | 获取单个文章 |
| articleService | updateArticle | PATCH | /articles/:id | 更新文章 |
| articleService | batchUpdateArticles | PATCH | /articles/batch-update | 批量更新 |
| subscriptionService | getSubscriptions | GET | /subscriptions | 获取订阅列表 |
| subscriptionService | createSubscription | POST | /subscriptions | 创建订阅 |
| subscriptionService | updateSubscription | PATCH | /subscriptions/:id | 更新订阅 |
| subscriptionService | deleteSubscription | DELETE | /subscriptions/:id | 删除订阅 |
| feedService | updateFeed | PATCH | /feeds/update/:id | 更新指定 Feed |
| feedService | cleanupFeed | PATCH | /feeds/cleanup/:id | 清理指定 Feed |
| feedService | updateAllFeeds | PATCH | /feeds/update-all | 更新所有 Feed |
| feedService | cleanupAllFeeds | PATCH | /feeds/cleanup-all | 清理所有 Feed |

---

## 🔗 相关文档

- [迁移指南](./migration-guide.md) - 详细迁移步骤
- [最佳实践](./best-practices.md) - 代码规范和建议
