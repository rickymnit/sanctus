import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ContentProvider } from './cms/ContentProvider';
import './styles/globals.css';

// The admin panel is a separate, lazily loaded bundle so visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp'));
const isAdmin = /^\/admin(\/|$)/.test(window.location.pathname);

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {isAdmin ? (
      <Suspense fallback={<div className="min-h-screen bg-ink" />}>
        <AdminApp />
      </Suspense>
    ) : (
      <ContentProvider>
        <App />
      </ContentProvider>
    )}
  </React.StrictMode>
);
