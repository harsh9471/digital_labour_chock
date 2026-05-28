import type { Metadata } from 'next';
import Link from 'next/link';

import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Join Digital Labour Chowk and connect with India\'s largest labour network',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between gradient-brand p-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold">DL</span>
          </div>
          <span className="text-white font-display font-bold text-xl">Digital Labour Chowk</span>
        </Link>

        <div className="text-white">
          <h1 className="text-4xl font-display font-bold mb-4">
            Start Your Journey<br />Today
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Join 2 lakh+ workers and 50,000+ contractors already on our platform.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Workers', value: '2L+' },
              { label: 'Contractors', value: '50K+' },
              { label: 'Jobs Done', value: '5L+' },
              { label: 'Cities', value: '100+' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-blue-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-200 text-sm">
          Free to register. No hidden charges.
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="flex items-center justify-center gap-2 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
              <span className="text-white font-bold text-sm">DL</span>
            </div>
            <span className="font-display font-bold text-gray-900 text-xl">Digital Labour Chowk</span>
          </div>

          <div className="auth-card">
            <div className="mb-6">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-1">Create Account</h2>
              <p className="text-gray-500 text-sm">Join India&apos;s largest labour marketplace</p>
            </div>

            <RegisterForm />
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By registering, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
