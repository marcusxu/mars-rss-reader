# 前端页面重写 - 总体概览

## 🎯 重写目标

将前端页面重构为现代化、简洁、高性能的 RSS 阅读器应用。

### 设计理念
- **现代简洁** - 扁平化设计，大量留白，清晰的视觉层次
- **卡片式布局** - 文章和订阅以卡片形式展示，信息丰富
- **响应式设计** - 完美适配桌面、平板、手机
- **优秀体验** - 骨架屏、Toast 提示、流畅动画

### 核心功能
- ✅ 固定侧边栏导航（桌面）/ 抽屉式侧边栏（移动端）
- ✅ 文章列表（卡片视图）
- ✅ 文章筛选器（按订阅、分类、状态）
- ✅ 文章详情页（应用内阅读）
- ✅ 订阅管理（卡片式布局）
- ✅ 深色/浅色主题切换
- ✅ Toast 提示系统
- ✅ 骨架屏加载效果

---

## 📁 目标文件结构

```
frontend/src/
├── pages/                          # 页面组件
│   ├── feeds-page.tsx              # [重构] 文章列表页
│   ├── article-detail-page.tsx     # [新增] 文章详情页
│   ├── subscriptions-page.tsx      # [重构] 订阅管理页
│   └── settings-page.tsx           # [新增] 设置页面
├── components/
│   ├── layout/                     # [新增] 布局组件
│   │   ├── app-layout.tsx          # 应用主布局
│   │   ├── sidebar.tsx             # 侧边栏
│   │   ├── header.tsx              # 顶部栏
│   │   └── sidebar-item.tsx        # 侧边栏菜单项
│   ├── article/                    # [新增] 文章相关组件
│   │   ├── article-card.tsx        # 文章卡片
│   │   ├── article-list.tsx        # 文章列表
│   │   ├── article-filter.tsx      # 文章筛选器
│   │   ├── article-skeleton.tsx    # 文章骨架屏
│   │   └── article-actions.tsx     # 文章操作按钮
│   ├── subscription/               # [新增] 订阅相关组件
│   │   ├── subscription-card.tsx   # 订阅卡片
│   │   ├── subscription-list.tsx   # 订阅列表
│   │   └── subscription-form.tsx   # 订阅表单
│   ├── common/                     # [新增] 通用组件
│   │   ├── loading.tsx             # 加载组件
│   │   ├── error-boundary.tsx      # 错误边界
│   │   ├── toast-provider.tsx      # Toast 提供者
│   │   ├── confirm-dialog.tsx      # 确认对话框
│   │   └── empty-state.tsx         # 空状态
│   └── navigator.tsx               # [删除] 旧导航组件
├── theme/                          # [新增] 主题配置
│   ├── theme.ts                    # MUI 主题配置
│   └── theme-provider.tsx          # 主题提供者
├── hooks/                          # [保留 + 新增]
│   ├── use-articles.ts             # [保留] 已重构
│   ├── use-subscriptions.ts        # [保留] 已重构
│   ├── use-toast.ts                # [新增] Toast Hook
│   └── index.ts
├── services/                       # [保留] 已重构完成
├── types/                          # [保留] 已重构完成
├── config/                         # [保留]
├── utils/                          # [保留]
└── main.tsx                        # [重构] 路由配置
```

---

## 🔄 实施阶段（5 个阶段）

### **Phase 1: 基础架构搭建**
**时间：** 1-2 小时
**目标：** 搭建应用的基础架构和通用组件

**主要任务：**
1. 创建主题配置（深色/浅色主题）
2. 创建 Toast 系统
3. 创建布局组件（AppLayout, Sidebar, Header）
4. 创建通用组件（Loading, EmptyState, ConfirmDialog）
5. 重构路由配置

**验证：**
- 应用能正常启动
- 布局组件正常显示
- Toast 系统工作正常
- 主题切换功能正常

---

### **Phase 2: 文章列表页重构**
**时间：** 2-3 小时
**目标：** 重构文章列表页，使用卡片视图和侧边栏布局

**主要任务：**
1. 创建文章卡片组件（ArticleCard）
2. 创建文章列表组件（ArticleList）
3. 创建文章筛选器组件（ArticleFilter）
4. 创建文章骨架屏组件（ArticleSkeleton）
5. 创建文章操作按钮组件（ArticleActions）
6. 重构 FeedsPage

**验证：**
- 文章列表正常显示
- 文章卡片视图正常
- 筛选功能正常
- 分页功能正常
- 操作按钮正常
- 骨架屏加载正常

---

### **Phase 3: 文章详情页实现**
**时间：** 1-2 小时
**目标：** 实现文章详情页，支持应用内阅读

**主要任务：**
1. 创建文章详情页（ArticleDetailPage）
2. 创建文章内容渲染组件（ArticleContent）
3. 创建文章导航组件（ArticleNavigation）
4. 更新路由配置

