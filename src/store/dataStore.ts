const STORAGE_KEY = 'anadameth_astronomy_society_data';

// Default data
const defaultData = {
  events: [
    {
      id: '1',
      title: 'Night Sky Photography Workshop',
      date: '2026-04-12',
      time: '7:00 PM',
      location: 'School Observatory Deck',
      description: 'Learn to capture the Moon, constellations, and deep-sky objects with any camera. Bring a tripod if you have one.',
      category: 'workshop',
      image: '/images/featured-event.jpg',
      featured: true,
      registrationLink: '#'
    },
    {
      id: '2',
      title: 'Star Map Reading Session',
      date: '2026-03-28',
      time: '6:30 PM',
      location: 'Classroom B',
      description: 'Learn to read and use star maps to navigate the night sky.',
      category: 'workshop'
    },
    {
      id: '3',
      title: 'Messier Marathon',
      date: '2026-04-05',
      time: '8:00 PM',
      location: 'Field Trip - Dark Sky Site',
      description: 'Annual observation event to view as many Messier objects as possible in one night.',
      category: 'observation'
    },
    {
      id: '4',
      title: 'Rocketry Demo Day',
      date: '2026-04-18',
      time: '4:00 PM',
      location: 'School Grounds',
      description: 'Watch model rocket launches and learn about rocketry basics.',
      category: 'other'
    },
    {
      id: '5',
      title: 'Astro Quiz (Inter-School)',
      date: '2026-05-02',
      time: '10:00 AM',
      location: 'School Hall',
      description: 'Test your astronomy knowledge against students from other schools.',
      category: 'competition'
    }
  ],
  news: [
    {
      id: '1',
      title: 'New Telescope Installed',
      date: '2026-02-20',
      category: 'Club Update',
      description: 'We have added a 200mm reflector telescope for planetary observation. Book a session every Friday evening.',
      image: '/images/news-telescope.jpg'
    },
    {
      id: '2',
      title: 'Club Wins Regional Competition',
      date: '2026-02-15',
      category: 'Achievement',
      description: 'Our team secured first place in the Regional Astronomy Quiz competition.',
    },
    {
      id: '3',
      title: 'Summer Camp Registration Open',
      date: '2026-02-10',
      category: 'Announcement',
      description: 'Registration for the annual astronomy summer camp is now open. Limited spots available.',
    }
  ],
  competitions: [
    {
      id: '1',
      title: 'Astrophotography Contest 2026',
      deadline: '2026-05-10',
      description: 'Submit your best night-sky shots. Show us the beauty of the cosmos through your lens.',
      categories: ['Lunar', 'Planetary', 'Deep Sky', 'Creative'],
      image: '/images/competition-astrophoto.jpg',
      submissionLink: '#',
      rulesLink: '#'
    }
  ],
  gallery: [
    { id: '1', src: '/images/gallery-moon.jpg', alt: 'Moon through telescope', category: 'Astrophotography' },
    { id: '2', src: '/images/gallery-setup.jpg', alt: 'Club observation night', category: 'Events' },
    { id: '3', src: '/images/gallery-startrails.jpg', alt: 'Star trails over school', category: 'Astrophotography' },
    { id: '4', src: '/images/gallery-rocket.jpg', alt: 'Rocket launch', category: 'Rocketry' },
    { id: '5', src: '/images/gallery-milkyway.jpg', alt: 'Milky Way core', category: 'Astrophotography' },
    { id: '6', src: '/images/membership-stargazing.jpg', alt: 'Stargazing session', category: 'Events' },
    { id: '7', src: '/images/about-camping.jpg', alt: 'Astronomy camp', category: 'Camps' },
    { id: '8', src: '/images/achievements-award.jpg', alt: 'Award ceremony', category: 'Achievements' },
  ],
  team: [
    { id: '1', name: 'K. Perera', role: 'President', type: 'committee' },
    { id: '2', name: 'S. Fernando', role: 'Vice President', type: 'committee' },
    { id: '3', name: 'A. Silva', role: 'Secretary', type: 'committee' },
    { id: '4', name: 'N. Jayasuriya', role: 'Treasurer', type: 'committee' },
    { id: '5', name: 'Mr. R. Wijesinghe', role: 'Faculty Advisor', type: 'faculty' },
    { id: '6', name: 'D. Ranaweera', role: 'Past President (2025)', type: 'past' },
  ],
  magazines: [
    {
      id: '1',
      title: 'Stardust Issue 04',
      issue: 'February 2026',
      date: '2026-02-01',
      description: 'Features: camping under the Milky Way, how to photograph the Moon, and an interview with a guest astronomer.',
      coverImage: '/images/magazine-cover.jpg',
      readLink: '#',
      downloadLink: '#'
    }
  ],
  achievements: [
    {
      id: '1',
      title: 'National Astro Quiz Finalists',
      year: '2025',
      category: 'Team Category',
      description: 'Our team placed in the top 10 at the National Astronomy Quiz, competing against 80+ schools.',
      image: '/images/achievements-award.jpg'
    },
    {
      id: '2',
      title: 'Regional Astrophotography Winner',
      year: '2025',
      category: 'Individual',
      description: 'First place in the Regional Astrophotography Competition - Deep Sky category.',
    },
    {
      id: '3',
      title: 'Best School Astronomy Club',
      year: '2024',
      category: 'Club Award',
      description: 'Recognized as the Best School Astronomy Club in the province.',
    }
  ],
  resources: [
    {
      id: '1',
      title: 'Cosmology',
      description: 'Origins, expansion, and the large-scale structure of the universe.',
      category: 'Theory',
      image: '/images/resource-cosmology.jpg'
    },
    {
      id: '2',
      title: 'Observation',
      description: 'Reading star maps, planning sessions, and logging observations.',
      category: 'Practical',
      image: '/images/resource-observation.jpg'
    },
    {
      id: '3',
      title: 'Astrophysics',
      description: 'Stars, spectra, and the physics of light.',
      category: 'Theory',
      image: '/images/resource-astrophysics.jpg'
    },
    {
      id: '4',
      title: 'Rocketry',
      description: 'Basics of propulsion, stability, and safe launches.',
      category: 'Practical',
      image: '/images/resource-rocketry.jpg'
    },
    {
      id: '5',
      title: 'General Astronomy',
      description: 'Planets, moons, eclipses, and seasons.',
      category: 'Theory',
      image: '/images/resource-general.jpg'
    },
    {
      id: '6',
      title: 'Papers & Projects',
      description: 'Past student papers and presentation guides.',
      category: 'Academic',
      image: '/images/resource-papers.jpg'
    }
  ],
  messages: [],
  registrations: [
    {
      id: 'r1',
      name: 'I. Jayasinghe',
      email: 'ishara@example.com',
      phone: '+94 71 123 4567',
      competitionId: '1',
      category: 'Deep Sky',
      notes: 'Wants feedback session before deadline',
      date: '2026-02-22'
    }
  ],
  quizzes: [
    {
      id: 'quiz-1',
      title: 'Night Sky Basics',
      description: 'Test quick fundamentals before your next observation.',
      createdAt: '2026-02-20',
      questions: [
        {
          id: 'q1',
          question: 'Which constellation holds Polaris (the North Star)?',
          options: ['Orion', 'Ursa Minor', 'Cassiopeia', 'Cygnus'],
          correctIndex: 1
        },
        {
          id: 'q2',
          question: 'What colour shift do we observe when an object moves away from us?',
          options: ['Redshift', 'Blueshift', 'Infrared drift', 'Ultraviolet drift'],
          correctIndex: 0
        },
        {
          id: 'q3',
          question: 'Which planet is known as the “Morning Star”?',
          options: ['Mars', 'Venus', 'Jupiter', 'Mercury'],
          correctIndex: 1
        }
      ]
    }
  ],
  quizAttempts: [],
  memberships: []
};

