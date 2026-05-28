'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth.store';
import { getRoleDashboardPath, isValidIndianPhone } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface OtpFormProps {
  initialPhone?: string;
  purpose?: string;
}

export function OtpForm({ initialPhone = '', purpose = 'LOGIN' }: OtpFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { sendOtp, loginWithOtp } = useAuthStore();

  const phone = searchParams.get('phone') || initialPhone;
  const otpPurpose = searchParams.get('purpose') || purpose;

  const [phoneNumber, setPhoneNumber] = useState(phone);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (phone && isValidIndianPhone(phone)) {
      handleSendOtp();
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!isValidIndianPhone(phoneNumber)) {
      toast({ title: 'Invalid phone', description: 'Please enter a valid +91 Indian phone number', variant: 'destructive' });
      return;
    }
    setIsSending(true);
    try {
      const res = await sendOtp(phoneNumber, otpPurpose);
      setOtpSent(true);
      setCountdown(60);

      // Dev mode: auto-fill OTP
      if (res?.devOtp) {
        setDevOtp(res.devOtp);
        const digits = res.devOtp.split('');
        setOtpDigits(digits);
        toast({ title: '🛠️ Dev Mode', description: `OTP auto-filled: ${res.devOtp}`, variant: 'default' });
      } else {
        setOtpDigits(['', '', '', '', '', '']);
        toast({ title: 'OTP Sent!', description: `OTP sent to ${phoneNumber}`, variant: 'default' });
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({ title: 'Failed to send OTP', description: axiosError.response?.data?.message || 'Please try again', variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newDigits.every((d) => d !== '') && newDigits.join('').length === 6) {
      handleVerifyOtp(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const digits = pasted.split('');
      setOtpDigits(digits);
      inputRefs.current[5]?.focus();
      handleVerifyOtp(pasted);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    try {
      const response = await loginWithOtp({
        phone: phoneNumber,
        code,
        purpose: otpPurpose as 'LOGIN' | 'REGISTER' | 'PASSWORD_RESET' | 'EMAIL_VERIFY' | 'PHONE_VERIFY',
      });
      toast({ title: '✓ Verified!', description: `Welcome, ${response.user.firstName}!` });
      router.push(getRoleDashboardPath(response.user.role));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({ title: 'Verification failed', description: axiosError.response?.data?.message || 'Invalid OTP', variant: 'destructive' });
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="space-y-6">
      {!otpSent ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-600 text-sm font-medium">
                🇮🇳 +91
              </span>
              <input
                type="tel"
                value={phoneNumber.replace('+91', '')}
                onChange={(e) => setPhoneNumber(`+91${e.target.value.replace(/\D/g, '').slice(0, 10)}`)}
                placeholder="9876543210"
                className="flex-1 h-10 px-3 rounded-r-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={10}
              />
            </div>
          </div>
          <Button
            variant="brand"
            size="lg"
            className="w-full"
            onClick={handleSendOtp}
            loading={isSending}
            disabled={phoneNumber.length < 13}
          >
            {isSending ? 'Sending OTP...' : 'Get OTP'}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Enter the 6-digit OTP sent to{' '}
              <span className="font-semibold text-gray-900">{phoneNumber.slice(0, 6)}****</span>
            </p>
          </div>

          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={cn(
                  'w-12 h-14 text-center text-xl font-bold border-2 rounded-xl transition-all duration-200',
                  'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
                  digit ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white',
                )}
              />
            ))}
          </div>

          {/* Dev mode OTP banner */}
          {devOtp && (
            <div className="flex items-center justify-between rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2.5 text-sm">
              <span className="text-yellow-800">
                🛠️ <span className="font-medium">Dev OTP:</span>
              </span>
              <span className="font-mono font-bold tracking-widest text-yellow-900 text-base">
                {devOtp}
              </span>
              <button
                type="button"
                onClick={() => {
                  const digits = devOtp.split('');
                  setOtpDigits(digits);
                  handleVerifyOtp(devOtp);
                }}
                className="ml-2 text-xs font-semibold text-yellow-700 underline hover:text-yellow-900"
              >
                Use it
              </button>
            </div>
          )}

          <div className="text-center space-y-2">
            {countdown > 0 ? (
              <p className="text-sm text-gray-500">
                Resend OTP in{' '}
                <span className="font-semibold text-blue-600">{countdown}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSending}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                {isSending ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>

          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={() => { setOtpSent(false); setOtpDigits(['', '', '', '', '', '']); }}
          >
            Change Phone Number
          </Button>
        </div>
      )}
    </div>
  );
}
