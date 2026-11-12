import { useState } from 'react';
import { ArrowUpRight, Download, Mail, MessageCircle } from 'lucide-react';
import { CONTACT, EVENT_TYPES, LINKS } from '../content';
import { Reveal, SectionHead } from './ui';

// No backend needed: the form composes a message and hands it to
// WhatsApp or the visitor's email client, pre-filled.
const compose = (f) =>
  [
    'Booking enquiry for SANCTÜS',
    '',
    `Name: ${f.name}`,
    f.type ? `Event: ${f.type}` : null,
    f.date ? `Date: ${f.date}` : null,
    f.venue ? `Venue / City: ${f.venue}` : null,
    '',
    f.message,
  ]
    .filter((l) => l !== null)
    .join('\n');

export default function Booking() {
  const [f, setF] = useState({ name: '', type: '', date: '', venue: '', message: '' });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const send = (via) => (e) => {
    e.preventDefault();
    const form = e.currentTarget.form || e.currentTarget;
    if (!form.reportValidity()) return;
    const text = compose(f);
    const url =
      via === 'whatsapp'
        ? `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`
        : `mailto:${CONTACT.email}?subject=${encodeURIComponent(
            `Booking: ${f.type || 'Event'}${f.date ? ` · ${f.date}` : ''}`
          )}&body=${encodeURIComponent(text)}`;
    window.open(url, via === 'whatsapp' ? '_blank' : '_self');
  };

  return (
    <section id="book" className="relative bg-bone py-16 sm:py-24 text-ink md:py-36">
      <header className="gutter mx-auto max-w-site">
        <div className="flex items-center justify-between border-t border-ink/15 pt-4">
          <span className="label text-ink/60">
            <span className="text-signal">07</span> / Bookings
          </span>
          <span className="label hidden text-ink/60 sm:block">Open for 2026–27</span>
        </div>
        <Reveal as="h2" className="display mt-8 text-[clamp(3rem,11vw,10rem)]">
          Book SANCTÜS
        </Reveal>
      </header>

      <div className="gutter mx-auto mt-12 grid max-w-site gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="max-w-md text-lg leading-relaxed text-ink/70">
            Club nights, house parties, sundowners, festivals, private events and guest mixes. Tell me
            about the room and the crowd, and I'll build the set around it.
          </p>

          <dl className="mt-10">
            {[
              ['Email', CONTACT.email, `mailto:${CONTACT.email}`],
              ['Phone', CONTACT.phoneDisplay, `tel:${CONTACT.phone}`],
              ['WhatsApp', CONTACT.phoneDisplay, `https://wa.me/${CONTACT.whatsapp}`],
              ['Based', CONTACT.city, null],
            ].map(([k, v, href]) => (
              <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-4 border-t sm:grid-cols-3 border-ink/15 py-4">
                <dt className="label pt-0.5 text-ink/60">{k}</dt>
                <dd className="min-w-0 break-words sm:col-span-2 font-medium">
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="break-words hover:text-signal">
                      {v} <ArrowUpRight size={14} className="inline align-baseline" />
                    </a>
                  ) : (
                    v
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <a
            href={LINKS.presskit}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mt-8 h-14 w-full bg-signal text-ink hover:bg-ink hover:text-bone sm:w-auto"
          >
            <Download size={16} /> Download Presskit
          </a>
          <p className="mt-3 text-sm text-ink/50">Bio, photos and logos for promoters. Opens Google Drive.</p>
        </div>

        <form className="lg:col-span-7 lg:pl-8" onSubmit={send('whatsapp')}>
          <fieldset>
            <legend className="label mb-4 text-ink/60">Event type</legend>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((t) => (
                <label key={t} className="cursor-pointer">
                  <input type="radio" name="type" value={t} checked={f.type === t} onChange={set('type')} className="peer sr-only" />
                  <span className="inline-block border border-ink/25 px-4 py-2 text-sm transition-colors hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-bone peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-signal">
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {[
              ['name', 'Your name', 'text', true],
              ['date', 'Date', 'date', false],
            ].map(([k, label, type, req]) => (
              <label key={k} className="block">
                <span className="label text-ink/60">{label}{req && ' *'}</span>
                <input type={type} required={req} value={f[k]} onChange={set(k)} className="field-light" />
              </label>
            ))}
            <label className="block sm:col-span-2">
              <span className="label text-ink/60">Venue / City</span>
              <input type="text" value={f.venue} onChange={set('venue')} className="field-light" placeholder="e.g. Club name, Jaipur" />
            </label>
            <label className="block sm:col-span-2">
              <span className="label text-ink/60">Details *</span>
              <textarea
                required
                rows={4}
                value={f.message}
                onChange={set('message')}
                className="field-light resize-none"
                placeholder="Set length, expected crowd, sound system, vibe…"
              />
            </label>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="btn h-14 w-full sm:w-auto sm:flex-1 bg-ink text-bone hover:bg-signal hover:text-ink">
              <MessageCircle size={16} /> Send via WhatsApp
            </button>
            <button type="button" onClick={send('email')} className="btn h-14 w-full sm:w-auto sm:flex-1 border border-ink/30 hover:border-ink hover:bg-ink hover:text-bone">
              <Mail size={16} /> Send via Email
            </button>
          </div>
          <p className="mt-4 text-sm text-ink/50">Opens WhatsApp or your mail app with everything filled in.</p>
        </form>
      </div>
    </section>
  );
}
