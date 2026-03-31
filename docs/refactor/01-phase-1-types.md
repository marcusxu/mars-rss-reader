# Phase 1: 类型定义层

## 🎯 阶段目标

建立完整的 TypeScript 类型系统，与后端 DTO 保持一致，为后续阶段提供类型支持。

## 📦 文件清单

需要创建 6 个类型文件：

1. `frontend/src/types/pagination.types.ts` - 分页类型
2. `frontend/src/types/subscription.types.ts` - 订阅类型
3. `frontend/src/types/article.types.ts` - 文章类型
4. `frontend/src/types/feed.types.ts` - Feed 类型
5. `frontend/src/types/api-error.types.ts` - API 错误类型
6. `frontend/src/types/index.ts` - 统一导出

## 📝 完整代码实现

### 1. `frontend/src/types/pagination.types.ts`

```typescript
export interface PaginationRequest {
  page?: number;
  perPage?: number;
}

export interface PaginationResponse<T> {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: T[];
}
```

**说明：**
- `PaginationRequest` - 分页请求参数，对应后端 `PaginationRequestDto`
- `PaginationResponse<T>` - 分页响应数据，对应后端 `PaginationResponseDto<T>`

---

### 2. `frontend/src/types/subscription.types.ts`

```typescript
import { PaginationRequest } from './pagination.types';

export interface Subscription {
  id: string;
  url: string;
  name: string;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionRequest {
  url: string;
  name: string;
  description?: string;
  category?: string;
}

export interface UpdateSubscriptionRequest {
  url?: string;
  name?: string;
  description?: string;
  category?: string;
}

export interface SubscriptionFilter extends PaginationRequest {
  id?: string;
  url?: string;
  name?: string;
  category?: string;
}
```

**说明：**
- `Subscription` - 订阅实体，对应后端 `Subscription` entity
- `CreateSubscriptionRequest` - 创建订阅请求，对应后端 `CreateSubscriptionDto`
- `UpdateSubscriptionRequest` - 更新订阅请求，对应后端 `UpdateSubscriptionDto`
- `SubscriptionFilter` - 查询订阅过滤条件，对应后端 `FindSubscriptionDto`

---

### 3. `frontend/src/types/article.types.ts`

```typescript
import { PaginationRequest, Subscription } from './pagination.types';
import { Subscription } from './subscription.types';

export interface Article {
  id: string;
  title: string;
  content: string;
  link: string;
  author?: string;
  pubDate: string;
  isRead: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  subscription: Subscription;
}

export interface ArticleFilter extends PaginationRequest {
  id?: string;
  title?: string;
  content?: string;
  link?: string;
  author?: string;
  pubDate?: string;
  subscriptionId?: string;
  isRead?: boolean;
  isFavorite?: boolean;
}

export interface UpdateArticleRequest {
  isRead?: boolean;
  isFavorite?: boolean;
}

export interface BatchUpdateArticleRequest {
  ids: string[];
  isRead?: boolean;
  isFavorite?: boolean;
}

export interface BatchUpdateResponse {
  updatedCount: number;
  failedIds: string[];
  message: string;
}
```

**说明：**
- `Article` - 文章实体，对应后端 `Article` entity
- `ArticleFilter` - 查询文章过滤条件，对应后端 `FindArticleDto`
- `UpdateArticleRequest` - 更新文章请求，对应后端 `UpdateArticleDto`
- `BatchUpdateArticleRequest` - 批量更新文章请求
- `BatchUpdateResponse` - 批量更新响应，对应后端 `BatchUpdateResponseDto`

---

### 4. `frontend/src/types/feed.types.ts`

```typescript
export interface FeedResponse {
  subscriptionId?: string;
  updatedAt: string;
  articlesCount: number;
}
```

**说明：**
- `FeedResponse` - Feed 操作响应，对应后端 `FeedResponseDto`
- `subscriptionId` - 单个订阅操作时有值，批量操作时为 undefined

---

### 5. `frontend/src/types/api-error.types.ts`

```typescript
export interface ApiError {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface ServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
```

**说明：**
- `ApiError` - API 错误响应，对应后端 `HttpExceptionFilter` 返回格式
- `ServiceResult<T>` - Service 方法统一返回格式，包含成功/失败状态和数据/错误

---

### 6. `frontend/src/types/index.ts`

