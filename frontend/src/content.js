// Single source of truth for site copy and links.
// Edit this file to update bio, genres, sets, socials, or booking details.

export const LINKS = {
  instagram: 'https://www.instagram.com/sanctus_dj/',
  instagramRadio: 'https://www.instagram.com/sanctus.radio/',
  soundcloud: 'https://soundcloud.com/sanctus-dj',
  mixcloud: 'https://www.mixcloud.com/sanctus_dj/',
  youtube: 'https://www.youtube.com/@sanctusdj',
  instagramDm: 'https://ig.me/m/sanctus_dj',
  presskit: 'https://drive.google.com/drive/folders/1glM9DPcRGclsUADrXC0hxB3v3mCjVj-c',
};

export const CONTACT = {
  email: 'bookings.sanctus@gmail.com',
  phoneDisplay: '+91 96020 91364',
  phone: '+919602091364',
  whatsapp: '919602091364',
  city: 'Jaipur, Rajasthan, IN',
};

export const BIO = {
  roles: ['DJ', 'Producer', 'Selecta'],
  lead:
    'SANCTÜS is a Jaipur-based DJ, producer and selecta exploring the evolving sounds of electronic music. Moving between House, UK Garage, Drum & Bass, HardGroove and UK Bass, his sets bring together underground sounds, unexpected transitions and carefully curated global edits. Driven by rhythm, energy and an instinct for storytelling, SANCTÜS approaches every set as a journey rather than a genre. Blending deep selections with high-energy moments, his sound is rooted in underground culture while remaining open to the unexpected. From intimate sessions to late-night dancefloors, the focus remains the same: discovering sounds, creating connections and leaving a lasting impression.',
};

// Venues played, in display order. `note` shows as a tag (e.g. residency).
export const VENUES = [
  { name: 'Amano', note: 'F/R Resident DJ' },
  { name: 'Paro' },
  { name: 'Dyore' },
  { name: 'Savanna' },
  { name: 'HOP (House of People)' },
  { name: "D'SURA" },
  { name: "Garrison's" },
];

export const GENRES = [
  { name: 'House' },
  { name: 'UK Garage' },
  { name: 'Drum & Bass' },
  { name: 'HardGroove' },
  { name: 'UK Bass' },
  { name: 'Global Edits' },
];

// YouTube sets, in display order. The first one is featured.
export const SETS = [
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
];

// Fallback for SANCTÜS Radio if the Mixcloud API is unreachable.
// The live list is fetched from Mixcloud, so new uploads appear automatically.
export const RADIO_FALLBACK = [
  {
    key: '/sanctus_dj/gqom-3-step-mix-by-sanct%C3%BCs/',
    url: 'https://www.mixcloud.com/sanctus_dj/gqom-3-step-mix-by-sanct%C3%BCs/',
    name: 'GQOM & 3-Step Mix by SANCTÜS',
    tags: ['Gqom', 'Afro', '3step', 'Afro house'],
    created: '2026-11-09T18:21:44Z',
    length: 3644,
    image: 'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/d/b/8/e/7887-7a9e-44e8-b51f-00b6c1b84300',
  },
  {
    key: '/sanctus_dj/detroit-techno-mix-by-sanct%C3%BCs/',
    url: 'https://www.mixcloud.com/sanctus_dj/detroit-techno-mix-by-sanct%C3%BCs/',
    name: 'Detroit Techno Mix by SANCTÜS',
    tags: ['Detroit techno', 'Chicago house', 'Minimal house'],
    created: '2026-10-26T11:56:55Z',
    length: 2984,
    image: 'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/8/d/f/a/d862-ba66-4a02-89c9-6393b9812249',
  },
  {
    key: '/sanctus_dj/nu-disco-funk-house-mix-by-sanct%C3%BCs/',
    url: 'https://www.mixcloud.com/sanctus_dj/nu-disco-funk-house-mix-by-sanct%C3%BCs/',
    name: 'Nu Disco & Funk House Mix By SANCTÜS',
    tags: ['Nu-disco', 'Disco', 'Disco edits'],
    created: '2026-10-10T11:08:09Z',
    length: 3756,
    image: 'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/6/d/8/7/b88d-8cda-4839-8a44-af13df5d5354',
  },
];

export const GALLERY = [
  { src: '/img/crowd.webp', alt: 'SANCTÜS behind the decks surrounded by a crowd under purple stage light', caption: 'Open-air, Jaipur' },
  { src: '/img/balcony.webp', alt: 'SANCTÜS mixing on a Pioneer controller on a balcony at night', caption: 'Terrace set' },
  { src: '/img/jalmahal.webp', alt: 'SANCTÜS at dusk by the lake with pink clouds and hills behind', caption: 'Jal Mahal, dusk' },
  { src: '/img/headphones.webp', alt: 'Sepia portrait of SANCTÜS wearing headphones', caption: 'Studio' },
  { src: '/img/decks.webp', alt: 'Mixing on a controller at home with headphones on', caption: 'Practice room' },
  { src: '/img/profile.webp', alt: 'SANCTÜS smiling under colourful hanging banners', caption: 'Off duty' },
];

export const EVENT_TYPES = ['Club Night', 'House Party', 'Sundowner', 'Festival', 'Private / Wedding', 'Radio / Guest Mix'];
