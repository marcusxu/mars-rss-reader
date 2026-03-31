# 最佳实践

本文档总结了前端服务层重构的最佳实践，帮助开发者编写高质量、可维护的代码。

## 📋 目录

- [类型定义最佳实践](#类型定义最佳实践)
- [Service 层最佳实践](#service-层最佳实践)
- [Hook 层最佳实践](#hook-层最佳实践)
- [错误处理最佳实践](#错误处理最佳实践)
- [性能优化最佳实践](#性能优化最佳实践)
- [代码组织最佳实践](#代码组织最佳实践)
- [测试最佳实践](#测试最佳实践)
- [文档维护最佳实践](#文档维护最佳实践)

---

## 类型定义最佳实践

### 1. 与后端 DTO 保持一致

**原则：** 前端类型定义应该完全对应后端 DTO/Entity。

**示例：**

```typescript
// ✅ 好的做法：与后端 Entity 完全一致
export interface Article {
  id: string;
  title: string;
  content: string;
  link: string;
  author?: string;      // 后端：@Column({ nullable: true })
  pubDate: string;      // 后端：Date，但 JSON 序列化后是 string
  isRead: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  subscription: Subscription;
}

// ❌ 不好的做法：与后端不一致
export interface Article {
  id: number;           // 后端是 UUID string
  title: string;
  body: string;         // 后端是 content
  // 缺少字段
}
```

---

### 2. 使用统一的导入路径

**原则：** 所有类型统一从 `types/index.ts` 导入。

**示例：**

```typescript
// ✅ 好的做法：统一导入
import { Article, Subscription, FeedResponse } from '../types';

// ❌ 不好的做法：分散导入
import { Article } from '../types/article.types';
import { Subscription } from '../types/subscription.types';
```

---

### 3. 使用可选类型标记可选字段

**原则：** 与后端保持一致，使用 `?` 标记可选字段。

**示例：**

```typescript
// ✅ 好的做法：明确标记可选字段
export interface CreateSubscriptionRequest {
  url: string;           // 必填
  name: string;          // 必填
  description?: string;  // 可选
  category?: string;     // 可选
}

// ❌ 不好的做法：不明确标记可选
export interface CreateSubscriptionRequest {
  url: string;
  name: string;
  description: string;   // 必填？可选？
  category: string;      // 必填？可选？
}
```

---

### 4. 区分 Request 和 Response 类型

**原则：** 为请求和响应定义不同的类型。

**示例：**

```typescript
// ✅ 好的做法：区分请求和响应
export interface CreateSubscriptionRequest {
  url: string;
  name: string;
  description?: string;
  category?: string;
}

export interface Subscription {
  id: string;
  url: string;
  name: string;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

// ❌ 不好的做法：混用同一个类型
export interface Subscription {
  id?: string;           // 创建时不需要，更新时可能需要
  url: string;
  name: string;
  // ...
}
```

---

### 5. 使用泛型定义通用类型

**原则：** 使用泛型定义可复用的通用类型。

**示例：**

```typescript
// ✅ 好的做法：使用泛型
export interface PaginationResponse<T> {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: T[];
}

// 使用
const articles: PaginationResponse<Article> = await articleService.getArticles();
const subscriptions: PaginationResponse<Subscription> = await subscriptionService.getSubscriptions();

// ❌ 不好的做法：为每个类型定义分页响应
export interface ArticlePaginationResponse {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: Article[];
}

export interface SubscriptionPaginationResponse {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: Subscription[];
}
```

---

## Service 层最佳实践

### 1. 使用统一的 API 客户端

**原则：** 所有 API 调用都通过 `apiClient` 发起。

**示例：**

```typescript
// ✅ 好的做法：使用 apiClient
import { apiClient } from './api-client';

export const articleService = {
  async getArticles(filter?: ArticleFilter) {
    const response = await apiClient.get('/articles', { params: filter });
    return response.data;
  },
};

// ❌ 不好的做法：直接使用 axios
import axios from 'axios';

export const articleService = {
  async getArticles(filter?: ArticleFilter) {
    const response = await axios.get('http://localhost:3000/articles', {
      params: filter,
    });
    return response.data;
  },
};
```

---

### 2. 区分基础方法和业务方法

**原则：** 基础方法直接调用 API，业务方法包含错误处理。

**示例：**

```typescript
// ✅ 好的做法：区分基础方法和业务方法
export const articleService = {
  // 基础方法：直接调用 API
  async updateArticle(id: string, data: UpdateArticleRequest): Promise<Article> {
    const response = await apiClient.patch<Article>(`/articles/${id}`, data);
    return response.data;
  },

  // 业务方法：包含错误处理
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
};
```

---

### 3. 使用 URLSearchParams 构建查询参数

**原则：** 使用 `URLSearchParams` 构建查询字符串，避免手动拼接。

**示例：**

```typescript
// ✅ 好的做法：使用 URLSearchParams
async getArticles(filter?: ArticleFilter): Promise<PaginationResponse<Article>> {
  const params = new URLSearchParams();
  
  if (filter?.page) params.append('page', String(filter.page));
  if (filter?.perPage) params.append('perPage', String(filter.perPage));
  if (filter?.title) params.append('title', filter.title);
  
  const response = await apiClient.get<PaginationResponse<Article>>(
    `/articles?${params.toString()}`
  );
  return response.data;
}

// ❌ 不好的做法：手动拼接字符串
async getArticles(filter?: ArticleFilter): Promise<PaginationResponse<Article>> {
  let url = '/articles?page=' + (filter?.page || 1);
  url += '&perPage=' + (filter?.perPage || 10);
  if (filter?.title) {
    url += '&title=' + filter.title;
  }
  const response = await apiClient.get(url);
  return response.data;
}
```

---

### 4. 只传递有值的参数

**原则：** 过滤掉 `undefined` 参数，避免发送无效参数。

**示例：**

```typescript
// ✅ 好的做法：只添加有值的参数
if (filter?.title) params.append('title', filter.title);
if (filter?.isRead !== undefined) params.append('isRead', String(filter.isRead));

// ❌ 不好的做法：添加所有参数
params.append('title', filter?.title);         // 如果 title 为 undefined，会发送 "title=undefined"
params.append('isRead', filter?.isRead);       // 如果 isRead 为 undefined，会发送 "isRead=undefined"
```

---

### 5. 正确处理布尔值

**原则：** 布尔值需要转换为字符串。

**示例：**

```typescript
// ✅ 好的做法：转换为字符串
if (filter?.isRead !== undefined) {
  params.append('isRead', String(filter.isRead));
}

// ❌ 不好的做法：直接传递布尔值
params.append('isRead', filter.isRead); // 会变成字符串 "true" 或 "false"
```

---

## Hook 层最佳实践

### 1. 使用 useCallback 包装方法

**原则：** 使用 `useCallback` 包装所有方法，避免不必要的重渲染。

**示例：**

```typescript
// ✅ 好的做法：使用 useCallback
export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);

  const updateArticles = useCallback(async (page: number = 1) => {
    const response = await articleService.getArticles({ page, perPage: 10 });
    setArticles(response.data);
  }, []); // 无依赖

  const toggleReadStatus = useCallback(async (article: Article) => {
    const result = await articleService.toggleReadStatus(article);
    if (result.success && result.data) {
      setArticles((prev) => prev.map((a) => (a.id === article.id ? result.data! : a)));
    }
  }, []); // 无依赖

  return { articles, updateArticles, toggleReadStatus };
}

// ❌ 不好的做法：不使用 useCallback
export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);

  const updateArticles = async (page: number = 1) => {
    // 每次 hook 重新执行都会创建新函数
    const response = await articleService.getArticles({ page, perPage: 10 });
    setArticles(response.data);
  };

  return { articles, updateArticles };
}
```

---

### 2. 使用函数式更新状态

**原则：** 使用函数式更新，避免依赖旧状态。

**示例：**

```typescript
// ✅ 好的做法：函数式更新
setArticles((prev) => prev.map((a) => (a.id === article.id ? result.data! : a)));

// ❌ 不好的做法：依赖旧状态
setArticles(
  articles.map((a) => (a.id === article.id ? result.data! : a))
); // articles 可能是旧值
```

---

### 3. 提供清晰的方法命名

**原则：** 方法名称应该清晰表达其功能。

**示例：**

```typescript
// ✅ 好的做法：清晰的命名
const toggleReadStatus = useCallback(async (article: Article) => {
  // ...
}, []);

const markAllAsRead = useCallback(async () => {
  // ...
}, []);

// ❌ 不好的做法：不清晰的命名
const handleChange = useCallback(async (article: Article) => {
  // ... 改变什么？
}, []);

const handleAll = useCallback(async () => {
  // ... 全部什么？
}, []);
```

---

### 4. 处理加载状态

**原则：** 正确处理加载状态，避免 UI 闪烁。

**示例：**

```typescript
// ✅ 好的做法：使用 finally 确保加载状态重置
const updateArticles = useCallback(async (page: number = 1) => {
  setLoading(true);
  try {
    const response = await articleService.getArticles({ page, perPage: 10 });
    setArticles(response.data);
  } catch (error) {
    console.error('Failed:', error);
  } finally {
    setLoading(false); // 确保重置
  }
}, []);

// ❌ 不好的做法：可能忘记重置加载状态
const updateArticles = useCallback(async (page: number = 1) => {
  setLoading(true);
  const response = await articleService.getArticles({ page, perPage: 10 });
  setArticles(response.data);
  setLoading(false); // 如果出错，不会执行
}, []);
```

---

### 5. 提供重置方法

**原则：** 提供重置方法，方便用户清空状态。

**示例：**

```typescript
// ✅ 好的做法：提供重置方法
export function useArticles() {
  const [filterValue, setFilterValue] = useState('');

  const resetFilter = useCallback(() => {
    setFilterValue('');
    updateArticles(1);
  }, [updateArticles]);

  return { filterValue, setFilterValue, resetFilter };
}
```

---

## 错误处理最佳实践

### 1. 统一使用 ServiceResult

**原则：** 所有业务方法返回 `ServiceResult`。

**示例：**

```typescript
// ✅ 好的做法：返回 ServiceResult
async toggleReadStatus(article: Article): Promise<ServiceResult<Article>> {
  try {
    const updated = await this.updateArticle(article.id, {
      isRead: !article.isRead,
    });
    return { success: true, data: updated };
  } catch (error) {
    return handleApiError(error);
  }
}

// 使用
const result = await articleService.toggleReadStatus(article);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error?.message);
}
```

---

### 2. 在 UI 中显示错误信息

**原则：** 错误信息应该显示给用户，而不是只在 console 中。

**示例：**

```typescript
// ✅ 好的做法：显示错误给用户
import { Snackbar, Alert } from '@mui/material';

function FeedsPage() {
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async () => {
    const result = await feedService.updateAllFeeds();
    if (!result.success) {
      setError(result.error?.message || 'Unknown error');
    }
  };

  return (
    <>
      <Button onClick={handleRefresh}>Refresh</Button>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
```

---

### 3. 记录错误日志

**原则：** 在 console 中记录错误，方便调试。

**示例：**

```typescript
// ✅ 好的做法：记录错误
const result = await articleService.toggleReadStatus(article);
if (!result.success) {
  console.error('Failed to toggle read status:', result.error);
  setError(result.error?.message);
}
```

---

## 性能优化最佳实践

### 1. 避免不必要的 API 调用

**原则：** 过滤已处理的数据，减少不必要的请求。

**示例：**

```typescript
// ✅ 好的做法：过滤已读文章
const markAllAsRead = useCallback(async () => {
  const unreadArticles = articles.filter((a) => !a.isRead);
  if (unreadArticles.length === 0) {
    console.log('All articles are already read');
    return;
  }

  const articleIds = unreadArticles.map((a) => a.id);
  await articleService.markAllAsRead(articleIds);
}, [articles]);

// ❌ 不好的做法：不过滤
const markAllAsRead = useCallback(async () => {
  const articleIds = articles.map((a) => a.id);
  await articleService.markAllAsRead(articleIds);
}, [articles]);
```

---

### 2. 使用防抖优化搜索

**原则：** 搜索输入使用防抖，避免频繁请求。

**示例：**

```typescript
// ✅ 好的做法：使用防抖
import { debounce } from 'lodash';

function FeedsPage() {
  const { searchArticles } = useArticles();
  const [searchValue, setSearchValue] = useState('');

  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      searchArticles(value);
    }, 500),
    [searchArticles]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  return <TextField value={searchValue} onChange={handleSearchChange} />;
}
```

---

### 3. 实现数据缓存

**原则：** 缓存常用数据，减少重复请求。

**示例：**

```typescript
// ✅ 好的做法：使用缓存
const cache = new Map<string, { data: any; timestamp: number }>();

export const articleService = {
  async getArticles(filter?: ArticleFilter): Promise<PaginationResponse<Article>> {
    const cacheKey = JSON.stringify(filter);
    const cached = cache.get(cacheKey);

    // 缓存有效期 1 分钟
    if (cached && Date.now() - cached.timestamp < 60000) {
      return cached.data;
    }

    const response = await apiClient.get('/articles', { params: filter });
    cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
    return response.data;
  },
};
```

---

## 代码组织最佳实践

### 1. 按功能模块组织代码

**原则：** 相关的代码放在一起，便于查找和维护。

**目录结构：**
```
frontend/src/
├── types/              # 类型定义
│   ├── article.types.ts
│   ├── subscription.types.ts
│   └── index.ts
├── services/           # API 服务
│   ├── article-service.ts
│   ├── subscription-service.ts
│   └── index.ts
├── hooks/              # 自定义 Hooks
│   ├── use-articles.ts
│   └── index.ts
├── pages/              # 页面组件
│   ├── feeds-page.tsx
│   └── subscriptions-page.tsx
├── components/         # 可复用组件
│   └── navigator.tsx
└── utils/              # 工具函数
    └── date-util.ts
```

---

### 2. 统一命名规范

**原则：** 遵循统一的命名规范。

**命名规范：**

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件名 | kebab-case | `article-service.ts`, `feeds-page.tsx` |
| 组件名 | PascalCase | `FeedsPage`, `ArticleItem` |
| Hook 名 | camelCase + use 前缀 | `useArticles`, `useSubscriptions` |
| Service 名 | camelCase + service 后缀 | `articleService`, `feedService` |
| 类型名 | PascalCase | `Article`, `Subscription` |
| 接口名 | PascalCase | `ArticleFilter`, `ServiceResult` |
| 方法名 | camelCase | `getArticles`, `toggleReadStatus` |

---

### 3. 导入顺序

**原则：** 导入语句按特定顺序组织。

**示例：**

```typescript
// 1. 外部包
import { useState, useCallback } from 'react';
import { Container, Button } from '@mui/material';

// 2. 内部类型
import { Article, ArticleFilter } from '../types';

// 3. 内部服务
import { articleService, feedService } from '../services';

// 4. 内部 Hooks
import { useArticles } from '../hooks';

// 5. 内部组件
import { ArticleItem } from '../components';

// 6. 工具函数
import { formatDate } from '../utils/date-util';
```

---

## 测试最佳实践

### 1. 测试 Service 方法

**原则：** 每个 service 方法都应该有对应的测试。

**示例：**

```typescript
// article-service.test.ts
import { articleService } from './article-service';
import { apiClient } from './api-client';

jest.mock('./api-client');

describe('articleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getArticles', () => {
    it('should call GET /articles with correct params', async () => {
      const mockResponse = {
        page: 1,
        perPage: 10,
        total: 100,
        totalPages: 10,
        data: [],
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await articleService.getArticles({ page: 1, perPage: 10 });

      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/articles')
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('toggleReadStatus', () => {
    it('should toggle read status successfully', async () => {
      const article = {
        id: 'article-id',
        isRead: false,
      } as Article;

      (apiClient.patch as jest.Mock).mockResolvedValue({
        data: { ...article, isRead: true },
      });

      const result = await articleService.toggleReadStatus(article);

      expect(result.success).toBe(true);
      expect(result.data?.isRead).toBe(true);
    });

    it('should handle errors', async () => {
      const article = { id: 'article-id' } as Article;

      (apiClient.patch as jest.Mock).mockRejectedValue({
        statusCode: 404,
        message: 'Article not found',
        timestamp: '',
        path: '',
      });

      const result = await articleService.toggleReadStatus(article);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Article not found');
    });
  });
});
```

---

### 2. 测试 Hook

**原则：** 使用 `@testing-library/react-hooks` 测试 hook。

**示例：**

```typescript
// use-articles.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useArticles } from './use-articles';
import { articleService } from '../services';

jest.mock('../services');

describe('useArticles', () => {
  it('should fetch articles on mount', async () => {
    const mockResponse = {
      page: 1,
      perPage: 10,
      total: 0,
      totalPages: 0,
      data: [],
    };

    (articleService.getArticles as jest.Mock).mockResolvedValue(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => useArticles());

    await waitForNextUpdate();

    expect(result.current.articles).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should toggle read status', async () => {
    const article = {
      id: 'article-id',
      isRead: false,
    } as Article;

    (articleService.getArticles as jest.Mock).mockResolvedValue({
      page: 1,
      perPage: 10,
      total: 1,
      totalPages: 1,
      data: [article],
    });

    (articleService.toggleReadStatus as jest.Mock).mockResolvedValue({
      success: true,
      data: { ...article, isRead: true },
    });

    const { result, waitForNextUpdate } = renderHook(() => useArticles());

    await waitForNextUpdate();

    await act(async () => {
      await result.current.toggleReadStatus(article);
    });

    expect(result.current.articles[0].isRead).toBe(true);
  });
});
```

---

## 文档维护最佳实践

### 1. 保持文档更新

**原则：** 代码变更时，同步更新相关文档。

**文档类型：**
- API 文档（Swagger）
- 类型定义文档
- 服务层文档
- Hook 文档
- 迁移指南

---

### 2. 使用注释说明复杂逻辑

**原则：** 对复杂的业务逻辑添加注释说明。

**示例：**

```typescript
// ✅ 好的做法：添加注释
/**
 * 标记所有文章为已读
 * 注意：只处理未读文章，避免不必要的 API 调用
 */
const markAllAsRead = useCallback(async () => {
  // 过滤已读文章，减少 API 调用
  const unreadArticles = articles.filter((a) => !a.isRead);
  
  if (unreadArticles.length === 0) {
    console.log('All articles are already read');
    return;
  }

  const articleIds = unreadArticles.map((a) => a.id);
  const result = await articleService.markAllAsRead(articleIds);
  
  // ...
}, [articles]);
```

---

### 3. 维护 CHANGELOG

**原则：** 记录每个版本的变更内容。

**示例：**

```markdown
# CHANGELOG

## [2.0.0] - 2024-01-XX

### Breaking Changes
- 重构 Service 层，返回 `ServiceResult` 而非直接数据
- Feed 操作迁移到 `feedService`
- Hook 方法命名变更（`handleMarkAllAsRead` → `markAllAsRead`）

### Added
- 新增 `feedService`
- 新增 `useSubscriptions` hook
- 新增订阅更新功能
- 新增搜索专用端点 `articleService.searchArticles`

### Changed
- 优化类型定义，与后端 DTO 保持一致
- 统一错误处理机制
- 优化 Hook 状态管理

### Fixed
- 修复分页参数处理问题
- 修复布尔值参数转换问题
```

---

## 📚 相关文档

- [API 映射表](./api-mapping.md) - 前后端 API 对应关系
- [迁移指南](./migration-guide.md) - 详细迁移步骤
