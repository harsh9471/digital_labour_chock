import Link from 'next/link';
import {
  ArrowRight, Shield, Zap, Clock, TrendingUp, CheckCircle2,
  Users, BarChart3, FileText, Building2, Star, IndianRupee
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavActions from '@/components/home/NavActions';

const benefits = [
  {
    icon: Shield,
    title: 'Verified Workers Only',
    desc: 'Every worker is Aadhaar-verified, skill-tested, and background checked before appearing in your search results.',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Zap,
    title: 'Fast Hiring',
    desc: 'Post a job and start receiving applications within minutes. Hire the right worker the same day.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Clock,
    title: 'Attendance Tracking',
    desc: 'Digital attendance management with geo-tagged check-ins and automated timesheets.',
    gradient: 'from-orange-500 to-amber-600',
  },
  {
    icon: IndianRupee,
    title: 'Payroll Management',
    desc: 'Automated daily/weekly wage calculations, payment disbursement, and digital salary slips.',
    gradient: 'from-purple-500 to-violet-600',
  },
  {
    icon: FileText,
    title: 'Compliance Ready',
    desc: 'Stay compliant with labour laws. Automated PF, ESI tracking and government filing support.',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    desc: 'Real-time dashboards for project costs, worker productivity, and site performance metrics.',
    gradient: 'from-teal-500 to-cyan-600',
  },
];

const steps = [
  {
    step: '01',
    title: 'Create Your Account',
    desc: 'Register as a contractor or company admin in under 2 minutes with your business details.',
    icon: Building2,
    color: 'bg-blue-600',
  },
  {
    step: '02',
    title: 'Post Your Requirements',
    desc: 'Describe the skills needed, work location, duration, and your wage offer.',
    icon: FileText,
    color: 'bg-purple-600',
  },
  {
    step: '03',
    title: 'Review & Hire',
    desc: 'Browse verified worker profiles, check ratings, and confirm hires directly on the platform.',
    icon: Users,
    color: 'bg-emerald-600',
  },
  {
    step: '04',
    title: 'Manage & Pay',
    desc: 'Track attendance, manage payroll, and release payments securely — all from one dashboard.',
    icon: TrendingUp,
    color: 'bg-orange-600',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    desc: 'Perfect for individual contractors starting out',
    features: [
      'Post up to 3 jobs/month',
      'Access to 500+ worker profiles',
      'Basic worker search & filters',
      'WhatsApp support',
      'Mobile app access',
    ],
    cta: 'Start Free',
    ctaHref: '/register?role=CONTRACTOR',
    highlight: false,
    gradient: 'from-gray-50 to-gray-100',
    border: 'border-gray-200',
  },
  {
    name: 'Professional',
    price: '₹2,999',
    period: 'per month',
    desc: 'For growing contractors with regular hiring needs',
    features: [
      'Unlimited job postings',
      'Full access to 2.5L+ workers',
      'Priority worker matching',
      'Digital attendance & payroll',
      'Compliance support',
      'Priority phone support',
      'Analytics dashboard',
    ],
    cta: 'Start Professional',
    ctaHref: '/register?role=CONTRACTOR&plan=professional',
    highlight: true,
    gradient: 'from-blue-600 to-indigo-700',
    border: 'border-blue-600',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    desc: 'For large companies managing 100+ workers',
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'Custom integrations & API',
      'Multi-site project management',
      'Custom analytics & reports',
      'SLA-backed 24/7 support',
      'On-site training & onboarding',
    ],
    cta: 'Contact Sales',
    ctaHref: '/contact',
    highlight: false,
    gradient: 'from-slate-800 to-slate-900',
    border: 'border-slate-700',
  },
];

const companies = [
  { name: 'Sobha Limited', workers: '200+', time: '2 weeks' },
  { name: 'L&T Construction', workers: '500+', time: '1 month' },
  { name: 'Quess Corp', workers: '1,000+', time: 'ongoing' },
];

