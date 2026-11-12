import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { api } from './api';
import { Button, inputCls, Spinner } from './ui';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.login(username, password);
      onLogin(await api.session());
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-[100dvh] place-items-center bg-ink px-4 text-bone">
      <form onSubmit={submit} className="w-full max-w-sm">
        <p className="wordmark text-center text-4xl">SANCTÜS</p>
        <p className="mt-3 text-center text-sm text-bone-dim">Website admin</p>

        <div className="mt-10 space-y-4 rounded-lg border border-line bg-ink-2 p-6">
          <div>
            <label htmlFor="u" className="mb-1.5 block text-sm font-medium">Username</label>
            <input id="u" autoComplete="username" autoFocus required value={username} onChange={(e) => setUsername(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label htmlFor="p" className="mb-1.5 block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                id="p"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputCls} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute inset-y-0 right-0 grid w-11 place-items-center text-bone-mute hover:text-bone"
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="rounded-md bg-signal/10 px-3 py-2 text-sm text-signal" role="alert">{error}</p>}
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={busy}>
            {busy ? <><Spinner /> Signing in…</> : 'Sign in'}
          </Button>
        </div>
        <a href="/" className="mt-6 block text-center text-sm text-bone-mute hover:text-bone">← Back to the website</a>
      </form>
    </div>
  );
}
