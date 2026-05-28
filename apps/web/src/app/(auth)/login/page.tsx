import type { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Digital Labour Chowk account',
};

const ROLE_PORTALS = [
  {
    role: 'Worker',
    description: 'Find daily work, track earnings, manage your profile',
    href: '/login/worker',
    icon: Briefcase,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50',
    text: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    role: 'Contractor',
    description: 'Post jobs, hire workers, manage your workforce',
    href: '/login/contractor',
    icon: Building2,
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-50',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    role: 'Admin',
    description: 'Platform management, KYC verification, analytics',
    href: '/login/admin',
    icon: ShieldCheck,
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50 border-purple-200 hover:border-purple-400 hover:bg-purple-50',
    text: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700',
  },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold">DL</span>
          </div>
          <span className="text-white font-bold text-xl">Digital Labour Chowk</span>
        </Link>

        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">
            India&apos;s Most Trusted<br />Labour Marketplace
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Connect with 2 lakh+ verified workers and contractors across India.
          </p>
          <div className="space-y-3 mb-10">
            {[
              '✓ Verified worker profiles with ID proof',
              '✓ Instant OTP-based secure login',
              '✓ Available in 100+ cities across India',
              '✓ Safe & transparent payments',
            ].map(item => (
              <p key={item} className="text-blue-100 text-sm">{item}</p>
            ))}
          </div>

          {/* Role portal cards on left panel */}
          <div className="space-y-3">
            {ROLE_PORTALS.map(portal => {
              const Icon = portal.icon;
              return (
                <Link key={portal.role} href={portal.href} className="flex items-center gap-4 bg-white/10 hover:bg-white/20 rounded-2xl p-4 transition-all group">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${portal.color} flex items-center justify-center shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">{portal.role} Portal</p>
                    <p className="text-blue-200 text-xs truncate">{portal.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-blue-200 group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {['R','S','M','A'].map(letter => (
              <div key={letter} className="w-9 h-9 rounded-full bg-white/30 border-2 border-white/50 flex items-center justify-center text-xs font-bold text-white">
                {letter}
              </div>
            ))}
          </div>
          <p className="text-blue-100 text-sm">
            <span className="font-bold text-white">2,00,000+</span> workers trust us
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">DL</span>
            </div>
            <span className="font-bold text-gray-900 text-xl">Digital Labour Chowk</span>
          </div>

          {/* Role-specific portals for mobile */}
          <div className="lg:hidden mb-6">
            <p className="text-sm font-medium text-gray-600 mb-3 text-center">Choose your portal</p>
            <div className="grid grid-cols-3 gap-3">
              {ROLE_PORTALS.map(portal => {
                const Icon = portal.icon;
                return (
                  <Link key={portal.role} href={portal.href}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${portal.bg}`}>
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${portal.color} flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className={`text-xs font-semibold ${portal.text}`}>{portal.role}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
              <p className="text-gray-500 text-sm">Sign in with email/password or mobile OTP</p>
            </div>
            <LoginForm />
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
