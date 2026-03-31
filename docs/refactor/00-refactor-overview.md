# 前端服务层重构 - 总体概览

## 📋 重构背景

当前前端代码存在以下问题：
- 类型定义重复且不一致
- API 调用逻辑分散在组件和 hook 中
- 缺少统一的错误处理机制
- Feed 相关操作混杂在 Article Service 中
- 缺少对后端 API 的完整支持（如 Search API、订阅更新等）

## 🎯 重构目标

1. **类型安全** - 建立完整的类型系统，与后端 DTO 保持一致
2. **代码复用** - 统一的 API 客户端和错误处理
3. **职责清晰** - Service 层职责明确，Feed Service 独立
4. **易于维护** - 清晰的代码组织，易于扩展和测试
5. **功能完整** - 支持所有后端 API，包括 Search 和订阅更新

## 📊 后端 API 结构总结

### Articles API (`/articles`)
- `GET /articles` - 分页获取文章，支持过滤
- `GET /articles/search` - 搜索文章
- `GET /articles/:id` - 获取单个文章
- `PATCH /articles/:id` - 更新单个文章（isRead, isFavorite）
- `PATCH /articles/batch-update` - 批量更新文章

### Subscriptions API (`/subscriptions`)
- `GET /subscriptions` - 分页获取订阅列表
- `POST /subscriptions` - 创建订阅
- `PATCH /subscriptions/:id` - 更新订阅
- `DELETE /subscriptions/:id` - 删除订阅

### Feeds API (`/feeds`)
- `PATCH /feeds/update/:id` - 更新指定订阅的文章
- `PATCH /feeds/cleanup/:id` - 清理指定订阅的文章
- `PATCH /feeds/update-all` - 更新所有订阅的文章
- `PATCH /feeds/cleanup-all` - 清理所有订阅的文章

## 🔄 执行流程图

```
Phase 1: 类型定义层
   ↓
Phase 2: 基础设施层 (api-client, error-handler)
   ↓
Phase 3: 服务层 (article-service, subscription-service, feed-service)
   ↓
Phase 4: Hooks 层 (use-articles, use-subscriptions)
   ↓
Phase 5: 清理和迁移 (删除旧文件，更新导入)
```

## 📁 文件结构对比

### 重构前
```
frontend/src/
├── types/
│   └── article-type.ts                 # 单一类型文件
├── services/
│   ├── article-service.ts              # 包含 Feed 操作
│   └── subscription-service.ts         # 错误处理不统一
├── hooks/
│   └── use-articles.ts                 # 未使用的状态
└── pages/
    ├── feeds-page.tsx
    └── subscriptions-page.tsx
```

### 重构后
```
frontend/src/
├── types/
│   ├── pagination.types.ts             # [新增] 分页类型
│   ├── subscription.types.ts           # [新增] 订阅类型
│   ├── article.types.ts                # [新增] 文章类型
│   ├── feed.types.ts                   # [新增] Feed 类型
│   ├── api-error.types.ts              # [新增] API 错误类型
│   └── index.ts                        # [新增] 统一导出
├── services/
│   ├── api-client.ts                   # [新增] 统一 Axios 实例
│   ├── error-handler.ts                # [新增] 统一错误处理
│   ├── article-service.ts              # [重构] 使用新架构
│   ├── subscription-service.ts         # [重构] 使用新架构
│   ├── feed-service.ts                 # [新增] Feed 操作独立
│   └── index.ts                        # [新增] 统一导出
├── hooks/
│   ├── use-articles.ts                 # [重构] 使用新 Service
│   ├── use-subscriptions.ts            # [新增] 订阅管理
│   └── index.ts                        # [新增] 统一导出
└── pages/
    ├── feeds-page.tsx                  # [更新] 使用新 Hook
    └── subscriptions-page.tsx          # [更新] 使用新 Hook
```

## 🛠️ 技术栈和工具

- **TypeScript** - 类型安全
- **Axios** - HTTP 客户端
- **React Hooks** - 状态管理
- **ESLint** - 代码质量检查
- **Vite** - 构建工具

## ⚠️ 注意事项和风险控制

### 依赖关系
- **严格按阶段执行** - 每个阶段依赖前一阶段的成果
- **不要跳过阶段** - 可能导致类型错误或编译失败

### 向后兼容
- **一次性废弃** - Phase 5 将删除所有旧文件
- **无需桥接** - 直接替换，不保留旧代码

### 验证策略
- **每个阶段完成后立即验证**
- **TypeScript 编译检查** - 确保类型正确
- **ESLint 检查** - 确保代码质量
- **功能测试** - 确保业务逻辑正确

### 风险控制
- **Phase 1-2** - 无业务影响，仅添加新文件
- **Phase 3-4** - 新旧代码共存，不影响现有功能
- **Phase 5** - 删除旧代码，需要仔细测试

## 📚 相关文档

- [01-phase-1-types.md](./01-phase-1-types.md) - 第 1 阶段：类型定义
- [02-phase-2-infrastructure.md](./02-phase-2-infrastructure.md) - 第 2 阶段：基础设施
- [03-phase-3-services.md](./03-phase-3-services.md) - 第 3 阶段：服务层
- [04-phase-4-hooks.md](./04-phase-4-hooks.md) - 第 4 阶段：Hooks 层
- [05-phase-5-cleanup.md](./05-phase-5-cleanup.md) - 第 5 阶段：清理和迁移
- [api-mapping.md](./api-mapping.md) - API 映射表
- [migration-guide.md](./migration-guide.md) - 迁移指南
- [best-practices.md](./best-practices.md) - 最佳实践

## ✅ 重构收益

1. ✅ 统一的类型定义，与后端 DTO 完全对应
2. ✅ 统一的 API 客户端和错误处理
3. ✅ Feed Service 独立，职责清晰
4. ✅ 支持 Search API 专用端点
5. ✅ 实现订阅更新功能
6. ✅ 所有 API 都有完整的类型支持
7. ✅ 统一的错误处理机制
8. ✅ 易于扩展和测试
