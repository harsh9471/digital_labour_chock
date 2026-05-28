import Link from 'next/link';
import { ArrowRight, CheckCircle2, Star, Users, Briefcase, MapPin, Shield, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NavActions from '@/components/home/NavActions';

const stats = [
  { label: 'Registered Workers', value: '2L+', icon: Users },
  { label: 'Jobs Completed', value: '50K+', icon: Briefcase },
  { label: 'Cities Covered', value: '100+', icon: MapPin },
  { label: 'Average Rating', value: '4.8', icon: Star },
];

const features = [
  { title: 'Verified Workers', description: 'All workers are ID verified and background checked', icon: Shield },
  { title: 'Instant Matching', description: 'Find the right worker in minutes, not days', icon: Zap },
  { title: 'Secure Payments', description: 'Safe and transparent payment processing', icon: CheckCircle2 },
  { title: 'Pan India Network', description: 'Workers available in 100+ cities across India', icon: MapPin },
];

const skillCategories = [
  { name: 'Construction', count: '45,000+', emoji: '🏗️', color: 'bg-orange-50 border-orange-200' },
  { name: 'Plumbing', count: '12,000+', emoji: '🔧', color: 'bg-blue-50 border-blue-200' },
  { name: 'Electrical', count: '18,000+', emoji: '⚡', color: 'bg-yellow-50 border-yellow-200' },
  { name: 'Carpentry', count: '9,000+', emoji: '🪚', color: 'bg-green-50 border-green-200' },
  { name: 'Painting', count: '15,000+', emoji: '🎨', color: 'bg-purple-50 border-purple-200' },
  { name: 'Driving', count: '22,000+', emoji: '🚗', color: 'bg-indigo-50 border-indigo-200' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <span className="text-white font-bold text-sm">DL</span>
            </div>
            <span className="font-display font-bold text-gray-900 text-lg">
              Digital Labour <span className="text-blue-600">Chowk</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 font-medium">Features</Link>
            <Link href="#skills" className="text-sm text-gray-600 hover:text-gray-900 font-medium">Browse Skills</Link>
            <Link href="#about" className="text-sm text-gray-600 hover:text-gray-900 font-medium">About</Link>
          </div>
          <NavActions />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="info" className="mb-4 px-4 py-1 text-sm">
            🇮🇳 India&apos;s #1 Labour Marketplace
          </Badge>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 leading-tight mb-6">
            Find Skilled Workers{' '}
            <span className="text-gradient">Instantly</span>
            <br />Across India
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with verified daily wage workers, skilled craftsmen, and contractors.
            Hire fast, pay fair, build great.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=CONTRACTOR">
              <Button variant="brand" size="xl" className="w-full sm:w-auto shadow-lg shadow-blue-200">
                Hire Workers <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register?role=WORKER">
              <Button variant="outline" size="xl" className="w-full sm:w-auto border-2">
                Find Work Near Me
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            ✓ Free to register &nbsp; ✓ No hidden charges &nbsp; ✓ Instant OTP login
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <Icon className="h-6 w-6 text-blue-200 mx-auto mb-2" />
                  <div className="text-3xl font-display font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-blue-200 mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Skill Categories */}
      <section id="skills" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Browse by <span className="text-gradient">Skill Category</span>
            </h2>
            <p className="text-lg text-gray-600">Find the right worker for every job</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {skillCategories.map((cat) => (
              <Link key={cat.name} href={`/workers?skill=${cat.name.toLowerCase()}`}>
                <div className={`rounded-2xl border-2 p-6 text-center card-hover cursor-pointer ${cat.color}`}>
                  <div className="text-4xl mb-3">{cat.emoji}</div>
                  <h3 className="font-semibold text-gray-900 text-sm">{cat.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{cat.count} workers</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Why Choose <span className="text-gradient">Digital Labour Chowk?</span>
            </h2>
            <p className="text-lg text-gray-600">Everything you need to hire right</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors group">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 group-hover:bg-blue-600 flex items-center justify-center mx-auto mb-4 transition-colors">
                    <Icon className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 gradient-brand">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join 2 lakh+ workers and contractors already on Digital Labour Chowk
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=WORKER">
              <Button size="xl" variant="secondary" className="w-full sm:w-auto font-semibold">
                Register as Worker
              </Button>
            </Link>
            <Link href="/register?role=CONTRACTOR">
              <Button size="xl" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                Hire Workers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DL</span>
                </div>
                <span className="font-bold text-white">Digital Labour Chowk</span>
              </div>
              <p className="text-sm text-gray-500">India&apos;s most trusted labour marketplace connecting workers with opportunities.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">For Workers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register?role=WORKER" className="hover:text-white transition-colors">Register as Worker</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">For Employers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register?role=CONTRACTOR" className="hover:text-white transition-colors">Post a Job</Link></li>
                <li><Link href="/workers" className="hover:text-white transition-colors">Browse Workers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 Digital Labour Chowk. All rights reserved. Made with ❤️ in India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
