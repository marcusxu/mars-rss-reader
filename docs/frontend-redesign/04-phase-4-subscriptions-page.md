# Phase 4: 订阅管理页重构

## 🎯 阶段目标

重构订阅管理页，使用卡片式布局展示订阅，提供友好的创建、编辑、删除功能。

## 📦 文件清单

需要创建 3 个文件，重构 1 个文件：

### 新增组件（3 个文件）
1. `frontend/src/components/subscription/subscription-card.tsx` - 订阅卡片
2. `frontend/src/components/subscription/subscription-list.tsx` - 订阅列表
3. `frontend/src/components/subscription/subscription-form.tsx` - 订阅表单（创建/编辑）

### 重构页面（1 个文件）
4. `frontend/src/pages/subscriptions-page.tsx` - 订阅管理页

**依赖：** Phase 1 已完成（基础架构）

---

## 📝 完整代码实现

### 1. `frontend/src/components/subscription/subscription-card.tsx`

```typescript
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  RssFeed as RssFeedIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { Subscription } from '../../types';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
}

export function SubscriptionCard({ subscription, onEdit, onDelete }: SubscriptionCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(subscription);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(subscription);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <RssFeedIcon
            sx={{
              fontSize: 40,
              color: 'primary.main',
              mr: 2,
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {subscription.name}
            </Typography>
            {subscription.category && (
              <Chip
                label={subscription.category}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {subscription.description || 'No description'}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {subscription.url}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Tooltip title="Open feed URL">
          <IconButton
            size="small"
            href={subscription.url}
            target="_blank"
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <IconButton size="small" onClick={handleMenuOpen}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </CardActions>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
}
```

---

### 2. `frontend/src/components/subscription/subscription-list.tsx`

```typescript
import { Box, Grid, Typography } from '@mui/material';
import { Subscription } from '../../types';
import { SubscriptionCard } from './subscription-card';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
}

export function SubscriptionList({
  subscriptions,
  onEdit,
  onDelete,
}: SubscriptionListProps) {
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
        {subscriptions.length} subscription{subscriptions.length !== 1 ? 's' : ''}
      </Typography>

      <Grid container spacing={3}>
        {subscriptions.map((subscription) => (
          <Grid item xs={12} sm={6} md={4} key={subscription.id}>
            <SubscriptionCard
              subscription={subscription}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
```

---

### 3. `frontend/src/components/subscription/subscription-form.tsx`

```typescript
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  InputAdornment,
  Alert,
} from '@mui/material';
import { Link as LinkIcon } from '@mui/icons-material';
import { Subscription, CreateSubscriptionRequest, UpdateSubscriptionRequest } from '../../types';

interface SubscriptionFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  subscription?: Subscription | null;
  onSubmit: (data: CreateSubscriptionRequest | UpdateSubscriptionRequest) => Promise<boolean>;
  onCancel: () => void;
}

export function SubscriptionForm({
  open,
  mode,
  subscription,
  onSubmit,
  onCancel,
}: SubscriptionFormProps) {
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    description: '',
    category: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && subscription) {
      setFormData({
        url: subscription.url,
        name: subscription.name,
        description: subscription.description || '',
        category: subscription.category || '',
      });
    } else if (mode === 'create') {
      setFormData({
        url: '',
        name: '',
        description: '',
        category: '',
      });
    }
    setErrors({});
  }, [mode, subscription, open]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    const data = {
      url: formData.url,
      name: formData.name,
      description: formData.description || undefined,
      category: formData.category || undefined,
    };

    const success = await onSubmit(data);
    setLoading(false);

    if (success) {
      onCancel();
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Add Subscription' : 'Edit Subscription'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Feed URL"
              required
              value={formData.url}
              onChange={handleChange('url')}
              error={!!errors.url}
              helperText={errors.url}
              disabled={mode === 'edit'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              required
              value={formData.name}
              onChange={handleChange('name')}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange('description')}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Category"
              value={formData.category}
              onChange={handleChange('category')}
            />
          </Grid>
        </Grid>

        {mode === 'edit' && (
          <Alert severity="info" sx={{ mt: 2 }}>
            URL cannot be changed after creation
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {mode === 'create' ? 'Add' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
```

---

### 4. 重构 `frontend/src/pages/subscriptions-page.tsx`

