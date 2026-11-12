// The site's built-in content. Used until the admin panel saves something,
// and as a fallback for any field the saved content is missing.
// Shape here == shape the admin panel edits == shape stored in Vercel Blob.

export const DEFAULT_CONTENT = {
  links: {
    instagram: 'https://www.instagram.com/sanctus_dj/',
    instagramRadio: 'https://www.instagram.com/sanctus.radio/',
    soundcloud: 'https://soundcloud.com/sanctus-dj',
    mixcloud: 'https://www.mixcloud.com/sanctus_dj/',
    youtube: 'https://www.youtube.com/@sanctusdj',
    instagramDm: 'https://ig.me/m/sanctus_dj',
    presskit: 'https://drive.google.com/drive/folders/1glM9DPcRGclsUADrXC0hxB3v3mCjVj-c',
  },
  handles: {
    instagram: '@sanctus_dj',
    instagramRadio: '@sanctus.radio',
    mixcloud: 'sanctus_dj',
    soundcloud: 'sanctus-dj',
    youtube: '@sanctusdj',
  },
  contact: {
    email: 'bookings.sanctus@gmail.com',
    phoneDisplay: '+91 96020 91364',
    phone: '+919602091364',
    whatsapp: '919602091364',
    city: 'Jaipur, India',
  },
  hero: {
    image: '/img/crowd.webp',
    imageAlt: 'SANCTÜS mixing for a crowd at an open-air night in Jaipur',
    focus: '50% 30%',
    tagline: 'Immersive electronic music: groove, energy and storytelling for the dancefloor.',
    location: 'Jaipur, IN',
    coordinates: '26.91°N 75.79°E',
  },
  about: {
    portrait: '/img/portrait-red.webp',
    portraitAlt: 'Portrait of SANCTÜS with headphones around his neck against a deep red backdrop',
    focus: '50% 35%',
    lead:
      'SANCTÜS is a Jaipur-based DJ, producer and selecta exploring the evolving sounds of electronic music. Moving between House, UK Garage, Drum & Bass, HardGroove and UK Bass, his sets bring together underground sounds, unexpected transitions and carefully curated global edits. Driven by rhythm, energy and an instinct for storytelling, SANCTÜS approaches every set as a journey rather than a genre. Blending deep selections with high-energy moments, his sound is rooted in underground culture while remaining open to the unexpected. From intimate sessions to late-night dancefloors, the focus remains the same: discovering sounds, creating connections and leaving a lasting impression.',
    roles: ['DJ', 'Producer', 'Selecta'],
    facts: [
      { label: 'Resident', value: 'Amano (F/R Resident DJ)' },
      { label: 'Shows', value: 'SANCTÜS Radio, on Mixcloud & YouTube' },
      { label: 'Plays', value: 'Clubs, house parties, sundowners, festivals' },
    ],
  },
  venues: [
    { name: 'Amano', note: 'F/R Resident DJ' },
    { name: 'Paro', note: '' },
    { name: 'Dyore', note: '' },
    { name: 'Savanna', note: '' },
    { name: "Garrison's", note: '' },
    { name: 'HOP (House of People)', note: '' },
    { name: "D'SURA", note: '' },
  ],
  genres: [
    { name: 'House' },
    { name: 'UK Bass' },
    { name: 'UK Garage' },
    { name: 'Drum & Bass' },
    { name: 'HardGroove' },
    { name: 'Global Edits' },
  ],
  sound: {
    intro:
      'Groove first, then energy. Sets move between deep and driving, from the first record to the last, built around the room rather than a fixed playlist.',
  },
  radio: {
    intro:
      'A regular mix series built around one genre per episode, from Gqom and 3-step to Detroit techno and nu disco. New episodes land on Mixcloud and YouTube.',
  },
  sets: [
    {
      id: 'flMwXO-50As',
      title: 'Early Morning Cinematics',
      genre: 'Afro House',
      note: 'Black Coffee, Keinemusik & more for sunrise',
      image: 'https://i.ytimg.com/vi/flMwXO-50As/maxresdefault.jpg',
    },
    {
      id: '-X48UMxQw9c',
      title: 'Bolly Tech / Afro House',
      genre: 'Afro House',
      note: 'Bollywood edits on Afro House grooves',
      image: '/img/mix-bolly.webp',
    },
    {
      id: 'nRYLjYj2EX0',
      title: 'Liquid DnB in a Dorm',
      genre: 'Liquid DnB',
      note: 'Late-night liquid, recorded in a dorm room',
      image: 'https://i.ytimg.com/vi/nRYLjYj2EX0/hqdefault.jpg',
    },
    {
      id: 'pRS0Du1DF1M',
      title: 'Liquid DnB / Jungle',
      genre: 'Drum & Bass',
      note: 'Soulful rollers into amen territory',
      image: '/img/mix-liquid.webp',
    },
    {
      id: 'b2X7h0o_HPM',
      title: 'Afro / Latin House',
      genre: 'Latin House',
      note: 'Percussion-led Latin rhythms',
      image: '/img/mix-latin.webp',
    },
  ],
  gallery: [
    { src: '/img/live-decks.webp', alt: 'SANCTÜS in a cap and paisley shirt mixing on a Pioneer controller in a dark club', caption: 'Live, behind the decks', focus: '50% 50%' },
    { src: '/img/crowd.webp', alt: 'SANCTÜS behind the decks surrounded by a crowd under purple stage light', caption: 'Open-air, Jaipur', focus: '50% 50%' },
    { src: '/img/balcony.webp', alt: 'SANCTÜS mixing on a Pioneer controller on a balcony at night', caption: 'Terrace set', focus: '50% 50%' },
    { src: '/img/after-hours.webp', alt: 'SANCTÜS in a cap and sunglasses, arms crossed, bathed in red light', caption: 'After hours', focus: '50% 50%' },
    { src: '/img/headphones.webp', alt: 'Sepia portrait of SANCTÜS wearing headphones', caption: 'Studio', focus: '50% 50%' },
    { src: '/img/jalmahal.webp', alt: 'SANCTÜS at dusk by the lake with pink clouds and hills behind', caption: 'Jal Mahal, dusk', focus: '50% 50%' },
    { src: '/img/decks.webp', alt: 'Mixing on a controller at home with headphones on', caption: 'Practice room', focus: '50% 50%' },
    { src: '/img/profile.webp', alt: 'SANCTÜS smiling under colourful hanging banners', caption: 'Off duty', focus: '50% 50%' },
  ],
  booking: {
    intro:
      "Club nights, house parties, sundowners, festivals, private events and guest mixes. Tell me about the room and the crowd, and I'll build the set around it.",
    availability: 'Open for 2026–27',
    eventTypes: ['Club Night', 'House Party', 'Sundowner', 'Festival', 'Private / Wedding', 'Radio / Guest Mix'],
  },
};

// Saved content wins, but any section or field it lacks falls back to the defaults,
// so adding new fields to the site later never breaks older saved content.
export function mergeContent(saved) {
  if (!saved || typeof saved !== 'object') return DEFAULT_CONTENT;
  const out = { ...DEFAULT_CONTENT };
  for (const [key, def] of Object.entries(DEFAULT_CONTENT)) {
    const val = saved[key];
    if (val === undefined || val === null) continue;
    if (Array.isArray(def)) out[key] = Array.isArray(val) ? val : def;
    else if (typeof def === 'object') out[key] = { ...def, ...(typeof val === 'object' ? val : {}) };
    else out[key] = val;
  }
  if (saved.updatedAt) out.updatedAt = saved.updatedAt;
  return out;
}
