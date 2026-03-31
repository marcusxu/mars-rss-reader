import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
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
