import { supabase, supabaseEnabled, KV_TABLE, IMAGE_BUCKET } from '@/lib/supabase';

const STORAGE_KEY = 'anadameth_astronomy_society_data';

type Collection =
  | 'events'
  | 'news'
  | 'competitions'
  | 'gallery'
  | 'team'
  | 'magazines'
  | 'achievements'
  | 'resources'
  | 'messages'
  | 'registrations'
  | 'quizzes'
  | 'quizAttempts'
  | 'memberships';

// Kept permissive on purpose: the public site and admin treat rows as
// loose records (ad-hoc shapes per collection). Tightening this breaks
// ~20 call sites that read arbitrary fields.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = any;
type DataShape = Record<Collection, Row[]>;

const defaultData: DataShape = {
  events: [
    { id: '1', title: 'Night Sky Photography Workshop', date: '2026-04-12', time: '7:00 PM', location: 'School Observatory Deck', description: 'Learn to capture the Moon, constellations, and deep-sky objects with any camera. Bring a tripod if you have one.', category: 'workshop', image: '/images/featured-event.jpg', featured: true, registrationLink: '#' },
    { id: '2', title: 'Star Map Reading Session', date: '2026-03-28', time: '6:30 PM', location: 'Classroom B', description: 'Learn to read and use star maps to navigate the night sky.', category: 'workshop' },
    { id: '3', title: 'Messier Marathon', date: '2026-04-05', time: '8:00 PM', location: 'Field Trip - Dark Sky Site', description: 'Annual observation event to view as many Messier objects as possible in one night.', category: 'observation' },
    { id: '4', title: 'Rocketry Demo Day', date: '2026-04-18', time: '4:00 PM', location: 'School Grounds', description: 'Watch model rocket launches and learn about rocketry basics.', category: 'other' },
    { id: '5', title: 'Astro Quiz (Inter-School)', date: '2026-05-02', time: '10:00 AM', location: 'School Hall', description: 'Test your astronomy knowledge against students from other schools.', category: 'competition' }
  ],
  news: [
    { id: '1', title: 'New Telescope Installed', date: '2026-02-20', category: 'Club Update', description: 'We have added a 200mm reflector telescope for planetary observation. Book a session every Friday evening.', image: '/images/news-telescope.jpg' },
    { id: '2', title: 'Club Wins Regional Competition', date: '2026-02-15', category: 'Achievement', description: 'Our team secured first place in the Regional Astronomy Quiz competition.' },
    { id: '3', title: 'Summer Camp Registration Open', date: '2026-02-10', category: 'Announcement', description: 'Registration for the annual astronomy summer camp is now open. Limited spots available.' }
  ],
  competitions: [
    { id: '1', title: 'Astrophotography Contest 2026', deadline: '2026-05-10', description: 'Submit your best night-sky shots. Show us the beauty of the cosmos through your lens.', categories: ['Lunar', 'Planetary', 'Deep Sky', 'Creative'], image: '/images/competition-astrophoto.jpg', submissionLink: '#', rulesLink: '#' }
  ],
  gallery: [
    { id: '1', src: '/images/gallery-moon.jpg', alt: 'Moon through telescope', category: 'Astrophotography' },
    { id: '2', src: '/images/gallery-setup.jpg', alt: 'Club observation night', category: 'Events' },
    { id: '3', src: '/images/gallery-startrails.jpg', alt: 'Star trails over school', category: 'Astrophotography' },
    { id: '4', src: '/images/gallery-rocket.jpg', alt: 'Rocket launch', category: 'Rocketry' },
    { id: '5', src: '/images/gallery-milkyway.jpg', alt: 'Milky Way core', category: 'Astrophotography' },
    { id: '6', src: '/images/membership-stargazing.jpg', alt: 'Stargazing session', category: 'Events' },
    { id: '7', src: '/images/about-camping.jpg', alt: 'Astronomy camp', category: 'Camps' },
    { id: '8', src: '/images/achievements-award.jpg', alt: 'Award ceremony', category: 'Achievements' }
  ],
  team: [
    { id: '1', name: 'K. Perera', role: 'President', type: 'committee' },
    { id: '2', name: 'S. Fernando', role: 'Vice President', type: 'committee' },
    { id: '3', name: 'A. Silva', role: 'Secretary', type: 'committee' },
    { id: '4', name: 'N. Jayasuriya', role: 'Treasurer', type: 'committee' },
    { id: '5', name: 'Mr. R. Wijesinghe', role: 'Faculty Advisor', type: 'faculty' },
    { id: '6', name: 'D. Ranaweera', role: 'Past President (2025)', type: 'past' }
  ],
  magazines: [
    { id: '1', title: 'Stardust Issue 04', issue: 'February 2026', date: '2026-02-01', description: 'Features: camping under the Milky Way, how to photograph the Moon, and an interview with a guest astronomer.', coverImage: '/images/magazine-cover.jpg', readLink: '#', downloadLink: '#' }
  ],
  achievements: [
    { id: '1', title: 'National Astro Quiz Finalists', year: '2025', category: 'Team Category', description: 'Our team placed in the top 10 at the National Astronomy Quiz, competing against 80+ schools.', image: '/images/achievements-award.jpg' },
    { id: '2', title: 'Regional Astrophotography Winner', year: '2025', category: 'Individual', description: 'First place in the Regional Astrophotography Competition - Deep Sky category.' },
    { id: '3', title: 'Best School Astronomy Club', year: '2024', category: 'Club Award', description: 'Recognized as the Best School Astronomy Club in the province.' }
  ],
  resources: [
    { id: '1', title: 'Cosmology', description: 'Origins, expansion, and the large-scale structure of the universe.', category: 'Theory', image: '/images/resource-cosmology.jpg' },
    { id: '2', title: 'Observation', description: 'Reading star maps, planning sessions, and logging observations.', category: 'Practical', image: '/images/resource-observation.jpg' },
    { id: '3', title: 'Astrophysics', description: 'Stars, spectra, and the physics of light.', category: 'Theory', image: '/images/resource-astrophysics.jpg' },
    { id: '4', title: 'Rocketry', description: 'Basics of propulsion, stability, and safe launches.', category: 'Practical', image: '/images/resource-rocketry.jpg' },
    { id: '5', title: 'General Astronomy', description: 'Planets, moons, eclipses, and seasons.', category: 'Theory', image: '/images/resource-general.jpg' },
    { id: '6', title: 'Papers & Projects', description: 'Past student papers and presentation guides.', category: 'Academic', image: '/images/resource-papers.jpg' }
  ],
  messages: [],
  registrations: [
    { id: 'r1', name: 'I. Jayasinghe', email: 'ishara@example.com', phone: '+94 71 123 4567', competitionId: '1', category: 'Deep Sky', notes: 'Wants feedback session before deadline', date: '2026-02-22' }
  ],
  quizzes: [
    {
      id: 'quiz-1',
      title: 'Night Sky Basics',
      description: 'Test quick fundamentals before your next observation.',
      createdAt: '2026-02-20',
      questions: [
        { id: 'q1', question: 'Which constellation holds Polaris (the North Star)?', options: ['Orion', 'Ursa Minor', 'Cassiopeia', 'Cygnus'], correctIndex: 1 },
        { id: 'q2', question: 'What colour shift do we observe when an object moves away from us?', options: ['Redshift', 'Blueshift', 'Infrared drift', 'Ultraviolet drift'], correctIndex: 0 },
        { id: 'q3', question: 'Which planet is known as the "Morning Star"?', options: ['Mars', 'Venus', 'Jupiter', 'Mercury'], correctIndex: 1 }
      ]
    }
  ],
  quizAttempts: [],
  memberships: []
};

