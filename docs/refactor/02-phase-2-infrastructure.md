# Phase 2: 基础设施层

## 🎯 阶段目标

创建统一的 API 客户端和错误处理机制，为 Service 层提供基础设施支持。

## 📦 文件清单

需要创建 2 个文件：

1. `frontend/src/services/api-client.ts` - 统一 Axios 实例
2. `frontend/src/services/error-handler.ts` - 统一错误处理

**依赖：** Phase 1 已完成（类型定义）

---

## 📝 完整代码实现

### 1. `frontend/src/services/api-client.ts`

```typescript
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config/api.config';
import { ApiError } from '../types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log(`[API Response] ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError<ApiError>) => {
        const apiError: ApiError = {
          statusCode: error.response?.status || 500,
          message: error.response?.data?.message || error.message || 'Network Error',
          timestamp: error.response?.data?.timestamp || new Date().toISOString(),
          path: error.response?.data?.path || error.config?.url || '',
        };
        console.error('[API Response Error]', apiError);
        return Promise.reject(apiError);
      }
    );
  }

  get instance() {
    return this.client;
  }
}

export const apiClient = new ApiClient().instance;
```

**说明：**

#### 配置项
- `baseURL: API_BASE_URL` - 从环境变量读取后端地址
- `timeout: 30000` - 30 秒超时
- `headers: { 'Content-Type': 'application/json' }` - 默认 JSON 格式

#### 请求拦截器
- 记录请求日志（method + url）
- 可以在此添加认证 token（未来扩展）

#### 响应拦截器
- 记录响应日志（status + url）
- 统一错误处理：将 AxiosError 转换为 ApiError
- 错误格式标准化

#### 错误处理逻辑
1. **网络错误** - `error.response` 不存在时，statusCode 为 500，message 为 'Network Error'
2. **4xx 客户端错误** - 使用后端返回的错误信息
3. **5xx 服务端错误** - 使用后端返回的错误信息

---

### 2. `frontend/src/services/error-handler.ts`

```typescript
import { ApiError, ServiceResult } from '../types';

export function handleApiError<T>(error: unknown): ServiceResult<T> {
  if (isApiError(error)) {
    return {
      success: false,
      error,
    };
  }

  const unknownError: ApiError = {
    statusCode: 500,
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    path: '',
  };

  return {
    success: false,
    error: unknownError,
  };
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'message' in error
  );
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
```

**说明：**

#### `handleApiError<T>(error: unknown): ServiceResult<T>`
- 统一错误处理函数
- 将任意错误转换为 `ServiceResult`
- 支持 TypeScript 类型守卫

#### `isApiError(error: unknown): error is ApiError`
- 类型守卫函数
- 判断错误是否为 `ApiError` 类型

#### `getErrorMessage(error: unknown): string`
- 从错误中提取错误消息
- 用于在 UI 中显示错误信息

---

## 🔧 使用示例

### 在 Service 中使用

```typescript
import { apiClient } from './api-client';
import { handleApiError } from './error-handler';
import { Article, ServiceResult } from '../types';

async function getArticle(id: string): Promise<ServiceResult<Article>> {
  try {
    const response = await apiClient.get<Article>(`/articles/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
}
```

### 在组件中使用

```typescript
const result = await getArticle('article-id');

if (result.success) {
  console.log('Article:', result.data);
} else {
  console.error('Error:', result.error?.message);
  // 显示错误提示给用户
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

### 2. 导入测试

创建临时测试文件 `services/test.ts`：

```typescript
import { apiClient } from './api-client';
import { handleApiError, isApiError, getErrorMessage } from './error-handler';

console.log('API Client:', apiClient);
console.log('Error Handler:', { handleApiError, isApiError, getErrorMessage });
```

**预期结果：** 无导入错误

### 3. 浏览器 Console 测试

启动开发服务器后，在浏览器控制台测试：

```bash
cd frontend
npm run dev
```

在浏览器控制台中：

```javascript
// 导入 apiClient（假设 dev 环境暴露了）
import { apiClient } from '/src/services/api-client.ts';

// 测试 GET 请求
apiClient.get('/health').then(console.log).catch(console.error);

// 测试错误处理
apiClient.get('/articles/invalid-id').catch(error => {
  console.log('Error:', error);
  console.log('Status Code:', error.statusCode);
  console.log('Message:', error.message);
});
```

**预期结果：**
- GET `/health` 返回成功响应
- GET `/articles/invalid-id` 返回标准化错误格式

### 4. 错误处理测试

```javascript
import { handleApiError, isApiError } from '/src/services/error-handler.ts';

// 测试类型守卫
const apiError = { statusCode: 404, message: 'Not Found', timestamp: '', path: '' };
console.log('Is ApiError:', isApiError(apiError)); // true

// 测试 handleApiError
const result = handleApiError(apiError);
console.log('Result:', result); // { success: false, error: apiError }
```

**预期结果：** 所有测试通过

---

## ⚠️ 注意事项

### 1. CORS 配置
- 后端已启用 CORS，前端无需额外配置
- 如果遇到 CORS 错误，检查后端 `main.ts` 中的 CORS 配置

### 2. 超时设置
- 默认 30 秒超时
- Feed 更新操作可能耗时较长，如有需要可以单独设置超时：
  ```typescript
  await apiClient.patch('/feeds/update-all', {}, { timeout: 60000 });
  ```

### 3. 日志记录
- 生产环境建议关闭 console.log
- 可以通过环境变量控制日志级别：
  ```typescript
  if (import.meta.env.DEV) {
    console.log(`[API Request] ${config.method} ${config.url}`);
  }
  ```

### 4. 错误格式一致性
- 后端 `HttpExceptionFilter` 返回格式必须为：
  ```json
  {
    "statusCode": 404,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "path": "/articles/invalid-id",
    "message": "Article not found"
  }
  ```

### 5. Axios 类型导入
- 使用 `InternalAxiosRequestConfig` 而非 `AxiosRequestConfig`（Axios v1.x 新要求）

---

## 🔗 与后端的关系

### 后端 CORS 配置（已完成）

`backend/src/main.ts`:
```typescript
app.enableCors({
  origin: 'http://localhost:3001',
  credentials: true,
});
```

### 后端错误过滤器（已完成）

`backend/src/common/filters/http-exception.filter.ts`:
```typescript
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // 返回标准化的错误格式
    // { statusCode, timestamp, path, message }
  }
}
```

---

## 📌 Phase 2 完成标志

- [x] 创建 api-client.ts
- [x] 创建 error-handler.ts
- [x] TypeScript 编译通过
- [x] API 客户端可正常发起请求
- [x] 错误处理可正常工作

完成后，可以继续执行 Phase 3。

---

## 📚 后续扩展

### 1. 认证拦截器（未来）
```typescript
this.client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 2. 请求重试（未来）
```typescript
import axiosRetry from 'axios-retry';

axiosRetry(this.client, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});
```

### 3. 请求取消（未来）
```typescript
const controller = new AbortController();
apiClient.get('/articles', { signal: controller.signal });
controller.abort(); // 取消请求
```
