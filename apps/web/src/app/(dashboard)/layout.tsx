'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Briefcase, Users, MapPin, LogOut,
  Menu, X, ChevronRight, Bell, Settings, Loader2,
  Store, Bookmark, FileText, UserCircle, ClipboardList,
  Building2, BarChart2, Shield, Zap, FolderKanban,
  CalendarCheck, Wallet, AlertCircle, Building,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import NotificationBell from '@/components/notifications/NotificationBell';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  // Worker
  { label: 'Dashboard',       href: '/worker',                      icon: LayoutDashboard, roles: ['WORKER'],            section: 'main' },
  { label: 'Browse Jobs',     href: '/marketplace',                 icon: Store,           roles: ['WORKER'],            section: 'jobs' },
  { label: 'My Applications', href: '/worker/applications',         icon: FileText,        roles: ['WORKER'],            section: 'jobs' },
  { label: 'Saved Jobs',      href: '/worker/saved',                icon: Bookmark,        roles: ['WORKER'],            section: 'jobs' },
  { label: 'Attendance',      href: '/worker/attendance',           icon: CalendarCheck,   roles: ['WORKER'],            section: 'jobs' },
  { label: 'My Profile',      href: '/worker/profile',              icon: UserCircle,      roles: ['WORKER'],            section: 'account' },

  // Contractor
  { label: 'Dashboard',       href: '/contractor',                  icon: LayoutDashboard, roles: ['CONTRACTOR'],        section: 'main' },
  { label: 'Post a Job',      href: '/contractor/jobs/new',         icon: Briefcase,       roles: ['CONTRACTOR'],        section: 'jobs' },
  { label: 'My Jobs',         href: '/contractor/jobs',             icon: ClipboardList,   roles: ['CONTRACTOR'],        section: 'jobs' },
  { label: 'Applications',    href: '/contractor/applications',     icon: FileText,        roles: ['CONTRACTOR'],        section: 'jobs' },
  { label: 'Workers',         href: '/workers',                     icon: Users,           roles: ['CONTRACTOR'],        section: 'team' },
  { label: 'Sites',           href: '/sites',                       icon: MapPin,          roles: ['CONTRACTOR'],        section: 'team' },
  { label: 'Projects',        href: '/contractor/projects',         icon: FolderKanban,    roles: ['CONTRACTOR'],        section: 'operations' },
  { label: 'Attendance',      href: '/contractor/attendance',       icon: CalendarCheck,   roles: ['CONTRACTOR'],        section: 'operations' },
  { label: 'Payroll',         href: '/contractor/payroll',          icon: Wallet,          roles: ['CONTRACTOR'],        section: 'operations' },
  { label: 'Compliance',      href: '/contractor/compliance',       icon: Shield,          roles: ['CONTRACTOR'],        section: 'operations' },

  // Company Admin
  { label: 'Dashboard',       href: '/company',                     icon: LayoutDashboard, roles: ['COMPANY_ADMIN'],     section: 'main' },
  { label: 'My Company',      href: '/company/profile',             icon: Building,        roles: ['COMPANY_ADMIN'],     section: 'company' },
  { label: 'Contractors',     href: '/company/contractors',         icon: Briefcase,       roles: ['COMPANY_ADMIN'],     section: 'company' },
  { label: 'Workforce',       href: '/company/workforce',           icon: Users,           roles: ['COMPANY_ADMIN'],     section: 'company' },
  { label: 'Compliance',      href: '/company/compliance',          icon: AlertCircle,     roles: ['COMPANY_ADMIN'],     section: 'company' },

  // Super Admin
  { label: 'Dashboard',       href: '/admin',                       icon: LayoutDashboard, roles: ['SUPER_ADMIN'],       section: 'main' },
  { label: 'Users',           href: '/admin/users',                 icon: Users,           roles: ['SUPER_ADMIN'],       section: 'manage' },
  { label: 'Workers',         href: '/admin/workers',               icon: UserCircle,      roles: ['SUPER_ADMIN'],       section: 'manage' },
  { label: 'Contractors',     href: '/contractors',                 icon: Briefcase,       roles: ['SUPER_ADMIN'],       section: 'manage' },
  { label: 'Companies',       href: '/admin/companies',             icon: Building2,       roles: ['SUPER_ADMIN'],       section: 'manage' },
  { label: 'Verifications',   href: '/admin/kyc',                   icon: Shield,          roles: ['SUPER_ADMIN'],       section: 'manage' },
  { label: 'Complaints',      href: '/admin/complaints',            icon: AlertCircle,     roles: ['SUPER_ADMIN'],       section: 'manage' },
  { label: 'Analytics',       href: '/admin/analytics',             icon: BarChart2,       roles: ['SUPER_ADMIN'],       section: 'analytics' },
  { label: 'Reports',         href: '/admin/reports',               icon: FileText,        roles: ['SUPER_ADMIN'],       section: 'analytics' },
  { label: 'Roles',           href: '/admin/roles',                 icon: Shield,          roles: ['SUPER_ADMIN'],       section: 'config' },
  { label: 'Notifications',   href: '/admin/notifications',         icon: Bell,            roles: ['SUPER_ADMIN'],       section: 'config' },
  { label: 'Banners',         href: '/admin/banners',               icon: Zap,             roles: ['SUPER_ADMIN'],       section: 'config' },
  { label: 'CMS Pages',       href: '/admin/cms',                   icon: FileText,        roles: ['SUPER_ADMIN'],       section: 'config' },
  { label: 'Audit Logs',      href: '/admin/audit-logs',            icon: ClipboardList,   roles: ['SUPER_ADMIN'],       section: 'config' },
  { label: 'Settings',        href: '/admin/settings',              icon: Settings,        roles: ['SUPER_ADMIN'],       section: 'config' },
];