export default function BusinessPage() {
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
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 50%), radial-gradient(circle at 20% 80%, #60a5fa 0%, transparent 50%)' }} />
        <div className="relative container mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-blue-200 font-medium mb-6 backdrop-blur-md">
              <Building2 className="h-4 w-4" /> For Contractors & Companies
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Hire the Right Worker,
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Every Time
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100/80 mb-10 max-w-2xl leading-relaxed">
              Access India&apos;s largest pool of 2.5 Lakh+ verified skilled workers. Post jobs, manage attendance, handle payroll — all in one platform built for the construction industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register?role=CONTRACTOR">
                <Button size="lg" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-5 rounded-full gap-2 shadow-xl shadow-orange-500/30 transition-transform hover:scale-105">
                  Start Hiring Today <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register?role=COMPANY_ADMIN">
                <Button size="lg" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-5 rounded-full gap-2 backdrop-blur-md">
                  Enterprise Solutions <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-10">
              {['No placement fees', 'Aadhaar-verified workers', 'Digital contracts', 'Instant hiring'].map(t => (
                <span key={t} className="flex items-center gap-2 text-blue-200 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Companies Already Hiring on DLC</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {companies.map((c) => (
              <div key={c.name} className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Hired <span className="font-semibold text-emerald-600">{c.workers} workers</span> in {c.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Platform Benefits</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">
              Everything You Need to Hire Right
            </h2>
            <p className="text-gray-500 text-lg">Built specifically for the construction and skilled trades industry</p>
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

      {/* ── How It Works ── */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">How It Works for Businesses</h2>
            <p className="text-gray-500 text-lg">Start hiring verified workers in 4 simple steps</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:-translate-y-1 transition-all duration-200">
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-10 w-6 h-0.5 bg-gray-300 z-10" />
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

      {/* ── Pricing ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-500 text-lg">No hidden fees. Start free, scale as you grow.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`rounded-2xl border-2 overflow-hidden ${plan.border} ${plan.highlight ? 'shadow-2xl shadow-blue-500/20 scale-105' : 'shadow-sm'} transition-all duration-200`}>
                <div className={`p-6 bg-gradient-to-br ${plan.gradient}`}>
                  {plan.highlight && (
                    <div className="inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs text-white font-semibold mb-3">
                      <Star className="h-3 w-3 fill-white" /> Most Popular
                    </div>
                  )}
                  <h3 className={`text-lg font-bold ${plan.highlight ? 'text-white' : plan.name === 'Enterprise' ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                  <div className={`mt-2 mb-1 ${plan.highlight ? 'text-white' : plan.name === 'Enterprise' ? 'text-white' : 'text-gray-900'}`}>
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className={`text-sm ml-1 ${plan.highlight ? 'text-blue-200' : plan.name === 'Enterprise' ? 'text-slate-400' : 'text-gray-500'}`}>/{plan.period}</span>
                  </div>
                  <p className={`text-sm ${plan.highlight ? 'text-blue-200' : plan.name === 'Enterprise' ? 'text-slate-400' : 'text-gray-500'}`}>{plan.desc}</p>
                </div>
                <div className="p-6 bg-white space-y-3">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                  <div className="pt-4">
                    <Link href={plan.ctaHref}>
                      <Button className={`w-full rounded-xl font-bold py-5 ${plan.highlight ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'}`}>
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-500 to-amber-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 50%)' }} />
        <div className="relative container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Hiring Today
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            Join 15,000+ contractors who&apos;ve found quality workers on Digital Labour Chowk
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=CONTRACTOR">
              <Button size="lg" className="w-full sm:w-auto bg-white text-orange-600 hover:bg-orange-50 font-bold gap-2 shadow-xl py-5 px-8 rounded-full text-lg transition-transform hover:scale-105">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 border-2 border-orange-400 text-white font-bold gap-2 shadow-xl py-5 px-8 rounded-full text-lg transition-transform hover:scale-105">
                Learn More <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-orange-200/70 text-sm">No credit card required · Setup in 2 minutes</p>
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
              {[{ href: '/', label: 'Home' }, { href: '/about', label: 'About' }, { href: '/platform/workers', label: 'Workers' }, { href: '/platform/projects', label: 'Projects' }].map(l => (
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
