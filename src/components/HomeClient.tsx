'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, ShieldCheck, Truck, Headphones, HelpCircle, 
  Mail, ChevronLeft, ChevronRight, BarChart3, Users,
  ShoppingBag, Check, Star, RefreshCw
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { apiFetch } from '../utils/api';

// Hero slides
const HERO_SLIDES = [
  {
    title: 'Peak Tech Performance',
    subtitle: 'MacBook Pro 16" M3 Max',
    desc: 'Blazing-fast speeds and unparalleled graphical processing. Power through extreme engineering workflows, 3D rendering, and video editing with ease.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    color: 'from-indigo-500/20 to-cyan-500/20',
    cta: 'Explore Laptops',
    link: '/explore?category=Laptops'
  },
  {
    title: 'Acoustic Perfection',
    subtitle: 'Sony WH-1000XM5 Audio',
    desc: 'Industry-leading noise cancellation engineered with dual processors. Exceptional audio fidelity and up to 30 hours of continuous wireless playback.',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=800',
    color: 'from-purple-500/20 to-pink-500/20',
    cta: 'Browse Audio',
    link: '/explore?category=Audio'
  },
  {
    title: 'Engineered for Adventure',
    subtitle: 'Apple Watch Ultra 2',
    desc: 'The toughest sports watch in the world. Features a lightweight aerospace titanium casing, dual-frequency GPS, and up to 72 hours of low-power battery life.',
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=800',
    color: 'from-cyan-500/20 to-emerald-500/20',
    cta: 'View Wearables',
    link: '/explore?category=Wearables'
  }
];