const cache: DataShape = structuredClone(defaultData);
const listeners = new Set<() => void>();
let initialized = false;
let initPromise: Promise<void> | null = null;

function emit() {
  listeners.forEach((fn) => fn());
}

function loadFromLocalStorage() {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;
  try {
    const parsed = JSON.parse(stored) as Partial<DataShape>;
    (Object.keys(cache) as Collection[]).forEach((k) => {
      if (Array.isArray(parsed[k])) cache[k] = parsed[k] as Row[];
    });
  } catch {
    /* ignore parse errors */
  }
}

function saveToLocalStorage() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    /* quota exceeded — ignore */
  }
}

async function pushCollection(collection: Collection) {
  saveToLocalStorage();
  emit();
  if (!supabase) return;
  const { error } = await supabase
    .from(KV_TABLE)
    .upsert({ key: collection, value: cache[collection] }, { onConflict: 'key' });
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[supabase] upsert failed', collection, error);
  }
}

async function fetchAllCollections() {
  if (!supabase) return;
  const { data, error } = await supabase.from(KV_TABLE).select('key,value');
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[supabase] fetch failed', error);
    return;
  }
  const seen = new Set<string>();
  (data ?? []).forEach((row: { key: string; value: unknown }) => {
    if (row.key in cache && Array.isArray(row.value)) {
      cache[row.key as Collection] = row.value as Row[];
      seen.add(row.key);
    }
  });
  // Seed any collection that has no row yet, so visitors still see content on a brand-new project.
  const toSeed = (Object.keys(cache) as Collection[]).filter((k) => !seen.has(k));
  if (toSeed.length) {
    const rows = toSeed.map((k) => ({ key: k, value: cache[k] }));
    const { error: seedErr } = await supabase.from(KV_TABLE).upsert(rows, { onConflict: 'key' });
    if (seedErr) {
      // eslint-disable-next-line no-console
      console.warn('[supabase] seed failed', seedErr);
    }
  }
}

