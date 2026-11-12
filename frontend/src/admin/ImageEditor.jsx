import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RotateCcw, RotateCw, X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button, Spinner } from './ui';

// Crop / zoom / rotate / resize an image in the browser, then hand back a
// compressed WebP (JPEG fallback). Works with a fixed frame: drag the photo
// behind the frame to position it, zoom to crop tighter.

export const ASPECTS = [
  { key: 'original', label: 'Original', value: null },
  { key: '1:1', label: 'Square', value: 1 },
  { key: '4:5', label: 'Portrait 4:5', value: 4 / 5 },
  { key: '3:4', label: 'Portrait 3:4', value: 3 / 4 },
  { key: '16:10', label: 'Landscape 16:10', value: 16 / 10 },
  { key: '16:9', label: 'Wide 16:9', value: 16 / 9 },
];

const SIZES = [
  { label: 'Small', width: 900, hint: 'thumbnails' },
  { label: 'Medium', width: 1400, hint: 'most photos' },
  { label: 'Large', width: 2000, hint: 'full-screen' },
];

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (!src.startsWith('blob:') && !src.startsWith('data:')) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("This photo couldn't be opened. Use a JPG, PNG or WebP. (iPhone HEIC photos: share/export as JPG first.)"));
    img.src = src;
  });
}

