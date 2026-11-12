import { useEffect, useState } from 'react';
import { Download, History, ImagePlus, RotateCcw, Youtube } from 'lucide-react';
import ImageField, { useImageUpload } from './ImageField';
import { api } from './api';
import { Button, Card, ChipList, ListEditor, Spinner, TextArea, TextInput, urlWarning } from './ui';
import { DEFAULT_CONTENT } from '../cms/defaults';
import { useToast } from './toast';

// Each editor gets the section's current value and a setter for it.
const patch = (value, onChange) => (p) => onChange({ ...value, ...p });

/* ------------------------------------------------------------------ Hero */

function HeroEditor({ value, onChange }) {
  const set = patch(value, onChange);
  return (
    <>
      <Card title="Main photo" description="The full-screen photo behind the big SANCTÜS title. It’s shown in black & white and darkened so the text stays readable.">
        <ImageField
          name="hero"
          src={value.image}
          alt={value.imageAlt}
          focus={value.focus}
          previewAspect="9 / 12"
          aspectKey="original"
          sizeWidth={2000}
          grayscale
          help="Best: a wide, high-resolution live photo. Phones show a tall slice of it, so set the focal point on the artist."
          onChange={(p) => set({ ...(p.src !== undefined && { image: p.src }), ...(p.focus !== undefined && { focus: p.focus }), ...(p.alt !== undefined && { imageAlt: p.alt }) })}
        />
      </Card>
      <Card title="Text">
        <TextArea label="Tagline" rows={2} max={140} value={value.tagline} onChange={(v) => set({ tagline: v })} help="One short line under the title." />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput label="Location" value={value.location} onChange={(v) => set({ location: v })} placeholder="Jaipur, IN" />
          <TextInput label="Coordinates" value={value.coordinates} onChange={(v) => set({ coordinates: v })} placeholder="26.91°N 75.79°E" />
        </div>
        <p className="text-xs text-bone-dim">The roles (DJ / Producer…) come from <b className="text-bone">About</b>, and the genre lines from <b className="text-bone">Sound</b>.</p>
      </Card>
    </>
  );
}

/* ----------------------------------------------------------------- About */

function AboutEditor({ value, onChange }) {
  const set = patch(value, onChange);
  return (
    <>
      <Card title="Portrait">
        <ImageField
          name="portrait"
          src={value.portrait}
          alt={value.portraitAlt}
          focus={value.focus}
          previewAspect="4 / 5"
          aspectKey="4:5"
          sizeWidth={1400}
          help="Shown in colour, tall 4:5 shape."
          onChange={(p) => set({ ...(p.src !== undefined && { portrait: p.src }), ...(p.focus !== undefined && { focus: p.focus }), ...(p.alt !== undefined && { portraitAlt: p.alt }) })}
        />
      </Card>
      <Card title="Bio">
        <TextArea label="Bio" rows={9} max={1200} value={value.lead} onChange={(v) => set({ lead: v })} help="The main paragraph next to the portrait. Around 80–150 words reads best." />
        <ChipList label="Roles" value={value.roles} onChange={(v) => set({ roles: v })} help="Shown at the top of the homepage and in the facts list." />
      </Card>
      <Card title="Quick facts" description="The list under the bio. “Based” (from Contact) and “Roles” are added automatically at the top.">
        <ListEditor
          items={value.facts}
          onChange={(v) => set({ facts: v })}
          newItem={() => ({ label: '', value: '' })}
          itemTitle={(f) => f.label || 'New fact'}
          addLabel="Add fact"
          compact
          renderItem={(f, up) => (
            <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
              <TextInput label="Label" value={f.label} onChange={(v) => up({ ...f, label: v })} placeholder="Resident" />
              <TextInput label="Text" value={f.value} onChange={(v) => up({ ...f, value: v })} placeholder="Amano (F/R Resident DJ)" />
            </div>
          )}
        />
      </Card>
    </>
  );
}

/* ---------------------------------------------------------------- Venues */

function VenuesEditor({ value, onChange }) {
  return (
    <Card title="Venues played" description="Shown as tags in the “Played at” section. Add a highlight (like “Resident DJ”) to make a venue stand out in orange.">
      <ListEditor
        items={value}
        onChange={onChange}
        newItem={() => ({ name: '', note: '' })}
        itemTitle={(v) => v.name || 'New venue'}
        addLabel="Add venue"
        compact
        renderItem={(v, up) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput label="Venue name" value={v.name} onChange={(x) => up({ ...v, name: x })} placeholder="Club name" />
            <TextInput label="Highlight (optional)" value={v.note} onChange={(x) => up({ ...v, note: x })} placeholder="e.g. Resident DJ" />
          </div>
        )}
      />
    </Card>
  );
}

