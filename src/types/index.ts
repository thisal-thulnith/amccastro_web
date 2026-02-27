export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'workshop' | 'observation' | 'competition' | 'other';
  image?: string;
  featured?: boolean;
  registrationLink?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image?: string;
}

export interface Competition {
  id: string;
  title: string;
  deadline: string;
  description: string;
  categories: string[];
  image?: string;
  submissionLink?: string;
  rulesLink?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  type: 'committee' | 'faculty' | 'past';
}

export interface Magazine {
  id: string;
  title: string;
  issue: string;
  date: string;
  description: string;
  coverImage?: string;
  readLink?: string;
  downloadLink?: string;
}

export interface Achievement {
  id: string;
  title: string;
  year: string;
  category: string;
  description: string;
  image?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  link?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface Registration {
  id: string;
  name: string;
  email: string;
  phone?: string;
  competitionId: string;
  category?: string;
  notes?: string;
  date: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  name: string;
  email: string;
  score: number;
  total: number;
  date: string;
  answers: { questionId: string; selected: number; correct: number }[];
}

export interface Membership {
  id: string;
  name: string;
  email: string;
  phone?: string;
  grade?: string;
  interest?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface SiteData {
  events: Event[];
  news: NewsItem[];
  competitions: Competition[];
  gallery: GalleryImage[];
  team: TeamMember[];
  magazines: Magazine[];
  achievements: Achievement[];
  resources: Resource[];
  messages: ContactMessage[];
  registrations: Registration[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  memberships: Membership[];
}
