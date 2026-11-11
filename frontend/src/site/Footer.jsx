import { CONTACT, LINKS } from '../content';

const SOCIALS = [
  ['Instagram', '@sanctus_dj', LINKS.instagram],
  ['Radio', '@sanctus.radio', LINKS.instagramRadio],
  ['Mixcloud', 'sanctus_dj', LINKS.mixcloud],
  ['SoundCloud', 'sanctus-dj', LINKS.soundcloud],
  ['YouTube', '@sanctusdj', LINKS.youtube],
];

export default function Footer() {
  return (
    <footer className="overflow-hidden pt-20">
      <div className="gutter mx-auto grid max-w-site gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="label">Contact</p>
          <a href={`mailto:${CONTACT.email}`} className="mt-3 block break-words text-lg hover:text-signal">
            {CONTACT.email}
          </a>
          <a href={`tel:${CONTACT.phone}`} className="mt-1 block text-lg hover:text-signal">
            {CONTACT.phoneDisplay}
          </a>
          <a href={LINKS.presskit} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-6">
            Download Presskit ↗
          </a>
        </div>
        <ul className="md:col-span-8 md:columns-2 md:gap-8">
          {SOCIALS.map(([name, handle, href]) => (
            <li key={name} className="break-inside-avoid">
              <a href={href} target="_blank" rel="noopener noreferrer" className="group rule flex items-baseline justify-between py-3">
                <span className="font-semibold group-hover:text-signal">{name}</span>
                <span className="label group-hover:text-bone">{handle} ↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="gutter mx-auto mt-16 max-w-site">
        <p className="wordmark select-none whitespace-nowrap text-center text-[clamp(2.5rem,14.6vw,13.5rem)] text-bone/[0.07]" aria-hidden="true">
          SANCTÜS
        </p>
        <div className="rule label flex flex-col gap-2 py-6 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} SANCTÜS · Jaipur</span>
          <a href="#top" className="hover:text-signal">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