const SECTION_LABELS: Record<string, string> = {
  main: '', jobs: 'Jobs', team: 'Team', operations: 'Operations',
  company: 'Company', manage: 'Manage', account: 'Account',
  analytics: 'Analytics', config: 'Configuration',
};

// ─── Role-based theme ────────────────────────────────────────────────────────

type Theme = {
  dark: boolean;
  sidebar: string;
  border: string;
  logoBg: string;
  logoBadge: string;
  avatarRing: string;
  avatarBg: string;
  avatarText: string;
  roleBadge: string;
  sectionLabel: string;
  navBase: string;
  navHover: string;
  navActive: string;
  navActiveIcon: string;
  navInactiveIcon: string;
  navActiveIndicator: string;
  bottomBorder: string;
  settingsHover: string;
  logoutText: string;
  logoutHover: string;
};

const THEMES: Record<string, Theme> = {
  WORKER: {
    dark: false,
    sidebar: 'bg-white',
    border: 'border-slate-200',
    logoBg: 'from-emerald-500 to-teal-600',
    logoBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    avatarRing: 'ring-2 ring-emerald-100',
    avatarBg: 'bg-emerald-100',
    avatarText: 'text-emerald-700',
    roleBadge: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    sectionLabel: 'text-slate-400',
    navBase: 'text-slate-600',
    navHover: 'hover:bg-emerald-50 hover:text-emerald-700',
    navActive: 'bg-emerald-50 text-emerald-700',
    navActiveIcon: 'text-emerald-600',
    navInactiveIcon: 'text-slate-400 group-hover:text-emerald-500',
    navActiveIndicator: 'bg-emerald-500',
    bottomBorder: 'border-slate-100',
    settingsHover: 'hover:bg-slate-100 text-slate-600',
    logoutText: 'text-red-500',
    logoutHover: 'hover:bg-red-50',
  },
  CONTRACTOR: {
    dark: false,
    sidebar: 'bg-white',
    border: 'border-slate-200',
    logoBg: 'from-blue-500 to-indigo-600',
    logoBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    avatarRing: 'ring-2 ring-blue-100',
    avatarBg: 'bg-blue-100',
    avatarText: 'text-blue-700',
    roleBadge: 'bg-blue-50 text-blue-600 border border-blue-200',
    sectionLabel: 'text-slate-400',
    navBase: 'text-slate-600',
    navHover: 'hover:bg-blue-50 hover:text-blue-700',
    navActive: 'bg-blue-50 text-blue-700',
    navActiveIcon: 'text-blue-600',
    navInactiveIcon: 'text-slate-400 group-hover:text-blue-500',
    navActiveIndicator: 'bg-blue-500',
    bottomBorder: 'border-slate-100',
    settingsHover: 'hover:bg-slate-100 text-slate-600',
    logoutText: 'text-red-500',
    logoutHover: 'hover:bg-red-50',
  },
  SUPER_ADMIN: {
    dark: true,
    sidebar: 'bg-slate-900',
    border: 'border-slate-700/60',
    logoBg: 'from-violet-500 to-purple-600',
    logoBadge: 'bg-violet-900/50 text-violet-300 border-violet-700',
    avatarRing: 'ring-2 ring-violet-500/30',
    avatarBg: 'bg-violet-900/60',
    avatarText: 'text-violet-300',
    roleBadge: 'bg-violet-900/40 text-violet-300 border border-violet-700/50',
    sectionLabel: 'text-slate-500',
    navBase: 'text-slate-400',
    navHover: 'hover:bg-slate-800 hover:text-slate-100',
    navActive: 'bg-violet-600/20 text-violet-300',
    navActiveIcon: 'text-violet-400',
    navInactiveIcon: 'text-slate-500 group-hover:text-slate-300',
    navActiveIndicator: 'bg-violet-500',
    bottomBorder: 'border-slate-700/60',
    settingsHover: 'hover:bg-slate-800 text-slate-400',
    logoutText: 'text-red-400',
    logoutHover: 'hover:bg-red-900/30',
  },
  COMPANY_ADMIN: {
    dark: true,
    sidebar: 'bg-slate-900',
    border: 'border-slate-700/60',
    logoBg: 'from-violet-500 to-purple-600',
    logoBadge: 'bg-violet-900/50 text-violet-300 border-violet-700',
    avatarRing: 'ring-2 ring-violet-500/30',
    avatarBg: 'bg-violet-900/60',
    avatarText: 'text-violet-300',
    roleBadge: 'bg-violet-900/40 text-violet-300 border border-violet-700/50',
    sectionLabel: 'text-slate-500',
    navBase: 'text-slate-400',
    navHover: 'hover:bg-slate-800 hover:text-slate-100',
    navActive: 'bg-violet-600/20 text-violet-300',
    navActiveIcon: 'text-violet-400',
    navInactiveIcon: 'text-slate-500 group-hover:text-slate-300',
    navActiveIndicator: 'bg-violet-500',
    bottomBorder: 'border-slate-700/60',
    settingsHover: 'hover:bg-slate-800 text-slate-400',
    logoutText: 'text-red-400',
    logoutHover: 'hover:bg-red-900/30',
  },
};

