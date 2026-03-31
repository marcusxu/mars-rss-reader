# 组件指南

本文档提供 Mars RSS Reader 所有组件的使用指南，包括 Props API、使用示例和最佳实践。

## 📋 组件列表

### 布局组件
- [AppLayout](#applayout)
- [Sidebar](#sidebar)
- [Header](#header)
- [SidebarItem](#sidebaritem)

### 通用组件
- [Loading](#loading)
- [EmptyState](#emptystate)
- [ConfirmDialog](#confirmdialog)
- [ToastProvider](#toastprovider)

### 文章组件
- [ArticleCard](#articlecard)
- [ArticleList](#articlelist)
- [ArticleFilter](#articlefilter)
- [ArticleSkeleton](#articleskeleton)
- [ArticleActions](#articleactions)
- [ArticleContent](#articlecontent)
- [ArticleNavigation](#articlenavigation)

### 订阅组件
- [SubscriptionCard](#subscriptioncard)
- [SubscriptionList](#subscriptionlist)
- [SubscriptionForm](#subscriptionform)

---

## 布局组件

### AppLayout

应用主布局组件，包含侧边栏、顶部栏和主内容区。

**位置：** `frontend/src/components/layout/app-layout.tsx`

#### Props

无 Props，通过 children 接收内容。

#### 使用示例

```typescript
import { AppLayout } from './components/layout/app-layout';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<FeedsPage />} />
      </Routes>
    </AppLayout>
  );
}
```

#### 功能特性

- 响应式侧边栏（桌面固定，移动端抽屉）
- 顶部栏固定
- 主内容区自适应

---

### Sidebar

侧边栏导航组件。

**位置：** `frontend/src/components/layout/sidebar.tsx`

#### Props

```typescript
interface SidebarProps {
  open: boolean;           // 移动端是否打开
  onClose: () => void;     // 关闭回调
  width: number;           // 侧边栏宽度
  isMobile: boolean;       // 是否移动端
}
```

#### 使用示例

```typescript
<Sidebar
  open={mobileOpen}
  onClose={handleDrawerToggle}
  width={240}
  isMobile={isMobile}
/>
```

#### 功能特性

- 桌面端固定显示
- 移动端抽屉式
- 自动高亮当前页面

---

### Header

顶部栏组件，包含标题和主题切换按钮。

**位置：** `frontend/src/components/layout/header.tsx`

#### Props

```typescript
interface HeaderProps {
  onMenuClick: () => void;   // 菜单按钮点击回调
  sidebarWidth: number;      // 侧边栏宽度
  isMobile: boolean;         // 是否移动端
}
```

#### 使用示例

```typescript
<Header
  onMenuClick={handleDrawerToggle}
  sidebarWidth={240}
  isMobile={isMobile}
/>
```

#### 功能特性

- 响应式菜单按钮（仅移动端显示）
- 主题切换按钮
- 固定顶部

---

### SidebarItem

侧边栏菜单项组件。

**位置：** `frontend/src/components/layout/sidebar-item.tsx`

#### Props

```typescript
interface SidebarItemProps {
  text: string;            // 菜单项文本
  icon: React.ReactNode;   // 图标
  selected: boolean;       // 是否选中
  onClick: () => void;     // 点击回调
}
```

#### 使用示例

```typescript
<SidebarItem
  text="Feeds"
  icon={<HomeIcon />}
  selected={location.pathname === '/'}
  onClick={() => navigate('/')}
/>
```

---

## 通用组件

### Loading

加载指示器组件。

**位置：** `frontend/src/components/common/loading.tsx`

#### Props

```typescript
interface LoadingProps {
  message?: string;      // 加载文字，默认 'Loading...'
  fullScreen?: boolean;  // 是否全屏，默认 false
}
```

#### 使用示例

```typescript
// 普通加载
<Loading message="Loading articles..." />

// 全屏加载
<Loading message="Initializing..." fullScreen />
```

---

### EmptyState

空状态组件，用于显示无数据时的提示。

**位置：** `frontend/src/components/common/empty-state.tsx`

#### Props

```typescript
interface EmptyStateProps {
  title: string;                     // 标题
  description?: string;              // 描述
  icon?: React.ReactNode;            // 图标
  action?: {                         // 操作按钮
    label: string;
    onClick: () => void;
  };
}
```

#### 使用示例

```typescript
<EmptyState
  title="No articles found"
  description="Try adjusting your filters or add some subscriptions"
  icon={<ArticleIcon sx={{ fontSize: 80 }} />}
  action={{
    label: 'Add Subscription',
    onClick: () => navigate('/subscriptions'),
  }}
/>
```

---

### ConfirmDialog

确认对话框组件。

**位置：** `frontend/src/components/common/confirm-dialog.tsx`

#### Props

```typescript
interface ConfirmDialogProps {
  open: boolean;                                     // 是否打开
  title: string;                                     // 标题
  message: string;                                   // 消息
  onConfirm: () => void;                             // 确认回调
  onCancel: () => void;                              // 取消回调
  confirmText?: string;                              // 确认按钮文字
  cancelText?: string;                               // 取消按钮文字
  confirmColor?: 'primary' | 'secondary' | 'error';  // 确认按钮颜色
}
```

#### 使用示例

```typescript
<ConfirmDialog
  open={showDialog}
  title="Delete Subscription"
  message="Are you sure you want to delete this subscription?"
  onConfirm={handleDelete}
  onCancel={() => setShowDialog(false)}
  confirmText="Delete"
  confirmColor="error"
/>
```

---

### ToastProvider

Toast 提示组件。

**位置：** `frontend/src/components/common/toast-provider.tsx`

#### 使用方法

```typescript
import { useToast } from '../hooks';

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.showToast('Operation successful', 'success');
  };

  const handleError = () => {
    toast.showToast('Operation failed', 'error');
  };

  return (
    <Button onClick={handleSuccess}>Success</Button>
  );
}
```

#### Toast 级别

- `success` - 成功提示（绿色）
- `error` - 错误提示（红色）
- `warning` - 警告提示（橙色）
- `info` - 信息提示（蓝色）

---

## 文章组件

### ArticleCard

文章卡片组件。

**位置：** `frontend/src/components/article/article-card.tsx`

#### Props

```typescript
interface ArticleCardProps {
  article: Article;                           // 文章数据
  onToggleRead: (article: Article) => void;   // 切换已读回调
  onToggleFavorite: (article: Article) => void; // 切换收藏回调
  allArticles?: Article[];                    // 所有文章（用于导航）
  currentIndex?: number;                      // 当前索引
}
```

#### 使用示例

```typescript
<ArticleCard
  article={article}
  onToggleRead={handleToggleRead}
  onToggleFavorite={handleToggleFavorite}
  allArticles={articles}
  currentIndex={index}
/>
```

#### 功能特性

- 显示文章标题、摘要、作者、日期
- 显示订阅来源和状态标签
- 点击卡片跳转到详情页
- 操作按钮：已读/收藏/在新标签页打开

---

### ArticleList

文章列表组件。

**位置：** `frontend/src/components/article/article-list.tsx`

#### Props

```typescript
interface ArticleListProps {
  articles: Article[];                         // 文章列表
  currentPage: number;                         // 当前页
  totalPages: number;                          // 总页数
  onPageChange: (page: number) => void;        // 页码改变回调
  onToggleRead: (article: Article) => void;    // 切换已读回调
  onToggleFavorite: (article: Article) => void; // 切换收藏回调
}
```

#### 使用示例

```typescript
<ArticleList
  articles={articles}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={updateArticles}
  onToggleRead={toggleReadStatus}
  onToggleFavorite={toggleFavoriteStatus}
/>
```

---

### ArticleFilter

文章筛选器组件。

**位置：** `frontend/src/components/article/article-filter.tsx`

#### Props

```typescript
interface ArticleFilterProps {
  searchValue: string;                              // 搜索值
  onSearchChange: (value: string) => void;          // 搜索值改变回调
  onSearch: () => void;                             // 搜索回调
  subscriptions: Subscription[];                    // 订阅列表
  selectedSubscriptions: string[];                  // 选中的订阅
  onSubscriptionChange: (ids: string[]) => void;    // 订阅改变回调
  readFilter: 'all' | 'read' | 'unread';            // 已读筛选
  onReadFilterChange: (filter: ...) => void;        // 已读筛选改变回调
  favoriteFilter: 'all' | 'favorite' | 'unfavorite'; // 收藏筛选
  onFavoriteFilterChange: (filter: ...) => void;    // 收藏筛选改变回调
  onReset: () => void;                              // 重置回调
}
```

#### 使用示例

```typescript
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
```

---

### ArticleSkeleton

文章骨架屏组件。

**位置：** `frontend/src/components/article/article-skeleton.tsx`

#### 使用示例

```typescript
// 单个骨架屏
<ArticleSkeleton />

// 骨架屏列表
<ArticleSkeletonList count={9} />
```

---

### ArticleActions

文章操作按钮组组件。

**位置：** `frontend/src/components/article/article-actions.tsx`

#### Props

```typescript
interface ArticleActionsProps {
  onRefresh: () => void;      // 刷新回调
  onMarkAllRead: () => void;  // 标记全部已读回调
  onCleanup: () => void;      // 清理回调
  loading: boolean;           // 是否加载中
  hasUnread: boolean;         // 是否有未读文章
}
```

#### 使用示例

```typescript
<ArticleActions
  onRefresh={handleRefresh}
  onMarkAllRead={markAllAsRead}
  onCleanup={handleCleanup}
  loading={loading}
  hasUnread={hasUnread}
/>
```

---

### ArticleContent

文章内容渲染组件。

**位置：** `frontend/src/components/article/article-content.tsx`

#### Props

```typescript
interface ArticleContentProps {
  article: Article;  // 文章数据
}
```

#### 使用示例

```typescript
<ArticleContent article={article} />
```

---

### ArticleNavigation

文章导航组件。

**位置：** `frontend/src/components/article/article-navigation.tsx`

#### Props

```typescript
interface ArticleNavigationProps {
  hasNext: boolean;          // 是否有下一篇
  hasPrevious: boolean;      // 是否有上一篇
  onNext?: () => void;       // 下一篇回调
  onPrevious?: () => void;   // 上一篇回调
  currentIndex: number;      // 当前索引
  totalCount: number;        // 总数
}
```

#### 使用示例

```typescript
<ArticleNavigation
  hasNext={currentIndex < articles.length - 1}
  hasPrevious={currentIndex > 0}
  onNext={handleNext}
  onPrevious={handlePrevious}
  currentIndex={currentIndex + 1}
  totalCount={articles.length}
/>
```

---

## 订阅组件

### SubscriptionCard

订阅卡片组件。

**位置：** `frontend/src/components/subscription/subscription-card.tsx`

#### Props

```typescript
interface SubscriptionCardProps {
  subscription: Subscription;                        // 订阅数据
  onEdit: (subscription: Subscription) => void;      // 编辑回调
  onDelete: (subscription: Subscription) => void;    // 删除回调
}
```

#### 使用示例

```typescript
<SubscriptionCard
  subscription={subscription}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

---

### SubscriptionList

订阅列表组件。

**位置：** `frontend/src/components/subscription/subscription-list.tsx`

#### Props

```typescript
interface SubscriptionListProps {
  subscriptions: Subscription[];                      // 订阅列表
  onEdit: (subscription: Subscription) => void;      // 编辑回调
  onDelete: (subscription: Subscription) => void;    // 删除回调
}
```

#### 使用示例

```typescript
<SubscriptionList
  subscriptions={subscriptions}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

---

### SubscriptionForm

订阅表单组件（创建/编辑）。

**位置：** `frontend/src/components/subscription/subscription-form.tsx`

#### Props

```typescript
interface SubscriptionFormProps {
  open: boolean;           // 是否打开
  mode: 'create' | 'edit'; // 模式
  subscription?: Subscription | null;  // 编辑时的订阅数据
  onSubmit: (data: ...) => Promise<boolean>;  // 提交回调
  onCancel: () => void;    // 取消回调
}
```

#### 使用示例

```typescript
<SubscriptionForm
  open={formOpen}
  mode={formMode}
  subscription={selectedSubscription}
  onSubmit={handleFormSubmit}
  onCancel={() => setFormOpen(false)}
/>
```

---

## 🎯 最佳实践

### 1. 组件复用

优先使用通用组件，避免重复代码。

### 2. Props 验证

所有 Props 都应有明确的类型定义。

### 3. 错误处理

组件应处理错误情况，显示友好的错误提示。

### 4. 加载状态

异步操作应显示加载状态。

### 5. 无障碍

为交互元素提供 ARIA 标签。

### 6. 响应式

确保组件在不同屏幕尺寸下正常显示。

---

## 📝 组件开发指南

### 创建新组件

1. 在相应目录创建组件文件
2. 定义 Props 接口
3. 实现组件逻辑
4. 添加导出
5. 编写文档注释

### 组件命名

- 文件名：kebab-case（如 `article-card.tsx`）
- 组件名：PascalCase（如 `ArticleCard`）

### 文件结构

```typescript
// 导入
import { ... } from '...';

// 类型定义
interface Props {
  // ...
}

// 组件实现
export function Component({ ... }: Props) {
  // ...
}

// 导出
export default Component;
```

---

遵循本指南可以确保组件的一致性和可维护性。
