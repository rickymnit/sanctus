import { useRef, useState } from 'react';
import { Crop, ImagePlus, Upload } from 'lucide-react';
import ImageEditor from './ImageEditor';
import { api } from './api';
import { Button, TextInput } from './ui';
import { useToast } from './toast';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif';

// Open a file picker, then the editor, then upload. Returns { open, editor }:
// render `editor` somewhere and call `open()` (or `edit(url)`) to start.
export function useImageUpload({ name, aspectKey, sizeWidth, onUploaded }) {
  const toast = useToast();
  const input = useRef(null);
  const [editing, setEditing] = useState(null); // { src, revoke }

  const fromFile = (file) => {
    if (!file) return;
    if (file.type && !file.type.startsWith('image/')) return toast.error('Please choose a photo (JPG, PNG or WebP).');
    const src = URL.createObjectURL(file);
    setEditing({ src, revoke: true });
  };

  const close = () => {
    if (editing?.revoke) URL.revokeObjectURL(editing.src);
    setEditing(null);
  };

  const done = async (blob) => {
    try {
      const { url } = await api.upload(blob, name);
      onUploaded(url);
      toast.success('Photo uploaded. Remember to publish.');
      close();
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  };

  const editor = (
    <>
      <input
        ref={input}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          fromFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      {editing && (
        <ImageEditor
          src={editing.src}
          aspectKey={aspectKey}
          sizeWidth={sizeWidth}
          onCancel={close}
          onDone={done}
        />
      )}
    </>
  );

  return {
    open: () => input.current?.click(),
    edit: (url) => setEditing({ src: url, revoke: false }),
    fromFile,
    editor,
  };
}

// Photo slot: preview at the shape the site shows it, click to set the focal
// point, replace / crop, and alt text.
export default function ImageField({
  label,
  help,
  src,
  alt,
  focus = '50% 50%',
  onChange,
  name,
  previewAspect = '4 / 5',
  aspectKey = 'original',
  sizeWidth = 1400,
  withFocus = true,
  withAlt = true,
  emptyText = 'No photo yet',
  grayscale = false,
}) {
  const [dragOver, setDragOver] = useState(false);
  const up = useImageUpload({ name, aspectKey, sizeWidth, onUploaded: (url) => onChange({ src: url, focus: '50% 50%' }) });

  const setFocus = (e) => {
    if (!withFocus || !src) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - r.left) / r.width) * 100);
    const y = Math.round(((e.clientY - r.top) / r.height) * 100);
    onChange({ focus: `${x}% ${y}%` });
  };

  const [fx, fy] = (focus || '50% 50%').split(' ').map((v) => parseFloat(v));

  return (
    <div>
      {label && <p className="mb-1.5 text-sm font-medium text-bone">{label}</p>}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div
          className={`group relative w-full shrink-0 overflow-hidden rounded-md border bg-ink-3 sm:w-56 ${dragOver ? 'border-signal' : 'border-line'} ${src && withFocus ? 'cursor-crosshair' : ''}`}
          style={{ aspectRatio: previewAspect }}
          onClick={setFocus}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            up.fromFile(e.dataTransfer.files?.[0]);
          }}
          title={src && withFocus ? 'Click the most important point of the photo' : undefined}
        >
          {src ? (
            <>
              <img src={src} alt="" className={`h-full w-full object-cover ${grayscale ? 'grayscale' : ''}`} style={{ objectPosition: focus }} draggable={false} />
              {withFocus && (
                <span
                  className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(0,0,0,0.5)]"
                  style={{ left: `${fx}%`, top: `${fy}%` }}
                />
              )}
            </>
          ) : (
            <button type="button" onClick={up.open} className="flex h-full w-full flex-col items-center justify-center gap-2 text-sm text-bone-dim hover:text-bone">
              <ImagePlus size={24} />
              {emptyText}
              <span className="text-xs text-bone-mute">or drop a photo here</span>
            </button>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={up.open}>
              <Upload size={16} /> {src ? 'Replace photo' : 'Upload photo'}
            </Button>
            {src && (
              <Button onClick={() => up.edit(src)}>
                <Crop size={16} /> Crop / resize
              </Button>
            )}
          </div>
          {help && <p className="text-xs leading-relaxed text-bone-dim">{help}</p>}
          {src && withFocus && (
            <p className="text-xs leading-relaxed text-bone-dim">
              <span className="text-bone">Focal point:</span> click the photo on the left to choose what stays in view when it’s cropped on phones and wide screens.
            </p>
          )}
          {withAlt && (
            <TextInput
              label="Photo description"
              help="Describe the photo in a few words. Read aloud by screen readers and used by Google."
              value={alt}
              onChange={(v) => onChange({ alt: v })}
              placeholder="e.g. SANCTÜS mixing at a rooftop party"
            />
          )}
        </div>
      </div>
      {up.editor}
    </div>
  );
}
