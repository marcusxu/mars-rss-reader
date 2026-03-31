import { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Theme,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { Subscription } from '../../types';

interface ArticleFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  subscriptions: Subscription[];
  selectedSubscriptions: string[];
  onSubscriptionChange: (ids: string[]) => void;
  readFilter: 'all' | 'read' | 'unread';
  onReadFilterChange: (filter: 'all' | 'read' | 'unread') => void;
  favoriteFilter: 'all' | 'favorite' | 'unfavorite';
  onFavoriteFilterChange: (filter: 'all' | 'favorite' | 'unfavorite') => void;
  onReset: () => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(id: string, selectedIds: readonly string[], theme: Theme) {
  return {
    fontWeight:
      selectedIds.indexOf(id) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export function ArticleFilter({
  searchValue,
  onSearchChange,
  onSearch,
  subscriptions,
  selectedSubscriptions,
  onSubscriptionChange,
  readFilter,
  onReadFilterChange,
  favoriteFilter,
  onFavoriteFilterChange,
  onReset,
}: ArticleFilterProps) {
  const theme = useTheme();
  const [showFilters, setShowFilters] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const hasActiveFilters =
    selectedSubscriptions.length > 0 ||
    readFilter !== 'all' ||
    favoriteFilter !== 'all';

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search articles..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onSearchChange('')}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <IconButton
          color={showFilters ? 'primary' : 'default'}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FilterIcon />
        </IconButton>

        {hasActiveFilters && (
          <IconButton color="primary" onClick={onReset}>
            <ClearIcon />
          </IconButton>
        )}
      </Box>

      {showFilters && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Subscriptions</InputLabel>
            <Select
              multiple
              value={selectedSubscriptions}
              onChange={(e) => onSubscriptionChange(e.target.value as string[])}
              input={<OutlinedInput label="Subscriptions" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const sub = subscriptions.find((s) => s.id === id);
                    return (
                      <Chip
                        key={id}
                        label={sub?.name || id}
                        size="small"
                        onDelete={() =>
                          onSubscriptionChange(
                            selectedSubscriptions.filter((s) => s !== id)
                          )
                        }
                      />
                    );
                  })}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {subscriptions.map((sub) => (
                <MenuItem
                  key={sub.id}
                  value={sub.id}
                  style={getStyles(sub.id, selectedSubscriptions, theme)}
                >
                  {sub.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Read Status</InputLabel>
            <Select
              value={readFilter}
              label="Read Status"
              onChange={(e) =>
                onReadFilterChange(e.target.value as 'all' | 'read' | 'unread')
              }
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="read">Read</MenuItem>
              <MenuItem value="unread">Unread</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Favorite Status</InputLabel>
            <Select
              value={favoriteFilter}
              label="Favorite Status"
              onChange={(e) =>
                onFavoriteFilterChange(
                  e.target.value as 'all' | 'favorite' | 'unfavorite'
                )
              }
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="favorite">Favorite</MenuItem>
              <MenuItem value="unfavorite">Not Favorite</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
    </Box>
  );
}
