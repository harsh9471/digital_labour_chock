'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth.store';
import { getRoleDashboardPath } from '@/lib/utils';
import { cn } from '@/lib/utils';

// ─── Schemas ─────────────────────────────────────────────────────────────────

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const phoneSchema = z.object({
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Use format: +91XXXXXXXXXX'),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type PhoneFormValues = z.infer<typeof phoneSchema>;

// ─── Dev credentials data ─────────────────────────────────────────────────────

const DEV_CREDS = [
  { label: 'Super Admin', email: 'superadmin@digitallabourchowk.com', password: 'Password@123', role: 'SUPER_ADMIN', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  { label: 'Admin',       email: 'admin@digitallabourchowk.com',      password: 'Password@123', role: 'SUPER_ADMIN', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
];

const DEV_WORKERS = [
  { label: 'Worker 1',     phone: '+919700001001' },
  { label: 'Worker 2',     phone: '+919700001002' },
  { label: 'Contractor 1', phone: '+919800001001' },
];

// ─── Email + Password Tab ─────────────────────────────────────────────────────

function EmailLoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailFormValues) => {
    try {
      const response = await login(data);
      toast({ title: 'Welcome back!', description: `Logged in as ${response.user.firstName}` });
      router.push(getRoleDashboardPath(response.user.role));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({ title: 'Login failed', description: axiosError.response?.data?.message || 'Invalid credentials', variant: 'destructive' });
    }
  };

  const fillCred = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Dev credentials panel */}
      <DevCredentialsPanel onFill={fillCred} />

      <div className="space-y-1.5">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" placeholder="you@example.com" autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />} error={errors.email?.message} {...register('email')} />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            Forgot password?
          </Link>
        </div>
        <Input id="password" type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password" autoComplete="current-password"
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-foreground">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          error={errors.password?.message} {...register('password')} />
      </div>

      <Button type="submit" variant="brand" size="lg" className="w-full" loading={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}

// ─── Phone OTP Tab ────────────────────────────────────────────────────────────

function PhoneLoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { sendOtp, loginWithOtp } = useAuthStore();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
  });

  React.useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleSend = async (data: PhoneFormValues) => {
    setIsSending(true);
    try {
      const res = await sendOtp(data.phone, 'LOGIN');
      setPhone(data.phone);
      setStep('otp');
      setCountdown(60);
      if (res?.devOtp) {
        setDevOtp(res.devOtp);
        setOtp(res.devOtp.split(''));
        toast({ title: '🛠️ Dev Mode', description: `OTP auto-filled: ${res.devOtp}` });
      } else {
        toast({ title: 'OTP Sent!', description: `Code sent to ${data.phone}` });
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({ title: 'Error', description: axiosError.response?.data?.message || 'Failed to send OTP', variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async (code: string) => {
    setIsVerifying(true);
    try {
      const response = await loginWithOtp({ phone, code, purpose: 'LOGIN' });
      toast({ title: `✓ Welcome, ${response.user.firstName}!` });
      router.push(getRoleDashboardPath(response.user.role));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({ title: 'Invalid OTP', description: axiosError.response?.data?.message || 'Please try again', variant: 'destructive' });
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
    if (next.every(d => d) && next.join('').length === 6) handleVerify(next.join(''));
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) inputRefs.current[idx - 1]?.focus();
  };

  if (step === 'otp') {
    return (
      <div className="space-y-5">
        <p className="text-sm text-gray-600 text-center">
          Enter the 6-digit OTP sent to <span className="font-semibold">{phone.slice(0, 7)}****</span>
        </p>

        {/* Dev OTP banner */}
        {devOtp && (
          <div className="flex items-center justify-between rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2.5 text-sm">
            <span className="text-yellow-800">🛠️ <span className="font-medium">Dev OTP:</span></span>
            <span className="font-mono font-bold tracking-widest text-yellow-900 text-base">{devOtp}</span>
            <button type="button" onClick={() => handleVerify(devOtp)}
              className="ml-2 text-xs font-semibold text-yellow-700 underline hover:text-yellow-900">
              Use it
            </button>
          </div>
        )}

        <div className="flex justify-center gap-3">
          {otp.map((digit, idx) => (
            <input key={idx}
              ref={el => { inputRefs.current[idx] = el; }}
              type="text" inputMode="numeric" pattern="\d*" maxLength={1} value={digit}
              onChange={e => handleOtpChange(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(idx, e)}
              disabled={isVerifying}
              className={cn(
                'w-12 h-14 text-center text-xl font-bold border-2 rounded-xl transition-all',
                'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
                digit ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white',
                isVerifying && 'opacity-50',
              )}
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <button type="button" onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setDevOtp(null); }}
            className="text-gray-500 hover:text-gray-700">← Change number</button>
          {countdown > 0
            ? <span className="text-gray-400">Resend in {countdown}s</span>
            : <button type="button" onClick={() => handleSubmit(handleSend)()}
                className="text-blue-600 hover:text-blue-700 font-medium">Resend OTP</button>
          }
        </div>

        <Button variant="brand" size="lg" className="w-full" loading={isVerifying}
          onClick={() => otp.every(d => d) && handleVerify(otp.join(''))}>
          {isVerifying ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleSend)} className="space-y-4">
      <OtpWorkerPanel onFill={(p) => setValue('phone', p)} />

      <div className="space-y-1.5">
        <Label htmlFor="phone-login">Phone Number</Label>
        <Input id="phone-login" type="tel" placeholder="+919876543210"
          leftIcon={<Phone className="h-4 w-4" />} error={errors.phone?.message}
          {...register('phone')} />
      </div>

      <Button type="submit" variant="brand" size="lg" className="w-full" loading={isSending}>
        {isSending ? 'Sending OTP...' : 'Get OTP'}
      </Button>
    </form>
  );
}

// ─── Dev Credentials Panel ────────────────────────────────────────────────────

function DevCredentialsPanel({ onFill }: { onFill: (email: string, password: string) => void }) {
  const [open, setOpen] = useState(false);
  if (process.env.NODE_ENV !== 'development') return null;
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 text-xs overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-amber-800 font-medium hover:bg-amber-100 transition-colors">
        <span>🛠️ Dev — Quick Login (Admin)</span>
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>
      {open && (
        <div className="border-t border-amber-200 p-2 space-y-1.5">
          {DEV_CREDS.map(c => (
            <div key={c.email} className={cn('flex items-center justify-between rounded-md border px-2.5 py-1.5', c.color)}>
              <div>
                <span className="font-semibold">{c.label}</span>
                <span className="ml-2 text-gray-500 font-mono">{c.email}</span>
              </div>
              <button type="button" onClick={() => { onFill(c.email, c.password); setOpen(false); }}
                className="ml-2 rounded bg-white/70 px-2 py-0.5 font-semibold hover:bg-white transition-colors border border-current/20">
                Fill
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OtpWorkerPanel({ onFill }: { onFill: (phone: string) => void }) {
  const [open, setOpen] = useState(false);
  if (process.env.NODE_ENV !== 'development') return null;
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 text-xs overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-amber-800 font-medium hover:bg-amber-100 transition-colors">
        <span>🛠️ Dev — Quick Login (Worker/Contractor)</span>
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>
      {open && (
        <div className="border-t border-amber-200 p-2 space-y-1.5">
          {DEV_WORKERS.map(w => (
            <div key={w.phone} className="flex items-center justify-between rounded-md border border-blue-200 bg-blue-50 text-blue-700 px-2.5 py-1.5">
              <div>
                <span className="font-semibold">{w.label}</span>
                <span className="ml-2 font-mono text-blue-600">{w.phone}</span>
              </div>
              <button type="button" onClick={() => { onFill(w.phone); setOpen(false); }}
                className="ml-2 rounded bg-white/70 px-2 py-0.5 font-semibold hover:bg-white transition-colors border border-blue-200">
                Fill
              </button>
            </div>
          ))}
          <p className="text-gray-400 px-1 pt-0.5">OTP will be auto-filled after sending</p>
        </div>
      )}
    </div>
  );
}

// ─── Main LoginForm ───────────────────────────────────────────────────────────

export function LoginForm() {
  const [tab, setTab] = useState<'email' | 'phone'>('email');

  return (
    <div className="space-y-5">
      {/* Tab switcher */}
      <div className="flex rounded-lg bg-gray-100 p-1 gap-1">
        {(['email', 'phone'] as const).map(t => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-2 text-sm font-medium rounded-md transition-all',
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
            )}>
            {t === 'email' ? '📧 Email / Admin' : '📱 Phone OTP'}
          </button>
        ))}
      </div>

      {tab === 'email' ? <EmailLoginForm /> : <PhoneLoginForm />}

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">Create one</Link>
      </p>
    </div>
  );
}
