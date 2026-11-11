import { createContext, useContext, useEffect, useState } from 'react';
import { RADIO_FALLBACK } from '../content';

const API = 'https://api.mixcloud.com/sanctus_dj/cloudcasts/?limit=50';

const normalise = (c) => ({
  key: c.key,
  url: c.url,
  name: c.name,
  tags: (c.tags || []).map((t) => t.name),
  created: c.created_time,
  length: c.audio_length,
  image: c.pictures?.extra_large || c.pictures?.large,
});

// Episodes newest-first, each numbered from the oldest (EP 01).
const withNumbers = (list) =>
  [...list]
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .map((ep, i, arr) => ({ ...ep, number: arr.length - i }));

export const formatLength = (s) => {
  if (!s) return '';
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  return h ? `${h}h ${String(m).padStart(2, '0')}m` : `${m} min`;
};

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export const pad = (n) => String(n).padStart(2, '0');

export const widgetSrc = (key, autoplay = true) =>
  `https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&hide_artwork=1&autoplay=${autoplay ? 1 : 0}&feed=${encodeURIComponent(key)}`;

const RadioContext = createContext(null);

export function RadioProvider({ children }) {
  const [episodes, setEpisodes] = useState(() => withNumbers(RADIO_FALLBACK));
  const [live, setLive] = useState(false);
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(API, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json) => {
        if (json?.data?.length) {
          setEpisodes(withNumbers(json.data.map(normalise)));
          setLive(true);
        }
      })
      .catch(() => {
        /* keep the bundled fallback list */
      });
    return () => ctrl.abort();
  }, []);

  return (
    <RadioContext.Provider value={{ episodes, live, playing, play: setPlaying, stop: () => setPlaying(null) }}>
      {children}
    </RadioContext.Provider>
  );
}

export const useRadio = () => useContext(RadioContext);
