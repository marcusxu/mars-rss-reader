import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ThemeProvider } from './theme/theme-provider';
import { ToastProvider } from './hooks/use-toast';
import { ToastContainer } from './components/common/toast-provider';
import { ErrorBoundary } from './components/common/error-boundary';
import { AppLayout } from './components/layout/app-layout';
import { Loading } from './components/common/loading';

const FeedsPage = lazy(() =>
  import('./pages/feeds-page').then((m) => ({ default: m.FeedsPage })),
);
const ArticleDetailPage = lazy(() =>
  import('./pages/article-detail-page').then((m) => ({ default: m.ArticleDetailPage })),
);
const SubscriptionsPage = lazy(() =>
  import('./pages/subscriptions-page').then((m) => ({ default: m.SubscriptionsPage })),
);
const SettingsPage = lazy(() =>
  import('./pages/settings-page').then((m) => ({ default: m.SettingsPage })),
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppLayout>
              <Suspense fallback={<Loading fullScreen />}>
                <Routes>
                  <Route path="/" element={<FeedsPage />} />
                  <Route path="/article/:id" element={<ArticleDetailPage />} />
                  <Route path="/subscriptions" element={<SubscriptionsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </Suspense>
            </AppLayout>
            <ToastContainer />
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
