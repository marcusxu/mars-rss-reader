import { Link } from 'react-router';
import logo from '../../../assets/logo.png';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';

export const Navigator = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography>
        <img src={logo} alt="Mars RSS Reader Logo" style={{ width: '50px' }} />
      </Typography>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
      ></IconButton>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Mars RssReader
      </Typography>
      <Link to="/">Homepage</Link>
      <Link to="/subscriptions">Subscriptions</Link>
    </Toolbar>
  </AppBar>
);