**验证：**
- 点击文章标题跳转到详情页
- 文章内容正常显示
- 文章导航正常
- 返回按钮正常

---

### **Phase 4: 订阅管理页重构**
**时间：** 2-3 小时
**目标：** 重构订阅管理页，使用卡片式布局

**主要任务：**
1. 创建订阅卡片组件（SubscriptionCard）
2. 创建订阅列表组件（SubscriptionList）
3. 创建订阅表单组件（SubscriptionForm）
4. 重构 SubscriptionsPage

**验证：**
- 订阅列表正常显示
- 创建订阅功能正常
- 编辑订阅功能正常
- 删除订阅功能正常

---

### **Phase 5: 设置页面和优化**
**时间：** 1-2 小时
**目标：** 实现设置页面，完善响应式设计和性能优化

**主要任务：**
1. 创建设置页面（SettingsPage）
2. 实现主题切换
3. 完善响应式设计
4. 添加性能优化
5. 删除旧文件

**验证：**
- 设置页面正常显示
- 主题切换正常
- 响应式设计正常
- 性能优化生效

---

## 📊 阶段依赖关系

```
Phase 1: 基础架构
   ↓
   ├─→ Phase 2: 文章列表页
   ├─→ Phase 3: 文章详情页
   └─→ Phase 4: 订阅管理页
          ↓
      Phase 5: 设置和优化
```

**说明：**
- Phase 2、3、4 都依赖 Phase 1，可以并行执行
- Phase 5 依赖所有前置阶段

---

## 🎨 设计规范

### 页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | FeedsPage | 文章列表页（默认） |
| `/article/:id` | ArticleDetailPage | 文章详情页 |
| `/subscriptions` | SubscriptionsPage | 订阅管理页 |
| `/settings` | SettingsPage | 设置页面 |

### 颜色方案

**浅色主题：**
- 主色：#1976d2（蓝色）
- 背景：#fafafa（浅灰）
- 卡片背景：#ffffff（白色）
- 文字：#212121（深灰）
- 次要文字：#757575（中灰）

**深色主题：**
- 主色：#90caf9（浅蓝）
- 背景：#121212（深灰）
- 卡片背景：#1e1e1e（浅黑）
- 文字：#ffffff（白色）
- 次要文字：#b0b0b0（浅灰）

### 间距规范

| 名称 | 大小 | 用途 |
|------|------|------|
| xs | 4px | 极小间距 |
| sm | 8px | 小间距 |
| md | 16px | 中等间距 |
| lg | 24px | 大间距 |
| xl | 32px | 极大间距 |

### 响应式断点

| 名称 | 范围 | 设备 |
|------|------|------|
| xs | 0-599px | 手机 |
| sm | 600-899px | 平板竖屏 |
| md | 900-1199px | 平板横屏 |
| lg | 1200-1535px | 桌面 |
| xl | 1536px+ | 大屏 |

---

## 🛠️ 技术栈

- **框架：** React 18.3.1
- **UI 库：** Material-UI v6.4.8
- **图标：** Material Icons v6.4.8
- **路由：** React Router v7.0.1
- **HTTP 客户端：** Axios v1.7.8
- **构建工具：** Vite v6.0.1
- **语言：** TypeScript 5.6.2

---

## ✅ 成功标准

完成后，应用应该满足：

### 视觉效果
- ✅ 现代简洁的界面设计
- ✅ 卡片式文章展示
- ✅ 流畅的动画过渡
- ✅ 完美的响应式布局

### 功能完整
- ✅ 文章列表展示（分页）
- ✅ 文章搜索和筛选
- ✅ 文章详情阅读
- ✅ 订阅管理（CRUD）
- ✅ 深色/浅色主题切换

### 用户体验
- ✅ 骨架屏加载效果
- ✅ Toast 提示反馈
- ✅ 确认对话框
- ✅ 平滑的页面切换
- ✅ 直观的导航

### 性能优化
- ✅ 虚拟滚动（文章列表）
- ✅ 图片懒加载
- ✅ 组件懒加载
- ✅ 合理的状态管理

---

## 📚 相关文档

- [Phase 1: 基础架构搭建](./01-phase-1-infrastructure.md)
- [Phase 2: 文章列表页重构](./02-phase-2-feeds-page.md)
- [Phase 3: 文章详情页实现](./03-phase-3-article-detail.md)
- [Phase 4: 订阅管理页重构](./04-phase-4-subscriptions-page.md)
- [Phase 5: 设置和优化](./05-phase-5-settings-and-optimization.md)
- [设计系统](./design-system.md)
- [组件指南](./component-guide.md)

---

## 🚀 开始执行

按顺序执行以下文档：
1. [Phase 1: 基础架构搭建](./01-phase-1-infrastructure.md) - 必须首先执行
2. Phase 2-4 可以并行执行
3. [Phase 5: 设置和优化](./05-phase-5-settings-and-optimization.md) - 最后执行
