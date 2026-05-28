'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Briefcase, Building2, TrendingUp, Shield, AlertTriangle, ArrowRight, Activity } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { AdminStats } from '@/lib/admin-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth.store';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (user?.role !== 'SUPER_ADMIN') { router.replace('/login'); return; }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    adminApi.getStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, []);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600" />
    </div>
  );

  const statCards = [
    { label: 'Total Workers', value: stats?.totalWorkers ?? 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', href: '/admin/workers' },
    { label: 'Contractors', value: stats?.totalContractors ?? 0, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', href: '/contractors' },
    { label: 'Companies', value: stats?.totalCompanies ?? 0, icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', href: '/admin/companies' },
    { label: 'Total Jobs', value: stats?.totalJobs ?? 0, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', href: '/admin/analytics' },
    { label: 'Pending KYC', value: stats?.pendingKyc ?? 0, icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', href: '/admin/kyc', urgent: (stats?.pendingKyc ?? 0) > 0 },
    { label: 'Pending Accounts', value: stats?.pendingVerifications ?? 0, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', href: '/admin/workers', urgent: (stats?.pendingVerifications ?? 0) > 0 },
  ];

  const quickLinks = [
    { href: '/admin/workers', label: 'Manage Workers', icon: Users, desc: 'View, verify, and manage all workers', color: 'bg-blue-600' },
    { href: '/contractors', label: 'Manage Contractors', icon: Briefcase, desc: 'View and manage all contractors', color: 'bg-indigo-600' },
    { href: '/admin/companies', label: 'Companies', icon: Building2, desc: 'View all registered companies', color: 'bg-purple-600' },
    { href: '/admin/kyc', label: 'KYC Verifications', icon: Shield, desc: `${stats?.pendingKyc ?? 0} workers awaiting KYC review`, color: 'bg-amber-600', badge: stats?.pendingKyc },
    { href: '/admin/complaints', label: 'Complaints', icon: AlertTriangle, desc: 'Manage platform complaints & disputes', color: 'bg-rose-600' },
    { href: '/admin/analytics', label: 'Analytics', icon: Activity, desc: 'Platform-wide analytics & insights', color: 'bg-emerald-600' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Welcome back, <span className="font-medium text-slate-700">{user.firstName}</span>. Here&rsquo;s your platform overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {loadingStats
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />)
          : statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link key={stat.label} href={stat.href}>
                  <Card className={`border ${stat.border} shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer`}>
                    <CardContent className="p-4">
                      <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                        <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
                      </div>
                      <div className="flex items-end gap-1">
                        <span className="text-2xl font-bold text-slate-900">
                          {stat.value.toLocaleString('en-IN')}
                        </span>
                        {stat.urgent && stat.value > 0 && (
                          <span className="w-2 h-2 rounded-full bg-red-500 mb-1 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-tight">{stat.label}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${link.color} flex items-center justify-center shrink-0`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">{link.label}</p>
                        {link.badge != null && link.badge > 0 && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0.5">{link.badge}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{link.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Platform Status */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Platform Status</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'API Server', status: 'Operational', ok: true },
              { label: 'Database', status: 'Operational', ok: true },
              { label: 'Auth Service', status: 'Operational', ok: true },
              { label: 'Job Matching', status: 'Operational', ok: true },
            ].map(({ label, status, ok }) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${ok ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <div>
                  <p className="text-xs font-semibold text-slate-700">{label}</p>
                  <p className="text-xs text-slate-400">{status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
