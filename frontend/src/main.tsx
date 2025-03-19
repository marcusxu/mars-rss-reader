import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import './index.css';
import { HomePage } from './pages/home-page';
import { SubscriptionPage } from './pages/subscription-page';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/subscriptions" element={<SubscriptionPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