/* ----------------------------------------------------------------- Sound */

function SoundEditor({ genres, sound, setGenres, setSound }) {
  return (
    <>
      <Card title="Intro">
        <TextArea label="Intro text" rows={3} max={300} value={sound.intro} onChange={(v) => setSound({ ...sound, intro: v })} />
      </Card>
      <Card title="Genres" description="Listed big in “The Sound”, scrolled in the orange ticker, and shown at the top of the homepage. Order matters.">
        <ListEditor
          items={genres}
          onChange={setGenres}
          newItem={() => ({ name: '' })}
          itemTitle={(g) => g.name || 'New genre'}
          addLabel="Add genre"
          compact
          renderItem={(g, up) => <TextInput label="Genre" value={g.name} onChange={(x) => up({ ...g, name: x })} placeholder="e.g. Afro House" />}
        />
      </Card>
    </>
  );
}

/* ----------------------------------------------------------------- Radio */

function RadioEditor({ value, onChange }) {
  return (
    <Card title="SANCTÜS Radio" description="Episodes are pulled automatically from Mixcloud. Upload a new mix there and it appears here within minutes, no editing needed.">
      <TextArea label="Intro text" rows={3} max={300} value={value.intro} onChange={(v) => onChange({ ...value, intro: v })} />
    </Card>
  );
}

/* ------------------------------------------------------------------ Sets */

export function youtubeId(input) {
  const s = (input || '').trim();
  const m = s.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
  if (m) return m[1];
  return /^[\w-]{11}$/.test(s) ? s : null;
}

