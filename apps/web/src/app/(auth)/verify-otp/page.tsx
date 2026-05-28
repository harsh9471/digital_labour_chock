import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { OtpForm } from '@/components/auth/otp-form';

export const metadata: Metadata = {
  title: 'Verify OTP',
  description: 'Verify your phone number to login',
};

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-bold">DL</span>
            </div>
            <span className="font-display font-bold text-gray-900 text-xl">Digital Labour Chowk</span>
          </Link>
        </div>

        <div className="auth-card">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Phone Verification</h2>
            <p className="text-gray-500 text-sm">Enter your registered mobile number to receive an OTP</p>
          </div>

          <Suspense fallback={
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-md animate-pulse" />
              ))}
            </div>
          }>
            <OtpForm />
          </Suspense>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700 font-medium">
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
