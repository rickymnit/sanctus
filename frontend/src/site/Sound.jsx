import { GENRES } from '../content';
import { Reveal, SectionHead } from './ui';

export default function Sound() {
  return (
    <section id="sound" className="relative overflow-hidden bg-ink-2 py-16 sm:py-24 md:py-36">
      <SectionHead index="03" label="Sound" title="The Sound" />

      <div className="gutter mx-auto mt-12 grid max-w-site gap-12 lg:grid-cols-12">
        <Reveal as="p" className="max-w-sm text-lg leading-relaxed text-bone-dim lg:col-span-4">
          Groove first, then energy. Sets move between deep and driving, from the first record to the
          last, built around the room rather than a fixed playlist.
        </Reveal>

        <ol className="lg:col-span-8">
          {GENRES.map((g, i) => (
            <Reveal
              as="li"
              key={g.name}
              delay={i * 0.04}
              className="group rule grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 py-5 transition-colors hover:bg-ink-3 sm:grid-cols-[3.5rem_1fr] sm:px-3"
            >
              <span className="label text-bone-mute group-hover:text-signal">{String(i + 1).padStart(2, '0')}</span>
              <span className="display text-[clamp(2rem,5vw,3.75rem)] transition-colors group-hover:text-signal">
                {g.name}
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
