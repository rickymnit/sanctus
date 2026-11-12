import { useContent } from '../cms/ContentProvider';
import { Reveal, SectionHead } from './ui';

// Asymmetric layout on desktop; simple 2-col on mobile.
const SPANS = [
  'col-span-2 md:col-span-8 md:row-span-2 aspect-[16/10] md:aspect-auto',
  'col-span-1 md:col-span-4 aspect-square',
  'col-span-1 md:col-span-4 aspect-square',
  'col-span-1 md:col-span-4 aspect-[4/5]',
  'col-span-1 md:col-span-4 aspect-[4/5]',
  'col-span-2 md:col-span-4 aspect-[16/10] md:aspect-[4/5]',
  'col-span-1 md:col-span-6 aspect-[4/5] md:aspect-[16/10]',
  'col-span-1 md:col-span-6 aspect-[4/5] md:aspect-[16/10]',
];

export default function Gallery() {
  const { gallery: GALLERY, links: LINKS, handles } = useContent();
  return (
    <section id="gallery" className="py-16 sm:py-24 md:py-36">
      <SectionHead index="06" label="Gallery" title="On the Floor" aside="Jaipur & around" />

      <div className="gutter mx-auto mt-12 grid max-w-site grid-cols-2 gap-2 md:grid-cols-12 md:gap-3">
        {GALLERY.map((img, i) => (
          <Reveal as="figure" key={`${img.src}-${i}`} delay={0.04 * i} className={`group relative overflow-hidden bg-ink-3 ${SPANS[i] || 'col-span-1 md:col-span-4 aspect-square'}`}>
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              style={{ objectPosition: img.focus || '50% 50%' }}
              className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0 group-hover:scale-[1.02]"
            />
            {img.caption && <figcaption className="label absolute bottom-0 left-0 bg-ink/80 px-2 py-1 text-bone">{img.caption}</figcaption>}
          </Reveal>
        ))}
      </div>

      <div className="gutter mx-auto mt-8 max-w-site">
        <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="label hover:text-signal">
          More on Instagram {handles.instagram} ↗
        </a>
      </div>
    </section>
  );
}
