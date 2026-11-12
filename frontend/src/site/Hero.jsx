import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, Play } from 'lucide-react';
import { useContent } from '../cms/ContentProvider';
import { pad, useRadio } from './radio';
import { openBooking } from './BookSheet';

export default function Hero() {
  const { episodes, play } = useRadio();
  const { hero, about, genres } = useContent();
  const names = genres.map((g) => g.name);
  const half = Math.ceil(names.length / 2);
  const latest = episodes[0];
  const reduce = useReducedMotion();
  const enter = (d) =>
    reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: d } };

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Photo */}
      <div className="absolute inset-0">
        <img
          src={hero.image}
          alt={hero.imageAlt}
          style={{ objectPosition: hero.focus || '50% 30%' }}
          className="h-full w-full object-cover grayscale contrast-[1.15] brightness-[0.55]"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60" />
      </div>

      {/* Meta row */}
      <div className="gutter relative mx-auto mt-24 grid w-full max-w-site grid-cols-2 gap-6 md:grid-cols-4">
        <motion.p className="label text-bone" {...enter(0.2)}>
          {about.roles.join(' / ')}
        </motion.p>
        <motion.p className="label text-bone" {...enter(0.3)}>
          {hero.location}
          <br />
          <span className="text-bone-dim">{hero.coordinates}</span>
        </motion.p>
        <motion.p className="label col-span-2 hidden text-bone md:block" {...enter(0.4)}>
          {names.slice(0, half).join(' · ')}
          <br />
          {names.slice(half).join(' · ')}
        </motion.p>
      </div>

      {/* Wordmark */}
      <div className="relative mt-auto">
        <div className="gutter mx-auto max-w-site">
          {latest && (
            <motion.button
              onClick={() => play(latest)}
              className="group mb-[clamp(1.5rem,3vw,3rem)] flex max-w-full items-center gap-4 text-left"
              {...enter(0.9)}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center bg-signal text-ink transition-colors group-hover:bg-bone">
                <Play size={18} fill="currentColor" />
              </span>
              <span className="min-w-0">
                <span className="label block text-signal">New on SANCTÜS Radio · EP {pad(latest.number)}</span>
                <span className="block truncate text-lg font-semibold">{latest.name}</span>
              </span>
            </motion.button>
          )}

          <motion.h1
            className="wordmark pb-[0.06em] text-[clamp(2.5rem,14.6vw,13.5rem)] -ml-[0.05em] whitespace-nowrap"
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          >
            SANCTÜS
          </motion.h1>
        </div>

        <div className="gutter mx-auto flex max-w-site flex-col gap-4 border-t border-line py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm text-bone-dim">
            {hero.tagline}
          </p>
          <div className="flex gap-3">
            <a href="#radio" className="btn-ghost h-11 flex-1 sm:flex-none">Listen</a>
            <button onClick={openBooking} className="btn-primary h-11 flex-1 sm:flex-none">
              Book a set <ArrowDownRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
