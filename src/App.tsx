import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Calendar, Users, Image, FileText, Star, Telescope, Trophy, 
  MapPin, Clock, Send, Plus, Trash2, Edit, LogOut, Settings, Menu, X, Mail, ChevronUp, ChevronRight,
  Sparkles, Rocket, Zap, Target, BookOpen, Camera, Crown, 
  CheckCircle, Search, AlertCircle, Info, 
  Share2, MessageCircle, MapPinned, Lightbulb, ClipboardList, ListChecks, Brain, BarChart3, Phone, CheckSquare, UserPlus
} from 'lucide-react';
import { dataStore } from '@/store/dataStore';
import './App.css';

gsap.registerPlugin(ScrollTrigger);
const ADMIN_PASSWORD = 'amccastro99';
const ADMIN_ENTRY_TOKEN = 'astro-secure-entry';

// ============================================
// PARTICLE BACKGROUND COMPONENT
// ============================================
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    let particles: Array<{x: number; y: number; vx: number; vy: number; size: number; alpha: number}> = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const createParticles = () => {
      particles = [];
      const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 12000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2.5 + 0.5,
          alpha: Math.random() * 0.6 + 0.2
        });
      }
    };
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(57, 255, 20, ${p.alpha})`;
        ctx.fill();
        
        // Draw connections
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(57, 255, 20, ${0.15 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      
      animationId = requestAnimationFrame(draw);
    };
    
    resize();
    createParticles();
    draw();
    
    window.addEventListener('resize', () => { resize(); createParticles(); });
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return <canvas ref={canvasRef} className="particle-canvas" />;
}

// ============================================
// ANIMATED COUNTER COMPONENT
// ============================================
function AnimatedCounter({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const increment = end / (duration * 60);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 1000 / 60);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);
  
  return <span ref={ref}>{count}{suffix}</span>;
}

// ============================================
// ICON BADGE COMPONENT
// ============================================
function IconBadge({ icon: Icon, color = 'green', size = 'md' }: { icon: any; color?: string; size?: string }) {
  const sizeClasses = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };
  const iconSizes = { sm: 14, md: 20, lg: 28 };
  const colorClasses: Record<string, string> = {
    green: 'from-[#39FF14]/20 to-[#39FF14]/5 text-[#39FF14]',
    blue: 'from-[#00D4FF]/20 to-[#00D4FF]/5 text-[#00D4FF]',
    purple: 'from-[#A855F7]/20 to-[#A855F7]/5 text-[#A855F7]',
    orange: 'from-[#F97316]/20 to-[#F97316]/5 text-[#F97316]',
    pink: 'from-[#EC4899]/20 to-[#EC4899]/5 text-[#EC4899]',
  };
  
  return (
    <div className={`${sizeClasses[size as keyof typeof sizeClasses]} rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center border border-current/20`}>
      <Icon size={iconSizes[size as keyof typeof iconSizes]} />
    </div>
  );
}

// ============================================
// ADMIN DASHBOARD WITH FULL CRUD
// ============================================
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('events');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [quizQuestions, setQuizQuestions] = useState<any[]>([
    { id: 'q-temp-1', question: '', options: ['', '', '', ''], correctIndex: 0 }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState('');
  
  const [data, setData] = useState({
    events: dataStore.getEvents(),
    news: dataStore.getNews(),
    competitions: dataStore.getCompetitions(),
    gallery: dataStore.getGallery(),
    team: dataStore.getTeam(),
    achievements: dataStore.getAchievements(),
    messages: dataStore.getMessages(),
    registrations: dataStore.getRegistrations(),
    quizzes: dataStore.getQuizzes(),
    quizAttempts: dataStore.getQuizAttempts(),
    memberships: dataStore.getMemberships()
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const loadData = () => {
    setData({
      events: dataStore.getEvents(),
      news: dataStore.getNews(),
      competitions: dataStore.getCompetitions(),
      gallery: dataStore.getGallery(),
      team: dataStore.getTeam(),
      achievements: dataStore.getAchievements(),
      messages: dataStore.getMessages(),
      registrations: dataStore.getRegistrations(),
      quizzes: dataStore.getQuizzes(),
      quizAttempts: dataStore.getQuizAttempts(),
      memberships: dataStore.getMemberships()
    });
  };

  const handleDelete = (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    switch (type) {
      case 'events': dataStore.deleteEvent(id); break;
      case 'news': dataStore.deleteNewsItem(id); break;
      case 'competitions': dataStore.deleteCompetition(id); break;
      case 'gallery': dataStore.deleteGalleryImage(id); break;
      case 'team': dataStore.deleteTeamMember(id); break;
      case 'achievements': dataStore.deleteAchievement(id); break;
      case 'messages': dataStore.deleteMessage(id); break;
      case 'registrations': dataStore.deleteRegistration(id); break;
      case 'quizzes': dataStore.deleteQuiz(id); break;
      case 'quizAttempts': dataStore.deleteQuizAttempt(id); break;
      case 'memberships': dataStore.deleteMembership(id); break;
    }
    loadData();
    showNotification('Item deleted successfully!');
  };

  const handleSave = () => {
    let item = { ...formData, id: editingItem?.id || Date.now().toString() };
    let quizPayload = quizQuestions;

    if (activeTab === 'competitions') {
      item = {
        ...item,
        categories: String(formData.categories || '')
          .split(',')
          .map((part) => part.trim())
          .filter(Boolean),
      };
    }

    if (activeTab === 'quizzes') {
      quizPayload = quizQuestions
        .map((q) => ({
          ...q,
          question: String(q.question || '').trim(),
          options: (q.options || []).map((opt: string) => String(opt || '').trim()),
        }))
        .filter((q) => q.question && q.options.every((opt: string) => opt));

      if (!quizPayload.length) {
        showNotification('Add at least one complete question with 4 options.');
        return;
      }

      item = {
        ...item,
        createdAt: formData.createdAt || new Date().toISOString().split('T')[0],
      };
    }
    
    switch (activeTab) {
      case 'events': dataStore.saveEvent(item); break;
      case 'news': dataStore.saveNewsItem(item); break;
      case 'competitions': dataStore.saveCompetition(item); break;
      case 'gallery': dataStore.saveGalleryImage(item); break;
      case 'team': dataStore.saveTeamMember(item); break;
      case 'achievements': dataStore.saveAchievement(item); break;
      case 'registrations': dataStore.saveRegistration(item); break;
      case 'quizzes': dataStore.saveQuiz({ ...item, questions: quizPayload }); break;
      case 'memberships': dataStore.saveMembership(item); break;
    }
    
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
    setQuizQuestions([{ id: 'q-temp-1', question: '', options: ['', '', '', ''], correctIndex: 0 }]);
    loadData();
    showNotification('Item saved successfully!');
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({});
    setQuizQuestions([{ id: 'q-temp-' + Date.now(), question: '', options: ['', '', '', ''], correctIndex: 0 }]);
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'competitions') {
      setFormData({
        ...item,
        categories: Array.isArray(item.categories) ? item.categories.join(', ') : item.categories
      });
    } else {
      setFormData(item);
    }
    if (activeTab === 'quizzes') {
      setQuizQuestions(item.questions || [{ id: 'q-temp-' + Date.now(), question: '', options: ['', '', '', ''], correctIndex: 0 }]);
    }
    setShowModal(true);
  };

  const tabs = [
    { id: 'events', label: 'Events', icon: Calendar, count: data.events.length, color: 'green' },
    { id: 'news', label: 'News', icon: FileText, count: data.news.length, color: 'blue' },
    { id: 'competitions', label: 'Competitions', icon: Trophy, count: data.competitions.length, color: 'orange' },
    { id: 'gallery', label: 'Gallery', icon: Image, count: data.gallery.length, color: 'purple' },
    { id: 'team', label: 'Team', icon: Users, count: data.team.length, color: 'orange' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, count: data.achievements.length, color: 'pink' },
    { id: 'registrations', label: 'Registrations', icon: ClipboardList, count: data.registrations.length, color: 'blue' },
    { id: 'memberships', label: 'Memberships', icon: UserPlus, count: data.memberships.length, color: 'green' },
    { id: 'quizzes', label: 'Quizzes', icon: ListChecks, count: data.quizzes.length, color: 'green' },
    { id: 'quizAttempts', label: 'Quiz Results', icon: BarChart3, count: data.quizAttempts.length, color: 'orange' },
    { id: 'messages', label: 'Messages', icon: Mail, count: data.messages.length, color: 'green' },
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  const getFormFields = () => {
    switch (activeTab) {
      case 'events':
        return [
          { name: 'title', label: 'Event Title', type: 'text', icon: Sparkles },
          { name: 'date', label: 'Date', type: 'date', icon: Calendar },
          { name: 'time', label: 'Time', type: 'text', icon: Clock },
          { name: 'location', label: 'Location', type: 'text', icon: MapPin },
          { name: 'category', label: 'Category', type: 'select', options: ['workshop', 'observation', 'competition', 'other'], icon: Target },
          { name: 'description', label: 'Description', type: 'textarea', icon: FileText },
          { name: 'image', label: 'Image URL', type: 'text', icon: Image },
        ];
      case 'news':
        return [
          { name: 'title', label: 'News Title', type: 'text', icon: Sparkles },
          { name: 'date', label: 'Date', type: 'date', icon: Calendar },
          { name: 'category', label: 'Category', type: 'text', icon: Target },
          { name: 'description', label: 'Description', type: 'textarea', icon: FileText },
          { name: 'image', label: 'Image URL', type: 'text', icon: Image },
        ];
      case 'competitions':
        return [
          { name: 'title', label: 'Competition Title', type: 'text', icon: Trophy },
          { name: 'deadline', label: 'Deadline', type: 'date', icon: Calendar },
          { name: 'description', label: 'Description', type: 'textarea', icon: FileText },
          { name: 'categories', label: 'Categories (comma separated)', type: 'text', icon: ListChecks },
          { name: 'rulesLink', label: 'Rules Link', type: 'text', icon: BookOpen },
          { name: 'submissionLink', label: 'Submission Link', type: 'text', icon: UploadIcon },
        ];
      case 'team':
        return [
          { name: 'name', label: 'Name', type: 'text', icon: Users },
          { name: 'role', label: 'Role', type: 'text', icon: Crown },
          { name: 'type', label: 'Type', type: 'select', options: ['committee', 'faculty', 'past'], icon: Target },
        ];
      case 'achievements':
        return [
          { name: 'title', label: 'Achievement Title', type: 'text', icon: Trophy },
          { name: 'year', label: 'Year', type: 'text', icon: Calendar },
          { name: 'category', label: 'Category', type: 'text', icon: Target },
          { name: 'description', label: 'Description', type: 'textarea', icon: FileText },
        ];
      case 'gallery':
        return [
          { name: 'src', label: 'Image URL', type: 'text', icon: Image },
          { name: 'alt', label: 'Alt Text', type: 'text', icon: FileText },
          { name: 'category', label: 'Category', type: 'text', icon: Target },
        ];
      case 'quizzes':
        return [
          { name: 'title', label: 'Quiz Title', type: 'text', icon: Sparkles },
          { name: 'description', label: 'Description', type: 'textarea', icon: FileText }
        ];
      default: return [];
    }
  };

  const updateQuestionText = (index: number, value: string) => {
    const next = [...quizQuestions];
    next[index].question = value;
    setQuizQuestions(next);
  };

  const updateOptionText = (qIndex: number, optIndex: number, value: string) => {
    const next = [...quizQuestions];
    next[qIndex].options[optIndex] = value;
    setQuizQuestions(next);
  };

  const markCorrect = (qIndex: number, optIndex: number) => {
    const next = [...quizQuestions];
    next[qIndex].correctIndex = optIndex;
    setQuizQuestions(next);
  };

  const removeQuestion = (index: number) => {
    if (quizQuestions.length === 1) return;
    const next = [...quizQuestions];
    next.splice(index, 1);
    setQuizQuestions(next);
  };

  const addQuestionRow = () => {
    setQuizQuestions([
      ...quizQuestions,
      { id: 'q-' + Date.now(), question: '', options: ['', '', '', ''], correctIndex: 0 }
    ]);
  };

  const filteredData = (data[activeTab as keyof typeof data] as any[]).filter((item: any) =>
    JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#05070A]">
      <ParticleBackground />
      
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-[200] glass rounded-xl px-6 py-4 flex items-center gap-3 animate-slide-in-right">
          <CheckCircle className="text-[#39FF14]" size={20} />
          <span>{notification}</span>
        </div>
      )}
      
      {/* Header */}
      <header className="relative z-10 glass border-b border-[rgba(244,246,250,0.1)] px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center">
              <Telescope className="text-[#05070A]" size={24} />
            </div>
            <div>
              <h1 className="font-orbitron text-xl font-bold">Admin Dashboard</h1>
              <p className="text-xs text-[#A7B0C8] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
                System Online
              </p>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="relative z-10 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 glass lg:min-h-[calc(100vh-80px)] border-b lg:border-b-0 lg:border-r border-[rgba(244,246,250,0.1)] p-4 md:p-5">
          <nav className="space-y-2">
            {tabs.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? `bg-gradient-to-r from-[#39FF14]/20 to-transparent text-[#39FF14] border border-[#39FF14]/30 shadow-[0_0_20px_rgba(57,255,20,0.1)]` 
                    : 'text-[#A7B0C8] hover:bg-[rgba(244,246,250,0.05)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  activeTab === item.id ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'bg-[rgba(244,246,250,0.1)]'
                }`}>
                  {item.count}
                </span>
              </button>
            ))}
          </nav>
          
          <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-[#39FF14]/10 via-[#00D4FF]/5 to-transparent border border-[#39FF14]/20">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={16} className="text-[#39FF14]" />
              <h4 className="font-orbitron text-sm font-bold">Quick Tip</h4>
            </div>
            <p className="text-xs text-[#A7B0C8] leading-relaxed">
              Use the search bar to find items quickly. Click + to add new content.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {/* Header with search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <IconBadge icon={currentTab?.icon || Star} color={currentTab?.color} size="lg" />
              <div>
                <h2 className="font-orbitron text-3xl font-bold capitalize">{activeTab}</h2>
                <p className="text-[#A7B0C8] mt-1 flex items-center gap-2">
                  <Target size={14} />
                  Manage your {activeTab} content
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A7B0C8]" size={18} />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-64"
                />
              </div>
              {!['messages','registrations','quizAttempts','memberships'].includes(activeTab) && (
                <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
                  <Plus size={18} />
                  Add New
                </button>
              )}
            </div>
          </div>
          
          {/* Content Table/Grid */}
          <div className="glass rounded-2xl p-6">
            {activeTab === 'gallery' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredData.map((img: any) => (
                  <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-[#0B0F17]">
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
                      <p className="text-xs font-medium truncate">{img.alt}</p>
                      <p className="text-[10px] text-[#A7B0C8]">{img.category}</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => openEditModal(img)} className="p-2 bg-[#39FF14] rounded-lg text-[#05070A] hover:scale-110 transition-transform">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDelete('gallery', img.id)} className="p-2 bg-red-500 rounded-lg text-white hover:scale-110 transition-transform">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeTab === 'messages' ? (
              <div className="space-y-4">
                {filteredData.length === 0 ? (
                  <div className="text-center py-16">
                    <Mail size={64} className="mx-auto text-[#A7B0C8]/20 mb-4" />
                    <p className="text-[#A7B0C8]">No messages yet</p>
                  </div>
                ) : (
                  filteredData.map((msg: any) => (
                    <div key={msg.id} className="glass rounded-xl p-5 hover:border-[#39FF14]/20 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#39FF14]/20 to-[#00D4FF]/20 flex items-center justify-center">
                            <Users size={16} className="text-[#39FF14]" />
                          </div>
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              {msg.name}
                              <Mail size={12} className="text-[#A7B0C8]" />
                            </h4>
                            <p className="text-sm text-[#A7B0C8]">{msg.email}</p>
                          </div>
                        </div>
                        <span className="text-xs text-[#A7B0C8] flex items-center gap-1">
                          <Clock size={12} />
                          {msg.date}
                        </span>
                      </div>
                      <p className="text-sm text-[#A7B0C8] pl-13 bg-[rgba(244,246,250,0.03)] rounded-lg p-3">{msg.message}</p>
                      <button onClick={() => handleDelete('messages', msg.id)} className="mt-3 text-red-400 text-sm hover:text-red-300 transition-colors flex items-center gap-1">
                        <Trash2 size={14} /> Delete Message
                      </button>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === 'registrations' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(244,246,250,0.1)]">
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Student</th>
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Source</th>
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Contact</th>
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((reg: any) => {
                      const comp = data.competitions.find((c: any) => c.id === reg.competitionId);
                      const requestType = reg.sourceType || 'competition';
                      const requestTitle = reg.sourceTitle || comp?.title || 'N/A';
                      return (
                        <tr key={reg.id} className="border-b border-[rgba(244,246,250,0.05)] hover:bg-[rgba(244,246,250,0.02)] transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-medium">{reg.name}</div>
                            <div className="text-xs text-[#A7B0C8]">{reg.notes || '—'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-3 py-1 rounded-full text-xs bg-[#39FF14]/10 text-[#39FF14] capitalize">{requestType}</span>
                          </td>
                          <td className="py-3 px-4 text-[#A7B0C8]">{requestTitle}</td>
                          <td className="py-3 px-4 text-[#A7B0C8] flex flex-col gap-1">
                            <span>{reg.email}</span>
                            <span className="text-xs flex items-center gap-1"><Phone size={12} />{reg.phone || '—'}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-3 py-1 rounded-full text-xs bg-[#39FF14]/10 text-[#39FF14] capitalize flex items-center gap-1 w-fit">
                              <Target size={10} />
                              {reg.category || 'General'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs capitalize ${
                              reg.status === 'approved'
                                ? 'bg-[#39FF14]/10 text-[#39FF14]'
                                : reg.status === 'rejected'
                                  ? 'bg-red-500/10 text-red-400'
                                  : 'bg-yellow-500/10 text-yellow-400'
                            }`}>
                              {reg.status || 'pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#A7B0C8]">{reg.date}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  dataStore.saveRegistration({ ...reg, status: 'approved' });
                                  loadData();
                                }}
                                className="px-3 py-1 text-xs rounded-lg bg-[#39FF14]/10 text-[#39FF14] hover:bg-[#39FF14]/20"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  dataStore.saveRegistration({ ...reg, status: 'rejected' });
                                  loadData();
                                }}
                                className="px-3 py-1 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                              >
                                Reject
                              </button>
                              <button onClick={() => handleDelete('registrations', reg.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors" title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : activeTab === 'memberships' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(244,246,250,0.1)]">
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Member</th>
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Contact</th>
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Profile</th>
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((member: any) => (
                      <tr key={member.id} className="border-b border-[rgba(244,246,250,0.05)] hover:bg-[rgba(244,246,250,0.02)] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-[#A7B0C8]">{member.date}</div>
                        </td>
                        <td className="py-3 px-4 text-[#A7B0C8]">
                          <div>{member.email}</div>
                          <div className="text-xs">{member.phone || 'No phone'}</div>
                        </td>
                        <td className="py-3 px-4 text-[#A7B0C8]">
                          <div>Grade: {member.grade || '-'}</div>
                          <div className="text-xs">Interest: {member.interest || '-'}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs capitalize ${
                            member.status === 'approved'
                              ? 'bg-[#39FF14]/10 text-[#39FF14]'
                              : member.status === 'rejected'
                                ? 'bg-red-500/10 text-red-400'
                                : 'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {member.status || 'pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                dataStore.saveMembership({ ...member, status: 'approved' });
                                loadData();
                              }}
                              className="px-3 py-1 text-xs rounded-lg bg-[#39FF14]/10 text-[#39FF14] hover:bg-[#39FF14]/20"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                dataStore.saveMembership({ ...member, status: 'rejected' });
                                loadData();
                              }}
                              className="px-3 py-1 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleDelete('memberships', member.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : activeTab === 'quizzes' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(244,246,250,0.1)]">
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Quiz</th>
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Questions</th>
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Created</th>
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((quiz: any) => (
                      <tr key={quiz.id} className="border-b border-[rgba(244,246,250,0.05)] hover:bg-[rgba(244,246,250,0.02)] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium">{quiz.title}</div>
                          <div className="text-xs text-[#A7B0C8] line-clamp-1">{quiz.description}</div>
                        </td>
                        <td className="py-3 px-4 text-[#A7B0C8]">{quiz.questions?.length || 0}</td>
                        <td className="py-3 px-4 text-[#A7B0C8]">{quiz.createdAt || '-'}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button onClick={() => openEditModal(quiz)} className="p-2 hover:bg-[#39FF14]/10 rounded-lg text-[#39FF14] transition-colors" title="Edit">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDelete('quizzes', quiz.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : activeTab === 'quizAttempts' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(244,246,250,0.1)]">
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Participant</th>
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Quiz</th>
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Score</th>
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-orbitron">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((attempt: any) => {
                      const quiz = data.quizzes.find((q: any) => q.id === attempt.quizId);
                      return (
                        <tr key={attempt.id} className="border-b border-[rgba(244,246,250,0.05)] hover:bg-[rgba(244,246,250,0.02)] transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-medium">{attempt.name}</div>
                            <div className="text-xs text-[#A7B0C8]">{attempt.email}</div>
                          </td>
                          <td className="py-3 px-4 text-[#A7B0C8]">{quiz?.title || 'N/A'}</td>
                          <td className="py-3 px-4">
                            <span className="px-3 py-1 rounded-full text-xs bg-[#39FF14]/10 text-[#39FF14]">
                              {attempt.score}/{attempt.total}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#A7B0C8]">{attempt.date}</td>
                          <td className="py-3 px-4">
                            <button onClick={() => handleDelete('quizAttempts', attempt.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(244,246,250,0.1)]">
                      <th className="text-left py-4 px-4 font-orbitron text-sm flex items-center gap-2">
                        <Info size={14} /> Details
                      </th>
                      <th className="text-left py-4 px-4 font-orbitron text-sm">
                        <Target size={14} className="inline mr-1" /> Category
                      </th>
                      <th className="text-left py-4 px-4 font-orbitron text-sm">
                        <Calendar size={14} className="inline mr-1" /> Date
                      </th>
                      <th className="text-left py-4 px-4 font-orbitron text-sm">
                        <Settings size={14} className="inline mr-1" /> Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item: any) => (
                      <tr key={item.id} className="border-b border-[rgba(244,246,250,0.05)] hover:bg-[rgba(244,246,250,0.02)] transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium flex items-center gap-2">
                            {item.featured && <Star size={14} className="text-[#39FF14]" />}
                            {item.title || item.name}
                          </div>
                          <div className="text-sm text-[#A7B0C8] line-clamp-1">{item.description || item.role}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded-full text-xs bg-[#39FF14]/10 text-[#39FF14] capitalize flex items-center gap-1 w-fit">
                            <Target size={10} />
                            {item.category || item.type}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-[#A7B0C8] flex items-center gap-1">
                          <Calendar size={14} />
                          {item.date || item.deadline || item.year || '-'}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button onClick={() => openEditModal(item)} className="p-2 hover:bg-[#39FF14]/10 rounded-lg text-[#39FF14] transition-colors" title="Edit">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDelete(activeTab, item.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-orbitron text-xl font-bold flex items-center gap-2">
                <Edit size={20} className="text-[#39FF14]" />
                {editingItem ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[rgba(244,246,250,0.1)] rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {getFormFields().map((field: any) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <field.icon size={14} className="text-[#39FF14]" />
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select 
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                      className="input-field w-full"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea 
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                      className="input-field w-full h-24 resize-none"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <input 
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                      className="input-field w-full"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}

              {activeTab === 'quizzes' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-orbitron font-bold flex items-center gap-2">
                      <ListChecks size={16} className="text-[#39FF14]" />
                      Questions
                    </h4>
                    <button type="button" onClick={addQuestionRow} className="btn-outline py-1 px-3 text-sm flex items-center gap-2">
                      <Plus size={14} /> Add Question
                    </button>
                  </div>
                  {quizQuestions.map((q, qIndex) => (
                    <div key={q.id} className="p-4 glass rounded-xl border border-[rgba(244,246,250,0.1)] space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Q{qIndex + 1}</span>
                        {quizQuestions.length > 1 && (
                          <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-400 text-xs hover:text-red-300">Remove</button>
                        )}
                      </div>
                      <input 
                        type="text"
                        value={q.question}
                        onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                        className="input-field w-full"
                        placeholder="Enter question"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {q.options.map((opt: string, optIndex: number) => (
                          <button
                            type="button"
                            key={optIndex}
                            className={`text-left input-field w-full flex items-center gap-2 ${q.correctIndex === optIndex ? 'border-[#39FF14] text-[#39FF14]' : ''}`}
                            onClick={() => markCorrect(qIndex, optIndex)}
                          >
                            <CheckSquare size={14} className={q.correctIndex === optIndex ? 'text-[#39FF14]' : 'text-[#A7B0C8]'} />
                            <input
                              type="text"
                              value={opt}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updateOptionText(qIndex, optIndex, e.target.value)}
                              className="bg-transparent flex-1 outline-none text-sm"
                              placeholder={`Option ${optIndex + 1}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="btn-outline flex-1">
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <CheckCircle size={18} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN WEBSITE COMPONENT
// ============================================
function MainWebsite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showMembership, setShowMembership] = useState(false);
  const [registrationNote, setRegistrationNote] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(null);
  const [registrationContext, setRegistrationContext] = useState<{ type: 'competition' | 'event'; sourceId: string; sourceTitle: string }>({
    type: 'competition',
    sourceId: '',
    sourceTitle: ''
  });
  const [quizParticipant, setQuizParticipant] = useState({ name: '', email: '' });
  const quizzes = dataStore.getQuizzes();
  const [activeQuizId, setActiveQuizId] = useState(quizzes[0]?.id || '');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedNews, setSelectedNews] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    revealRefs.current.forEach((el) => {
      if (!el) return;
      gsap.fromTo(el, 
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        }
      );
    });
  }, []);

  useEffect(() => {
    if (heroRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();
        tl.from('.hero-bg', { scale: 1.2, opacity: 0, duration: 2, ease: 'power2.out' })
          .from('.hero-badge', { y: 30, opacity: 0, duration: 0.6 }, '-=1.5')
          .from('.hero-title span', { y: 100, opacity: 0, stagger: 0.15, duration: 1, ease: 'power4.out' }, '-=1')
          .from('.hero-desc', { y: 40, opacity: 0, duration: 0.8 }, '-=0.5')
          .from('.hero-cta button', { y: 30, opacity: 0, stagger: 0.1, duration: 0.6 }, '-=0.3')
          .from('.hero-stats > div', { y: 40, opacity: 0, stagger: 0.1, duration: 0.6 }, '-=0.3');
      }, heroRef);
      return () => ctx.revert();
    }
  }, []);

  const addToRefs = useCallback((el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  }, []);

  const navLinks = [
    { label: 'Events', href: '#events', icon: Calendar },
    { label: 'Competitions', href: '#competitions', icon: Trophy },
    { label: 'Quiz', href: '#quiz', icon: Brain },
    { label: 'News', href: '#news', icon: FileText },
    { label: 'Gallery', href: '#gallery', icon: Image },
    { label: 'About', href: '#about', icon: Users },
    { label: 'Contact', href: '#contact', icon: Mail },
  ];

  const events = dataStore.getEvents();
  const news = dataStore.getNews();
  const gallery = dataStore.getGallery();
  const team = dataStore.getTeam();
  const competitions = dataStore.getData().competitions;
  const activeQuiz = quizzes.find((q: any) => q.id === activeQuizId);

  useEffect(() => {
    if (competitions?.length && !selectedCompetition) {
      setSelectedCompetition(competitions[0].id);
    }
  }, [competitions, selectedCompetition]);

  const featuredEvent = events.find((e: any) => e.featured) || events[0] || {
    id: 'fallback',
    title: 'New Event Coming Soon',
    date: 'TBA',
    time: 'TBA',
    location: 'TBA',
    description: 'Admins can add the next featured event from the dashboard.',
    category: 'other'
  };
  const upcomingEvents = events.filter((e: any) => !e.featured).slice(0, 4);

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    dataStore.saveMessage({
      id: Date.now().toString(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      date: new Date().toISOString().split('T')[0]
    });
    alert('Message sent successfully!');
    form.reset();
  };

  const handleRegistrationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const compId = (formData.get('competitionId') as string) || competitions[0]?.id || '';
    dataStore.saveRegistration({
      id: Date.now().toString(),
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      competitionId: compId || registrationContext.sourceId || 'unknown',
      category: formData.get('category'),
      sourceType: registrationContext.type,
      sourceId: registrationContext.sourceId,
      sourceTitle: registrationContext.sourceTitle,
      status: 'pending',
      notes: registrationNote,
      date: new Date().toISOString().split('T')[0]
    });
    alert('Registration received! We will reach out soon.');
    setShowRegistration(false);
    setRegistrationNote('');
    e.currentTarget.reset();
  };

  const openCompetitionRegistration = (competition: any) => {
    setRegistrationContext({
      type: 'competition',
      sourceId: competition?.id || '',
      sourceTitle: competition?.title || 'Competition'
    });
    if (competition?.id) {
      setSelectedCompetition(competition.id);
    }
    setShowRegistration(true);
  };

  const openEventRegistration = (event: any) => {
    setRegistrationContext({
      type: 'event',
      sourceId: event?.id || '',
      sourceTitle: event?.title || 'Event'
    });
    setShowRegistration(true);
  };

  const handleQuizAnswer = (questionId: string, optionIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: optionIndex });
  };

  const handleQuizSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeQuiz) return;
    if (!quizParticipant.name || !quizParticipant.email) {
      alert('Please add your name and email.');
      return;
    }
    const total = activeQuiz.questions.length;
    const score = activeQuiz.questions.reduce((sum: number, q: any) => {
      return sum + (quizAnswers[q.id] === q.correctIndex ? 1 : 0);
    }, 0);

    dataStore.saveQuizAttempt({
      id: Date.now().toString(),
      quizId: activeQuiz.id,
      name: quizParticipant.name,
      email: quizParticipant.email,
      score,
      total,
      date: new Date().toISOString().split('T')[0],
      answers: activeQuiz.questions.map((q: any) => ({
        questionId: q.id,
        selected: quizAnswers[q.id] ?? -1,
        correct: q.correctIndex
      }))
    });

    alert(`Submitted! You scored ${score}/${total}.`);
    setQuizAnswers({});
    setQuizParticipant({ name: '', email: '' });
    setShowQuizModal(false);
  };

  const handleMembershipSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    dataStore.saveMembership({
      id: Date.now().toString(),
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      grade: formData.get('grade'),
      interest: formData.get('interest'),
      notes: formData.get('notes'),
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    });
    alert('Membership request submitted successfully.');
    e.currentTarget.reset();
    setShowMembership(false);
  };

  const handleShareSite = async () => {
    const shareData = {
      title: 'Anadameth Astronomical Society',
      text: 'Join our astronomy community and events.',
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Site link copied to clipboard.');
      }
    } catch {
      // Ignore if user cancels share dialog.
    }
  };

  const closeDetailModals = () => {
    setSelectedEvent(null);
    setSelectedNews(null);
  };

  return (
    <div className="min-h-screen bg-[#05070A]">
      <ParticleBackground />
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass border-b border-[rgba(244,246,250,0.1)]' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <a href="#home" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                <Telescope className="text-[#05070A]" size={22} />
              </div>
              <span className="font-orbitron text-lg font-bold hidden sm:block">AAS</span>
            </a>
            
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <a key={link.label} href={link.href} className="flex items-center gap-2 px-4 py-2 text-sm text-[#A7B0C8] hover:text-[#39FF14] hover:bg-[rgba(57,255,20,0.05)] rounded-xl transition-all">
                  <link.icon size={16} />
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center">
              <button className="lg:hidden p-2 hover:bg-[rgba(244,246,250,0.05)] rounded-xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden glass border-b border-[rgba(244,246,250,0.1)] animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <a key={link.label} href={link.href} className="flex items-center gap-3 px-4 py-3 text-[#A7B0C8] hover:text-[#39FF14] hover:bg-[rgba(57,255,20,0.05)] rounded-xl transition-all" onClick={() => setMobileMenuOpen(false)}>
                  <link.icon size={18} />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="hero-bg absolute inset-0">
          <img src="/images/hero-main.jpg" alt="Hero" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-[#05070A]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070A]/80 via-transparent to-[#05070A]/80" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="hero-badge inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass mb-8 border border-[#39FF14]/20">
            <Sparkles size={16} className="text-[#39FF14]" />
            <span className="text-sm">Welcome to Anadameth Astronomical Society</span>
          </div>
          
          <h1 className="hero-title font-orbitron text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-wider mb-8">
            <span className="block text-gradient">Explore The</span>
            <span className="block text-white mt-2">Universe</span>
          </h1>
          
          <p className="hero-desc text-[#A7B0C8] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Join our community of stargazers, astronomers, and space enthusiasts. 
            Discover the cosmos through workshops, observations, and competitions.
          </p>
          
          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="#events" className="btn-primary inline-flex items-center justify-center gap-2">
              <Rocket size={18} />
              Explore Events
            </a>
            <a href="#membership" className="btn-outline inline-flex items-center justify-center gap-2">
              <Users size={18} />
              Join Club
            </a>
          </div>
          
          <div className="hero-stats flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { icon: Users, value: 500, suffix: '+', label: 'Members' },
              { icon: Calendar, value: 50, suffix: '+', label: 'Events/Year' },
              { icon: Trophy, value: 15, suffix: '+', label: 'Awards' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-[#39FF14]/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon size={22} className="text-[#39FF14]" />
                </div>
                <div className="font-orbitron text-3xl md:text-4xl font-bold text-white">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-[#A7B0C8] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#A7B0C8]">
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-[#A7B0C8]/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-[#39FF14] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Featured Event */}
      <section id="events" ref={addToRefs} className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="relative group cursor-pointer" onClick={() => setSelectedEvent(featuredEvent)}>
              <div className="absolute -inset-4 bg-gradient-to-r from-[#39FF14]/20 to-[#00D4FF]/20 rounded-[32px] blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative rounded-[24px] overflow-hidden">
                <img src="/images/event-workshop.jpg" alt="Event" className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-[#39FF14] text-[#05070A] text-sm font-bold flex items-center gap-2">
                  <Star size={14} fill="currentColor" />
                  Featured Event
                </div>
              </div>
            </div>
            
            <div>
              <span className="eyebrow mb-4 block">
                <Zap size={14} className="inline mr-1" />
                Up Next
              </span>
              <h2 className="section-title mb-6">{featuredEvent.title}</h2>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon: Calendar, text: featuredEvent.date },
                  { icon: Clock, text: featuredEvent.time },
                  { icon: MapPin, text: featuredEvent.location },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass">
                    <item.icon size={16} className="text-[#39FF14]" />
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-[#A7B0C8] text-lg mb-8 leading-relaxed">{featuredEvent.description}</p>
              
              <div className="flex flex-wrap gap-4">
                <button onClick={() => openEventRegistration(featuredEvent)} className="btn-primary flex items-center gap-2">
                  <CheckCircle size={18} />
                  Register Now
                </button>
                <button onClick={handleShareSite} className="btn-outline flex items-center gap-2">
                  <Share2 size={18} />
                  Share
                </button>
                <button onClick={() => setSelectedEvent(featuredEvent)} className="btn-outline flex items-center gap-2">
                  <Info size={18} />
                  View More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#0B0F17]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="eyebrow mb-4 block justify-center">
              <Calendar size={14} className="inline mr-1" />
              Schedule
            </span>
            <h2 className="section-title">Upcoming Events</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event: any) => (
              <div key={event.id} className="group glass rounded-2xl p-6 hover:border-[#39FF14]/30 transition-all duration-500 hover:-translate-y-2 cursor-pointer" onClick={() => setSelectedEvent(event)}>
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1.5 rounded-full text-xs bg-[#39FF14]/10 text-[#39FF14] uppercase tracking-wider flex items-center gap-1">
                    <Target size={10} />
                    {event.category}
                  </span>
                  <span className="text-sm text-[#A7B0C8] flex items-center gap-1">
                    <Calendar size={14} />
                    {event.date}
                  </span>
                </div>
                <h3 className="font-orbitron text-xl font-bold mb-3 group-hover:text-[#39FF14] transition-colors">{event.title}</h3>
                <p className="text-[#A7B0C8] mb-4 line-clamp-2">{event.description}</p>
                <div className="flex items-center gap-4 text-sm text-[#A7B0C8]">
                  <span className="flex items-center gap-1"><Clock size={14} className="text-[#39FF14]" /> {event.time}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} className="text-[#39FF14]" /> {event.location}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }} className="mt-4 text-sm text-[#39FF14] hover:text-[#5cff3d]">
                  View More
                </button>
                <button onClick={(e) => { e.stopPropagation(); openEventRegistration(event); }} className="mt-3 text-sm text-[#A7B0C8] hover:text-[#39FF14]">
                  Register for Event
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competition */}
      <section id="competitions" ref={addToRefs} className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="eyebrow mb-4 block">
                <Trophy size={14} className="inline mr-1" />
                Competition
              </span>
              <h2 className="section-title mb-6">{competitions[0]?.title}</h2>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#39FF14]/10 text-[#39FF14] mb-6">
                <Rocket size={16} />
                <span className="text-sm font-medium">Submissions Open Until {competitions[0]?.deadline}</span>
              </div>
              
              <p className="text-[#A7B0C8] text-lg mb-8 leading-relaxed">{competitions[0]?.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {(competitions[0]?.categories || []).map((cat: string) => (
                  <span key={cat} className="px-4 py-2 rounded-full text-sm glass hover:border-[#39FF14]/50 hover:text-[#39FF14] transition-colors cursor-pointer flex items-center gap-1">
                    <Camera size={14} />
                    {cat}
                  </span>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button onClick={() => openCompetitionRegistration(competitions[0])} className="btn-primary flex items-center gap-2">
                  <UploadIcon />
                  Register Now
                </button>
                <button
                  onClick={() => {
                    const rulesLink = competitions[0]?.rulesLink;
                    if (rulesLink && rulesLink !== '#') {
                      window.open(rulesLink, '_blank', 'noopener,noreferrer');
                    } else {
                      alert('Rules will be published soon.');
                    }
                  }}
                  className="btn-outline flex items-center gap-2"
                >
                  <BookOpen size={18} />
                  View Rules
                </button>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#00D4FF]/20 to-[#39FF14]/20 rounded-[32px] blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative rounded-[24px] overflow-hidden">
                <img src="/images/competition-main.jpg" alt="Competition" className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Challenge */}
      <section id="quiz" ref={addToRefs} className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#0B0F17]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <span className="eyebrow mb-4 block justify-center">
              <Brain size={14} className="inline mr-1" />
              Quiz Challenge
            </span>
            <h2 className="section-title mb-4">Test Your Astro Knowledge</h2>
            <p className="text-[#A7B0C8] text-lg leading-relaxed mb-6">
              Attempt quick MCQs curated by the admin. Get instant scoring and let the club track progress.
            </p>
            <div className="glass rounded-2xl p-5 border border-[#39FF14]/20 mb-6 text-left">
              <div className="flex items-center gap-3 mb-4">
                <IconBadge icon={ListChecks} color="green" size="sm" />
                <div>
                  <p className="text-sm text-[#A7B0C8]">Active quiz</p>
                  <h4 className="font-orbitron font-semibold">{activeQuiz?.title || 'No quiz published yet'}</h4>
                </div>
              </div>
              <p className="text-sm text-[#A7B0C8]">{activeQuiz?.description || 'Admins can add quizzes from the dashboard.'}</p>
            </div>
            <button
              onClick={() => setShowQuizModal(true)}
              disabled={quizzes.length === 0}
              className="btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Brain size={16} />
              Start Quiz
            </button>
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news" ref={addToRefs} className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#0B0F17]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="eyebrow mb-4 block justify-center">
              <FileText size={14} className="inline mr-1" />
              Latest Updates
            </span>
            <h2 className="section-title">News & Announcements</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {news.slice(0, 3).map((item: any) => (
              <div key={item.id} className="group glass rounded-2xl overflow-hidden hover:border-[#39FF14]/30 transition-all duration-500 hover:-translate-y-3 cursor-pointer" onClick={() => setSelectedNews(item)}>
                {item.image && (
                  <div className="aspect-video overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-3 py-1 rounded-full text-xs bg-[#39FF14]/10 text-[#39FF14] flex items-center gap-1">
                      <Target size={10} />
                      {item.category}
                    </span>
                    <span className="text-xs text-[#A7B0C8] flex items-center gap-1">
                      <Calendar size={10} />
                      {item.date}
                    </span>
                  </div>
                  <h3 className="font-orbitron text-lg font-bold mb-2 group-hover:text-[#39FF14] transition-colors">{item.title}</h3>
                  <p className="text-[#A7B0C8] text-sm line-clamp-2">{item.description}</p>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedNews(item); }} className="mt-4 text-sm text-[#39FF14] hover:text-[#5cff3d]">
                    View More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" ref={addToRefs} className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="eyebrow mb-4 block justify-center">
              <Image size={14} className="inline mr-1" />
              Memories
            </span>
            <h2 className="section-title">Gallery</h2>
            <p className="text-[#A7B0C8] mt-4 max-w-xl mx-auto">Moments from our observation nights, competitions, and camps</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((img: any, i: number) => (
              <div key={img.id} className={`group relative overflow-hidden rounded-2xl cursor-pointer ${i === 0 || i === 5 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="eyebrow text-[10px] mb-1">{img.category}</span>
                    <p className="font-medium text-sm">{img.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Team */}
      <section id="about" ref={addToRefs} className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#0B0F17]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 mb-24">
            <div>
              <span className="eyebrow mb-4 block">
                <Users size={14} className="inline mr-1" />
                Our Story
              </span>
              <h2 className="section-title mb-6">Who We Are</h2>
              <p className="text-[#A7B0C8] text-lg mb-6 leading-relaxed">
                Anadameth Astronomical Society is a student-led club built around curiosity, teamwork, and the night sky.
              </p>
              <p className="text-[#A7B0C8] mb-8 leading-relaxed">
                We organize regular observation nights, workshops, and competitions that inspire the next generation of space explorers.
              </p>
              <blockquote className="border-l-4 border-[#39FF14] pl-6 py-2 mb-8">
                <p className="text-lg italic text-[#A7B0C8]">"The universe is under no obligation to make sense to us."</p>
                <cite className="text-sm text-[#39FF14] mt-2 block">— Neil deGrasse Tyson</cite>
              </blockquote>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#39FF14]/20 to-[#00D4FF]/20 rounded-[32px] blur-2xl opacity-50" />
              <img src="/images/achievement-win.jpg" alt="Team" className="relative rounded-[24px] w-full aspect-video object-cover" />
            </div>
          </div>
          
          {/* Team */}
          <div className="text-center mb-12">
            <span className="eyebrow mb-4 block justify-center">
              <Crown size={14} className="inline mr-1" />
              Leadership
            </span>
            <h3 className="font-orbitron text-3xl font-bold">Our Team</h3>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member: any) => (
              <div key={member.id} className="group glass rounded-2xl p-8 text-center hover:border-[#39FF14]/30 transition-all duration-500 hover:-translate-y-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#39FF14]/20 to-[#00D4FF]/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <Users size={32} className="text-[#39FF14]" />
                </div>
                <h4 className="font-orbitron text-lg font-bold mb-1">{member.name}</h4>
                <p className="text-[#A7B0C8] mb-2">{member.role}</p>
                <span className="inline-block px-3 py-1 rounded-full text-xs glass capitalize">{member.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="membership" ref={addToRefs} className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#0B0F17]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="eyebrow mb-4 block justify-center">
              <UserPlus size={14} className="inline mr-1" />
              Membership
            </span>
            <h2 className="section-title mb-4">Become a Member</h2>
            <p className="text-[#A7B0C8] max-w-2xl mx-auto">
              Join weekly sky-watching sessions, workshops, and quiz training. Submit your membership request and admins will review it.
            </p>
          </div>
          <div className="glass rounded-3xl p-8 border border-[#39FF14]/20 text-center">
            <p className="text-[#A7B0C8] mb-6">Membership requests are reviewed by the admin team and updated in the dashboard.</p>
            <button onClick={() => setShowMembership(true)} className="btn-primary inline-flex items-center gap-2">
              <UserPlus size={16} />
              Apply for Membership
            </button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" ref={addToRefs} className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <span className="eyebrow mb-4 block">
                <Mail size={14} className="inline mr-1" />
                Get In Touch
              </span>
              <h2 className="section-title mb-6">Contact Us</h2>
              <p className="text-[#A7B0C8] text-lg mb-10">Have a question? We would love to hear from you.</p>
              
              <div className="space-y-6">
                {[
                  { icon: Mail, title: 'Email', value: 'astro@anadameth.edu' },
                  { icon: MapPinned, title: 'Location', value: 'Observatory Deck, Anadameth College' },
                  { icon: Clock, title: 'Meeting Time', value: 'Every Thursday, 3:30 PM' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#39FF14]/10 flex items-center justify-center">
                      <item.icon size={20} className="text-[#39FF14]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#A7B0C8]">{item.title}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Users size={14} className="text-[#39FF14]" /> Name
                  </label>
                  <input type="text" name="name" required className="input-field w-full" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Mail size={14} className="text-[#39FF14]" /> Email
                  </label>
                  <input type="email" name="email" required className="input-field w-full" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <MessageCircle size={14} className="text-[#39FF14]" /> Message
                  </label>
                  <textarea name="message" required rows={4} className="input-field w-full resize-none" placeholder="Your message..."></textarea>
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[rgba(244,246,250,0.1)] bg-[#0B0F17]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(57,255,20,0.3)]">
              <Telescope size={28} className="text-[#05070A]" />
            </div>
            <h3 className="font-orbitron text-2xl font-bold mb-2">ANADAMETH ASTRONOMICAL SOCIETY</h3>
            <p className="text-[#A7B0C8]">Curiosity begins here.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { title: 'Explore', links: [{ label: 'Events', href: '#events' }, { label: 'Competitions', href: '#competitions' }, { label: 'Gallery', href: '#gallery' }] },
              { title: 'Learn', links: [{ label: 'Quiz Challenge', href: '#quiz' }, { label: 'News', href: '#news' }, { label: 'Membership', href: '#membership' }] },
              { title: 'Join', links: [{ label: 'Membership', href: '#membership' }, { label: 'Our Team', href: '#about' }, { label: 'About Us', href: '#about' }] },
              { title: 'Connect', links: [{ label: 'Contact', href: '#contact' }, { label: 'Email Us', href: 'mailto:astro@anadameth.edu' }, { label: 'Top', href: '#home' }] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-orbitron font-bold mb-4 flex items-center gap-2">
                  <Target size={14} className="text-[#39FF14]" />
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href={link.href} className="text-[#A7B0C8] hover:text-[#39FF14] transition-colors text-sm flex items-center gap-1">
                        <ChevronRight size={12} />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-[rgba(244,246,250,0.1)] flex justify-center items-center">
            <p className="text-[#A7B0C8] text-sm text-center">© 2026 Anadameth Astronomical Society. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-full glass flex items-center justify-center text-[#39FF14] hover:bg-[#39FF14] hover:text-[#05070A] transition-all z-40 ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <ChevronUp size={24} />
      </button>

      {/* Competition Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass rounded-3xl p-8 w-full max-w-xl relative animate-scale-in">
            <button onClick={() => setShowRegistration(false)} className="absolute top-4 right-4 text-[#A7B0C8] hover:text-[#F4F6FA] transition-colors">
              <X size={24} />
            </button>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-[#39FF14] mb-2">
                <UploadIcon />
                Competition Registration
              </div>
              <h3 className="font-orbitron text-2xl font-bold">Join the Challenge</h3>
              <p className="text-sm text-[#A7B0C8] mt-2">Fill the form to confirm your spot. We’ll email you next steps.</p>
              <p className="text-xs text-[#39FF14] mt-1">Request for: {registrationContext.sourceTitle || 'Competition'}</p>
            </div>

            <form className="space-y-4" onSubmit={handleRegistrationSubmit}>
              <div className="grid md:grid-cols-2 gap-3">
                <input name="name" required placeholder="Full name" className="input-field w-full" />
                <input name="email" required type="email" placeholder="Email" className="input-field w-full" />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <input name="phone" placeholder="Phone / WhatsApp" className="input-field w-full" />
                {registrationContext.type === 'competition' ? (
                  <select 
                    name="competitionId" 
                    value={selectedCompetition || ''}
                    onChange={(e) => setSelectedCompetition(e.target.value)}
                    className="input-field w-full"
                    disabled={!competitions.length}
                  >
                    {!competitions.length && <option value="">No competitions available</option>}
                    {competitions.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                ) : (
                  <input value={registrationContext.sourceTitle} className="input-field w-full" disabled />
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <select name="category" className="input-field w-full">
                  <option value="">Pick a category</option>
                  {(registrationContext.type === 'competition'
                    ? competitions.find((c: any) => c.id === selectedCompetition)?.categories
                    : ['General'])?.map((cat: string) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input 
                  value={registrationNote} 
                  onChange={(e) => setRegistrationNote(e.target.value)} 
                  placeholder="Any notes or needs?" 
                  className="input-field w-full" 
                />
              </div>
              <button type="submit" disabled={registrationContext.type === 'competition' && !competitions.length} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                <Send size={16} />
                Submit Registration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Membership Modal */}
      {showMembership && (
        <div className="fixed inset-0 z-[205] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass rounded-3xl p-8 w-full max-w-2xl relative animate-scale-in">
            <button onClick={() => setShowMembership(false)} className="absolute top-4 right-4 text-[#A7B0C8] hover:text-[#F4F6FA] transition-colors">
              <X size={24} />
            </button>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-[#39FF14] mb-2">
                <UserPlus size={16} />
                Membership Application
              </div>
              <h3 className="font-orbitron text-2xl font-bold">Join the Society</h3>
              <p className="text-sm text-[#A7B0C8] mt-2">Fill in your details. Admin will review and update your status.</p>
            </div>

            <form className="space-y-4" onSubmit={handleMembershipSubmit}>
              <div className="grid md:grid-cols-2 gap-3">
                <input name="name" required placeholder="Full name" className="input-field w-full" />
                <input name="email" type="email" required placeholder="Email address" className="input-field w-full" />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <input name="phone" placeholder="Phone / WhatsApp" className="input-field w-full" />
                <input name="grade" placeholder="Grade / Class" className="input-field w-full" />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <input name="interest" placeholder="Main interest (e.g. Astrophotography)" className="input-field w-full" />
                <input name="notes" placeholder="Additional notes" className="input-field w-full" />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Send size={16} />
                Submit Membership Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass rounded-3xl p-6 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-scale-in">
            <button onClick={() => setShowQuizModal(false)} className="absolute top-4 right-4 text-[#A7B0C8] hover:text-[#F4F6FA] transition-colors">
              <X size={24} />
            </button>

            <div className="mb-6">
              <h3 className="font-orbitron text-2xl font-bold">Quiz Challenge</h3>
              <p className="text-sm text-[#A7B0C8] mt-2">Complete the MCQs and submit to get your score.</p>
            </div>

            <form className="space-y-4" onSubmit={handleQuizSubmit}>
              <div className="grid md:grid-cols-2 gap-3">
                <input 
                  value={quizParticipant.name}
                  onChange={(e) => setQuizParticipant({ ...quizParticipant, name: e.target.value })}
                  placeholder="Your name"
                  className="input-field w-full"
                  required
                />
                <input 
                  type="email"
                  value={quizParticipant.email}
                  onChange={(e) => setQuizParticipant({ ...quizParticipant, email: e.target.value })}
                  placeholder="Email"
                  className="input-field w-full"
                  required
                />
              </div>

              <select 
                className="input-field w-full"
                value={activeQuizId}
                onChange={(e) => { setActiveQuizId(e.target.value); setQuizAnswers({}); }}
                required={quizzes.length > 0}
                disabled={quizzes.length === 0}
              >
                {quizzes.length === 0 && <option value="">No quizzes published</option>}
                {quizzes.map((q: any) => (
                  <option key={q.id} value={q.id}>{q.title}</option>
                ))}
              </select>

              {activeQuiz?.questions?.map((q: any, idx: number) => (
                <div key={q.id} className="p-4 rounded-2xl bg-[#0B0F17] border border-[rgba(244,246,250,0.08)]">
                  <p className="text-sm text-[#A7B0C8] mb-3">Q{idx + 1}. {q.question}</p>
                  <div className="grid md:grid-cols-2 gap-2">
                    {q.options.map((opt: string, optIdx: number) => (
                      <label key={optIdx} className={`input-field cursor-pointer flex items-center gap-2 ${quizAnswers[q.id] === optIdx ? 'border-[#39FF14] text-[#39FF14]' : ''}`}>
                        <input
                          type="radio"
                          className="accent-[#39FF14]"
                          name={`quiz-${q.id}`}
                          value={optIdx}
                          checked={quizAnswers[q.id] === optIdx}
                          onChange={() => handleQuizAnswer(q.id, optIdx)}
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button type="submit" disabled={quizzes.length === 0} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                <Send size={16} />
                Submit Answers
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[215] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-scale-in">
            <button onClick={closeDetailModals} className="absolute top-4 right-4 text-[#A7B0C8] hover:text-[#F4F6FA] transition-colors">
              <X size={24} />
            </button>
            <h3 className="font-orbitron text-2xl font-bold mb-3">{selectedEvent.title}</h3>
            <div className="flex flex-wrap gap-2 mb-4 text-sm text-[#A7B0C8]">
              <span className="px-3 py-1 rounded-lg bg-[rgba(244,246,250,0.06)] flex items-center gap-1"><Calendar size={14} /> {selectedEvent.date}</span>
              <span className="px-3 py-1 rounded-lg bg-[rgba(244,246,250,0.06)] flex items-center gap-1"><Clock size={14} /> {selectedEvent.time}</span>
              <span className="px-3 py-1 rounded-lg bg-[rgba(244,246,250,0.06)] flex items-center gap-1"><MapPin size={14} /> {selectedEvent.location}</span>
            </div>
            <p className="text-[#A7B0C8] leading-relaxed">{selectedEvent.description}</p>
          </div>
        </div>
      )}

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-[216] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-scale-in">
            <button onClick={closeDetailModals} className="absolute top-4 right-4 text-[#A7B0C8] hover:text-[#F4F6FA] transition-colors">
              <X size={24} />
            </button>
            <h3 className="font-orbitron text-2xl font-bold mb-3">{selectedNews.title}</h3>
            <div className="flex flex-wrap gap-2 mb-4 text-sm text-[#A7B0C8]">
              <span className="px-3 py-1 rounded-lg bg-[rgba(244,246,250,0.06)] flex items-center gap-1"><Calendar size={14} /> {selectedNews.date}</span>
              <span className="px-3 py-1 rounded-lg bg-[rgba(244,246,250,0.06)] flex items-center gap-1"><Target size={14} /> {selectedNews.category}</span>
            </div>
            {selectedNews.image && (
              <img src={selectedNews.image} alt={selectedNews.title} className="w-full max-h-72 object-cover rounded-2xl mb-4" />
            )}
            <p className="text-[#A7B0C8] leading-relaxed">{selectedNews.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Upload Icon Component
function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

// ============================================
// LOGIN MODAL
// ============================================
function LoginModal({ onLogin, onClose }: { onLogin: () => void; onClose: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass rounded-3xl p-8 w-full max-w-md relative animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#A7B0C8] hover:text-[#F4F6FA] transition-colors">
          <X size={24} />
        </button>
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#39FF14]/20 to-[#00D4FF]/20 flex items-center justify-center mx-auto mb-4">
            <Telescope size={36} className="text-[#39FF14]" />
          </div>
          <h2 className="font-orbitron text-2xl font-bold">Admin Login</h2>
          <p className="text-[#A7B0C8] text-sm mt-2">Enter password to access dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field w-full text-center text-lg"
            placeholder="••••••••"
          />
          {error && <p className="text-red-400 text-sm text-center flex items-center justify-center gap-1"><AlertCircle size={14} /> {error}</p>}
          <button type="submit" className="btn-primary w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================
function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const clearAdminParam = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('admin_entry');
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.get('admin_entry') === ADMIN_ENTRY_TOKEN) {
        setShowLogin(true);
      }
    }
  }, []);

  if (isAdmin) {
    return <AdminDashboard onLogout={() => setIsAdmin(false)} />;
  }

  return (
    <>
      <MainWebsite />
      {showLogin && (
        <LoginModal 
          onLogin={() => { setIsAdmin(true); setShowLogin(false); clearAdminParam(); }} 
          onClose={() => { setShowLogin(false); clearAdminParam(); }} 
        />
      )}
    </>
  );
}

export default App;
