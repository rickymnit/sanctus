import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { LINKS } from '../content';
import { formatDate, formatLength, pad, useRadio } from './radio';
import { Reveal, SectionHead } from './ui';

function Episode({ ep, active, onPlay }) {
  return (
    <li className="rule group grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 py-4 sm:grid-cols-[6rem_4rem_1fr_auto] sm:gap-6">
      <button
        onClick={onPlay}
        className="relative aspect-square w-full overflow-hidden bg-ink-3"
        aria-label={active ? `Now playing ${ep.name}` : `Play ${ep.name}`}
      >
        {ep.image && <img src={ep.image} alt="" className="h-full w-full object-cover" loading="lazy" />}
        <span
          className={`absolute inset-0 grid place-items-center bg-ink/60 transition-opacity ${
            active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          {active ? (
            <span className="eq flex items-end gap-[3px] text-signal"><span /><span /><span /></span>
          ) : (
            <Play size={22} fill="currentColor" />
          )}
        </span>
      </button>

      <span className="label hidden text-signal sm:block">EP {pad(ep.number)}</span>

      <div className="min-w-0">
        <span className="label block text-signal sm:hidden">EP {pad(ep.number)}</span>
        <button onClick={onPlay} className="block max-w-full text-left">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug sm:truncate sm:text-2xl group-hover:text-signal transition-colors">{ep.name}</h3>
        </button>
        <p className="label mt-1 truncate normal-case tracking-normal">
          {formatDate(ep.created)} · {formatLength(ep.length)}
          {ep.tags.length > 0 && <span className="hidden md:inline"> · {ep.tags.slice(0, 3).join(', ')}</span>}
        </p>
      </div>

      <a
        href={ep.url}
        target="_blank"
        rel="noopener noreferrer"
        className="grid h-10 w-10 place-items-center border border-line text-bone-dim hover:border-bone hover:text-bone"
        aria-label={`Open ${ep.name} on Mixcloud`}
      >
        <ArrowUpRight size={16} />
      </a>
    </li>
  );
}

export default function Radio() {
  const { episodes, playing, play, stop } = useRadio();
  const latest = episodes[0];
  const isLatestPlaying = playing?.key === latest?.key;

  return (
    <section id="radio" className="py-16 sm:py-24 md:py-36">
      <SectionHead index="04" label="Radio" aside="Mixcloud · YouTube" />

      <div className="gutter mx-auto mt-12 max-w-site">
        {/* Show header */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Reveal as="h2" className="wordmark text-[clamp(2.75rem,7.4vw,6.5rem)]">
              SANCTÜS
              <span className="display mt-[0.15em] block font-sans text-signal">Radio</span>
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-8 max-w-xl text-lg leading-relaxed text-bone-dim">
              A regular mix series built around one genre per episode, from Gqom and 3-step to Detroit
              techno and nu disco. New episodes land on Mixcloud and YouTube.
            </Reveal>
            <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-3">
              <a href={LINKS.mixcloud} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                Follow on Mixcloud <ArrowUpRight size={14} />
              </a>
              <a href={LINKS.instagramRadio} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                @sanctus.radio <ArrowUpRight size={14} />
              </a>
              <a href={LINKS.youtube} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                YouTube <ArrowUpRight size={14} />
              </a>
            </Reveal>
          </div>

          {latest && (
            <Reveal delay={0.1} className="lg:col-span-5">
              <div className="relative bg-ink-2 p-4">
                <div className="label mb-3 flex justify-between">
                  <span className="text-signal">Latest · EP {pad(latest.number)}</span>
                  <span>{formatLength(latest.length)}</span>
                </div>
                <button
                  onClick={() => (isLatestPlaying ? stop() : play(latest))}
                  className="group relative block w-full overflow-hidden"
                  aria-label={isLatestPlaying ? 'Stop' : `Play ${latest.name}`}
                >
                  <img src={latest.image} alt="" className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  <span className="absolute bottom-4 left-4 grid h-16 w-16 place-items-center bg-signal text-ink transition-colors group-hover:bg-bone">
                    {isLatestPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
                  </span>
                </button>
                <h3 className="mt-4 text-xl font-semibold">{latest.name}</h3>
                <p className="label mt-1 normal-case tracking-normal">{latest.tags.join(' · ')}</p>
              </div>
            </Reveal>
          )}
        </div>

        {/* Episode list */}
        <div className="mt-20">
          <div className="label mb-2 flex justify-between">
            <span>All episodes</span>
            <span>{episodes.length} total</span>
          </div>
          <ol>
            {episodes.map((ep) => (
              <Episode key={ep.key} ep={ep} active={playing?.key === ep.key} onPlay={() => play(ep)} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
