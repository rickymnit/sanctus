import { useCallback, useEffect, useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import { ToastProvider } from './toast';
import { api } from './api';
import { Spinner } from './ui';

export default function AdminApp() {
  const [session, setSession] = useState(undefined); // undefined = checking, null = logged out

  useEffect(() => {
    document.title = 'Admin · SANCTÜS';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    api.session().then(setSession).catch(() => setSession(null));
  }, []);

  const logout = useCallback(async () => {
    await api.logout().catch(() => {});
    setSession(null);
  }, []);

  return (
    <ToastProvider>
      {session === undefined ? (
        <div className="grid min-h-screen place-items-center bg-ink text-bone-dim">
          <Spinner size={22} />
        </div>
      ) : session ? (
        <Dashboard session={session} onLogout={logout} />
      ) : (
        <Login onLogin={setSession} />
      )}
    </ToastProvider>
  );
}
