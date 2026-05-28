'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Briefcase, Star, MapPin, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

const phoneSchema = z.object({
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Use format: +91XXXXXXXXXX'),
});
type PhoneFormValues = z.infer<typeof phoneSchema>;

const DEV_WORKERS = [
  { label: 'Ramesh Yadav (Mason)', phone: '+919700001001' },
  { label: 'Kavitha Nair (Cook)', phone: '+919700001002' },
  { label: 'Arun Kumar (Electrician)', phone: '+919700001003' },
  { label: 'Santosh Gupta (Carpenter)', phone: '+919700001005' },
];

export default function WorkerLoginPage() {
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
  const [showDevPanel, setShowDevPanel] = useState(false);
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
        toast({ title: '🛠️ Dev Mode', description: `OTP: ${res.devOtp}` });
      } else {
        toast({ title: 'OTP Sent!', description: `Sent to ${data.phone}` });
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
      if (response.user.role !== 'WORKER') {
        toast({ title: 'Wrong Portal', description: 'Use the correct login portal for your role', variant: 'destructive' });
        setIsVerifying(false);
        return;
      }
      toast({ title: `Welcome back, ${response.user.firstName}!` });
      router.push('/worker');
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

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex w-[45%] flex-col bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 relative overflow-hidden">
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
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Find Daily Work<br />Near You
            </h1>
            <p className="text-emerald-100 text-lg mb-8">
              Connect with contractors and find jobs matching your skills across India.
            </p>
            <div className="space-y-4">
              {[
                { icon: MapPin, text: '100+ cities across India' },
                { icon: Star, text: 'Rated 4.8/5 by 2L+ workers' },
                { icon: Shield, text: 'Safe & verified payments' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-emerald-200" />
                  </div>
                  <span className="text-emerald-100">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">R</div>
              <div>
                <p className="font-semibold text-sm">Ramesh Yadav</p>
                <p className="text-emerald-200 text-xs">Mason • Mumbai</p>
              </div>
            </div>
            <p className="text-sm text-emerald-100 italic">
              &quot;Got hired within 2 hours of registering. Payment was safe and on time.&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">DL</span>
            </div>
            <span className="font-bold text-gray-900 text-xl">Digital Labour Chowk</span>
          </div>

          {/* Role badge */}
          <div className="flex items-center gap-2 mb-6 justify-center lg:justify-start">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
              <Briefcase className="h-4 w-4" /> Worker Portal
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {step === 'phone' ? 'Sign in as Worker' : 'Enter OTP'}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {step === 'phone'
                ? 'Enter your registered mobile number to continue'
                : `Enter the 6-digit code sent to ${phone.slice(0, 7)}****`}
            </p>

            {step === 'phone' ? (
              <>
                {/* Dev panel */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
                    <button type="button" onClick={() => setShowDevPanel(!showDevPanel)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-amber-800 text-sm font-medium">
                      🛠️ Dev — Worker Quick Login
                      {showDevPanel ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {showDevPanel && (
                      <div className="border-t border-amber-200 p-3 space-y-2">
                        {DEV_WORKERS.map(w => (
                          <div key={w.phone} className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                            <div>
                              <span className="text-xs font-semibold text-emerald-800">{w.label}</span>
                              <span className="ml-2 font-mono text-xs text-emerald-600">{w.phone}</span>
                            </div>
                            <button type="button"
                              onClick={() => { setValue('phone', w.phone); setShowDevPanel(false); }}
                              className="text-xs bg-white border border-emerald-200 rounded px-2 py-1 text-emerald-700 font-semibold hover:bg-emerald-50">
                              Fill
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit(handleSend)} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Mobile Number</Label>
                    <Input id="phone" type="tel" placeholder="+91 98765 43210"
                      leftIcon={<Phone className="h-4 w-4" />}
                      error={errors.phone?.message} {...register('phone')} />
                    <p className="text-xs text-gray-400">Format: +91XXXXXXXXXX</p>
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" loading={isSending}>
                    {isSending ? 'Sending OTP...' : 'Get OTP →'}
                  </Button>
                </form>
              </>
            ) : (
              <div className="space-y-5">
                {devOtp && (
                  <div className="flex items-center justify-between rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm">
                    <span className="text-yellow-800">🛠️ Dev OTP:</span>
                    <span className="font-mono font-bold tracking-widest text-yellow-900 text-lg">{devOtp}</span>
                    <button onClick={() => handleVerify(devOtp)} className="text-xs font-semibold text-yellow-700 underline">Use it</button>
                  </div>
                )}
                <div className="flex justify-center gap-3">
                  {otp.map((digit, idx) => (
                    <input key={idx} ref={el => { inputRefs.current[idx] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleKeyDown(idx, e)}
                      disabled={isVerifying}
                      className={cn(
                        'w-12 h-14 text-center text-xl font-bold border-2 rounded-xl transition-all focus:outline-none',
                        digit ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-300 bg-white',
                        'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100',
                        isVerifying && 'opacity-50',
                      )}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <button onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setDevOtp(null); }}
                    className="text-gray-500 hover:text-gray-700">← Change number</button>
                  {countdown > 0
                    ? <span className="text-gray-400">Resend in {countdown}s</span>
                    : <button onClick={() => handleSubmit(handleSend)()} className="text-emerald-600 hover:text-emerald-700 font-medium">Resend OTP</button>
                  }
                </div>
                <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" loading={isVerifying}
                  onClick={() => otp.every(d => d) && handleVerify(otp.join(''))}>
                  {isVerifying ? 'Verifying...' : 'Verify & Sign In'}
                </Button>
              </div>
            )}

            <p className="text-center text-sm text-gray-500 mt-5">
              New worker?{' '}
              <Link href="/register?role=WORKER" className="font-semibold text-emerald-600 hover:text-emerald-700">Register here</Link>
            </p>
          </div>

          {/* Switch portals */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 mb-3">Sign in as a different role?</p>
            <div className="flex gap-2 justify-center">
              <Link href="/login/contractor">
                <button className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors">
                  Contractor
                </button>
              </Link>
              <Link href="/login/admin">
                <button className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors">
                  Admin
                </button>
              </Link>
              <Link href="/login">
                <button className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors">
                  General Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
