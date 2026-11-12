import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ExternalLink, Eye, EyeOff, LogOut, Undo2, UploadCloud } from 'lucide-react';
import { SECTIONS } from './sections';
import Preview from './Preview';
import { api } from './api';
import { Button, Spinner } from './ui';
import { useToast } from './toast';
import { mergeContent } from '../cms/defaults';

const DRAFT_KEY = 'sanctus:admin-draft';
const strip = ({ updatedAt, ...rest }) => rest; // eslint-disable-line no-unused-vars
const same = (a, b) => JSON.stringify(strip(a)) === JSON.stringify(strip(b));

function ago(iso) {
  if (!iso) return null;
  const s = Math.round((Date.now() - new Date(iso)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

export default function Dashboard({ session, onLogout }) {
  const toast = useToast();
  const [published, setPublished] = useState(null);
  const [draft, setDraft] = useState(null);
  const [active, setActive] = useState(() => {
    const k = window.location.hash.slice(1);
    return SECTIONS.some((s) => s.key === k) ? k : 'hero';
  });
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(() => window.innerWidth >= 1280);
  const [, tick] = useState(0);

  useEffect(() => {
    api
      .content()
      .then((saved) => {
        const c = mergeContent(saved);
        setPublished(c);
        // Bring back unpublished work from a closed tab or expired session.
        let restored = null;
        try {
          restored = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
        } catch {
          /* ignore */
        }
        if (restored && !same(mergeContent(restored), c)) {
          setDraft(mergeContent(restored));
          toast.success('Restored your unpublished changes from last time.');
        } else setDraft(c);
      })
      .catch((e) => {
        if (e.status === 401) onLogout();
        else toast.error(e.message);
      });
  }, [onLogout, toast]);

  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 30000); // refresh "x min ago"
    return () => clearInterval(t);
  }, []);

  const dirty = draft && published && !same(draft, published);

  // Keep a local copy of unpublished work.
  useEffect(() => {
    if (!draft || !published) return;
    const t = setTimeout(() => {
      try {
        if (dirty) localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        else localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* storage full or blocked */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [draft, published, dirty]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const h = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  const setSection = useCallback((key, value) => setDraft((d) => ({ ...d, [key]: value })), []);
  const loadDraft = useCallback((c) => setDraft(mergeContent(c)), []);

  const publish = useCallback(async () => {
    if (!dirty || saving) return;
    setSaving(true);
    try {
      const { updatedAt } = await api.publish(strip(draft));
      const next = { ...draft, updatedAt };
      setPublished(next);
      setDraft(next);
      toast.success('Published. The live site updates within a few seconds.');
    } catch (e) {
      if (e.status === 401) {
        toast.error('Your session expired. Log in again; your changes are kept and will be restored.');
        setTimeout(onLogout, 1500);
      } else toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }, [dirty, saving, draft, toast, onLogout]);

  const discard = () => {
    if (window.confirm('Throw away all unpublished changes?')) setDraft(published);
  };

  // Ctrl/Cmd + S publishes.
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        publish();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [publish]);

  const go = (key) => {
    setActive(key);
    history.replaceState(null, '', `#${key}`);
    document.getElementById('admin-main')?.scrollTo({ top: 0 });
  };

  const section = SECTIONS.find((s) => s.key === active);
  const changed = useMemo(() => {
    if (!draft || !published) return new Set();
    const keys = { hero: ['hero'], about: ['about'], venues: ['venues'], sound: ['sound', 'genres'], radio: ['radio'], sets: ['sets'], gallery: ['gallery'], booking: ['booking'], contact: ['contact', 'links', 'handles'] };
    return new Set(Object.entries(keys).filter(([, ks]) => ks.some((k) => JSON.stringify(draft[k]) !== JSON.stringify(published[k]))).map(([s]) => s));
  }, [draft, published]);

  if (!draft) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink text-bone-dim">
        <div className="flex items-center gap-3"><Spinner /> Loading content…</div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-ink text-bone">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line bg-ink-2 px-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="wordmark text-lg">SANCTÜS</span>
          <span className="hidden rounded bg-ink-3 px-2 py-0.5 text-xs font-medium text-bone-dim sm:inline">Admin</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowPreview((v) => !v)} aria-pressed={showPreview}>
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            <span className="hidden sm:inline">{showPreview ? 'Hide preview' : 'Preview'}</span>
          </Button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center gap-2 rounded-md px-2.5 text-[13px] font-medium text-bone-dim hover:bg-ink-3 hover:text-bone">
            <ExternalLink size={16} /> <span className="hidden sm:inline">View site</span>
          </a>
          <Button variant="ghost" size="sm" onClick={onLogout} title={`Signed in as ${session.username}`}>
            <LogOut size={16} /> <span className="hidden md:inline">Log out</span>
          </Button>
        </div>
      </header>

      {session.storage !== 'blob' && (
        <div className={`flex items-start gap-2 border-b px-4 py-2 text-[13px] ${session.storage === 'missing' ? 'border-signal/40 bg-signal/10 text-bone' : 'border-line bg-ink-2 text-bone-dim'}`}>
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-signal" />
          {session.storage === 'missing'
            ? 'Storage isn’t connected yet, so publishing won’t work. In Vercel: Storage → Create → Blob → connect to this project, then redeploy.'
            : 'Local mode: changes are saved on this computer only (frontend/.data), not on the live site.'}
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        {/* Sidebar (desktop) */}
        <nav className="hidden w-56 shrink-0 overflow-y-auto border-r border-line bg-ink-2 p-3 md:block" aria-label="Sections">
          <ul className="space-y-0.5">
            {SECTIONS.map((s) => (
              <li key={s.key}>
                {s.key === 'history' && <div className="my-3 border-t border-line" />}
                <button
                  onClick={() => go(s.key)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[15px] transition-colors ${
                    active === s.key ? 'bg-ink-3 font-medium text-bone' : 'text-bone-dim hover:bg-ink-3/60 hover:text-bone'
                  }`}
                  aria-current={active === s.key ? 'page' : undefined}
                >
                  {s.label}
                  {changed.has(s.key) && <span className="h-2 w-2 rounded-full bg-signal" title="Unpublished changes" />}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Editor */}
        <main id="admin-main" className="min-w-0 flex-1 overflow-y-auto">
          {/* Section tabs (mobile) */}
          <div className="sticky top-0 z-10 flex gap-1 overflow-x-auto border-b border-line bg-ink/95 px-3 py-2 backdrop-blur md:hidden">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => go(s.key)}
                ref={active === s.key ? (el) => el?.scrollIntoView({ block: 'nearest', inline: 'center' }) : undefined}
                className={`relative shrink-0 rounded-md px-3 py-1.5 text-sm ${active === s.key ? 'bg-ink-3 text-bone' : 'text-bone-dim'}`}
              >
                {s.label}
                {changed.has(s.key) && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-signal" />}
              </button>
            ))}
          </div>

          <div className="mx-auto max-w-3xl space-y-5 px-4 py-6 pb-32 sm:px-6 sm:py-8">
            <div>
              <h1 className="text-2xl font-semibold">{section.label}</h1>
              {published.updatedAt && <p className="mt-1 text-sm text-bone-mute">Last published {ago(published.updatedAt)}</p>}
            </div>
            {section.render(draft, setSection, loadDraft)}
          </div>
        </main>

        {/* Preview: side panel on wide screens, full-screen overlay otherwise */}
        {showPreview && (
          <aside className="fixed inset-0 z-40 xl:static xl:z-auto xl:w-[46%] xl:max-w-[760px] xl:border-l xl:border-line">
            <Preview draft={draft} anchor={section.anchor} onClose={() => setShowPreview(false)} />
          </aside>
        )}
      </div>

      {/* Publish bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t transition-transform duration-300 md:left-56 ${showPreview ? 'xl:right-[min(46%,760px)]' : ''} ${
          dirty ? 'translate-y-0 border-signal/40 bg-ink-2' : 'translate-y-full border-transparent'
        }`}
        aria-hidden={!dirty}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 shrink-0 rounded-full bg-signal" />
            <span>Unpublished changes</span>
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={discard} disabled={saving} tabIndex={dirty ? 0 : -1}>
              <Undo2 size={16} /> <span className="hidden sm:inline">Discard</span>
            </Button>
            <Button variant="primary" size="lg" onClick={publish} disabled={saving} tabIndex={dirty ? 0 : -1}>
              {saving ? <Spinner /> : <UploadCloud size={17} />} {saving ? 'Publishing…' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
