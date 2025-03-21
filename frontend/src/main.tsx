import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Navigator } from './components/Navigator';

import { FeedsPage } from './pages/feeds-page';
import { SubscriptionsPage } from './pages/subscriptions-page';
import { Box, Container } from '@mui/material';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {' '}
      <Box>
        <Container>
          <Navigator />
        </Container>
        <Routes>
          <Route path="/" element={<FeedsPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
        </Routes>
      </Box>
    </BrowserRouter>
  </StrictMode>,
);
