import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Monitor, Smartphone, X } from 'lucide-react';
import { Button } from './ui';

const DEVICES = {
  desktop: { width: 1280, label: 'Desktop', icon: Monitor },
  phone: { width: 390, label: 'Phone', icon: Smartphone },
};

// The real site in an iframe, fed the unsaved draft over postMessage.
export default function Preview({ draft, anchor, onClose }) {
  const frame = useRef(null);
  const box = useRef(null);
  const [ready, setReady] = useState(false);
  const [device, setDevice] = useState('desktop');
  const [size, setSize] = useState({ w: 600, h: 800 });

  useLayoutEffect(() => {
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onMsg = (e) => {
      if (e.origin === window.location.origin && e.data?.type === 'sanctus:preview-ready' && e.source === frame.current?.contentWindow) setReady(true);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Send the draft (debounced) whenever it changes.
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => frame.current?.contentWindow?.postMessage({ type: 'sanctus:preview', content: draft }, window.location.origin), 200);
    return () => clearTimeout(t);
  }, [draft, ready]);

  // Jump to the section being edited.
  useEffect(() => {
    if (ready && anchor) frame.current?.contentWindow?.postMessage({ type: 'sanctus:scroll', id: anchor }, window.location.origin);
  }, [anchor, ready]);

  const dev = DEVICES[device];
  const scale = Math.min(1, size.w / dev.width);
  const frameH = size.h / scale;

  return (
    <div className="flex h-full flex-col bg-ink">
      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
        <p className="text-sm font-medium text-bone-dim">Live preview <span className="text-bone-mute">· unsaved changes included</span></p>
        <div className="flex items-center gap-1">
          {Object.entries(DEVICES).map(([key, d]) => (
            <Button key={key} size="sm" variant={device === key ? 'secondary' : 'ghost'} onClick={() => setDevice(key)} aria-pressed={device === key} title={d.label}>
              <d.icon size={15} /> <span className="hidden sm:inline">{d.label}</span>
            </Button>
          ))}
          {onClose && (
            <Button size="sm" variant="ghost" onClick={onClose} aria-label="Close preview">
              <X size={16} />
            </Button>
          )}
        </div>
      </div>
      <div ref={box} className="relative flex-1 overflow-hidden bg-[#050505]">
        <iframe
          ref={frame}
          title="Site preview"
          src="/?preview=1"
          className="absolute left-1/2 top-0 origin-top border-0 bg-ink"
          style={{ width: dev.width, height: frameH, transform: `translateX(-50%) scale(${scale})` }}
        />
      </div>
    </div>
  );
}