```typescript
export * from './pagination.types';
export * from './subscription.types';
export * from './article.types';
export * from './feed.types';
export * from './api-error.types';
```

**说明：**
- 统一导出所有类型，方便其他文件导入
- 使用方式：`import { Article, Subscription } from '../types'`

---

## 🔗 与后端 DTO 的对应关系

| 前端类型 | 后端 DTO/Entity | 文件位置 |
|---------|----------------|---------|
| `PaginationRequest` | `PaginationRequestDto` | `backend/src/common/pagination/pagination-request.dto.ts` |
| `PaginationResponse<T>` | `PaginationResponseDto<T>` | `backend/src/common/pagination/pagination-response.dto.ts` |
| `Subscription` | `Subscription` (Entity) | `backend/src/subscriptions/entities/subscription.entity.ts` |
| `CreateSubscriptionRequest` | `CreateSubscriptionDto` | `backend/src/subscriptions/dto/create-subscription.dto.ts` |
| `UpdateSubscriptionRequest` | `UpdateSubscriptionDto` | `backend/src/subscriptions/dto/update-subscription.dto.ts` |
| `SubscriptionFilter` | `FindSubscriptionDto` | `backend/src/subscriptions/dto/find-subscription.dto.ts` |
| `Article` | `Article` (Entity) | `backend/src/articles/entities/article.entity.ts` |
| `ArticleFilter` | `FindArticleDto` | `backend/src/articles/dto/find-article.dto.ts` |
| `UpdateArticleRequest` | `UpdateArticleDto` | `backend/src/articles/dto/update-article.dto.ts` |
| `BatchUpdateResponse` | `BatchUpdateResponseDto` | `backend/src/articles/dto/batch-update-response.dto.ts` |
| `FeedResponse` | `FeedResponseDto` | `backend/src/feeds/dto/feed-response.dto.ts` |
| `ApiError` | HttpExceptionFilter 返回 | `backend/src/common/filters/http-exception.filter.ts` |

---

## ✅ 验证步骤

### 1. TypeScript 编译检查

```bash
cd frontend
npm run build
```

**预期结果：** 编译成功，无类型错误

### 2. 类型导入测试

在任意文件中添加临时导入测试：

```typescript
import {
  PaginationRequest,
  PaginationResponse,
  Subscription,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  SubscriptionFilter,
  Article,
  ArticleFilter,
  UpdateArticleRequest,
  BatchUpdateArticleRequest,
  BatchUpdateResponse,
  FeedResponse,
  ApiError,
  ServiceResult,
} from './types';
```

**预期结果：** 所有类型都能正确导入，无红色波浪线

### 3. 类型使用测试

创建临时测试文件 `types/test.ts`：

```typescript
import { Article, Subscription } from './index';

const article: Article = {
  id: 'test-id',
  title: 'Test Article',
  content: 'Test Content',
  link: 'https://example.com',
  author: 'Test Author',
  pubDate: '2024-01-01',
  isRead: false,
  isFavorite: false,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  subscription: {
    id: 'sub-id',
    url: 'https://example.com/feed',
    name: 'Test Subscription',
    category: 'Tech',
    description: 'Test Description',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
};

console.log(article);
```

**预期结果：** 无类型错误

---

## ⚠️ 注意事项

### 1. 导入顺序
- `article.types.ts` 导入了 `Subscription`，必须确保 `subscription.types.ts` 已创建
- `article.types.ts` 也导入了 `PaginationRequest`，这个应该从 `pagination.types.ts` 导入

**修正：** 在 `article.types.ts` 中，应该这样导入：

```typescript
import { PaginationRequest } from './pagination.types';
import { Subscription } from './subscription.types';
```

### 2. 可选字段
- 后端使用 `?` 标记可选字段，前端类型定义保持一致
- 例如：`author?: string` 表示 author 可以为 undefined

### 3. 日期类型
- 后端 Entity 使用 `Date` 类型
- 前端使用 `string` 类型，因为 JSON 序列化后是字符串

### 4. 不影响现有代码
- 本阶段只添加新文件，不修改现有代码
- 旧的 `types/article-type.ts` 暂时保留，Phase 5 再删除

---

## 📌 Phase 1 完成标志

- [x] 创建 6 个类型文件
- [x] TypeScript 编译通过
- [x] 所有类型可正确导入
- [x] 类型与后端 DTO 一致

完成后，可以继续执行 Phase 2。
