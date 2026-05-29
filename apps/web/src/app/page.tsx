import Link from 'next/link';
import {
  ArrowRight, CheckCircle2, Star, Users, Briefcase,
  MapPin, Shield, Zap, Phone, IndianRupee, Clock,
  ChevronRight, TrendingUp, HardHat, Wrench, Hammer,
  Paintbrush, Car, ChefHat, Building2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import NavActions from '@/components/home/NavActions';

const stats = [
  { label: 'Registered Workers', value: '2L+', icon: Users, color: 'text-blue-200' },
  { label: 'Jobs Completed', value: '50K+', icon: Briefcase, color: 'text-blue-200' },
  { label: 'Cities Covered', value: '100+', icon: MapPin, color: 'text-blue-200' },
  { label: 'Average Rating', value: '4.8★', icon: Star, color: 'text-blue-200' },
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
  { name: 'Construction', count: '45,000+', icon: Building2, bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  { name: 'Plumbing', count: '12,000+', icon: Wrench, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  { name: 'Electrical', count: '18,000+', icon: Zap, bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
  { name: 'Carpentry', count: '9,000+', icon: Hammer, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
  { name: 'Painting', count: '15,000+', icon: Paintbrush, bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  { name: 'Driving', count: '22,000+', icon: Car, bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
  { name: 'Masonry', count: '30,000+', icon: HardHat, bg: 'bg-stone-50', border: 'border-stone-200', text: 'text-stone-700' },
  { name: 'Welding', count: '8,000+', icon: Shield, bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' },
  { name: 'Cooking', count: '11,000+', icon: ChefHat, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
];

const howItWorks = [
  { step: '01', title: 'Post a Job', desc: 'Describe the work, set the wage, and specify location in minutes.', icon: Briefcase, color: 'bg-blue-600' },
  { step: '02', title: 'Browse Workers', desc: 'See verified worker profiles, skills, ratings and past work.', icon: Users, color: 'bg-purple-600' },
  { step: '03', title: 'Hire & Track', desc: 'Send offer, confirm hire, and track work progress in real-time.', icon: CheckCircle2, color: 'bg-emerald-600' },
  { step: '04', title: 'Pay Fairly', desc: 'Release payment on job completion — safe and transparent.', icon: IndianRupee, color: 'bg-amber-600' },
];

const testimonials = [
  {
    name: 'Suresh Patil', role: 'Contractor, Mumbai',
    text: 'Found 3 skilled electricians within 2 hours. The verification process gives me confidence in every hire.',
    rating: 5, avatar: 'SP',
  },
  {
    name: 'Ramesh Yadav', role: 'Electrician, Delhi',
    text: 'Got 8 jobs in my first month. The OTP login is so simple and I always know exactly what I\'ll be paid.',
    rating: 5, avatar: 'RY',
  },
  {
    name: 'Anita Desai', role: 'Site Contractor, Pune',
    text: 'Managing 40+ workers across 3 sites is now effortless. The dashboard is clean and everything is in one place.',
    rating: 5, avatar: 'AD',
  },
  {
    name: 'Priya Sharma', role: 'Interior Designer, Bangalore',
    text: 'I hire painters and carpenters regularly through this app. The quality of verified workers is outstanding.',
    rating: 5, avatar: 'PS',
  },
  {
    name: 'Harsh Patel', role: 'Contractor, Vadodara',
    text: 'I hire different kind of skilled person for my day to day life work on construction site. Digital Labour Chwok help me to find right person for right job.',
    rating: 5, avatar: 'HP',
  }
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
            {['#how-it-works', '#skills', '#features'].map((href, i) => (
              <Link key={href} href={href}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
                {['How It Works', 'Browse Skills', 'Features'][i]}
              </Link>
            ))}
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
        {/* Dark overlay for readability: dark on left, transparent on right */}
        <div className="absolute inset-0 bg-slate-900/60 sm:bg-transparent sm:bg-gradient-to-r sm:from-slate-900/95 sm:via-slate-900/60 sm:to-transparent" />

        <div className="relative container mx-auto max-w-5xl text-left">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-blue-200 font-medium mb-6 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            🇮🇳 India&apos;s #1 Labour Marketplace
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg max-w-2xl">
            Hire Skilled Workers
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
              Instantly Across India
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-blue-100/90 mb-10 max-w-2xl leading-relaxed">
            Connect with verified daily-wage workers, craftsmen &amp; contractors.
            Post a job in minutes. Hire today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link href="/register?role=CONTRACTOR">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-6 text-lg gap-2 shadow-xl shadow-blue-500/30 rounded-full transition-transform hover:scale-105">
                Hire Workers <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register?role=WORKER">
              <Button size="lg" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border-2 border-white/40 text-white font-bold px-8 py-6 text-lg gap-2 backdrop-blur-md rounded-full transition-transform hover:scale-105">
                Find Work Near Me
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-100/70 font-medium max-w-2xl">
            {['Free to register', 'No hidden charges', 'Instant OTP login', '100% verified workers'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-blue-600 py-10 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center">
                  <Icon className={`h-6 w-6 ${s.color} mx-auto mb-2`} />
                  <p className="text-3xl font-bold text-white">{s.value}</p>
                  <p className="text-sm text-blue-200 mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">
              Start Hiring in 4 Steps
            </h2>
            <p className="text-gray-500 text-lg">From posting a job to paying the worker — all in one platform</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 hover:-translate-y-1 transition-all duration-300">
                  {i < howItWorks.length - 1 && (
                    <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 z-10" />
                  )}
                  <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-4 shadow-md`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 tracking-widest">STEP {item.step}</span>
                  <h3 className="font-bold text-gray-900 mt-1 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
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
            <p className="text-gray-500 text-lg">From construction to cooking — workers for every need</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {skillCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.name} href={`/workers?skill=${cat.name.toLowerCase()}`}>
                  <div className={`w-32 rounded-2xl border p-5 text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer ${cat.bg} border-transparent hover:${cat.border}`}>
                    <div className={`w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center bg-white shadow-sm ${cat.text}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className={`font-bold text-sm ${cat.text}`}>{cat.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{cat.count}</p>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="text-center mt-8">
            <Link href="/workers">
              <Button variant="outline" className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 gap-2">
                View All Skills <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
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

      {/* ── Testimonials ── */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Real Stories</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">
              Trusted by Workers &amp; Contractors
            </h2>
          </div>
        </div>

        {/* Infinite Looping Carousel */}
        <div className="flex w-full overflow-hidden group mask-image-fade relative">
          {/* Edge gradients to blend with white background */}
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div key={`${t.name}-${idx}`} className="w-[300px] sm:w-[350px] mx-3 bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col shrink-0">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  {t.rating < 5 && <Star className="h-4 w-4 text-gray-300" />}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6 italic flex-grow">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-blue-600 font-medium mt-0.5">{t.role}</p>
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
            Join 2 lakh+ workers and contractors already on Digital Labour Chowk
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/register?role=WORKER">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-bold gap-2 shadow-xl py-6 px-8 rounded-full text-lg transition-transform hover:scale-105">
                Register as Worker <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register?role=CONTRACTOR">
              <Button size="lg" className="w-full sm:w-auto bg-blue-500 hover:bg-blue-400 border-2 border-blue-400 text-white font-bold gap-2 shadow-xl py-6 px-8 rounded-full text-lg transition-transform hover:scale-105">
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
              { title: 'For Workers', links: [{ label: 'Register as Worker', href: '/register?role=WORKER' }, { label: 'Browse Jobs', href: '/marketplace' }, { label: 'Worker Login', href: '/login/worker' }] },
              { title: 'For Employers', links: [{ label: 'Post a Job', href: '/register?role=CONTRACTOR' }, { label: 'Browse Workers', href: '/workers' }, { label: 'Contractor Login', href: '/login/contractor' }] },
              { title: 'Platform', links: [{ label: 'Admin Portal', href: '/login/admin' }, { label: 'About Us', href: '/about' }, { label: 'Contact', href: '/contact' }] },
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
