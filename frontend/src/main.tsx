import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Navigator } from './components/Navigator';

import { FeedsPage } from './pages/feeds-page';
import { SubscriptionsPage } from './pages/subscriptions-page';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Navigator />
      <Routes>
        <Route path="/" element={<FeedsPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