function subscribeRealtime() {
  if (!supabase) return;
  supabase
    .channel('kv_store_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: KV_TABLE },
      (payload: { new?: { key?: string; value?: unknown }; old?: { key?: string } }) => {
        const key = (payload.new?.key ?? payload.old?.key) as Collection | undefined;
        if (!key || !(key in cache)) return;
        if (Array.isArray(payload.new?.value)) {
          cache[key] = payload.new!.value as Row[];
        }
        saveToLocalStorage();
        emit();
      }
    )
    .subscribe();
}

async function init() {
  if (initialized) return;
  if (initPromise) return initPromise;
  loadFromLocalStorage();
  emit();
  initPromise = (async () => {
    await fetchAllCollections();
    subscribeRealtime();
    saveToLocalStorage();
    emit();
    initialized = true;
  })();
  return initPromise;
}

function upsertRow(collection: Collection, item: Row) {
  const arr = cache[collection];
  const idx = arr.findIndex((r) => r.id === item.id);
  if (idx >= 0) arr[idx] = item;
  else arr.push(item);
  void pushCollection(collection);
}

function deleteRow(collection: Collection, id: string) {
  cache[collection] = cache[collection].filter((r) => r.id !== id);
  void pushCollection(collection);
}

async function uploadImage(file: File): Promise<string> {
  if (supabase) {
    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    const { error } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
    if (error) throw error;
    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }
  // Fallback: base64 data URL (local only — not ideal for production)
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export const dataStore = {
  init,
  isReady: () => initialized,
  isRemote: () => supabaseEnabled,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  uploadImage,

  getData() {
    return cache;
  },

  // Events
  getEvents: () => cache.events,
  saveEvent: (event: Row) => upsertRow('events', event),
  deleteEvent: (id: string) => deleteRow('events', id),

  // News
  getNews: () => cache.news,
  saveNewsItem: (item: Row) => upsertRow('news', item),
  deleteNewsItem: (id: string) => deleteRow('news', id),

  // Competitions
  getCompetitions: () => cache.competitions,
  saveCompetition: (competition: Row) => upsertRow('competitions', competition),
  deleteCompetition: (id: string) => deleteRow('competitions', id),

  // Gallery
  getGallery: () => cache.gallery,
  saveGalleryImage: (image: Row) => upsertRow('gallery', image),
  deleteGalleryImage: (id: string) => deleteRow('gallery', id),

  // Team
  getTeam: () => cache.team,
  saveTeamMember: (member: Row) => upsertRow('team', member),
  deleteTeamMember: (id: string) => deleteRow('team', id),

  // Achievements
  getAchievements: () => cache.achievements,
  saveAchievement: (achievement: Row) => upsertRow('achievements', achievement),
  deleteAchievement: (id: string) => deleteRow('achievements', id),

  // Messages (contact form)
  getMessages: () => cache.messages,
  saveMessage: (message: Row) => upsertRow('messages', message),
  deleteMessage: (id: string) => deleteRow('messages', id),

  // Registrations
  getRegistrations: () => cache.registrations,
  saveRegistration: (registration: Row) => upsertRow('registrations', registration),
  deleteRegistration: (id: string) => deleteRow('registrations', id),

  // Quizzes
  getQuizzes: () => cache.quizzes,
  saveQuiz: (quiz: Row) => upsertRow('quizzes', quiz),
  deleteQuiz: (id: string) => deleteRow('quizzes', id),

  // Quiz attempts
  getQuizAttempts: () => cache.quizAttempts,
  saveQuizAttempt: (attempt: Row) => upsertRow('quizAttempts', attempt),
  deleteQuizAttempt: (id: string) => deleteRow('quizAttempts', id),

  // Memberships
  getMemberships: () => cache.memberships,
  saveMembership: (membership: Row) => upsertRow('memberships', membership),
  deleteMembership: (id: string) => deleteRow('memberships', id),

  reset() {
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
    const fresh = structuredClone(defaultData);
    (Object.keys(fresh) as Collection[]).forEach((k) => {
      cache[k] = fresh[k];
    });
    emit();
  },
};
