import { useContent } from '../cms/ContentProvider';
import { Reveal, SectionHead } from './ui';

export default function Venues() {
  const { venues: VENUES } = useContent();
  return (
    <section id="venues" className="py-14 md:py-20">
      <SectionHead index="02" label="Venues" aside={`${VENUES.length} venues`} />

      <div className="gutter mx-auto mt-8 grid max-w-site gap-6 md:grid-cols-12 md:gap-8">
        <Reveal as="h2" className="display text-4xl md:col-span-3 md:text-5xl">
          Played At
        </Reveal>

        <Reveal as="ul" delay={0.05} className="flex flex-wrap gap-2 md:col-span-9 md:gap-3">
          {VENUES.map((v, i) => (
            <li
              key={`${v.name}-${i}`}
              className={`flex items-center gap-3 border px-4 py-2.5 ${
                v.note ? 'border-signal bg-signal text-ink' : 'border-line text-bone'
              }`}
            >
              <span className="text-lg font-semibold md:text-xl">{v.name}</span>
              {v.note && <span className="font-mono text-[10px] uppercase tracking-label">{v.note}</span>}
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
