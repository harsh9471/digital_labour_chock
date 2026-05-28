'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth.store';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormValues = z.infer<typeof schema>;

const DEV_ADMINS = [
  { label: 'Super Admin', email: 'superadmin@digitallabourchowk.com', password: 'Password@123' },
  { label: 'Admin',       email: 'admin@digitallabourchowk.com',      password: 'Password@123' },
];

export default function AdminLoginPage() {
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
      if (!['SUPER_ADMIN', 'COMPANY_ADMIN'].includes(response.user.role)) {
        toast({ title: 'Access Denied', description: 'Admin credentials required', variant: 'destructive' });
        return;
      }
      toast({ title: `Welcome, ${response.user.firstName}!` });
      router.push('/admin');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({ title: 'Login failed', description: axiosError.response?.data?.message || 'Invalid credentials', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding */}
      <div className="hidden lg:flex w-[45%] flex-col bg-gradient-to-br from-purple-700 via-violet-600 to-indigo-700 relative overflow-hidden">
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
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Platform<br />Administration
            </h1>
            <p className="text-purple-100 text-lg mb-8">
              Manage users, verify documents, monitor platform health, and configure settings.
            </p>
            <div className="space-y-3">
              {[
                'Full user management & RBAC',
                'Document verification & KYC',
                'Analytics & reporting dashboard',
                'Payroll oversight & disputes',
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-400 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-purple-100 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-5 text-white">
            <p className="text-sm text-purple-100">
              🔒 This portal is restricted to authorized administrators only. Unauthorized access attempts are logged.
            </p>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-700 to-indigo-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">DL</span>
            </div>
            <span className="font-bold text-gray-900 text-xl">Digital Labour Chowk</span>
          </div>

          <div className="flex items-center gap-2 mb-6 justify-center lg:justify-start">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-sm font-medium">
              <ShieldCheck className="h-4 w-4" /> Admin Portal
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Administrator Sign In</h2>
            <p className="text-gray-500 text-sm mb-6">Restricted access — authorized personnel only</p>

            {/* Dev panel */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
                <button type="button" onClick={() => setShowDevPanel(!showDevPanel)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-amber-800 text-sm font-medium">
                  🛠️ Dev — Admin Quick Login
                  {showDevPanel ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {showDevPanel && (
                  <div className="border-t border-amber-200 p-3 space-y-2">
                    {DEV_ADMINS.map(a => (
                      <div key={a.email} className="flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50 px-3 py-2">
                        <div>
                          <span className="text-xs font-semibold text-purple-800">{a.label}</span>
                          <span className="ml-1 font-mono text-xs text-purple-500">{a.email}</span>
                        </div>
                        <button type="button"
                          onClick={() => { setValue('email', a.email); setValue('password', a.password); setShowDevPanel(false); }}
                          className="text-xs bg-white border border-purple-200 rounded px-2 py-1 text-purple-700 font-semibold hover:bg-purple-50">
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
                <Label>Admin Email</Label>
                <Input type="email" placeholder="admin@digitallabourchowk.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message} {...register('email')} />
              </div>
              <div className="space-y-1.5">
                <Label>Password</Label>
                <Input type={showPass ? 'text' : 'password'} placeholder="Enter admin password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  error={errors.password?.message} {...register('password')} />
              </div>
              <Button type="submit" size="lg" className="w-full bg-purple-700 hover:bg-purple-800 text-white" loading={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In to Admin Panel →'}
              </Button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 mb-3">Sign in as a different role?</p>
            <div className="flex gap-2 justify-center">
              <Link href="/login/worker">
                <button className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600 transition-colors">Worker</button>
              </Link>
              <Link href="/login/contractor">
                <button className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors">Contractor</button>
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
