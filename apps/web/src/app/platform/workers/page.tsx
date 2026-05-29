import Link from 'next/link';
import {
  ArrowRight, Shield, Zap, IndianRupee, CheckCircle2,
  Users, Star, Building2, Wrench, Hammer, Paintbrush,
  Car, HardHat, Phone, MapPin, Clock, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavActions from '@/components/home/NavActions';

const benefits = [
  {
    icon: Phone,
    title: 'Free Registration',
    desc: 'Register completely free using just your phone number. No documents needed to start browsing jobs.',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Shield,
    title: 'Verified Employers Only',
    desc: 'All contractors and companies are verified. Never worry about fraud or fake job offers.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: IndianRupee,
    title: 'Daily Wages',
    desc: 'Know exactly what you\'ll earn before you accept a job. Daily and weekly wage structures are always transparent.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: Users,
    title: 'KYC Support',
    desc: 'Our team helps you complete your Aadhaar-based KYC verification to unlock more job opportunities.',
    gradient: 'from-purple-500 to-violet-600',
  },
  {
    icon: Clock,
    title: 'Attendance App',
    desc: 'Digital attendance tracking means your working hours are always recorded and you\'re always paid correctly.',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: Lock,
    title: 'Payment Protection',
    desc: 'Payments are held in escrow and released after job completion. Your earnings are always protected.',
    gradient: 'from-teal-500 to-cyan-600',
  },
];

const skillCategories = [
  { name: 'Construction', count: '45,000+ workers', icon: Building2, bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', jobs: '2,400+ jobs' },
  { name: 'Plumbing', count: '12,000+ workers', icon: Wrench, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', jobs: '800+ jobs' },
  { name: 'Electrical', count: '18,000+ workers', icon: Zap, bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', jobs: '1,200+ jobs' },
  { name: 'Carpentry', count: '9,000+ workers', icon: Hammer, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', jobs: '600+ jobs' },
  { name: 'Painting', count: '15,000+ workers', icon: Paintbrush, bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', jobs: '900+ jobs' },
  { name: 'Welding', count: '8,000+ workers', icon: Shield, bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', jobs: '500+ jobs' },
  { name: 'Masonry', count: '30,000+ workers', icon: HardHat, bg: 'bg-stone-50', border: 'border-stone-200', text: 'text-stone-700', jobs: '1,800+ jobs' },
  { name: 'Driving', count: '22,000+ workers', icon: Car, bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', jobs: '1,400+ jobs' },
];

const steps = [
  {
    step: '01',
    title: 'Register for Free',
    desc: 'Sign up with your phone number and get your profile created in under 2 minutes.',
    icon: Phone,
    color: 'bg-emerald-600',
  },
  {
    step: '02',
    title: 'Complete Your Profile',
    desc: 'Add your skills, experience, photos of your past work, and get KYC verified.',
    icon: Users,
    color: 'bg-blue-600',
  },
  {
    step: '03',
    title: 'Apply to Jobs',
    desc: 'Browse jobs near your location and apply with a single tap. Get notified instantly.',
    icon: MapPin,
    color: 'bg-purple-600',
  },
  {
    step: '04',
    title: 'Work & Get Paid',
    desc: 'Complete the work, track your attendance, and receive your wages securely.',
    icon: IndianRupee,
    color: 'bg-orange-600',
  },
];

const testimonials = [
  {
    name: 'Ramesh Yadav',
    skill: 'Electrician',
    city: 'Delhi',
    text: 'Got 8 jobs in my first month. The OTP login is so simple and I always know exactly what I\'ll be paid.',
    rating: 5,
    avatar: 'RY',
    earnings: '₹28,000/month',
  },
  {
    name: 'Suresh Kumar',
    skill: 'Mason',
    city: 'Mumbai',
    text: 'Before this app I used to wait at the labour chowk for hours. Now jobs come to me on my phone!',
    rating: 5,
    avatar: 'SK',
    earnings: '₹22,000/month',
  },
  {
    name: 'Manoj Patel',
    skill: 'Carpenter',
    city: 'Bangalore',
    text: 'The verification helped me get premium clients who pay on time. My income has gone up by 40%.',
    rating: 5,
    avatar: 'MP',
    earnings: '₹32,000/month',
  },
];

export default function WorkersPlatformPage() {
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
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/business', label: 'Business' },
              { href: '/platform/workers', label: 'Workers' },
              { href: '/platform/projects', label: 'Projects' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
                {label}
              </Link>
            ))}
          </div>
          <NavActions />
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 50%), radial-gradient(circle at 20% 80%, #6ee7b7 0%, transparent 50%)' }} />
        <div className="relative container mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-emerald-100 font-medium mb-6 backdrop-blur-md">
              <Users className="h-4 w-4" /> For Skilled Workers & Tradespeople
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Find Work Near You,
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Get Paid on Time
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-emerald-100/80 mb-10 max-w-2xl leading-relaxed">
              Join 2.5 Lakh+ verified workers already earning through Digital Labour Chowk. Find daily wage jobs in construction, plumbing, electrical, carpentry and more — near your location.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register?role=WORKER">
                <Button size="lg" className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-emerald-50 font-bold px-8 py-5 rounded-full gap-2 shadow-xl transition-transform hover:scale-105">
                  Register as Worker <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" className="w-full sm:w-auto bg-emerald-500/30 hover:bg-emerald-500/50 border border-white/30 text-white font-bold px-8 py-5 rounded-full gap-2 backdrop-blur-md">
                  Browse Jobs <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-10">
              {['Free to register', 'No middlemen', 'Verified employers', 'Instant OTP login'].map(t => (
                <span key={t} className="flex items-center gap-2 text-emerald-100 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-yellow-300 shrink-0" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-10 bg-slate-900">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: '2.5 Lakh+', label: 'Registered Workers' },
              { val: '₹850 Cr+', label: 'Wages Disbursed' },
              { val: '99%', label: 'On-time Payments' },
              { val: '4.8★', label: 'Worker Rating' },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">{val}</p>
                <p className="text-sm text-slate-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Why Join Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">
              Built for Workers Like You
            </h2>
            <p className="text-gray-500 text-lg">Everything you need to find better work and earn more</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${b.gradient} flex items-center justify-center mb-4 shadow-sm`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Skill Categories ── */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">All Skills</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">
              Find Jobs by Your Skill
            </h2>
            <p className="text-gray-500 text-lg">Thousands of job opportunities across all skilled trades</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {skillCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.name} href={`/marketplace?skill=${cat.name.toLowerCase()}`}>
                  <div className={`rounded-2xl border-2 p-5 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer ${cat.bg} ${cat.border}`}>
                    <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center bg-white shadow-sm ${cat.text}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className={`font-bold text-sm ${cat.text} mb-1`}>{cat.name}</h3>
                    <p className="text-xs text-gray-600 font-medium">{cat.jobs}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{cat.count}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 px-4 bg-emerald-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Get Started</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">Start Working in 4 Steps</h2>
            <p className="text-gray-500 text-lg">From registration to your first paycheck</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:-translate-y-1 transition-all duration-200">
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-10 w-6 h-0.5 bg-gray-200 z-10" />
                  )}
                  <div className={`w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center mb-4 shadow-md`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 tracking-widest">STEP {step.step}</span>
                  <h3 className="font-bold text-gray-900 mt-1 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Worker Stories</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">Workers Love Digital Labour Chowk</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.skill} · {t.city}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-bold text-emerald-600">{t.earnings}</p>
                    <p className="text-xs text-gray-400">avg earnings</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%)' }} />
        <div className="relative container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Register as Worker — It&apos;s Free!
          </h2>
          <p className="text-emerald-100 mb-8 text-lg">
            Join 2.5 Lakh+ workers who&apos;ve found better opportunities on Digital Labour Chowk
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=WORKER">
              <Button size="lg" className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-emerald-50 font-bold gap-2 shadow-xl py-5 px-8 rounded-full text-lg transition-transform hover:scale-105">
                Register Now — Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button size="lg" className="w-full sm:w-auto bg-emerald-500/40 hover:bg-emerald-500/60 border-2 border-white/30 text-white font-bold gap-2 shadow-xl py-5 px-8 rounded-full text-lg transition-transform hover:scale-105">
                Browse Jobs <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-emerald-200/60 text-sm">Free forever · No hidden charges · Instant OTP login</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-gray-400 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">DL</span>
              </div>
              <span className="font-bold text-white">Digital Labour Chowk</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              {[{ href: '/', label: 'Home' }, { href: '/about', label: 'About' }, { href: '/business', label: 'Business' }, { href: '/platform/projects', label: 'Projects' }].map(l => (
                <Link key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
            <p>© 2026 Digital Labour Chowk. All rights reserved.</p>
            <p className="text-gray-600">Made with ❤️ in India 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
