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
