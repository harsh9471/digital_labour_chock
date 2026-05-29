import Link from 'next/link';
import {
  ArrowRight, Users, Briefcase, Building2, TrendingUp,
  Shield, Zap, Heart, Star, CheckCircle2, MapPin,
  IndianRupee, Phone, Target, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavActions from '@/components/home/NavActions';

const stats = [
  { value: '2.5 Lakh+', label: 'Registered Workers', icon: Users, gradient: 'from-blue-500 to-indigo-600' },
  { value: '15,000+', label: 'Active Contractors', icon: Briefcase, gradient: 'from-emerald-500 to-teal-600' },
  { value: '850+', label: 'Partner Companies', icon: Building2, gradient: 'from-orange-500 to-amber-600' },
  { value: '200+', label: 'Active Projects', icon: TrendingUp, gradient: 'from-purple-500 to-violet-600' },
];

const whyFeatures = [
  {
    icon: Shield,
    title: 'Verified Workforce',
    desc: 'Every worker undergoes Aadhaar-based KYC and skill verification before being listed on the platform.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Zap,
    title: 'Instant Matching',
    desc: 'Our AI-powered matching engine connects the right worker with the right job in minutes, not days.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: IndianRupee,
    title: 'Transparent Payments',
    desc: 'Daily and weekly wage structures with no hidden fees. Workers know exactly what they earn.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: MapPin,
    title: '100+ Cities',
    desc: 'A nationwide network spanning 100+ cities, connecting workers and employers across India.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Phone,
    title: 'Mobile-First Design',
    desc: 'Built for India\'s mobile-first workforce. Works on 2G connections with OTP-based login.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Analytics',
    desc: 'Contractors and companies get live dashboards for attendance, payroll, and project progress.',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Dignity',
    desc: 'Every daily wage worker deserves to be treated with respect, paid fairly, and given opportunities to grow. We build technology that upholds the dignity of blue-collar work.',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: Eye,
    title: 'Transparency',
    desc: 'From job listings to payments — everything is visible, trackable, and fair. No middlemen, no hidden charges, no exploitation.',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Zap,
    title: 'Technology',
    desc: 'We leverage AI, digital KYC, and mobile-first design to solve real problems for India\'s 500 million informal workers.',
    gradient: 'from-amber-500 to-orange-600',
  },
];

const team = [
  { name: 'Harsh Shah', role: 'Co-Founder & CEO', avatar: 'HS', gradient: 'from-blue-600 to-indigo-700' },
  { name: 'Yogesh Suthar', role: 'Co-Founder & CTO', avatar: 'YS', gradient: 'from-emerald-600 to-teal-700' },
  { name: 'Priya Mehta', role: 'Head of Operations', avatar: 'PM', gradient: 'from-orange-500 to-amber-600' },
  { name: 'Rahul Joshi', role: 'Head of Product', avatar: 'RJ', gradient: 'from-purple-600 to-violet-700' },
];

export default function AboutPage() {
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
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, #60a5fa 0%, transparent 50%)' }} />
        <div className="relative container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-blue-200 font-medium mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Our Story
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            India&apos;s 1st Job Platform for
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Blue-Collar Workers
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed mb-10">
            We are revolutionizing how India hires skilled daily wage workers — making it faster, fairer, and more transparent for both workers and employers in the construction industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=WORKER">
              <Button size="lg" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-5 rounded-full gap-2 shadow-xl transition-transform hover:scale-105">
                Join as Worker <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/business">
              <Button size="lg" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-5 rounded-full gap-2 backdrop-blur-md">
                For Businesses <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-1.5 text-sm text-blue-600 font-semibold mb-5">
                <Target className="h-4 w-4" /> Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                Empowering India&apos;s 500 Million Informal Workers
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-lg">
                India has over 500 million informal workers, with millions in the construction sector alone. These skilled craftsmen, masons, electricians, and labourers have historically lacked access to fair wages, consistent work, and formal employment records.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Digital Labour Chowk was founded to change this. We&apos;re building a technology-driven platform that gives every worker a verified digital identity, connects them to quality employers, and ensures they are paid fairly and on time.
              </p>
              <div className="space-y-3">
                {['Fair wages and transparent pay structures', 'Digital identity and KYC verification', 'Consistent employment opportunities', 'Skill development and career growth'].map(item => (
                  <div key={item} className="flex items-center gap-2.5 text-gray-700">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="h-80 md:h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
                <div className="text-center text-white px-8">
                  <Users className="h-16 w-16 mx-auto mb-4 text-blue-200" />
                  <p className="text-2xl font-bold mb-2">500 Million</p>
                  <p className="text-blue-200 text-lg">Informal Workers in India</p>
                  <p className="text-blue-300 text-sm mt-2">Deserve better opportunities</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-xl">
                <div className="text-center text-white">
                  <p className="text-xl font-bold">2026</p>
                  <p className="text-xs text-emerald-200">Founded</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="h-80 md:h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-2xl">
                <div className="text-center text-white px-8">
                  <Building2 className="h-16 w-16 mx-auto mb-4 text-orange-200" />
                  <p className="text-2xl font-bold mb-2">Pan-India</p>
                  <p className="text-orange-100 text-lg">Labour Marketplace</p>
                  <p className="text-orange-200 text-sm mt-2">Connecting every city</p>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl">
                <div className="text-center text-white">
                  <p className="text-xl font-bold">100+</p>
                  <p className="text-xs text-blue-200">Cities</p>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-orange-50 rounded-full px-4 py-1.5 text-sm text-orange-600 font-semibold mb-5">
                <Eye className="h-4 w-4" /> Our Vision
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                A Future Where Every Worker Thrives
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-lg">
                We envision a future where geography is no barrier to opportunity — where a skilled mason from Rajasthan can find work in Mumbai, and a Bangalore contractor can hire the best electrician from Chennai.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                By 2030, we aim to be the single largest employment platform for India&apos;s blue-collar workforce, with 10 million registered workers, AI-driven skill matching, and integrated financial services.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: '10M+', label: 'Workers by 2030' },
                  { val: '500+', label: 'Cities by 2028' },
                  { val: '₹100Cr+', label: 'Wages Disbursed' },
                  { val: '99%', label: 'On-time Payments' },
                ].map(({ val, label }) => (
                  <div key={label} className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
                    <p className="text-2xl font-bold text-gray-900">{val}</p>
                    <p className="text-xs text-gray-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-900 to-blue-950">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Our Impact in Numbers</h2>
            <p className="text-slate-400">Building India&apos;s largest labour marketplace, one worker at a time</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className={`rounded-2xl p-6 text-center bg-gradient-to-br ${s.gradient} shadow-lg`}>
                  <Icon className="h-8 w-8 text-white/70 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-white">{s.value}</p>
                  <p className="text-sm text-white/70 mt-1">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why DLC ── */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Why Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">
              Why Digital Labour Chowk?
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">We&apos;re not just another job board — we&apos;re India&apos;s first end-to-end labour management platform</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${f.color}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">What We Stand For</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${v.gradient} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">Meet the Founders</h2>
            <p className="text-gray-500">Passionate about technology and social impact</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {team.map((member) => (
              <div key={member.name} className="text-center w-48">
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <span className="text-white text-2xl font-bold">{member.avatar}</span>
                </div>
                <p className="font-bold text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{member.role}</p>
                <div className="flex justify-center gap-1 mt-2">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 10% 50%, white 0%, transparent 60%)' }} />
        <div className="relative container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join India&apos;s Largest Labour Marketplace
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Be part of India&apos;s mission to create fair, transparent employment for every skilled worker
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=WORKER">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-bold gap-2 shadow-xl py-5 px-8 rounded-full text-lg transition-transform hover:scale-105">
                Register as Worker <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/business">
              <Button size="lg" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold gap-2 shadow-xl py-5 px-8 rounded-full text-lg transition-transform hover:scale-105">
                Business Solutions <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
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
              {[{ href: '/', label: 'Home' }, { href: '/business', label: 'Business' }, { href: '/platform/workers', label: 'Workers' }, { href: '/platform/projects', label: 'Projects' }].map(l => (
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
