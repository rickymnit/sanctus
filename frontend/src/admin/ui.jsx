import { useId, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2, X } from 'lucide-react';

// Shared admin form controls. Plain, readable, generous hit areas.

export const inputCls =
  'w-full rounded-md border border-line bg-ink-3 px-3 py-2.5 text-[15px] text-bone placeholder:text-bone-mute transition-colors focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal';

export function Card({ title, description, children, actions }) {
  return (
    <section className="rounded-lg border border-line bg-ink-2 p-5 sm:p-6">
      {(title || actions) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h2 className="text-lg font-semibold text-bone">{title}</h2>}
            {description && <p className="mt-1 max-w-prose text-sm leading-relaxed text-bone-dim">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function Field({ label, help, warning, count, max, children, id }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-bone">
          {label}
        </label>
        {max ? (
          <span className={`text-xs tabular-nums ${count > max ? 'text-signal' : 'text-bone-mute'}`}>
            {count}/{max}
          </span>
        ) : null}
      </div>
      {children}
      {warning ? (
        <p className="mt-1.5 text-xs text-signal">{warning}</p>
      ) : help ? (
        <p className="mt-1.5 text-xs leading-relaxed text-bone-dim">{help}</p>
      ) : null}
    </div>
  );
}

export function TextInput({ label, help, warning, value, onChange, placeholder, type = 'text', max, ...rest }) {
  const id = useId();
  return (
    <Field label={label} help={help} warning={warning} id={id} max={max} count={(value || '').length}>
      <input
        id={id}
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls}
        {...rest}
      />
    </Field>
  );
}

export function TextArea({ label, help, warning, value, onChange, placeholder, rows = 4, max }) {
  const id = useId();
  return (
    <Field label={label} help={help} warning={warning} id={id} max={max} count={(value || '').length}>
      <textarea
        id={id}
        rows={rows}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputCls} resize-y leading-relaxed`}
      />
    </Field>
  );
}

// Editable list of short words, shown as chips (roles, event types).
export function ChipList({ label, help, value = [], onChange, placeholder = 'Type and press Enter' }) {
  const id = useId();
  const [text, setText] = useState('');
  const add = () => {
    const t = text.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setText('');
  };
  return (
    <Field label={label} help={help} id={id}>
      <div className="flex flex-wrap gap-2 rounded-md border border-line bg-ink-3 p-2 focus-within:border-signal">
        {value.map((v, i) => (
          <span key={`${v}-${i}`} className="inline-flex items-center gap-1 rounded bg-ink-2 py-1 pl-2.5 pr-1 text-sm text-bone">
            {v}
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="grid h-6 w-6 place-items-center rounded text-bone-dim hover:bg-ink-3 hover:text-signal" aria-label={`Remove ${v}`}>
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              add();
            } else if (e.key === 'Backspace' && !text && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={add}
          placeholder={placeholder}
          className="min-w-[10rem] flex-1 bg-transparent px-1.5 py-1 text-[15px] text-bone placeholder:text-bone-mute focus:outline-none"
        />
      </div>
    </Field>
  );
}

export function Button({ variant = 'secondary', size = 'md', className = '', children, ...rest }) {
  const v = {
    primary: 'bg-signal text-ink hover:bg-signal-soft disabled:bg-signal/40',
    secondary: 'border border-line bg-ink-3 text-bone hover:border-bone/40 disabled:opacity-50',
    ghost: 'text-bone-dim hover:bg-ink-3 hover:text-bone disabled:opacity-50',
    danger: 'text-bone-dim hover:bg-signal/10 hover:text-signal',
  }[variant];
  const s = { sm: 'h-8 px-2.5 text-[13px]', md: 'h-10 px-4 text-sm', lg: 'h-11 px-5 text-[15px]' }[size];
  return (
    <button type="button" className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed ${v} ${s} ${className}`} {...rest}>
      {children}
    </button>
  );
}

// Reorderable list of cards (venues, sets, gallery, facts).
export function ListEditor({ items = [], onChange, renderItem, newItem, itemTitle, addLabel = 'Add', max = 100, emptyText, compact = false }) {
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const update = (i, val) => onChange(items.map((it, j) => (j === i ? val : it)));
  const remove = (i) => onChange(items.filter((_, j) => j !== i));

  return (
    <div className="space-y-3">
      {items.length === 0 && emptyText && <p className="rounded-md border border-dashed border-line p-4 text-center text-sm text-bone-dim">{emptyText}</p>}
      {items.map((item, i) => (
        <div key={i} className={`rounded-md border border-line bg-ink ${compact ? 'p-3' : 'p-4'}`}>
          <div className={`flex items-center justify-between gap-2 ${compact ? 'mb-2' : 'mb-3'}`}>
            <p className="min-w-0 truncate text-sm font-medium text-bone-dim">
              <span className="mr-2 font-mono text-xs text-bone-mute">{String(i + 1).padStart(2, '0')}</span>
              {itemTitle?.(item, i)}
            </p>
            <div className="flex shrink-0 items-center gap-0.5">
              <Button variant="ghost" size="sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" title="Move up">
                <ArrowUp size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down" title="Move down">
                <ArrowDown size={16} />
              </Button>
              <Button variant="danger" size="sm" onClick={() => remove(i)} aria-label="Remove" title="Remove">
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
          {renderItem(item, (val) => update(i, val), i)}
        </div>
      ))}
      {newItem && items.length < max && (
        <Button onClick={() => onChange([...items, newItem()])} className="w-full border-dashed">
          <Plus size={16} /> {addLabel}
        </Button>
      )}
    </div>
  );
}

export function Spinner({ size = 16 }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

export const isUrl = (v) => !v || /^(https?:\/\/|mailto:|tel:|\/)/i.test(v.trim());
export const urlWarning = (v) => (isUrl(v) ? null : 'Links should start with https://');
