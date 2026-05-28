'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, Building2, Users, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth.store';
import { cn as _cn } from '@/lib/utils';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormValues = z.infer<typeof schema>;

const DEV_CONTRACTORS = [
  { label: 'Suresh Patil', email: 'suresh.patil@contractor.com', password: 'Password@123' },
  { label: 'Anita Desai', email: 'anita.desai@contractor.com', password: 'Password@123' },
  { label: 'Mohammed Khan', email: 'mo.khan@contractor.com', password: 'Password@123' },
];

export default function ContractorLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, isLoading } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await login(data);
      if (response.user.role !== 'CONTRACTOR' && response.user.role !== 'COMPANY_ADMIN') {
        toast({ title: 'Wrong Portal', description: 'Use the correct login portal for your role', variant: 'destructive' });
        return;
      }
      toast({ title: `Welcome, ${response.user.firstName}!` });
      router.push('/contractor');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({ title: 'Login failed', description: axiosError.response?.data?.message || 'Invalid credentials', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding */}
      <div className="hidden lg:flex w-[45%] flex-col bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col h-full p-12">
          <Link href="/" className="flex items-center gap-3 mb-auto">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold">DL</span>
            </div>
            <span className="text-white font-bold text-xl">Digital Labour Chowk</span>
          </Link>

          <div className="text-white mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Hire the Right<br />People Fast
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Post jobs, browse verified workers, and manage your workforce from one dashboard.
            </p>
            <div className="space-y-4">
              {[
                { icon: Users, text: '2 lakh+ verified workers ready' },
                { icon: TrendingUp, text: 'Hire in hours, not days' },
                { icon: Building2, text: 'Used by 500+ contractors' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-blue-200" />
                  </div>
                  <span className="text-blue-100">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">S</div>
              <div>
                <p className="font-semibold text-sm">Suresh Patil</p>
                <p className="text-blue-200 text-xs">Contractor • Mumbai</p>
              </div>
            </div>
            <p className="text-sm text-blue-100 italic">
              &quot;Found 5 expert masons in one day. Saved weeks of searching. Highly recommended.&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">DL</span>
            </div>
            <span className="font-bold text-gray-900 text-xl">Digital Labour Chowk</span>
          </div>

          <div className="flex items-center gap-2 mb-6 justify-center lg:justify-start">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium">
              <Building2 className="h-4 w-4" /> Contractor Portal
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign in as Contractor</h2>
            <p className="text-gray-500 text-sm mb-6">Access your contractor dashboard</p>

            {/* Dev panel */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
                <button type="button" onClick={() => setShowDevPanel(!showDevPanel)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-amber-800 text-sm font-medium">
                  🛠️ Dev — Contractor Quick Login
                  {showDevPanel ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {showDevPanel && (
                  <div className="border-t border-amber-200 p-3 space-y-2">
                    {DEV_CONTRACTORS.map(c => (
                      <div key={c.email} className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
                        <div>
                          <span className="text-xs font-semibold text-blue-800">{c.label}</span>
                          <span className="ml-1 font-mono text-xs text-blue-500">{c.email}</span>
                        </div>
                        <button type="button"
                          onClick={() => { setValue('email', c.email); setValue('password', c.password); setShowDevPanel(false); }}
                          className="text-xs bg-white border border-blue-200 rounded px-2 py-1 text-blue-700 font-semibold hover:bg-blue-50">
                          Fill
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <Input type="email" placeholder="you@company.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message} {...register('email')} />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>Password</Label>
                  <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline font-medium">Forgot?</Link>
                </div>
                <Input type={showPass ? 'text' : 'password'} placeholder="Enter password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  error={errors.password?.message} {...register('password')} />
              </div>
              <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white" loading={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In →'}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              New contractor?{' '}
              <Link href="/register?role=CONTRACTOR" className="font-semibold text-blue-600 hover:text-blue-700">Register here</Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 mb-3">Sign in as a different role?</p>
            <div className="flex gap-2 justify-center">
              <Link href="/login/worker">
                <button className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600 transition-colors">Worker</button>
              </Link>
              <Link href="/login/admin">
                <button className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors">Admin</button>
              </Link>
              <Link href="/login">
                <button className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors">General Login</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