function SetItem({ set: item, onChange }) {
  const [link, setLink] = useState(item.id ? `https://youtu.be/${item.id}` : '');
  const id = youtubeId(link);
  // Keep the text box in sync when the item changes underneath (reorder, history load).
  useEffect(() => {
    if (youtubeId(link) !== item.id) setLink(item.id ? `https://youtu.be/${item.id}` : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);
  const up = (p) => onChange({ ...item, ...p });
  return (
    <div className="space-y-4">
      <TextInput
        label="YouTube link"
        value={link}
        onChange={(v) => {
          setLink(v);
          const nid = youtubeId(v);
          if (nid) up({ id: nid });
        }}
        placeholder="Paste the YouTube video link"
        warning={link && !id ? 'That doesn’t look like a YouTube video link.' : null}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Title" value={item.title} onChange={(v) => up({ title: v })} />
        <TextInput label="Genre" value={item.genre} onChange={(v) => up({ genre: v })} placeholder="e.g. Afro House" />
      </div>
      <TextInput label="Short description" value={item.note} onChange={(v) => up({ note: v })} max={90} />
      <ImageField
        label="Thumbnail"
        name="set"
        src={item.image || (item.id ? `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg` : '')}
        onChange={(p) => p.src !== undefined && up({ image: p.src })}
        previewAspect="16 / 9"
        aspectKey="16:9"
        sizeWidth={1400}
        withFocus={false}
        withAlt={false}
        help={item.image ? undefined : 'Using YouTube’s thumbnail. Upload your own artwork to replace it.'}
      />
      {item.image && (
        <Button size="sm" variant="ghost" onClick={() => up({ image: '' })}>
          <Youtube size={15} /> Use YouTube thumbnail instead
        </Button>
      )}
    </div>
  );
}

function SetsEditor({ value, onChange }) {
  return (
    <Card title="Recorded sets" description="YouTube videos. The first one is shown large as the featured set. Use the arrows to change the order.">
      <ListEditor
        items={value}
        onChange={onChange}
        newItem={() => ({ id: '', title: '', genre: '', note: '', image: '' })}
        itemTitle={(s, i) => (i === 0 ? `${s.title || 'New set'} · Featured` : s.title || 'New set')}
        addLabel="Add set"
        renderItem={(s, up) => <SetItem set={s} onChange={up} />}
      />
    </Card>
  );
}

/* --------------------------------------------------------------- Gallery */

const GALLERY_SHAPES = ['16 / 10', '1 / 1', '1 / 1', '4 / 5', '4 / 5', '16 / 10', '4 / 5', '4 / 5'];

function GalleryEditor({ value, onChange }) {
  const add = useImageUpload({
    name: 'gallery',
    aspectKey: 'original',
    sizeWidth: 1400,
    onUploaded: (url) => onChange([...value, { src: url, alt: '', caption: '', focus: '50% 50%' }]),
  });
  return (
    <Card
      title="Gallery"
      description="Photos in “On the floor”. The first photo is the big one. Photos show in black & white and turn to colour on hover."
      actions={
        <Button variant="primary" onClick={add.open}>
          <ImagePlus size={16} /> Add photo
        </Button>
      }
    >
      <ListEditor
        items={value}
        onChange={onChange}
        itemTitle={(g, i) => (i === 0 ? `${g.caption || 'Photo'} · Large` : g.caption || 'Photo')}
        emptyText="No photos yet. Use “Add photo”."
        renderItem={(g, up, i) => (
          <div className="space-y-4">
            <ImageField
              name="gallery"
              src={g.src}
              alt={g.alt}
              focus={g.focus}
              grayscale
              previewAspect={GALLERY_SHAPES[i] || '1 / 1'}
              aspectKey="original"
              sizeWidth={1400}
              onChange={(p) => up({ ...g, ...p })}
            />
            <TextInput label="Caption" value={g.caption} onChange={(v) => up({ ...g, caption: v })} max={40} placeholder="e.g. Open-air, Jaipur" help="Short label shown on the photo. Leave empty for none." />
          </div>
        )}
      />
      {add.editor}
    </Card>
  );
}

/* --------------------------------------------------------------- Booking */

function BookingEditor({ value, onChange }) {
  const set = patch(value, onChange);
  return (
    <Card title="Booking section" description="Phone, email and WhatsApp numbers are edited under Contact & links.">
      <TextArea label="Intro text" rows={3} max={300} value={value.intro} onChange={(v) => set({ intro: v })} />
      <TextInput label="Availability note" value={value.availability} onChange={(v) => set({ availability: v })} placeholder="Open for 2026–27" help="Small label at the top right. Leave empty to hide." />
      <ChipList label="Event types" value={value.eventTypes} onChange={(v) => set({ eventTypes: v })} help="Choices in the booking form." />
    </Card>
  );
}

/* --------------------------------------------------------------- Contact */

const PLATFORMS = [
  ['instagram', 'Instagram'],
  ['instagramRadio', 'Radio Instagram'],
  ['mixcloud', 'Mixcloud'],
  ['soundcloud', 'SoundCloud'],
  ['youtube', 'YouTube'],
];

function ContactEditor({ contact, links, handles, setContact, setLinks, setHandles }) {
  const c = patch(contact, setContact);
  const l = patch(links, setLinks);
  const h = patch(handles, setHandles);
  const emailWarn = contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) ? 'Check the email address.' : null;
  return (
    <>
      <Card title="Contact details" description="Used in the booking section, the “Book” pop-up and the footer.">
        <TextInput label="Booking email" type="email" value={contact.email} onChange={(v) => c({ email: v })} warning={emailWarn} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput label="Phone (as shown)" value={contact.phoneDisplay} onChange={(v) => c({ phoneDisplay: v })} placeholder="+91 96020 91364" />
          <TextInput
            label="Phone for the call button"
            value={contact.phone}
            onChange={(v) => c({ phone: v.replace(/[^\d+]/g, '') })}
            placeholder="+919602091364"
            help="With country code, no spaces."
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput
            label="WhatsApp number"
            value={contact.whatsapp}
            onChange={(v) => c({ whatsapp: v.replace(/\D/g, '') })}
            placeholder="919602091364"
            help="Country code + number, digits only."
          />
          <TextInput label="City" value={contact.city} onChange={(v) => c({ city: v })} placeholder="Jaipur, India" />
        </div>
      </Card>
      <Card title="Press kit">
        <TextInput label="Press kit link" value={links.presskit} onChange={(v) => l({ presskit: v })} warning={urlWarning(links.presskit)} help="Google Drive folder or PDF link. Used by every “Presskit” button." />
      </Card>
      <Card title="Social links" description="Profile link and the @handle shown next to it.">
        {PLATFORMS.map(([key, name]) => (
          <div key={key} className="grid gap-3 sm:grid-cols-[1fr_11rem]">
            <TextInput label={`${name} link`} value={links[key]} onChange={(v) => l({ [key]: v })} warning={urlWarning(links[key])} />
            <TextInput label="Handle" value={handles[key]} onChange={(v) => h({ [key]: v })} />
          </div>
        ))}
        <TextInput label="Instagram DM link" value={links.instagramDm} onChange={(v) => l({ instagramDm: v })} warning={urlWarning(links.instagramDm)} help="Opens a direct message. Format: https://ig.me/m/yourhandle" />
      </Card>
    </>
  );
}

/* --------------------------------------------------------------- History */

const when = (iso) =>
  new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

function HistoryEditor({ draft, loadDraft }) {
  const toast = useToast();
  const [versions, setVersions] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    api.history().then((r) => setVersions(r.versions)).catch((e) => {
      setVersions([]);
      toast.error(e.message);
    });
  }, [toast]);

  const load = async (id) => {
    setLoading(id);
    try {
      loadDraft(await api.version(id));
      toast.success('Version loaded. Check the preview, then press Publish to make it live.');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(null);
    }
  };

  const backup = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' }));
    a.download = `sanctus-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <Card title="Past versions" description="Every time you publish, a copy is kept (last 30). Load one to bring it back; nothing changes on the live site until you publish.">
        {versions === null ? (
          <div className="flex items-center gap-2 text-sm text-bone-dim"><Spinner /> Loading…</div>
        ) : versions.length === 0 ? (
          <p className="text-sm text-bone-dim">No versions yet. They appear after the first publish.</p>
        ) : (
          <ul className="divide-y divide-line rounded-md border border-line">
            {versions.map((v, i) => (
              <li key={v.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm text-bone">{when(v.savedAt)}</p>
                  {i === 0 && <p className="text-xs text-emerald-400">Live now</p>}
                </div>
                <Button size="sm" onClick={() => load(v.id)} disabled={loading === v.id}>
                  {loading === v.id ? <Spinner size={14} /> : <History size={15} />} Load
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card title="Backup & reset">
        <div className="flex flex-wrap gap-2">
          <Button onClick={backup}>
            <Download size={16} /> Download backup
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (window.confirm('Load the original built-in content into the editor? You can still discard before publishing.')) {
                loadDraft(DEFAULT_CONTENT);
                toast.success('Original content loaded. Publish to make it live.');
              }
            }}
          >
            <RotateCcw size={16} /> Load original content
          </Button>
        </div>
      </Card>
    </>
  );
}

/* --------------------------------------------------------------- Registry */

export const SECTIONS = [
  { key: 'hero', label: 'Home', anchor: 'top', render: (d, s) => <HeroEditor value={d.hero} onChange={(v) => s('hero', v)} /> },
  { key: 'about', label: 'About', anchor: 'about', render: (d, s) => <AboutEditor value={d.about} onChange={(v) => s('about', v)} /> },
  { key: 'venues', label: 'Venues', anchor: 'venues', render: (d, s) => <VenuesEditor value={d.venues} onChange={(v) => s('venues', v)} /> },
  {
    key: 'sound',
    label: 'Sound',
    anchor: 'sound',
    render: (d, s) => <SoundEditor genres={d.genres} sound={d.sound} setGenres={(v) => s('genres', v)} setSound={(v) => s('sound', v)} />,
  },
  { key: 'radio', label: 'Radio', anchor: 'radio', render: (d, s) => <RadioEditor value={d.radio} onChange={(v) => s('radio', v)} /> },
  { key: 'sets', label: 'Sets', anchor: 'sets', render: (d, s) => <SetsEditor value={d.sets} onChange={(v) => s('sets', v)} /> },
  { key: 'gallery', label: 'Gallery', anchor: 'gallery', render: (d, s) => <GalleryEditor value={d.gallery} onChange={(v) => s('gallery', v)} /> },
  { key: 'booking', label: 'Booking', anchor: 'book', render: (d, s) => <BookingEditor value={d.booking} onChange={(v) => s('booking', v)} /> },
  {
    key: 'contact',
    label: 'Contact & links',
    anchor: 'book',
    render: (d, s) => (
      <ContactEditor
        contact={d.contact}
        links={d.links}
        handles={d.handles}
        setContact={(v) => s('contact', v)}
        setLinks={(v) => s('links', v)}
        setHandles={(v) => s('handles', v)}
      />
    ),
  },
  { key: 'history', label: 'History', anchor: null, render: (d, s, load) => <HistoryEditor draft={d} loadDraft={load} /> },
];
