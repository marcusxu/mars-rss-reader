import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';
import {
  Brightness6 as BrightnessIcon,
  Language as LanguageIcon,
  Info as InfoIcon,
  Storage as StorageIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../theme/theme-provider';

export function SettingsPage() {
  const { mode, setMode } = useThemeContext();

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Settings
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <List>
          <ListItem>
            <ListItemIcon>
              <BrightnessIcon />
            </ListItemIcon>
            <ListItemText
              primary="Theme"
              secondary="Choose your preferred theme"
            />
            <ListItemSecondaryAction>
              <Select
                value={mode}
                onChange={(e) => setMode(e.target.value as 'light' | 'dark' | 'system')}
                size="small"
                sx={{ minWidth: 100 }}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System</MenuItem>
              </Select>
            </ListItemSecondaryAction>
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText
              primary="Language"
              secondary="Application language"
            />
            <ListItemSecondaryAction>
              <Chip label="English" size="small" />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText
              primary="Data Storage"
              secondary="Local storage for settings and cache"
            />
            <ListItemSecondaryAction>
              <Typography variant="body2" color="text.secondary">
                ~2 MB
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ mt: 3 }}>
        <List>
          <ListItem>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText
              primary="Version"
              secondary="Application version"
            />
            <ListItemSecondaryAction>
              <Typography variant="body2" color="text.secondary">
                v2.0.0
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <Divider />

          <ListItem component="a" href="https://github.com" target="_blank" rel="noopener noreferrer">
            <ListItemIcon>
              <GitHubIcon />
            </ListItemIcon>
            <ListItemText
              primary="GitHub Repository"
              secondary="View source code and report issues"
            />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          About Mars RSS Reader
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Mars RSS Reader is a modern, lightweight RSS feed reader built with React and Material-UI.
          It provides a clean and intuitive interface for reading your favorite RSS feeds.
        </Typography>
      </Paper>
    </Box>
  );
}