const ROLE_LABELS: Record<string, string> = {
  WORKER: 'Worker',
  CONTRACTOR: 'Contractor',
  SUPER_ADMIN: 'Super Admin',
  COMPANY_ADMIN: 'Company Admin',
};

// ─── Sidebar Component ───────────────────────────────────────────────────────

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const role = user?.role ?? 'WORKER';
  const theme = THEMES[role] ?? THEMES.WORKER;

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role)),
  );

  const sections = visibleItems.reduce((acc, item) => {
    const key = item.section ?? 'main';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const isActive = (href: string) => {
    const exactRoots = ['/worker', '/contractor', '/admin', '/marketplace'];
    if (exactRoots.includes(href)) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const logoTextColor = theme.dark ? 'text-white' : 'text-slate-900';
  const _subTextColor = theme.dark ? 'text-slate-400' : 'text-slate-500';
  const dividerColor = theme.dark ? 'border-slate-700/60' : 'border-slate-100';
  const nameColor = theme.dark ? 'text-slate-100' : 'text-slate-800';

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 flex flex-col
          transition-transform duration-300 ease-in-out
          ${theme.sidebar} border-r ${theme.border}
          ${open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto lg:shadow-none
        `}
      >
        {/* ── Brand header ── */}
        <div className={`px-4 py-4 border-b ${dividerColor}`}>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${theme.logoBg} flex items-center justify-center shadow-md shrink-0`}>
                <span className="text-white font-bold text-sm">DL</span>
              </div>
              <div>
                <p className={`font-bold text-sm leading-tight ${logoTextColor}`}>
                  Digital Labour
                </p>
                <p className={`text-xs font-semibold ${theme.dark ? 'text-violet-400' : 'text-blue-500'}`}>
                  Chowk
                </p>
              </div>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className={`lg:hidden p-1.5 rounded-lg transition-colors ${theme.dark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── User card ── */}
        {user && (
          <div className={`px-4 py-3.5 border-b ${dividerColor}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${theme.avatarBg} ${theme.avatarRing} flex items-center justify-center shrink-0`}>
                <span className={`text-sm font-bold ${theme.avatarText}`}>
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold truncate ${nameColor}`}>
                  {user.firstName} {user.lastName}
                </p>
                <span className={`inline-block mt-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${theme.roleBadge}`}>
                  {ROLE_LABELS[role] ?? role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-5">
          {Object.entries(sections).map(([sectionKey, items]) => {
            const deduped = items.filter(
              (item, idx, arr) => arr.findIndex((i) => i.href === item.href) === idx,
            );
            return (
              <div key={sectionKey}>
                {SECTION_LABELS[sectionKey] && (
                  <p className={`px-2 mb-1.5 text-[10px] font-bold uppercase tracking-widest ${theme.sectionLabel}`}>
                    {SECTION_LABELS[sectionKey]}
                  </p>
                )}
                <ul className="space-y-0.5">
                  {deduped.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={`
                            group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                            transition-all duration-150
                            ${theme.navBase} ${theme.navHover}
                            ${active ? theme.navActive : ''}
                          `}
                        >
                          {/* Active left indicator bar */}
                          {active && (
                            <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full ${theme.navActiveIndicator}`} />
                          )}
                          <Icon
                            className={`h-4 w-4 shrink-0 transition-colors ${active ? theme.navActiveIcon : theme.navInactiveIcon}`}
                          />
                          <span className="flex-1 truncate">{item.label}</span>
                          {active && (
                            <ChevronRight className={`h-3.5 w-3.5 shrink-0 ${theme.navActiveIcon}`} />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* ── Bottom actions ── */}
        <div className={`px-3 py-3 border-t ${theme.bottomBorder} space-y-0.5`}>
          {/* Show Settings only for non-admin (admin has it in nav) */}
          {role !== 'SUPER_ADMIN' && role !== 'COMPANY_ADMIN' && (
            <Link
              href="/settings"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${theme.settingsHover}`}
            >
              <Settings className="h-4 w-4 shrink-0 text-slate-400" />
              <span>Settings</span>
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${theme.logoutText} ${theme.logoutHover}`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Top bar ─────────────────────────────────────────────────────────────────

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const role = user?.role ?? '';
  const theme = THEMES[role] ?? THEMES.WORKER;

  // Derive page title from pathname
  const pageTitle = (() => {
    if (pathname === '/worker') return 'Dashboard';
    if (pathname === '/marketplace') return 'Browse Jobs';
    if (pathname === '/worker/applications') return 'My Applications';
    if (pathname === '/worker/saved') return 'Saved Jobs';
    if (pathname === '/worker/profile') return 'My Profile';
    if (pathname === '/contractor') return 'Dashboard';
    if (pathname.startsWith('/contractor/jobs/new')) return 'Post a Job';
    if (pathname.startsWith('/contractor/jobs')) return 'My Jobs';
    if (pathname.startsWith('/contractor/applications')) return 'Applications';
    if (pathname.startsWith('/contractor/projects')) return 'Projects';
    if (pathname.startsWith('/contractor/attendance')) return 'Attendance';
    if (pathname.startsWith('/contractor/payroll')) return 'Payroll';
    if (pathname.startsWith('/contractor/compliance')) return 'Compliance';
    if (pathname === '/company') return 'Company Dashboard';
    if (pathname.startsWith('/company/profile')) return 'My Company';
    if (pathname.startsWith('/company/contractors')) return 'Contractors';
    if (pathname.startsWith('/company/workforce')) return 'Workforce';
    if (pathname.startsWith('/company/compliance')) return 'Compliance';
    if (pathname === '/admin') return 'Admin Dashboard';
    if (pathname.startsWith('/admin/workers')) return 'Workers';
    if (pathname.startsWith('/admin/kyc')) return 'Verifications';
    if (pathname.startsWith('/admin/analytics')) return 'Analytics';
    if (pathname.startsWith('/admin/companies')) return 'Companies';
    if (pathname.startsWith('/admin/complaints')) return 'Complaints';
    if (pathname.startsWith('/admin/settings')) return 'Admin Settings';
    if (pathname.startsWith('/admin/users')) return 'User Management';
    if (pathname.startsWith('/admin/roles')) return 'Role Management';
    if (pathname.startsWith('/admin/notifications')) return 'Notifications';
    if (pathname.startsWith('/admin/banners')) return 'Banner Management';
    if (pathname.startsWith('/admin/cms')) return 'CMS Pages';
    if (pathname.startsWith('/admin/reports')) return 'Reports';
    if (pathname.startsWith('/admin/audit-logs')) return 'Audit Logs';
    if (pathname.startsWith('/notifications')) return 'Notifications';
    if (pathname === '/workers') return 'Workers';
    if (pathname === '/sites') return 'Sites';
    if (pathname.startsWith('/worker/attendance')) return 'My Attendance';
    if (pathname === '/settings') return 'Settings';
    if (pathname === '/contractors') return 'Contractors';
    return 'Dashboard';
  })();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center gap-4 px-4 lg:px-6 shrink-0 shadow-sm">
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title */}
      <div className="hidden sm:block">
        <h1 className="text-base font-semibold text-slate-800">{pageTitle}</h1>
      </div>

      {/* DL logo on mobile (since sidebar is hidden) */}
      <div className="flex sm:hidden items-center gap-2">
        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${theme.logoBg} flex items-center justify-center`}>
          <span className="text-white font-bold text-xs">DL</span>
        </div>
        <span className="font-bold text-slate-800 text-sm">Digital Labour Chowk</span>
      </div>

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        {/* Notification bell */}
        <NotificationBell />

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-slate-200 mx-1" />

        {/* User avatar + name */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-full ${theme.avatarBg} flex items-center justify-center`}>
            <span className={`text-xs font-bold ${theme.avatarText}`}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="hidden md:block leading-tight">
            <p className="text-sm font-semibold text-slate-800">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-slate-400">{ROLE_LABELS[role] ?? role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Root Layout ─────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hydrated, isAuthenticated, router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-slate-400">Loading…</p>
        </div>
      </div>
    );
  }

  const mainBg = 'bg-slate-50';

  return (
    // h-screen + overflow-hidden pins the container to the viewport.
    // This gives the sidebar's h-full a concrete value to inherit (= 100vh),
    // eliminating the empty white box at the bottom.
    // Only <main> scrolls — the sidebar and topbar stay fixed in view.
    <div className={`h-screen overflow-hidden ${mainBg} flex`}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