```typescript
import { useState } from 'react';
import { Box, Typography, Button, Skeleton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useSubscriptions, useToast } from '../hooks';
import { SubscriptionList } from '../components/subscription/subscription-list';
import { SubscriptionForm } from '../components/subscription/subscription-form';
import { EmptyState } from '../components/common/empty-state';
import { ConfirmDialog } from '../components/common/confirm-dialog';
import { Loading } from '../components/common/loading';
import { Subscription, CreateSubscriptionRequest, UpdateSubscriptionRequest } from '../types';
import RssFeedIcon from '@mui/icons-material/RssFeed';

export function SubscriptionsPage() {
  const toast = useToast();
  const {
    loading,
    subscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  } = useSubscriptions();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<Subscription | null>(null);

  const handleCreateClick = () => {
    setFormMode('create');
    setSelectedSubscription(null);
    setFormOpen(true);
  };

  const handleEditClick = (subscription: Subscription) => {
    setFormMode('edit');
    setSelectedSubscription(subscription);
    setFormOpen(true);
  };

  const handleDeleteClick = (subscription: Subscription) => {
    setSubscriptionToDelete(subscription);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: CreateSubscriptionRequest | UpdateSubscriptionRequest) => {
    let result;

    if (formMode === 'create') {
      result = await createSubscription(data as CreateSubscriptionRequest);
      if (result.success) {
        toast.showToast('Subscription added successfully', 'success');
      } else {
        toast.showToast(result.error?.message || 'Failed to add subscription', 'error');
      }
    } else {
      result = await updateSubscription(
        selectedSubscription!.id,
        data as UpdateSubscriptionRequest
      );
      if (result.success) {
        toast.showToast('Subscription updated successfully', 'success');
      } else {
        toast.showToast(result.error?.message || 'Failed to update subscription', 'error');
      }
    }

    return result.success;
  };

  const handleConfirmDelete = async () => {
    if (!subscriptionToDelete) return;

    const result = await deleteSubscription(subscriptionToDelete.id);
    setDeleteDialogOpen(false);
    setSubscriptionToDelete(null);

    if (result.success) {
      toast.showToast('Subscription deleted successfully', 'success');
    } else {
      toast.showToast(result.error?.message || 'Failed to delete subscription', 'error');
    }
  };

  if (loading) {
    return <Loading message="Loading subscriptions..." />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Subscriptions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Add Subscription
        </Button>
      </Box>

      {subscriptions.length === 0 ? (
        <EmptyState
          title="No subscriptions yet"
          description="Add your first RSS feed to start reading"
          icon={<RssFeedIcon sx={{ fontSize: 80 }} />}
          action={{
            label: 'Add Subscription',
            onClick: handleCreateClick,
          }}
        />
      ) : (
        <SubscriptionList
          subscriptions={subscriptions}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      <SubscriptionForm
        open={formOpen}
        mode={formMode}
        subscription={selectedSubscription}
        onSubmit={handleFormSubmit}
        onCancel={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Subscription"
        message={`Are you sure you want to delete "${subscriptionToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSubscriptionToDelete(null);
        }}
        confirmText="Delete"
        confirmColor="error"
      />
    </Box>
  );
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

### 2. 启动开发服务器

```bash
cd frontend
npm run dev
```

### 3. 功能测试

**测试订阅列表显示：**
- [ ] 订阅列表正常加载
- [ ] 订阅卡片正常显示
- [ ] 卡片布局响应式正常

**测试创建订阅：**
- [ ] 点击"Add Subscription"按钮打开表单
- [ ] 表单验证正常（URL格式、必填项）
- [ ] 创建成功后列表更新
- [ ] Toast 提示显示

**测试编辑订阅：**
- [ ] 点击卡片菜单中的"Edit"
- [ ] 表单预填充数据
- [ ] URL 字段禁用
- [ ] 编辑成功后列表更新
- [ ] Toast 提示显示

**测试删除订阅：**
- [ ] 点击卡片菜单中的"Delete"
- [ ] 确认对话框显示
- [ ] 删除成功后列表更新
- [ ] Toast 提示显示

**测试空状态：**
- [ ] 无订阅时显示空状态
- [ ] 空状态包含添加按钮

**测试样式：**
- [ ] 卡片样式美观
- [ ] 响应式布局正常
- [ ] 深色模式下显示正常

---

## ⚠️ 注意事项

### 1. URL 验证
- 使用 `new URL()` 验证 URL 格式
- 编辑模式下 URL 不可更改

### 2. 表单验证
- URL 和 Name 为必填项
- 实时清除错误提示

### 3. 删除确认
- 删除前显示确认对话框
- 显示订阅名称提醒用户

### 4. 错误处理
- 所有操作都有错误提示
- 使用 Toast 显示错误信息

---

## 📌 Phase 4 完成标志

- [x] 创建订阅卡片组件
- [x] 创建订阅列表组件
- [x] 创建订阅表单组件
- [x] 重构 SubscriptionsPage
- [x] TypeScript 编译通过
- [x] 所有功能测试通过

完成后，可以继续执行 Phase 5（设置和优化）。
