# 设计系统

本文档定义了 Mars RSS Reader 的设计系统，包括颜色、排版、间距、组件规范等。

## 🎨 颜色系统

### 浅色主题

#### 主色（Primary）
- **Primary Main**: `#1976d2` - 主要按钮、链接、选中状态
- **Primary Light**: `#42a5f5` - Hover 状态
- **Primary Dark**: `#1565c0` - Active 状态

#### 次要色（Secondary）
- **Secondary Main**: `#9c27b0` - 次要按钮、特殊标记
- **Secondary Light**: `#ba68c8` - Hover 状态
- **Secondary Dark**: `#7b1fa2` - Active 状态

#### 背景色（Background）
- **Default**: `#fafafa` - 页面背景
- **Paper**: `#ffffff` - 卡片背景

#### 文字色（Text）
- **Primary**: `#212121` - 主要文字
- **Secondary**: `#757575` - 次要文字、说明文字

#### 辅助色
- **Error**: `#d32f2f` - 错误提示
- **Warning**: `#ed6c02` - 警告提示
- **Info**: `#0288d1` - 信息提示
- **Success**: `#2e7d32` - 成功提示

---

### 深色主题

#### 主色（Primary）
- **Primary Main**: `#90caf9` - 主要按钮、链接、选中状态
- **Primary Light**: `#a6d4fa` - Hover 状态
- **Primary Dark**: `#648dae` - Active 状态

#### 次要色（Secondary）
- **Secondary Main**: `#ce93d8` - 次要按钮、特殊标记
- **Secondary Light**: `#f0b6e2` - Hover 状态
- **Secondary Dark**: `#a362b8` - Active 状态

#### 背景色（Background）
- **Default**: `#121212` - 页面背景
- **Paper**: `#1e1e1e` - 卡片背景

#### 文字色（Text）
- **Primary**: `#ffffff` - 主要文字
- **Secondary**: `#b0b0b0` - 次要文字、说明文字

---

## 📐 排版系统

### 字体家族

```css
font-family: "Roboto", "Helvetica", "Arial", sans-serif;
```

### 字体大小

| 名称 | 大小 | 行高 | 用途 |
|------|------|------|------|
| h1 | 2.5rem | 1.2 | 页面标题 |
| h2 | 2rem | 1.3 | 区块标题 |
| h3 | 1.75rem | 1.3 | 子标题 |
| h4 | 1.5rem | 1.4 | 卡片标题 |
| h5 | 1.25rem | 1.5 | 小标题 |
| h6 | 1rem | 1.5 | 最小标题 |
| body1 | 1rem | 1.5 | 正文 |
| body2 | 0.875rem | 1.43 | 辅助文字 |
| caption | 0.75rem | 1.5 | 说明文字 |
| button | 0.875rem | 1.75 | 按钮文字 |

### 字重

- **Regular**: 400 - 正文、说明文字
- **Medium**: 500 - 标题、强调文字
- **Bold**: 700 - 未读文章标题

---

## 📏 间距系统

### 基础单位

基础单位为 `4px`，所有间距都是 4 的倍数。

### 间距级别

| 名称 | 大小 | 用途 |
|------|------|------|
| xs | 4px | 极小间距，紧凑元素间 |
| sm | 8px | 小间距，相关元素间 |
| md | 16px | 中等间距，默认间距 |
| lg | 24px | 大间距，区块间 |
| xl | 32px | 极大间距，分隔明显区块 |

### 使用示例

```typescript
// Box 组件内边距
<Box sx={{ p: 2 }}>  // 16px padding

// Grid 间距
<Grid container spacing={3}>  // 24px gap

// 组件间距
<Box sx={{ mb: 2 }}>  // 16px margin-bottom
```

---

## 🔲 圆角系统

| 名称 | 大小 | 用途 |
|------|------|------|
| none | 0px | 无圆角 |
| sm | 4px | 小圆角，Chip |
| md | 8px | 中等圆角，Button |
| lg | 12px | 大圆角，Card |
| xl | 16px | 极大圆角，Dialog |
| full | 50% | 圆形，Avatar |

---

## 📐 布局系统

### 断点

| 名称 | 范围 | 设备 |
|------|------|------|
| xs | 0-599px | 手机竖屏 |
| sm | 600-899px | 手机横屏/平板竖屏 |
| md | 900-1199px | 平板横屏 |
| lg | 1200-1535px | 桌面 |
| xl | 1536px+ | 大屏 |

