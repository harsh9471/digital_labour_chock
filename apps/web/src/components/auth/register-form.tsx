'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, Briefcase, Building2, HardHat } from 'lucide-react';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid phone number format (+91XXXXXXXXXX)').optional().or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Must include uppercase, lowercase, number & special char'),
    confirmPassword: z.string(),
    role: z.enum(['WORKER', 'CONTRACTOR', 'COMPANY_ADMIN']),
  })
  .refine((data) => data.email || data.phone, {
    message: 'Either email or phone is required',
    path: ['email'],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const roles = [
  { value: 'WORKER', label: 'Worker', description: 'Looking for daily wage work', icon: HardHat, color: 'blue' },
  { value: 'CONTRACTOR', label: 'Contractor', description: 'Hire workers for projects', icon: Briefcase, color: 'orange' },
  { value: 'COMPANY_ADMIN', label: 'Company', description: 'Manage workforce at scale', icon: Building2, color: 'green' },
];

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'WORKER' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || undefined,
        phone: data.phone || undefined,
        password: data.password,
        role: data.role,
      });
      toast({
        title: 'Account created!',
        description: 'Please verify your account to continue.',
        variant: 'default',
      });
      if (data.phone) {
        router.push(`/verify-otp?phone=${encodeURIComponent(data.phone)}&purpose=REGISTER`);
      } else {
        router.push('/login');
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || 'Registration failed. Please try again.';
      toast({ title: 'Registration failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Role Selection */}
      <div className="space-y-2">
        <Label>I am a</Label>
        <div className="grid grid-cols-3 gap-3">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.value;
            return (
              <button
                key={role.value}
                type="button"
                onClick={() => setValue('role', role.value as RegisterFormValues['role'])}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-200',
                  isSelected
                    ? 'border-blue-600 bg-blue-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50',
                )}
              >
                <Icon
                  className={cn('h-6 w-6', isSelected ? 'text-blue-600' : 'text-gray-400')}
                />
                <div>
                  <p className={cn('text-xs font-semibold', isSelected ? 'text-blue-600' : 'text-gray-700')}>
                    {role.label}
                  </p>
                  <p className="text-xs text-gray-400 hidden sm:block">{role.description}</p>
                </div>
              </button>
            );
          })}
        </div>
        {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
      </div>

      {/* Name */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Rajesh"
            leftIcon={<User className="h-4 w-4" />}
            error={errors.firstName?.message}
            {...register('firstName')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Kumar"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number <span className="text-gray-400">(recommended)</span></Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+919876543210"
          leftIcon={<Phone className="h-4 w-4" />}
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address <span className="text-gray-400">(optional)</span></Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Min 8 chars with uppercase, number & symbol"
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-foreground">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          placeholder="Re-enter your password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>

      <Button type="submit" variant="brand" size="lg" className="w-full" loading={isLoading}>
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
          Sign in
        </Link>
      </p>
    </form>
  );
}