const CATEGORIES = [
  { name: 'Smartphones', count: '4 Items', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=300' },
  { name: 'Laptops', count: '3 Items', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=300' },
  { name: 'Audio', count: '5 Items', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=300' },
  { name: 'Wearables', count: '2 Items', image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=300' },
  { name: 'Cameras', count: '4 Items', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=300' },
  { name: 'Accessories', count: '6 Items', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=300' },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Jenkins',
    role: 'Hardware Reviewer',
    quote: 'NexMart has completely changed how I source tech listings. The descriptions are detailed, the specs sheets are actual facts, and the response time from sellers is impressive. Highly recommended!',
    avatar: 'S',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Creative Director',
    quote: 'Bought my M3 Max MacBook through this platform. The filtering allowed me to find the exact specification I needed in seconds. A beautiful and extremely fluid user interface.',
    avatar: 'M',
    rating: 5
  },
  {
    name: 'Elena Rostova',
    role: 'Software Engineer',
    quote: 'I love the transparent listing format. Seeing item priorities and seller location helps me coordinate secure local pick-ups easily. The layout is premium and looks state of the art.',
    avatar: 'E',
    rating: 4
  }
];

const FAQS = [
  {
    q: 'How does NexMart verify listed items?',
    a: 'Each listing includes mandatory fields like category, location, and technical specifications. We review uploads and encourage buyers to cross-reference verified seller contact details.'
  },
  {
    q: 'Can I sell my own custom-built PC or tech gadgets?',
    a: 'Absolutely. By creating a free account, you can access the "Add Item" interface to list any electronic products with descriptions, pricing, priorities, and image links.'
  },
  {
    q: 'Is there a buyer protection scheme in place?',
    a: 'All listings are public and direct. We encourage meeting in secure public zones for trades, and checking specification lists before finalizing payments.'
  },
  {
    q: 'How does the priority rating system work?',
    a: 'Sellers tag listings as Low, Medium, or High priority to indicate urgency of sale or item availability. Users can sort explore grids to search high priority items first.'
  }
];

const CHART_COLORS = ['#6366f1', '#06b6d4', '#d946ef', '#10b981', '#f59e0b', '#ec4899'];

export const HomeClient: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [statsData, setStatsData] = useState<any>(null);
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch stats and items on mount
    const fetchData = async () => {
      try {
        const stats = await apiFetch('/stats');
        setStatsData(stats);

        const itemsRes = await apiFetch('/items?limit=4');
        if (itemsRes.items) {
          setFeaturedItems(itemsRes.items);
        }
      } catch (err) {
        console.error('Failed to load home page data:', err);
      }
    };
    fetchData();

    // Auto rotate hero
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 4000);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-slate-400">Loading NexMart Platform...</span>
        </div>
      </div>
    );
  }

  // Fallback charts if stats fail or loading
  const defaultGrowth = [
    { month: 'Jan', listings: 12, views: 240 },
    { month: 'Feb', listings: 19, views: 380 },
    { month: 'Mar', listings: 28, views: 512 },
    { month: 'Apr', listings: 35, views: 760 },
    { month: 'May', listings: 50, views: 980 },
    { month: 'Jun', listings: 68, views: 1420 },
    { month: 'Jul', listings: 85, views: 1890 }
  ];

  const defaultCategoryPie = [
    { name: 'Smartphones', value: 4 },
    { name: 'Laptops', value: 3 },
    { name: 'Audio', value: 5 },
    { name: 'Accessories', value: 6 },
    { name: 'Wearables', value: 2 },
    { name: 'Cameras', value: 4 }
  ];

  const chartsData = statsData?.growthTrend || defaultGrowth;
  const pieData = statsData?.categoryStats?.map((s: any) => ({
    name: s.category,
    value: s.count
  })) || defaultCategoryPie;

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION (Height: 60-70% of viewport) */}
      <section className="relative min-h-[500px] max-h-[620px] h-[60vh] flex items-center overflow-hidden border-b border-white/5">
        {/* Carousel Background Glow */}
        <div className="absolute inset-0 bg-cover bg-center opacity-10 transition-all duration-1000 ease-in-out" 
             style={{ backgroundImage: `url(${HERO_SLIDES[activeSlide].image})` }}></div>
        
        {/* Interactive slide colored glow */}
        <div className={`absolute inset-0 bg-gradient-to-r ${HERO_SLIDES[activeSlide].color} transition-all duration-700`}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Slider Text Content */}
            <div className="space-y-6">
              <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <span>🔥 Featured Release</span>
              </span>
              <div className="space-y-2">
                <h2 className="text-lg uppercase tracking-widest text-cyan-400 font-bold">
                  {HERO_SLIDES[activeSlide].title}
                </h2>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {HERO_SLIDES[activeSlide].subtitle}
                </h1>
              </div>
              <p className="text-base text-slate-300 max-w-xl leading-relaxed">
                {HERO_SLIDES[activeSlide].desc}
              </p>
              <div className="flex items-center space-x-4 pt-2">
                <Link href={HERO_SLIDES[activeSlide].link} className="gradient-bg hover:shadow-lg hover:shadow-indigo-500/20 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:scale-105 flex items-center space-x-2">
                  <span>{HERO_SLIDES[activeSlide].cta}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/explore" className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all">
                  Browse All
                </Link>
              </div>
            </div>

            {/* Slider Product Image (Interactive) */}
            <div className="hidden lg:flex justify-center relative">
              <div className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <img 
                  src={HERO_SLIDES[activeSlide].image} 
                  alt={HERO_SLIDES[activeSlide].subtitle}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-left">
                    <span className="text-xs text-indigo-300 font-bold block mb-1">NexMart Exclusive</span>
                    <span className="text-sm font-semibold text-white">{HERO_SLIDES[activeSlide].subtitle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel controls */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-900 transition-all z-20">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-900 transition-all z-20">
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${activeSlide === i ? 'w-8 bg-indigo-500' : 'w-2.5 bg-slate-600'}`}
            />
          ))}
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Browse by Area</h2>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Curated Tech Categories
          </h1>
          <p className="text-slate-400 mt-4 text-sm leading-relaxed">
            Find exactly what you need quickly. Filter our massive catalog of pre-owned and new electronics across six categories.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <Link 
              key={cat.name} 
              href={`/explore?category=${cat.name}`}
              className="glass-card rounded-xl p-5 text-center flex flex-col items-center group cursor-pointer"
            >
              <div className="h-16 w-16 rounded-full overflow-hidden border border-white/15 mb-4 group-hover:border-indigo-400 transition-colors">
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{cat.name}</h3>
              <span className="text-xxs text-slate-400 mt-1 block font-medium">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. STATISTICS DASHBOARD SECTION (RECHARTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-2xl p-8 border border-white/10 relative overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center mb-12">
            <div className="lg:col-span-1 space-y-4">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <BarChart3 className="h-3 w-3" />
                <span>Live Analytics</span>
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                NexMart Marketplace Stats
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Real-time snapshot of listings development, category ratios, and active inquiries. Track market trends on our platform.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 text-center">
                  <span className="text-2xl font-black text-indigo-400 block">
                    {statsData?.summary?.totalItems || '12'}
                  </span>
                  <span className="text-xxs text-slate-400 uppercase tracking-wider font-semibold">Total Listings</span>
                </div>
                <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 text-center">
                  <span className="text-2xl font-black text-cyan-400 block">
                    {statsData?.summary?.totalUsers || '2'}
                  </span>
                  <span className="text-xxs text-slate-400 uppercase tracking-wider font-semibold">Verified Users</span>
                </div>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="lg:col-span-2 h-[260px] bg-slate-950/40 rounded-xl p-4 border border-white/5">
              <h3 className="text-xs uppercase text-slate-400 font-bold mb-4 tracking-wider">Listing Upload Growth Trend</h3>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={chartsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, color: '#f8fafc' }} />
                  <Area type="monotone" dataKey="listings" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorListings)" name="Listings" />
                  <Area type="monotone" dataKey="views" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" name="Traffic" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/5 pt-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">98.4% Satisfaction</h4>
                <p className="text-slate-400 text-xs mt-0.5">Highly rated transactional safety</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">980+ Inquiries</h4>
                <p className="text-slate-400 text-xs mt-0.5">High user engagement rate</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl border border-pink-500/20">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">24h Response</h4>
                <p className="text-slate-400 text-xs mt-0.5">Average seller reply speed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PLATFORM BENEFITS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Core Standards</h2>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Why Buy & Sell on NexMart?
          </h1>
          <p className="text-slate-400 mt-4 text-sm leading-relaxed">
            We provide a modern platform designed specifically to connect hardware enthusiasts securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="glass-card rounded-2xl p-6 border border-white/5 hover:border-indigo-500/30">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
              <Truck className="h-5 w-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-2">Fast Logistics</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Coordinate easy deliveries, secure postal shipping, or physical pickups in local neighborhoods with ease.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/5 hover:border-indigo-500/30">
            <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-2">Secure Listings</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Our accounts have encrypted profiles and verified email metrics to ensure low spam listings and low risk.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/5 hover:border-indigo-500/30">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
              <Star className="h-5 w-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-2">Detailed Spec Sheet</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Every item contains pricing, availability priority tags, precise conditions, and transparent descriptions.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/5 hover:border-indigo-500/30">
            <div className="h-10 w-10 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center mb-6">
              <Headphones className="h-5 w-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-2">Technical Support</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Having issues with account set up or uploading images? Contact our SSL-supported center anytime.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FEATURED HIGHLIGHTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Top Picks</h2>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Featured Listings
            </h1>
            <p className="text-slate-400 mt-3 text-sm leading-relaxed">
              Explore some of our latest premium gadget submissions. Highly rated and ready for shipment.
            </p>
          </div>
          <Link href="/explore" className="group mt-4 md:mt-0 inline-flex items-center space-x-2 text-indigo-400 hover:text-white font-semibold text-sm transition-colors">
            <span>View all explore grids</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Skeleton loading check */}
        {featuredItems.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden h-[380px] flex flex-col p-4 space-y-4">
                <div className="skeleton h-[180px] w-full rounded-xl"></div>
                <div className="skeleton h-5 w-2/3 rounded"></div>
                <div className="skeleton h-3 w-full rounded"></div>
                <div className="skeleton h-3 w-5/6 rounded"></div>
                <div className="flex justify-between items-center pt-2 mt-auto">
                  <div className="skeleton h-5 w-1/3 rounded"></div>
                  <div className="skeleton h-8 w-1/3 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item: any) => (
              <div 
                key={item._id || item.id} 
                className="glass-card rounded-2xl overflow-hidden h-[410px] flex flex-col group relative"
              >
                {/* Priority Ribbon */}
                {item.priority === 'high' && (
                  <span className="absolute top-3 right-3 bg-rose-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-lg z-10">
                    High Priority
                  </span>
                )}
                
                {/* Card Image */}
                <div className="h-[180px] w-full overflow-hidden relative border-b border-white/5">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" 
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                    {item.category}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-white font-bold text-sm tracking-tight line-clamp-1 mb-1 group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 flex items-center space-x-1.5 mb-2 font-medium">
                    <span>📍 {item.location}</span>
                    <span>•</span>
                    <span className="text-yellow-400">★ {Number(item.rating).toFixed(1)}</span>
                  </span>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {item.shortDescription}
                  </p>
                  
                  {/* Footer actions */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="text-base font-black text-indigo-300">
                      ${item.price}
                    </span>
                    <Link 
                      href={`/items/${item._id || item.id}`}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 hover:scale-105 transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10 text-center relative">
          <div className="absolute top-4 left-6 text-6xl text-indigo-500/20 font-serif leading-none select-none">“</div>
          
          <div className="space-y-6">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Feedback Loop</h2>
            <p className="text-lg md:text-xl text-slate-200 italic font-medium leading-relaxed max-w-2xl mx-auto">
              "{TESTIMONIALS[activeTestimonial].quote}"
            </p>
            
            <div className="flex flex-col items-center pt-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg mb-3 shadow-lg shadow-indigo-500/10">
                {TESTIMONIALS[activeTestimonial].avatar}
              </div>
              <span className="text-white font-bold text-sm block">
                {TESTIMONIALS[activeTestimonial].name}
              </span>
              <span className="text-slate-400 text-xs">
                {TESTIMONIALS[activeTestimonial].role}
              </span>
            </div>

            {/* Rating Stars */}
            <div className="flex justify-center space-x-1 text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-sm">
                  {i < TESTIMONIALS[activeTestimonial].rating ? '★' : '☆'}
                </span>
              ))}
            </div>
          </div>

          {/* Testimonial slider indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`h-2.5 rounded-full transition-all ${activeTestimonial === i ? 'w-6 bg-indigo-500' : 'w-2.5 bg-slate-700'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Got Questions?</h2>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h1>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div 
              key={index} 
              className="glass-card rounded-xl border border-white/5 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-4.5 text-left text-white hover:bg-white/5 transition-colors focus:outline-none"
              >
                <span className="font-semibold text-sm md:text-base flex items-center space-x-3">
                  <HelpCircle className="h-4.5 w-4.5 text-indigo-400 flex-shrink-0" />
                  <span>{faq.q}</span>
                </span>
                <ChevronDownIcon isOpen={activeFaq === index} />
              </button>

              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  activeFaq === index ? 'max-h-40 py-4.5 border-t border-white/5 text-slate-300 text-sm leading-relaxed' : 'max-h-0 text-transparent'
                }`}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. NEWSLETTER / CALL TO ACTION SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden text-center">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>

          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-extrabold">Exclusive Updates</h2>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Upgrade Your Workspace?
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Subscribe to the NexMart monthly dispatch. Receive early alerts on verified high-priority gadget releases and exclusive deals before they go public.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <div className="relative w-full sm:max-w-md">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="Enter your professional email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full pl-10.5 pr-4 py-3 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-white gradient-bg hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all hover:scale-102 flex items-center justify-center space-x-2"
              >
                <span>Subscribe Dispatch</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {newsletterSuccess && (
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-xs mx-auto animate-bounce mt-4">
                <Check className="h-3 w-3" />
                <span>Subscription successful! Enjoy early alerts.</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

// Internal icon component helper
const ChevronDownIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  return (
    <svg 
      className={`h-5 w-5 text-slate-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
};
