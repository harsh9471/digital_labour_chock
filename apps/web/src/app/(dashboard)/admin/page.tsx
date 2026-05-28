'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Briefcase, Building2, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { AdminStats } from '@/lib/admin-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600" />
    </div>
  );

  const statCards = stats ? [
    { label: 'Total Workers', value: stats.totalWorkers.toLocaleString('en-IN'), change: 'Registered', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Contractors', value: stats.totalContractors.toLocaleString('en-IN'), change: 'Registered', icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Companies', value: stats.totalCompanies.toLocaleString('en-IN'), change: 'Active', icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Jobs', value: stats.totalJobs.toLocaleString('en-IN'), change: 'Posted', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Pending KYC', value: stats.pendingKyc.toLocaleString('en-IN'), change: 'Awaiting review', icon: Shield, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Pending Verif.', value: stats.pendingVerifications.toLocaleString('en-IN'), change: 'Accounts', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  ] : [];

  const quickLinks = [
    { href: '/admin/workers', label: 'Manage Workers', icon: Users, desc: 'View and manage all workers' },
    { href: '/contractors', label: 'Manage Contractors', icon: Briefcase, desc: 'View and manage contractors' },
    { href: '/admin/companies', label: 'Companies', icon: Building2, desc: 'View registered companies' },
    { href: '/admin/kyc', label: 'KYC Verifications', icon: Shield, desc: `${stats?.pendingKyc ?? 0} pending review`, urgent: (stats?.pendingKyc ?? 0) > 0 },
    { href: '/admin/complaints', label: 'Complaints', icon: AlertTriangle, desc: 'Handle platform complaints' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Admin Dashboard</h1>
        <p className="text-sm text-slate-400 mt-0.5">Welcome back, {user.firstName}. Here&rsquo;s the platform overview.</p>
      </div>

      {/* Stats Grid */}
      {loadingStats ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 bg-slate-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-0 bg-slate-800 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <span className="text-xs text-slate-400">{stat.change}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Card className="border-0 bg-slate-800 shadow-sm hover:bg-slate-700 transition-colors cursor-pointer">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-900/50 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-100">{link.label}</p>
                        {link.urgent && <Badge variant="destructive" className="text-xs">!</Badge>}
                      </div>
                      <p className="text-xs text-slate-400 truncate">{link.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Platform health */}
      <Card className="border-0 bg-slate-800 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-300">Platform Status</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'API', status: 'Operational' },
            { label: 'Database', status: 'Operational' },
            { label: 'Auth Service', status: 'Operational' },
            { label: 'Job Matching', status: 'Operational' },
          ].map(({ label, status }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <div>
                <p className="text-xs font-medium text-slate-300">{label}</p>
                <p className="text-xs text-slate-500">{status}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
