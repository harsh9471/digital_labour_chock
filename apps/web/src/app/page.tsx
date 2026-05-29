import Link from 'next/link';
import {
  ArrowRight, CheckCircle2, Star, Users, Briefcase,
  MapPin, Shield, Zap, Phone, IndianRupee, Clock,
  ChevronRight, TrendingUp, HardHat, Wrench, Hammer,
  Paintbrush, Car, Building2, Quote
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import NavActions from '@/components/home/NavActions';
import DynamicBanners from '@/components/home/DynamicBanners';
import DynamicNavLinks from '@/components/home/DynamicNavLinks';

const stats = [
  { label: 'Registered Workers', value: '2.5 Lakh+', icon: Users },
  { label: 'Active Contractors', value: '15,000+', icon: Briefcase },
  { label: 'Partner Companies', value: '850+', icon: Building2 },
  { label: 'Active Projects', value: '200+', icon: TrendingUp },
];

const features = [
  {
    title: 'OTP-Based Instant Login',
    description: 'Workers login with just their phone number — no passwords, no hassle.',
    icon: Phone,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Verified & Trusted',
    description: 'All workers are Aadhaar & document verified before they can be hired.',
    icon: Shield,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Fair & Transparent Pay',
    description: 'Daily/weekly wage structure visible upfront. No hidden fees.',
    icon: IndianRupee,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    title: 'Hire in Minutes',
    description: 'Post a job, review applications, and start hiring the same day.',
    icon: Zap,
    gradient: 'from-purple-500 to-violet-600',
  },
  {
    title: '100+ Cities',
    description: 'Workers and contractors connected across every major city in India.',
    icon: MapPin,
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    title: 'Real-time Tracking',
    description: 'Track applications, hiring status and job progress live.',
    icon: TrendingUp,
    gradient: 'from-teal-500 to-cyan-600',
  },
];

const skillCategories = [
  { name: 'Construction', count: '45,000+', icon: Building2, bg: 'bg-orange-50', text: 'text-orange-700' },
  { name: 'Plumbing', count: '12,000+', icon: Wrench, bg: 'bg-blue-50', text: 'text-blue-700' },
  { name: 'Electrical', count: '18,000+', icon: Zap, bg: 'bg-yellow-50', text: 'text-yellow-700' },
  { name: 'Carpentry', count: '9,000+', icon: Hammer, bg: 'bg-green-50', text: 'text-green-700' },
  { name: 'Painting', count: '15,000+', icon: Paintbrush, bg: 'bg-purple-50', text: 'text-purple-700' },
  { name: 'Driving', count: '22,000+', icon: Car, bg: 'bg-indigo-50', text: 'text-indigo-700' },
  { name: 'Masonry', count: '30,000+', icon: HardHat, bg: 'bg-stone-50', text: 'text-stone-700' },
  { name: 'Welding', count: '8,000+', icon: Shield, bg: 'bg-gray-50', text: 'text-gray-700' },
];

const howItWorks = [
  { step: '01', title: 'Download App / Register', desc: 'Register on the app or web in under 2 minutes with your phone number.', icon: Phone, color: 'bg-blue-600' },
  { step: '02', title: 'Create Your Profile', desc: 'Add your skills, experience, and upload verification documents.', icon: Users, color: 'bg-purple-600' },
  { step: '03', title: 'Post Project / Browse Jobs', desc: 'Contractors post projects; workers apply with a single tap.', icon: Briefcase, color: 'bg-orange-600' },
  { step: '04', title: 'Interview & Hire', desc: 'Chat, review profiles, and confirm your hire on the platform.', icon: CheckCircle2, color: 'bg-emerald-600' },
  { step: '05', title: 'Work & Get Paid', desc: 'Track attendance, complete work, and receive payment securely.', icon: IndianRupee, color: 'bg-amber-600' },
];

const companyLogos = [
  'Sobha Limited', 'L&T Construction', 'Quess Corp', 'TeamLease',
  'Shapoorji Pallonji', 'DLF', 'Prestige Group', 'Godrej Properties',
];

const testimonials = [
  {
    company: 'Sobha Limited',
    role: 'Head of HR Operations',
    text: 'Digital Labour Chowk helped us hire 200+ skilled masons in just 2 weeks for our Bangalore project. The verification system is exceptional.',
    rating: 5,
    avatar: 'SL',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    company: 'Quess Corp',
    role: 'Staffing Manager',
    text: 'The verification system is outstanding. We\'ve reduced hiring time by 60% using this platform. Our clients are extremely satisfied with worker quality.',
    rating: 5,
    avatar: 'QC',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    company: 'L&T Construction',
    role: 'Project Director',
    text: 'Managing attendance and payroll for our 500+ daily workers has never been easier. The dashboard is powerful and intuitive.',
    rating: 5,
    avatar: 'LT',
    gradient: 'from-orange-500 to-amber-600',
  },
  {
    company: 'Prestige Group',
    role: 'Site Manager',
    text: 'We\'ve onboarded over 350 verified tradespeople through Digital Labour Chowk. The quality and reliability is consistently high.',
    rating: 5,
    avatar: 'PG',
    gradient: 'from-purple-500 to-violet-600',
  },
  {
    company: 'DLF',
    role: 'Construction Head',
    text: 'The platform transformed our workforce management. Real-time tracking and digital payments have eliminated a lot of manual work.',
    rating: 5,
    avatar: 'DL',
    gradient: 'from-rose-500 to-pink-600',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Navigation ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">DL</span>
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">
              Digital Labour <span className="text-blue-600">Chowk</span>
            </span>
            <span className="font-bold text-gray-900 text-base sm:hidden">DLC</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {[
              { href: '/about', label: 'About' },
              { href: '/business', label: 'Business' },
              { href: '/platform/workers', label: 'Workers' },
              { href: '/platform/projects', label: 'Projects' },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
                {label}
              </Link>
            ))}
            <DynamicNavLinks />
          </div>

          <NavActions />
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-20 px-4 overflow-hidden bg-slate-900">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-[position:70%_center] md:bg-right bg-no-repeat"
          style={{ backgroundImage: 'url(/hero-new-bg.png)' }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-900/60 sm:bg-transparent sm:bg-gradient-to-r sm:from-slate-900/95 sm:via-slate-900/60 sm:to-transparent" />

        <div className="relative container mx-auto max-w-5xl text-left">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-blue-200 font-medium mb-6 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            🇮🇳 India&apos;s 1st Job Portal for Daily Wage Workers
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg max-w-3xl">
            India&apos;s 1st Job Portal for
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent drop-shadow-sm">
              Daily Wage Workers
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-blue-100/90 mb-10 max-w-2xl leading-relaxed">
            Connect with 2.5 Lakh+ verified skilled workers, craftsmen &amp; contractors across India.
            Post a job in minutes. Hire today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link href="/marketplace">
              <Button size="lg" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-6 text-lg gap-2 shadow-xl shadow-emerald-500/30 rounded-full transition-transform hover:scale-105">
                Find Jobs <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register?role=CONTRACTOR">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-6 text-lg gap-2 shadow-xl shadow-blue-500/30 rounded-full transition-transform hover:scale-105">
                Hire Workers <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/platform/projects">
              <Button size="lg" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-6 text-lg gap-2 shadow-xl shadow-orange-500/30 rounded-full transition-transform hover:scale-105">
                Find Projects <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-100/70 font-medium max-w-2xl">
            {['Free to register', 'No hidden charges', 'Instant OTP login', '100% verified workers'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-slate-900 py-12 px-4 border-t border-slate-800">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center">
                  <Icon className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-white">{s.value}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Company Trust Section ── */}
      <section className="py-14 bg-white border-b border-gray-100 overflow-hidden">
        <div className="container mx-auto max-w-5xl px-4 text-center mb-8">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Trusted by India&apos;s Leading Construction Companies</p>
        </div>
        <div className="relative flex w-full overflow-hidden group">
          <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
            {[...companyLogos, ...companyLogos].map((name, idx) => (
              <div key={`${name}-${idx}`} className="mx-4 shrink-0 flex items-center justify-center px-8 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-gray-800 text-sm whitespace-nowrap">{name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dynamic Banners — full width, no container ── */}
      <DynamicBanners />

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">
              Start in 5 Simple Steps
            </h2>
            <p className="text-gray-500 text-lg">From registration to payment — everything on one platform</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {howItWorks.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 hover:-translate-y-1 transition-all duration-300">
                  {i < howItWorks.length - 1 && (
                    <ChevronRight className="hidden lg:block absolute -right-2.5 top-8 h-5 w-5 text-gray-300 z-10 bg-white rounded-full" />
                  )}
                  <div className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center mb-4 shadow-md`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest">STEP {item.step}</span>
                  <h3 className="font-bold text-gray-900 mt-1 mb-1.5 text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Skill Categories ── */}
      <section id="skills" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">All Skill Types</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">
              Find Workers by Skill
            </h2>
            <p className="text-gray-500 text-lg">From construction to carpentry — workers for every need</p>
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            {skillCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.name} href={`/platform/workers?skill=${cat.name.toLowerCase()}`}>
                  <div className={`w-32 rounded-2xl border border-transparent p-5 text-center shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-300 cursor-pointer ${cat.bg} hover:border-gray-200`}>
                    <div className={`w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center bg-white shadow-sm ${cat.text}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className={`font-bold text-sm ${cat.text}`}>{cat.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{cat.count}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link href="/platform/workers">
              <Button variant="outline" className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 gap-2">
                View All Skills <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Browse Projects CTA ── */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-blue-900/20">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #60a5fa 0%, transparent 50%), radial-gradient(circle at 80% 20%, #a78bfa 0%, transparent 50%)' }} />
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 rounded-full px-4 py-1.5 text-sm text-emerald-300 font-bold mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Opportunities Across India
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-white mb-3 leading-tight">
                  Browse Available<br />Projects &amp; Jobs
                </h2>
                <p className="text-blue-200/80 max-w-lg text-base leading-relaxed">
                  Hundreds of real jobs posted by verified contractors — searchable by skill, city, and job type.
                </p>
              </div>
              <div className="shrink-0 flex flex-col gap-3 min-w-[240px]">
                <Link href="/platform/projects">
                  <Button size="lg" className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold gap-2 px-8 py-4 rounded-2xl text-base shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 whitespace-nowrap">
                    View All Projects <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register?role=WORKER">
                  <Button size="lg" className="w-full bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white font-bold gap-2 px-8 py-4 rounded-2xl text-base whitespace-nowrap transition-all">
                    Register as Worker <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 px-4 bg-slate-900">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-3">
              Built for India&apos;s Workforce
            </h2>
            <p className="text-slate-400 text-lg">Everything you need to hire right, every time</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title}
                  className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300 group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-2 text-lg">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials (Company) ── */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Success Stories</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">
              Trusted by Leading Companies
            </h2>
            <p className="text-gray-500">Real results from India&apos;s top construction firms</p>
          </div>
        </div>

        <div className="flex w-full overflow-hidden group relative">
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div key={`${t.company}-${idx}`} className="w-[320px] sm:w-[380px] mx-3 bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col shrink-0">
                <Quote className="h-8 w-8 text-blue-100 mb-3" />
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 flex-grow">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center shrink-0`}>
                    <span className="text-white text-xs font-bold">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.company}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 10% 50%, white 0%, transparent 60%), radial-gradient(circle at 90% 20%, white 0%, transparent 60%)' }} />
        <div className="relative container mx-auto text-center max-w-2xl">
          <Clock className="h-12 w-12 text-blue-300 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join 2.5 Lakh+ workers and 15,000+ contractors already on Digital Labour Chowk
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/register?role=WORKER">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-bold gap-2 shadow-xl py-6 px-8 rounded-full text-lg transition-transform hover:scale-105">
                Register as Worker <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register?role=CONTRACTOR">
              <Button size="lg" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 border-2 border-orange-400 text-white font-bold gap-2 shadow-xl py-6 px-8 rounded-full text-lg transition-transform hover:scale-105">
                Hire Workers <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-blue-200/60 text-sm">Free to join · No credit card required</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-gray-400 py-14 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DL</span>
                </div>
                <span className="font-bold text-white">Digital Labour Chowk</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                India&apos;s most trusted labour marketplace — connecting skilled workers with opportunities nationwide.
              </p>
            </div>
            {[
              { title: 'For Workers', links: [{ label: 'Register as Worker', href: '/register?role=WORKER' }, { label: 'Browse Jobs', href: '/marketplace' }, { label: 'Workers Platform', href: '/platform/workers' }] },
              { title: 'For Employers', links: [{ label: 'Post a Job', href: '/register?role=CONTRACTOR' }, { label: 'Browse Workers', href: '/workers' }, { label: 'Business Solutions', href: '/business' }] },
              { title: 'Company', links: [{ label: 'About Us', href: '/about' }, { label: 'Active Projects', href: '/platform/projects' }, { label: 'Admin Portal', href: '/login/admin' }] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-semibold text-white mb-3 text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm hover:text-white transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
            <p>© 2026 Digital Labour Chowk. All rights reserved.</p>
            <p className="text-gray-600">Made with ❤️ in India 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
