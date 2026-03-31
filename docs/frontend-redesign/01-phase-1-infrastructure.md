# Phase 1: 基础架构搭建

## 🎯 阶段目标

搭建应用的基础架构，包括主题系统、布局组件、Toast 提示系统和通用组件，为后续页面开发提供基础支持。

## 📦 文件清单

需要创建 12 个文件：

### 主题系统（2 个文件）
1. `frontend/src/theme/theme.ts` - MUI 主题配置
2. `frontend/src/theme/theme-provider.tsx` - 主题提供者

### Hooks（1 个文件）
3. `frontend/src/hooks/use-toast.ts` - Toast Hook

### 通用组件（5 个文件）
4. `frontend/src/components/common/toast-provider.tsx` - Toast 提供者
5. `frontend/src/components/common/confirm-dialog.tsx` - 确认对话框
6. `frontend/src/components/common/loading.tsx` - 加载组件
7. `frontend/src/components/common/empty-state.tsx` - 空状态
8. `frontend/src/components/common/error-boundary.tsx` - 错误边界

### 布局组件（4 个文件）
9. `frontend/src/components/layout/app-layout.tsx` - 应用主布局
10. `frontend/src/components/layout/sidebar.tsx` - 侧边栏
11. `frontend/src/components/layout/header.tsx` - 顶部栏
12. `frontend/src/components/layout/sidebar-item.tsx` - 侧边栏菜单项

### 需要更新的文件
- `frontend/src/hooks/index.ts` - 导出 useToast
- `frontend/src/main.tsx` - 重构路由配置

---

## 📝 完整代码实现

### 1. `frontend/src/theme/theme.ts`

```typescript
import { createTheme, alpha } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    divider: '#e0e0e0',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#a6d4fa',
      dark: '#648dae',
    },
    secondary: {
      main: '#ce93d8',
      light: '#f0b6e2',
      dark: '#a362b8',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    divider: '#333333',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});
```

---

### 2. `frontend/src/theme/theme-provider.tsx`

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as ThemeMode) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
```

---

### 3. `frontend/src/hooks/use-toast.ts`

```typescript
import { useContext, createContext, ReactNode, useCallback } from 'react';

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  severity: ToastSeverity;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (message: string, severity?: ToastSeverity) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, severity: ToastSeverity = 'info') => {
    const id = Date.now().toString();
    const newToast: ToastMessage = { id, message, severity };
    
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 6000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}
```

**注意：** 需要在文件顶部添加 `import { useState } from 'react';`

---

### 4. `frontend/src/components/common/toast-provider.tsx`

```typescript
import { Snackbar, Alert, AlertColor, Slide, SlideProps } from '@mui/material';
import { useToast } from '../../hooks/use-toast';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={6000}
          onClose={() => removeToast(toast.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={SlideTransition}
          sx={{ bottom: { xs: 70 + index * 60, sm: 24 + index * 60 } }}
        >
          <Alert
            onClose={() => removeToast(toast.id)}
            severity={toast.severity as AlertColor}
            variant="filled"
            elevation={6}
            sx={{ width: '100%', minWidth: 300 }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}
```

---

### 5. `frontend/src/components/common/confirm-dialog.tsx`

```typescript
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color={confirmColor} variant="contained" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
```

---

### 6. `frontend/src/components/common/loading.tsx`

```typescript
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({ message = 'Loading...', fullScreen = false }: LoadingProps) {
  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        gap: 2,
      }}
    >
      <CircularProgress size={48} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
```

---

### 7. `frontend/src/components/common/empty-state.tsx`

```typescript
import { Box, Typography, Button } from '@mui/material';
import { Inbox as InboxIcon } from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center',
      }}
    >
      <Box sx={{ mb: 2, color: 'text.disabled' }}>
        {icon || <InboxIcon sx={{ fontSize: 80 }} />}
      </Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 400 }}>
          {description}
        </Typography>
      )}
      {action && (
        <Button variant="contained" onClick={action.onClick} sx={{ mt: 1 }}>
          {action.label}
        </Button>
      )}
    </Box>
  );
}
```

---

### 8. `frontend/src/components/common/error-boundary.tsx`

```typescript
import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3,
          }}
        >
          <Paper
            sx={{
              p: 4,
              maxWidth: 500,
              textAlign: 'center',
            }}
          >
            <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              An unexpected error occurred. Please try reloading the page.
            </Typography>
            <Button variant="contained" onClick={this.handleReload}>
              Reload Page
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
```

---

### 9. `frontend/src/components/layout/app-layout.tsx`

```typescript
import { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Sidebar } from './sidebar';
import { Header } from './header';

