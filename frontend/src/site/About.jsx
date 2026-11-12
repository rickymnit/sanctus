import { Download } from 'lucide-react';
import { BIO, CONTACT, LINKS } from '../content';
import { Reveal, SectionHead } from './ui';

const FACTS = [
  ['Based', CONTACT.city],
  ['Roles', BIO.roles.join(', ')],
  ['Resident', 'Amano (F/R Resident DJ)'],
  ['Shows', 'SANCTÜS Radio, on Mixcloud & YouTube'],
  ['Plays', 'Clubs, house parties, sundowners, festivals'],
];

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-24 md:py-36">
      <SectionHead index="01" label="About" aside="Est. Jaipur" />

      <div className="gutter mx-auto mt-12 grid max-w-site gap-10 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-5">
          <figure className="relative">
            <img
              src="/img/portrait-bw.webp"
              alt="Black and white portrait of SANCTÜS adjusting his headphones"
              className="aspect-[4/5] w-full object-cover object-[60%_40%]"
              loading="lazy"
            />
            <figcaption className="label mt-3 flex justify-between">
              <span>Portrait</span>
              <span>SANCTÜS</span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="md:col-span-7 md:pl-8 lg:pl-16">
          <Reveal as="p" className="text-[clamp(1.15rem,1.6vw,1.6rem)] font-medium leading-[1.4] tracking-tight">
            {BIO.lead}
          </Reveal>

          <Reveal as="dl" delay={0.15} className="mt-12">
            {FACTS.map(([k, v]) => (
              <div key={k} className="rule grid grid-cols-[5.5rem_1fr] gap-4 py-4 sm:grid-cols-3">
                <dt className="label pt-0.5">{k}</dt>
                <dd className="min-w-0 sm:col-span-2 text-bone">{v}</dd>
              </div>
            ))}
            <div className="rule grid grid-cols-[5.5rem_1fr] gap-4 py-4 sm:grid-cols-3">
              <dt className="label pt-0.5">Follow</dt>
              <dd className="min-w-0 sm:col-span-2 flex flex-wrap gap-x-5 gap-y-1">
                <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:text-signal hover:decoration-signal">
                  @sanctus_dj
                </a>
                <a href={LINKS.instagramRadio} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:text-signal hover:decoration-signal">
                  @sanctus.radio
                </a>
              </dd>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="mt-10">
            <a href={LINKS.presskit} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <Download size={16} /> Download Presskit
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
