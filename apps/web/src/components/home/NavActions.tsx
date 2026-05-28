'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';

const ROLE_DASHBOARD: Record<string, string> = {
  WORKER: '/worker',
  CONTRACTOR: '/contractor',
  SUPER_ADMIN: '/admin',
  COMPANY_ADMIN: '/admin',
};

export default function NavActions() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    const dashboard = ROLE_DASHBOARD[user.role] ?? '/worker';
    return (
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm text-gray-500">
          Hi, <span className="font-semibold text-gray-800">{user.firstName}</span>
        </span>
        <Link href={dashboard}>
          <Button variant="brand" size="sm" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Go to Dashboard</span>
            <span className="sm:hidden">Dashboard</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/login">
        <Button variant="ghost" size="sm" className="hidden sm:flex">
          Sign In
        </Button>
      </Link>
      <Link href="/register">
        <Button variant="brand" size="sm">
          Get Started
        </Button>
      </Link>
    </div>
  );
}
