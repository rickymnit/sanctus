import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Instagram, MessageCircle, Phone, X } from 'lucide-react';
import { CONTACT, LINKS } from '../content';

const EVENT = 'sanctus:book';

// Call from any "Book" button to open the options sheet.
export const openBooking = () => window.dispatchEvent(new Event(EVENT));

const GREETING = "Hi SANCTÜS, I'd like to book you for an event.";

const OPTIONS = [
  {
    label: 'Message on WhatsApp',
    detail: CONTACT.phoneDisplay,
    href: `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(GREETING)}`,
    icon: MessageCircle,
    external: true,
  },
  {
    label: 'Call',
    detail: CONTACT.phoneDisplay,
    href: `tel:${CONTACT.phone}`,
    icon: Phone,
  },
  {
    label: 'Message on Instagram',
    detail: '@sanctus_dj',
    href: LINKS.instagramDm,
    icon: Instagram,
    external: true,
  },
];

export default function BookSheet() {
  const [open, setOpen] = useState(false);
  const firstRef = useRef(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(EVENT, onOpen);
    return () => window.removeEventListener(EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => firstRef.current?.focus(), 50);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      clearTimeout(t);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[75] flex items-end justify-center bg-ink/80 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-sheet-title"
            className="w-full max-w-md border border-line bg-ink-2 p-6 pb-8 sm:pb-6"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="label text-signal">Bookings</p>
                <h2 id="book-sheet-title" className="display mt-2 text-5xl">Book SANCTÜS</h2>
              </div>
              <button onClick={close} className="grid h-10 w-10 shrink-0 place-items-center border border-line hover:border-bone" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <ul className="mt-6">
              {OPTIONS.map(({ label, detail, href, icon: Icon, external }, i) => (
                <li key={label} className="rule">
                  <a
                    ref={i === 0 ? firstRef : undefined}
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    onClick={close}
                    className="group flex items-center gap-4 py-4"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center bg-signal text-ink transition-colors group-hover:bg-bone">
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-semibold group-hover:text-signal">{label}</span>
                      <span className="label normal-case tracking-normal">{detail}</span>
                    </span>
                    <ArrowRight size={18} className="text-bone-mute transition-transform group-hover:translate-x-1 group-hover:text-bone" />
                  </a>
                </li>
              ))}
            </ul>

            <a href="#book" onClick={close} className="rule label block pt-4 text-center hover:text-signal">
              Or fill in the booking form ↓
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