### Grid 系统

使用 MUI Grid 组件，12 列布局。

```typescript
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={4}>
    {/* 内容 */}
  </Grid>
</Grid>
```

### 容器宽度

- **xs**: 100%
- **sm**: 600px
- **md**: 960px
- **lg**: 1280px
- **xl**: 1920px

---

## 🎭 阴影系统

### 阴影层级

```typescript
// 卡片默认阴影
boxShadow: '0 2px 8px rgba(0,0,0,0.08)'

// 卡片 Hover 阴影
boxShadow: '0 4px 16px rgba(0,0,0,0.12)'

// 深色主题卡片默认阴影
boxShadow: '0 2px 8px rgba(0,0,0,0.3)'

// 深色主题卡片 Hover 阴影
boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
```

---

## 🎬 动画系统

### 过渡时间

| 名称 | 时间 | 用途 |
|------|------|------|
| fast | 150ms | 快速过渡，hover 状态 |
| normal | 300ms | 正常过渡，展开/收起 |
| slow | 500ms | 慢速过渡，页面切换 |

### 缓动函数

```css
/* 默认缓动 */
transition-timing-function: ease-in-out;

/* 弹性缓动 */
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
```

### 使用示例

```typescript
<Box sx={{
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}}>
```

---

## 🧩 组件规范

### Button

**尺寸：**
- Small: height 32px, padding 8px 16px
- Medium: height 36px, padding 8px 22px
- Large: height 42px, padding 11px 22px

**样式：**
- 文字转换：无（`textTransform: 'none'`）
- 圆角：8px
- 最小宽度：64px

### Card

**样式：**
- 圆角：12px
- 内边距：16px
- 阴影：默认 `0 2px 8px`
- Hover 阴影：`0 4px 16px`

### Chip

**样式：**
- 圆角：8px
- 高度：24px (small), 32px (medium)

### TextField

**样式：**
- 高度：40px (small), 56px (medium)
- 圆角：4px

---

## 🖼️ 图标系统

### 图标尺寸

| 名称 | 大小 | 用途 |
|------|------|------|
| inherit | 继承 | 跟随文字大小 |
| small | 20px | 小图标，按钮内 |
| medium | 24px | 默认图标 |
| large | 35px | 大图标，强调 |

### 图标颜色

- **Primary**: 主色
- **Secondary**: 次要色
- **Action**: 交互色
- **Disabled**: 禁用色
- **Error**: 错误色

---

## 🌓 主题切换

### 主题模式

- **Light**: 浅色主题
- **Dark**: 深色主题
- **System**: 跟随系统（可选）

### 实现方式

使用 `localStorage` 保存主题设置：

```typescript
localStorage.setItem('themeMode', 'dark');
const mode = localStorage.getItem('themeMode');
```

使用 Media Query 检测系统主题：

```typescript
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const isDark = mediaQuery.matches;
```

---

## 📱 响应式设计原则

### 移动优先

从移动端开始设计，逐步增强到桌面端。

### 触摸友好

- 最小触摸目标：48x48px
- 按钮间距：8px 以上
- 文字大小：16px 以上（避免 iOS 缩放）

### 内容优先

- 移动端隐藏次要信息
- 使用折叠/展开
- 简化导航

---

## 🎯 无障碍设计

### 对比度

- 文字对比度：至少 4.5:1
- 大文字对比度：至少 3:1

### 焦点指示器

```css
outline: 2px solid primary.main;
outline-offset: 2px;
```

### ARIA 标签

所有交互元素都应提供可访问的标签：

```typescript
<IconButton aria-label="delete">
  <DeleteIcon />
</IconButton>
```

---

## 📝 使用指南

### 如何使用设计系统

1. **引用颜色**：使用主题提供的颜色，不要硬编码
2. **使用间距**：使用基础单位（4px）的倍数
3. **遵循排版**：使用预定义的字体大小和字重
4. **保持一致**：在整个应用中保持一致的样式

### 代码示例

```typescript
import { useTheme } from '@mui/material';

function MyComponent() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        p: 2,
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <Typography variant="h4">
        Title
      </Typography>
    </Box>
  );
}
```

---

设计系统是保证应用一致性和可维护性的基础，所有开发者都应遵循这些规范。
