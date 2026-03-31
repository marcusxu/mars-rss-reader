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
