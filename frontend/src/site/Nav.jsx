import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { LINKS } from '../content';
import { openBooking } from './BookSheet';

const ITEMS = [
  { href: '#about', label: 'About' },
  { href: '#sound', label: 'Sound' },
  { href: '#radio', label: 'Radio' },
  { href: '#sets', label: 'Sets' },
  { href: '#gallery', label: 'Gallery' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open ? 'bg-ink/85 backdrop-blur-md border-b border-line' : 'bg-transparent'
        }`}
      >
        <div className="gutter mx-auto flex h-16 max-w-site items-center justify-between">
          <a href="#top" className="wordmark text-xl" aria-label="SANCTÜS home">
            SANCTÜS
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {ITEMS.map((i) => (
              <li key={i.href}>
                <a href={i.href} className="label text-bone hover:text-signal transition-colors">
                  {i.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button onClick={openBooking} className="btn-primary hidden h-10 sm:inline-flex">
              Book
            </button>
            <button
              className="grid h-10 w-10 place-items-center md:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-ink pt-16 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ul className="gutter flex flex-col">
              {[...ITEMS, { href: '#book', label: 'Book', book: true }].map((i, n) => (
                <motion.li
                  key={i.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * n }}
                  className="rule"
                >
                  <a
                    href={i.href}
                    onClick={(e) => {
                      setOpen(false);
                      if (i.book) {
                        e.preventDefault();
                        openBooking();
                      }
                    }}
                    className="display flex items-baseline justify-between py-4 text-5xl"
                  >
                    {i.label}
                    <span className="label">{String(n + 1).padStart(2, '0')}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="gutter mt-8 flex flex-wrap gap-x-6 gap-y-2">
              <a className="label hover:text-signal" href={LINKS.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
              <a className="label hover:text-signal" href={LINKS.mixcloud} target="_blank" rel="noopener noreferrer">Mixcloud</a>
              <a className="label hover:text-signal" href={LINKS.soundcloud} target="_blank" rel="noopener noreferrer">SoundCloud</a>
              <a className="label hover:text-signal" href={LINKS.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