export const dataStore = {
  getData() {
    if (typeof window === 'undefined') return defaultData;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultData, ...JSON.parse(stored) };
    }
    return defaultData;
  },

  saveData(data: Record<string, unknown>) {
    if (typeof window === 'undefined') return;
    const current = this.getData();
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  // Events
  getEvents() {
    return this.getData().events;
  },
  saveEvent(event: Record<string, unknown>) {
    const events = this.getEvents();
    const index = events.findIndex((e: {id: string}) => e.id === event.id);
    if (index >= 0) {
      events[index] = event;
    } else {
      events.push(event);
    }
    this.saveData({ events });
  },
  deleteEvent(id: string) {
    const events = this.getEvents().filter((e: {id: string}) => e.id !== id);
    this.saveData({ events });
  },

  // News
  getNews() {
    return this.getData().news;
  },
  saveNewsItem(item: Record<string, unknown>) {
    const news = this.getNews();
    const index = news.findIndex((n: {id: string}) => n.id === item.id);
    if (index >= 0) {
      news[index] = item;
    } else {
      news.push(item);
    }
    this.saveData({ news });
  },
  deleteNewsItem(id: string) {
    const news = this.getNews().filter((n: {id: string}) => n.id !== id);
    this.saveData({ news });
  },

  // Competitions
  getCompetitions() {
    return this.getData().competitions;
  },
  saveCompetition(competition: Record<string, unknown>) {
    const competitions = this.getCompetitions();
    const index = competitions.findIndex((c: {id: string}) => c.id === competition.id);
    if (index >= 0) {
      competitions[index] = competition;
    } else {
      competitions.push(competition);
    }
    this.saveData({ competitions });
  },
  deleteCompetition(id: string) {
    const competitions = this.getCompetitions().filter((c: {id: string}) => c.id !== id);
    this.saveData({ competitions });
  },

  // Gallery
  getGallery() {
    return this.getData().gallery;
  },
  saveGalleryImage(image: Record<string, unknown>) {
    const gallery = this.getGallery();
    const index = gallery.findIndex((g: {id: string}) => g.id === image.id);
    if (index >= 0) {
      gallery[index] = image;
    } else {
      gallery.push(image);
    }
    this.saveData({ gallery });
  },
  deleteGalleryImage(id: string) {
    const gallery = this.getGallery().filter((g: {id: string}) => g.id !== id);
    this.saveData({ gallery });
  },

  // Team
  getTeam() {
    return this.getData().team;
  },
  saveTeamMember(member: Record<string, unknown>) {
    const team = this.getTeam();
    const index = team.findIndex((t: {id: string}) => t.id === member.id);
    if (index >= 0) {
      team[index] = member;
    } else {
      team.push(member);
    }
    this.saveData({ team });
  },
  deleteTeamMember(id: string) {
    const team = this.getTeam().filter((t: {id: string}) => t.id !== id);
    this.saveData({ team });
  },

  // Achievements
  getAchievements() {
    return this.getData().achievements;
  },
  saveAchievement(achievement: Record<string, unknown>) {
    const achievements = this.getAchievements();
    const index = achievements.findIndex((a: {id: string}) => a.id === achievement.id);
    if (index >= 0) {
      achievements[index] = achievement;
    } else {
      achievements.push(achievement);
    }
    this.saveData({ achievements });
  },
  deleteAchievement(id: string) {
    const achievements = this.getAchievements().filter((a: {id: string}) => a.id !== id);
    this.saveData({ achievements });
  },

  // Messages
  getMessages() {
    return this.getData().messages;
  },
  saveMessage(message: Record<string, unknown>) {
    const messages = this.getMessages();
    messages.push(message);
    this.saveData({ messages });
  },
  deleteMessage(id: string) {
    const messages = this.getMessages().filter((m: {id: string}) => m.id !== id);
    this.saveData({ messages });
  },

  // Registrations
  getRegistrations() {
    return this.getData().registrations || [];
  },
  saveRegistration(registration: Record<string, unknown>) {
    const registrations = this.getRegistrations();
    const index = registrations.findIndex((r: {id: string}) => r.id === registration.id);
    if (index >= 0) {
      registrations[index] = registration;
    } else {
      registrations.push(registration);
    }
    this.saveData({ registrations });
  },
  deleteRegistration(id: string) {
    const registrations = this.getRegistrations().filter((r: {id: string}) => r.id !== id);
    this.saveData({ registrations });
  },

  // Quizzes
  getQuizzes() {
    return this.getData().quizzes || [];
  },
  saveQuiz(quiz: Record<string, unknown>) {
    const quizzes = this.getQuizzes();
    const index = quizzes.findIndex((q: {id: string}) => q.id === quiz.id);
    if (index >= 0) {
      quizzes[index] = quiz;
    } else {
      quizzes.push(quiz);
    }
    this.saveData({ quizzes });
  },
  deleteQuiz(id: string) {
    const quizzes = this.getQuizzes().filter((q: {id: string}) => q.id !== id);
    this.saveData({ quizzes });
  },

  // Quiz attempts
  getQuizAttempts() {
    return this.getData().quizAttempts || [];
  },
  saveQuizAttempt(attempt: Record<string, unknown>) {
    const attempts = this.getQuizAttempts();
    attempts.push(attempt);
    this.saveData({ quizAttempts: attempts });
  },
  deleteQuizAttempt(id: string) {
    const attempts = this.getQuizAttempts().filter((a: {id: string}) => a.id !== id);
    this.saveData({ quizAttempts: attempts });
  },

  // Memberships
  getMemberships() {
    return this.getData().memberships || [];
  },
  saveMembership(membership: Record<string, unknown>) {
    const memberships = this.getMemberships();
    const index = memberships.findIndex((m: {id: string}) => m.id === membership.id);
    if (index >= 0) {
      memberships[index] = membership;
    } else {
      memberships.push(membership);
    }
    this.saveData({ memberships });
  },
  deleteMembership(id: string) {
    const memberships = this.getMemberships().filter((m: {id: string}) => m.id !== id);
    this.saveData({ memberships });
  },

  // Reset to defaults
  reset() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
