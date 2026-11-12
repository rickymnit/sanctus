import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const push = useCallback(
    (kind, text) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t.slice(-3), { id, kind, text }]);
      setTimeout(() => dismiss(id), kind === 'error' ? 8000 : 3500);
    },
    [dismiss]
  );
  const api = useMemo(() => ({ success: (t) => push('success', t), error: (t) => push('error', t) }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[120] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-2xl ${
              t.kind === 'error' ? 'border-signal/50 bg-[#2a1610] text-bone' : 'border-line bg-ink-3 text-bone'
            }`}
            role={t.kind === 'error' ? 'alert' : 'status'}
          >
            {t.kind === 'error' ? <AlertTriangle size={18} className="mt-0.5 shrink-0 text-signal" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />}
            <p className="flex-1 leading-relaxed">{t.text}</p>
            <button onClick={() => dismiss(t.id)} className="text-bone-mute hover:text-bone" aria-label="Dismiss">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
