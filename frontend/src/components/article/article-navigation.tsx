import { Box, Button, Typography } from '@mui/material';
import {
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';

interface ArticleNavigationProps {
  hasNext: boolean;
  hasPrevious: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  currentIndex: number;
  totalCount: number;
}

export function ArticleNavigation({
  hasNext,
  hasPrevious,
  onNext,
  onPrevious,
  currentIndex,
  totalCount,
}: ArticleNavigationProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2,
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'divider',
        mb: 3,
      }}
    >
      <Button
        startIcon={<NavigateBeforeIcon />}
        disabled={!hasPrevious}
        onClick={onPrevious}
        sx={{ minWidth: 120 }}
      >
        Previous
      </Button>

      <Typography variant="body2" color="text.secondary">
        {currentIndex} of {totalCount}
      </Typography>

      <Button
        endIcon={<NavigateNextIcon />}
        disabled={!hasNext}
        onClick={onNext}
        sx={{ minWidth: 120 }}
      >
        Next
      </Button>
    </Box>
  );
}
