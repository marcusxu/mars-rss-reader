import { Box, Button, ButtonGroup } from '@mui/material';
import {
  Refresh as RefreshIcon,
  DoneAll as DoneAllIcon,
  DeleteSweep as DeleteSweepIcon,
} from '@mui/icons-material';

interface ArticleActionsProps {
  onRefresh: () => void;
  onMarkAllRead: () => void;
  onCleanup: () => void;
  loading: boolean;
  hasUnread: boolean;
}

export function ArticleActions({
  onRefresh,
  onMarkAllRead,
  onCleanup,
  loading,
  hasUnread,
}: ArticleActionsProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <ButtonGroup variant="outlined" size="small" disabled={loading}>
        <Button
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
        <Button
          startIcon={<DoneAllIcon />}
          onClick={onMarkAllRead}
          disabled={!hasUnread || loading}
        >
          Mark All Read
        </Button>
        <Button
          startIcon={<DeleteSweepIcon />}
          onClick={onCleanup}
          color="error"
          disabled={loading}
        >
          Cleanup
        </Button>
      </ButtonGroup>
    </Box>
  );
}
