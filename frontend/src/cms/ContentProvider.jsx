import { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_CONTENT, mergeContent } from './defaults';

const ContentContext = createContext(DEFAULT_CONTENT);
const CACHE_KEY = 'sanctus:content';

const isPreview = () =>
  typeof window !== 'undefined' && window.parent !== window && new URLSearchParams(window.location.search).has('preview');

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(content) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(content));
  } catch {
    /* storage unavailable: fine */
  }
}

// Loads the site's content: last-seen copy from this browser first (instant),
// then the latest from /api/content. In the admin's live preview iframe it
// instead shows whatever draft the admin panel posts in.
export function ContentProvider({ children }) {
  const preview = isPreview();
  const cached = preview ? null : readCache();
  const [content, setContent] = useState(() => mergeContent(cached));
  // First-time visitors wait briefly for saved content so edited images/text don't visibly swap.
  const [ready, setReady] = useState(Boolean(cached) || preview);

  useEffect(() => {
    if (preview) {
      const onMessage = (e) => {
        if (e.origin !== window.location.origin) return;
        if (e.data?.type === 'sanctus:preview') setContent(mergeContent(e.data.content));
        if (e.data?.type === 'sanctus:scroll') document.getElementById(e.data.id)?.scrollIntoView({ behavior: 'smooth' });
      };
      window.addEventListener('message', onMessage);
      window.parent.postMessage({ type: 'sanctus:preview-ready' }, window.location.origin);
      return () => window.removeEventListener('message', onMessage);
    }

    const ctrl = new AbortController();
    const giveUp = setTimeout(() => setReady(true), 1500);
    fetch('/api/content', { signal: ctrl.signal })
      .then((r) => (r.status === 200 ? r.json() : r.status === 204 ? 'none' : null))
      .then((saved) => {
        if (saved === 'none') {
          // Nothing published yet: built-in content, and forget any stale cached copy.
          setContent(DEFAULT_CONTENT);
          try {
            localStorage.removeItem(CACHE_KEY);
          } catch {
            /* ignore */
          }
        } else if (saved) {
          setContent(mergeContent(saved));
          writeCache(saved);
        }
      })
      .catch(() => {
        /* offline or API unavailable: keep built-in content */
      })
      .finally(() => {
        clearTimeout(giveUp);
        setReady(true);
      });
    return () => {
      clearTimeout(giveUp);
      ctrl.abort();
    };
  }, [preview]);

  if (!ready) return <div className="min-h-[100svh] bg-ink" aria-busy="true" />;
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export const useContent = () => useContext(ContentContext);