const formatKB = (bytes) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`);

export default function ImageEditor({ src, aspectKey = 'original', sizeWidth = 1400, title = 'Edit photo', onCancel, onDone }) {
  const [img, setImg] = useState(null);
  const [error, setError] = useState('');
  const [aspect, setAspect] = useState(aspectKey);
  const [zoom, setZoom] = useState(1);
  const [rot, setRot] = useState(0); // quarter turns
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [outWidth, setOutWidth] = useState(sizeWidth);
  const [quality, setQuality] = useState(0.82);
  const [estimate, setEstimate] = useState(null);
  const [busy, setBusy] = useState(false);
  const stageRef = useRef(null);
  const [stage, setStage] = useState({ w: 600, h: 400 });
  const drag = useRef(null);

  useEffect(() => {
    let alive = true;
    loadImage(src).then((i) => alive && setImg(i)).catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [src]);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setStage({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Rotated source size
  const rotated = rot % 2 === 1;
  const iw = img ? (rotated ? img.naturalHeight : img.naturalWidth) : 1;
  const ih = img ? (rotated ? img.naturalWidth : img.naturalHeight) : 1;
  const ratio = ASPECTS.find((a) => a.key === aspect)?.value || iw / ih;

  // Frame fits inside the stage
  let fw = stage.w;
  let fh = fw / ratio;
  if (fh > stage.h) {
    fh = stage.h;
    fw = fh * ratio;
  }
  const cover = Math.max(fw / iw, fh / ih);
  const scale = cover * zoom;

  const clamp = useCallback(
    (o) => {
      const mx = Math.max(0, (iw * scale - fw) / 2);
      const my = Math.max(0, (ih * scale - fh) / 2);
      return { x: Math.min(mx, Math.max(-mx, o.x)), y: Math.min(my, Math.max(-my, o.y)) };
    },
    [iw, ih, scale, fw, fh]
  );

  useEffect(() => setOffset((o) => clamp(o)), [clamp]);

  // Pixels of the source that the frame covers → the most detail we can output.
  const maxOut = Math.round(fw / scale);
  const finalW = Math.max(1, Math.min(outWidth, maxOut));
  const finalH = Math.max(1, Math.round(finalW / ratio));

  const render = useCallback(
    async (type = 'image/webp') => {
      const canvas = document.createElement('canvas');
      canvas.width = finalW;
      canvas.height = finalH;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      const k = finalW / fw;
      ctx.translate(finalW / 2 + offset.x * k, finalH / 2 + offset.y * k);
      ctx.rotate((rot * Math.PI) / 2);
      ctx.scale(scale * k, scale * k);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      let blob = await new Promise((r) => canvas.toBlob(r, type, quality));
      if (!blob || blob.type !== type) blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', quality)); // older Safari
      return blob;
    },
    [img, finalW, finalH, fw, offset, rot, scale, quality]
  );

  // Live file-size estimate (debounced)
  useEffect(() => {
    if (!img) return;
    const t = setTimeout(() => {
      render()
        .then((b) => setEstimate(b ? b.size : null))
        .catch(() => setEstimate(null));
    }, 350);
    return () => clearTimeout(t);
  }, [img, render]);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, o: offset };
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const d = drag.current;
    setOffset(clamp({ x: d.o.x + e.clientX - d.x, y: d.o.y + e.clientY - d.y }));
  };
  const onPointerUp = () => (drag.current = null);
  const onWheel = (e) => setZoom((z) => Math.min(4, Math.max(1, z - e.deltaY * 0.0015)));

  const reset = () => {
    setZoom(1);
    setRot(0);
    setOffset({ x: 0, y: 0 });
  };

  const apply = async () => {
    setBusy(true);
    try {
      const blob = await render();
      if (!blob) throw new Error('Could not process this image.');
      await onDone(blob, { width: finalW, height: finalH });
    } catch (e) {
      setError(e.name === 'SecurityError' ? "This image is hosted elsewhere and can't be edited. Upload the file instead." : e.message);
      setBusy(false);
    }
  };

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !busy && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [busy, onCancel]);

  return (
    <div className="fixed inset-0 z-[100] flex items-stretch justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="flex max-h-full w-full max-w-5xl flex-col overflow-hidden bg-ink-2 sm:rounded-xl sm:border sm:border-line">
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
          <h2 className="font-semibold">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={busy} aria-label="Close">
            <X size={18} />
          </Button>
        </header>

        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[1fr_300px]">
          {/* Stage */}
          <div className="flex min-h-[320px] flex-col bg-black p-4 sm:p-6">
            <div ref={stageRef} className="relative flex min-h-[260px] flex-1 items-center justify-center lg:min-h-[440px]">
              {!img && !error && <Spinner size={28} />}
              {error && <p className="max-w-sm text-center text-sm text-signal">{error}</p>}
              {img && (
                <div
                  className="relative cursor-grab touch-none overflow-hidden outline outline-2 outline-signal active:cursor-grabbing"
                  style={{ width: fw, height: fh }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  onWheel={onWheel}
                >
                  <img
                    src={img.src}
                    alt=""
                    draggable={false}
                    className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
                    style={{
                      width: img.naturalWidth,
                      height: img.naturalHeight,
                      transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) rotate(${rot * 90}deg) scale(${scale})`,
                    }}
                  />
                  {/* rule-of-thirds guides */}
                  <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <span key={i} className="border border-white/10" />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <p className="mt-3 text-center text-xs text-bone-mute">Drag the photo to position it · scroll or use the slider to zoom</p>
          </div>

          {/* Controls */}
          <div className="space-y-6 border-t border-line p-5 lg:border-l lg:border-t-0">
            <div>
              <p className="mb-2 text-sm font-medium">Shape</p>
              <div className="grid grid-cols-2 gap-1.5">
                {ASPECTS.map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => {
                      setAspect(a.key);
                      setOffset({ x: 0, y: 0 });
                    }}
                    className={`rounded-md border px-2 py-2 text-[13px] transition-colors ${aspect === a.key ? 'border-signal bg-signal/10 text-bone' : 'border-line text-bone-dim hover:border-bone/40 hover:text-bone'}`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">Zoom</p>
                <span className="text-xs tabular-nums text-bone-mute">{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <ZoomOut size={16} className="text-bone-mute" />
                <input type="range" min="1" max="4" step="0.01" value={zoom} onChange={(e) => setZoom(+e.target.value)} className="w-full accent-[#ff5a1f]" aria-label="Zoom" />
                <ZoomIn size={16} className="text-bone-mute" />
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Rotate</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => { setRot((r) => (r + 3) % 4); setOffset({ x: 0, y: 0 }); }}>
                  <RotateCcw size={15} /> Left
                </Button>
                <Button size="sm" onClick={() => { setRot((r) => (r + 1) % 4); setOffset({ x: 0, y: 0 }); }}>
                  <RotateCw size={15} /> Right
                </Button>
                <Button size="sm" variant="ghost" onClick={reset}>
                  Reset
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Size</p>
              <div className="grid grid-cols-3 gap-1.5">
                {SIZES.map((s) => (
                  <button
                    key={s.width}
                    type="button"
                    onClick={() => setOutWidth(s.width)}
                    className={`rounded-md border px-2 py-2 text-left transition-colors ${outWidth === s.width ? 'border-signal bg-signal/10' : 'border-line hover:border-bone/40'}`}
                  >
                    <span className="block text-[13px] text-bone">{s.label}</span>
                    <span className="block text-[11px] text-bone-mute">{s.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">Quality</p>
                <span className="text-xs tabular-nums text-bone-mute">{Math.round(quality * 100)}%</span>
              </div>
              <input type="range" min="0.5" max="0.95" step="0.01" value={quality} onChange={(e) => setQuality(+e.target.value)} className="w-full accent-[#ff5a1f]" aria-label="Quality" />
              <p className="mt-1 text-xs text-bone-mute">Lower = smaller file, faster site.</p>
            </div>

            {img && (
              <div className="rounded-md bg-ink p-3 text-sm">
                <div className="flex justify-between"><span className="text-bone-dim">Result</span><span className="tabular-nums">{finalW} × {finalH} px</span></div>
                <div className="mt-1 flex justify-between"><span className="text-bone-dim">File size</span><span className="tabular-nums">{estimate ? `≈ ${formatKB(estimate)}` : '…'}</span></div>
                {finalW < outWidth && <p className="mt-2 text-xs text-bone-mute">Limited by the original photo's resolution.</p>}
              </div>
            )}
          </div>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-line px-5 py-3">
          <Button variant="ghost" onClick={onCancel} disabled={busy}>Cancel</Button>
          <Button variant="primary" onClick={apply} disabled={!img || busy}>
            {busy ? <><Spinner /> Uploading…</> : 'Save photo'}
          </Button>
        </footer>
      </div>
    </div>
  );
}
