'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Briefcase, Users, MapPin, LogOut,
  Menu, X, ChevronRight, Bell, Settings, Loader2,
  Store, Bookmark, FileText, UserCircle, ClipboardList,
  Building2, BarChart2, Shield,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  // Worker
  { label: 'Dashboard',     href: '/worker',                icon: LayoutDashboard, roles: ['WORKER'],    section: 'main' },
  { label: 'Browse Jobs',   href: '/marketplace',           icon: Store,           roles: ['WORKER'],    section: 'jobs' },
  { label: 'My Applications', href: '/worker/applications', icon: FileText,        roles: ['WORKER'],    section: 'jobs' },
  { label: 'Saved Jobs',    href: '/worker/saved',          icon: Bookmark,        roles: ['WORKER'],    section: 'jobs' },
  { label: 'My Profile',    href: '/worker/profile',        icon: UserCircle,      roles: ['WORKER'],    section: 'account' },

  // Contractor
  { label: 'Dashboard',     href: '/contractor',            icon: LayoutDashboard, roles: ['CONTRACTOR'], section: 'main' },
  { label: 'Post a Job',    href: '/contractor/jobs/new',   icon: Briefcase,       roles: ['CONTRACTOR'], section: 'jobs' },
  { label: 'My Jobs',       href: '/contractor/jobs',       icon: ClipboardList,   roles: ['CONTRACTOR'], section: 'jobs' },
  { label: 'Applications',  href: '/contractor/applications', icon: FileText,      roles: ['CONTRACTOR'], section: 'jobs' },
  { label: 'Workers',       href: '/workers',               icon: Users,           roles: ['CONTRACTOR'], section: 'team' },
  { label: 'Sites',         href: '/sites',                 icon: MapPin,          roles: ['CONTRACTOR'], section: 'team' },

  // Admin
  { label: 'Dashboard',     href: '/admin',                 icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN'], section: 'main' },
  { label: 'Jobs',          href: '/jobs',                  icon: Briefcase,       roles: ['SUPER_ADMIN', 'COMPANY_ADMIN'], section: 'manage' },
  { label: 'Workers',       href: '/workers',               icon: Users,           roles: ['SUPER_ADMIN', 'COMPANY_ADMIN'], section: 'manage' },
  { label: 'Companies',     href: '/admin/companies',       icon: Building2,       roles: ['SUPER_ADMIN'],                  section: 'manage' },
  { label: 'Analytics',     href: '/admin/analytics',       icon: BarChart2,       roles: ['SUPER_ADMIN', 'COMPANY_ADMIN'], section: 'manage' },
  { label: 'KYC Review',    href: '/admin/kyc',             icon: Shield,          roles: ['SUPER_ADMIN', 'COMPANY_ADMIN'], section: 'manage' },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role)),
  );

  // Group by section
  const sections = visibleItems.reduce((acc, item) => {
    const key = item.section ?? 'main';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const sectionLabels: Record<string, string> = {
    main: '', jobs: 'Jobs', team: 'Team', manage: 'Manage', account: 'Account',
  };


  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">DL</span>
            </div>
            <span className="font-bold text-slate-900 text-sm leading-tight">
              Digital Labour<br />
              <span className="text-blue-600">Chowk</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1 rounded text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-blue-700">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-slate-400 capitalize">
                  {user.role?.toLowerCase().replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {Object.entries(sections).map(([sectionKey, items]) => (
            <div key={sectionKey} className="mb-4">
              {sectionLabels[sectionKey] && (
                <p className="px-3 mb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {sectionLabels[sectionKey]}
                </p>
              )}
              <div className="space-y-0.5">
                {items.filter((item, idx, arr) => arr.findIndex(i => i.href === item.href) === idx).map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href ||
                    (item.href !== '/marketplace' && item.href !== '/worker' && item.href !== '/contractor' && item.href !== '/admin' && pathname.startsWith(item.href + '/')) ||
                    (item.href === '/marketplace' && (pathname === '/marketplace' || pathname.startsWith('/marketplace/'))) ||
                    (item.href === '/worker' && pathname === '/worker') ||
                    (item.href === '/contractor' && pathname === '/contractor') ||
                    (item.href === '/admin' && pathname === '/admin');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group
                        ${active
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      {item.label}
                      {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-blue-400" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 pb-4 space-y-0.5 border-t border-slate-100 pt-3">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Settings className="h-4 w-4 text-slate-400" />
            Settings
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Wait for Zustand to rehydrate from localStorage before checking auth
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hydrated, isAuthenticated, router]);

  // Show spinner while rehydrating or redirecting
  if (!hydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1 lg:flex-none" />

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 relative"
            >
              <Bell className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-700">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <span className="text-sm font-medium text-slate-700">
                {user?.firstName}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
