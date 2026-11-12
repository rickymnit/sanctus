import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Play, X } from 'lucide-react';
import { LINKS, SETS } from '../content';
import { Reveal, SectionHead } from './ui';

function Thumb({ set, onOpen, large = false }) {
  return (
    <button onClick={() => onOpen(set)} className="group block w-full text-left" aria-label={`Watch ${set.title}`}>
      <div className="relative overflow-hidden bg-ink-3">
        <img
          src={set.image}
          alt=""
          loading="lazy"
          className="aspect-video w-full object-cover transition duration-700 group-hover:scale-[1.03] group-hover:brightness-75"
        />
        <span
          className={`absolute bottom-0 left-0 grid place-items-center bg-signal text-ink transition-colors group-hover:bg-bone ${
            large ? 'h-16 w-16' : 'h-12 w-12'
          }`}
        >
          <Play size={large ? 22 : 18} fill="currentColor" />
        </span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <span className="label text-signal">{set.genre}</span>
          <h3 className={`mt-1 font-semibold leading-tight group-hover:text-signal transition-colors ${large ? 'text-2xl sm:text-3xl' : 'text-lg'}`}>
            {set.title}
          </h3>
          <p className="mt-1 text-sm text-bone-dim">{set.note}</p>
        </div>
      </div>
    </button>
  );
}

export default function Sets() {
  const [open, setOpen] = useState(null);
  const [featured, ...rest] = SETS;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <section id="sets" className="bg-ink-2 py-16 sm:py-24 md:py-36">
      <SectionHead index="05" label="Sets" title="Recorded Sets" aside="Video" />

      <div className="gutter mx-auto mt-12 grid max-w-site gap-x-8 gap-y-14 md:grid-cols-12">
        <Reveal className="md:col-span-8">
          <Thumb set={featured} onOpen={setOpen} large />
        </Reveal>
        <div className="grid gap-y-14 md:col-span-4">
          {rest.slice(0, 2).map((s, i) => (
            <Reveal key={s.id} delay={0.05 * (i + 1)}>
              <Thumb set={s} onOpen={setOpen} />
            </Reveal>
          ))}
        </div>
        {rest.slice(2).map((s, i) => (
          <Reveal key={s.id} delay={0.05 * i} className="md:col-span-4">
            <Thumb set={s} onOpen={setOpen} />
          </Reveal>
        ))}
        <Reveal className="flex items-end md:col-span-4">
          <a href={LINKS.youtube} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full">
            All sets on YouTube <ArrowUpRight size={14} />
          </a>
        </Reveal>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
          >
            <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="truncate font-semibold">{open.title}</p>
                <button onClick={() => setOpen(null)} className="grid h-10 w-10 shrink-0 place-items-center border border-line hover:border-bone" aria-label="Close video">
                  <X size={18} />
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${open.id}?autoplay=1&rel=0`}
                  title={open.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