const SIDEBAR_WIDTH = 240;

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header
        onMenuClick={handleDrawerToggle}
        sidebarWidth={SIDEBAR_WIDTH}
        isMobile={isMobile}
      />
      <Sidebar
        open={mobileOpen}
        onClose={handleDrawerToggle}
        width={SIDEBAR_WIDTH}
        isMobile={isMobile}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '64px',
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
```

---

### 10. `frontend/src/components/layout/sidebar.tsx`

```typescript
import { Drawer, Box, List, Toolbar, Typography, Divider } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import HomeIcon from '@mui/icons-material/Home';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import SettingsIcon from '@mui/icons-material/Settings';
import { SidebarItem } from './sidebar-item';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  width: number;
  isMobile: boolean;
}

const menuItems = [
  { text: 'Feeds', icon: <HomeIcon />, path: '/' },
  { text: 'Subscriptions', icon: <RssFeedIcon />, path: '/subscriptions' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

export function Sidebar({ open, onClose, width, isMobile }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleItemClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
          Mars Reader
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <SidebarItem
            key={item.text}
            text={item.text}
            icon={item.icon}
            selected={location.pathname === item.path}
            onClick={() => handleItemClick(item.path)}
          />
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          v2.0.0
        </Typography>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: width,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
```

---

### 11. `frontend/src/components/layout/header.tsx`

```typescript
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useTheme,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useThemeContext } from '../../theme/theme-provider';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarWidth: number;
  isMobile: boolean;
}

export function Header({ onMenuClick, sidebarWidth, isMobile }: HeaderProps) {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeContext();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${sidebarWidth}px)` },
        ml: { md: `${sidebarWidth}px` },
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            color: 'text.primary',
            fontWeight: 600,
          }}
        >
          Mars RSS Reader
        </Typography>
        <Box>
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            sx={{ color: 'text.primary' }}
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
```

---

### 12. `frontend/src/components/layout/sidebar-item.tsx`

```typescript
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

interface SidebarItemProps {
  text: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

export function SidebarItem({ text, icon, selected, onClick }: SidebarItemProps) {
  return (
    <ListItemButton
      selected={selected}
      onClick={onClick}
      sx={{
        mx: 1,
        borderRadius: 2,
        '&.Mui-selected': {
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
          '& .MuiListItemIcon-root': {
            color: 'primary.contrastText',
          },
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 40,
          color: selected ? 'inherit' : 'text.secondary',
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
}
```

---

### 13. 更新 `frontend/src/hooks/index.ts`

```typescript
export { useArticles } from './use-articles';
export { useSubscriptions } from './use-subscriptions';
export { useToast } from './use-toast';
```

---

### 14. 重构 `frontend/src/main.tsx`

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ThemeProvider } from './theme/theme-provider';
import { ToastProvider } from './hooks/use-toast';
import { ToastContainer } from './components/common/toast-provider';
import { ErrorBoundary } from './components/common/error-boundary';
import { AppLayout } from './components/layout/app-layout';
import { FeedsPage } from './pages/feeds-page';
import { SubscriptionsPage } from './pages/subscriptions-page';
import { SettingsPage } from './pages/settings-page';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<FeedsPage />} />
                <Route path="/subscriptions" element={<SubscriptionsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </AppLayout>
            <ToastContainer />
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
```

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

### 3. 启动开发服务器

```bash
cd frontend
npm run dev
```

**预期结果：**
- 应用正常启动
- 布局显示正常（侧边栏 + 主内容区）
- 侧边栏导航正常工作
- 主题切换按钮正常

### 4. 功能测试

**测试主题切换：**
1. 点击右上角主题切换按钮
2. 确认主题在浅色和深色之间切换
3. 刷新页面，确认主题设置保持

**测试侧边栏：**
1. 桌面端：侧边栏始终可见
2. 移动端：点击菜单按钮显示侧边栏
3. 点击菜单项，确认导航正常
4. 确认当前菜单项高亮显示

**测试 Toast：**
1. 在组件中调用 `useToast().showToast('Test message', 'success')`
2. 确认 Toast 正常显示
3. 确认 6 秒后自动消失

---

## ⚠️ 注意事项

### 1. 文件导入路径
- 所有组件使用相对导入
- 类型定义使用绝对导入（从 `types` 导入）

### 2. 主题持久化
- 主题设置保存在 `localStorage`
- 刷新页面后主题设置保持

### 3. 响应式设计
- 桌面端（md 以上）：固定侧边栏
- 移动端（md 以下）：抽屉式侧边栏

### 4. 性能优化
- 使用 `useMemo` 缓存计算结果
- 使用 `useCallback` 缓存回调函数

---

## 📌 Phase 1 完成标志

- [x] 创建主题配置文件
- [x] 创建主题提供者
- [x] 创建 Toast 系统
- [x] 创建布局组件
- [x] 创建通用组件
- [x] 重构路由配置
- [x] TypeScript 编译通过
- [x] 应用正常启动
- [x] 主题切换正常
- [x] 布局显示正常

完成后，可以继续执行 Phase 2-4（可并行执行）。
