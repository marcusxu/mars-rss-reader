import logo from '../../../assets/logo.png';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';

export const Navigator = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Feeds';
      case '/subscriptions':
        return 'Subscriptions';
      default:
        return 'Mars RssReader';
    }
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography>
          <img
            src={logo}
            alt="Mars RSS Reader Logo"
            style={{ width: '50px' }}
          />
        </Typography>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        ></IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {getPageTitle()}
        </Typography>
        <Button color="inherit" onClick={() => navigate('/')}>
          Feeds
        </Button>
        <Button color="inherit" onClick={() => navigate('/subscriptions')}>
          Subscriptions
        </Button>
      </Toolbar>
    </AppBar>
  );
};
