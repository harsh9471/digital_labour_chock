'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase, Users, FolderKanban, IndianRupee,
  AlertCircle, CheckCircle, MapPin, ChevronRight,
  Building2, TrendingUp, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { companyApi, CompanyDashboard } from '@/lib/company-api';

function StatCard({ label, value, icon: Icon, gradient, iconBg, sub }: {
  label: string; value: string | number; icon: React.ElementType;
  gradient: string; iconBg: string; sub?: string;
}) {
  return (
    <div className={`relative rounded-2xl p-5 overflow-hidden ${gradient} shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

const PROJECT_STATUS_MAP: Record<string, { label: string; cls: string }> = {
  PLANNING:  { label: 'Planning',  cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  ACTIVE:    { label: 'Active',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ON_HOLD:   { label: 'On Hold',   cls: 'bg-orange-50 text-orange-700 border-orange-200' },
  COMPLETED: { label: 'Completed', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  CANCELLED: { label: 'Cancelled', cls: 'bg-red-50 text-red-700 border-red-200' },
};

export default function CompanyDashboardPage() {
  const { user } = useAuthStore();
  const [dashboard, setDashboard] = useState<CompanyDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyApi.getDashboard()
      .then(res => setDashboard(res.data ?? null))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-36 bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats;
  const formatCurrency = (n: number) => `₹${Number(n).toLocaleString('en-IN')}`;

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* Hero banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 p-6 text-white shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-16 w-32 h-32 rounded-full bg-white blur-2xl" />
        </div>
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-violet-200 text-sm font-medium mb-1">Enterprise Portal 🏢</p>
            <h1 className="text-2xl sm:text-3xl font-bold">Welcome, {user?.firstName}!</h1>
            <p className="text-violet-100 text-sm mt-2">
              {stats ? `${stats.totalContractors} contractors · ${stats.totalProjects} projects · ${stats.companyWorkforce} workers deployed` : 'Loading company data...'}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link href="/company/contractors">
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur gap-2">
                <Briefcase className="h-3.5 w-3.5" /> Contractors
              </Button>
            </Link>
            <Link href="/company/workforce">
              <Button size="sm" className="bg-white text-violet-700 hover:bg-violet-50 gap-2 font-semibold">
                <Users className="h-3.5 w-3.5" /> Workforce
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
          {[
            { label: 'Contractors',   value: stats?.totalContractors ?? '—' },
            { label: 'Active Projects', value: stats?.activeProjects ?? '—' },
            { label: 'Workers Deployed', value: stats?.companyWorkforce ?? '—' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className="text-xl font-bold">{item.value}</p>
              <p className="text-violet-200 text-xs mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          label="Total Contractors" value={stats?.totalContractors ?? 0}
          icon={Briefcase} sub="Registered"
          gradient="bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-900"
          iconBg="bg-blue-500 text-white"
        />
        <StatCard
          label="Total Projects" value={stats?.totalProjects ?? 0}
          icon={FolderKanban} sub="All time"
          gradient="bg-gradient-to-br from-violet-50 to-purple-100 text-violet-900"
          iconBg="bg-violet-500 text-white"
        />
        <StatCard
          label="Active Projects" value={stats?.activeProjects ?? 0}
          icon={TrendingUp} sub="In progress"
          gradient="bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-900"
          iconBg="bg-emerald-500 text-white"
        />
        <StatCard
          label="Workforce Deployed" value={stats?.companyWorkforce ?? 0}
          icon={Users} sub="Active workers"
          gradient="bg-gradient-to-br from-amber-50 to-orange-100 text-amber-900"
          iconBg="bg-amber-500 text-white"
        />
        <StatCard
          label="Monthly Payroll" value={stats ? formatCurrency(stats.monthPayroll) : '—'}
          icon={IndianRupee} sub="This month"
          gradient="bg-gradient-to-br from-green-50 to-emerald-100 text-green-900"
          iconBg="bg-green-600 text-white"
        />
        <StatCard
          label="Pending Compliance" value={stats?.pendingCompliance ?? 0}
          icon={AlertCircle} sub="Needs attention"
          gradient={`bg-gradient-to-br ${(stats?.pendingCompliance ?? 0) > 0 ? 'from-red-50 to-rose-100 text-red-900' : 'from-gray-50 to-slate-100 text-gray-900'}`}
          iconBg={(stats?.pendingCompliance ?? 0) > 0 ? 'bg-red-500 text-white' : 'bg-gray-400 text-white'}
        />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Contractors',  href: '/company/contractors', icon: Briefcase,    bg: 'bg-blue-600',   text: 'text-white', hover: 'hover:bg-blue-700' },
            { label: 'Workforce',    href: '/company/workforce',   icon: Users,        bg: 'bg-white',      text: 'text-gray-700', hover: 'hover:bg-gray-50', border: 'border border-gray-200' },
            { label: 'My Company',   href: '/company/profile',     icon: Building2,    bg: 'bg-white',      text: 'text-gray-700', hover: 'hover:bg-gray-50', border: 'border border-gray-200' },
            { label: 'Compliance',   href: '/company/compliance',  icon: CheckCircle,  bg: 'bg-white',      text: 'text-gray-700', hover: 'hover:bg-gray-50', border: 'border border-gray-200' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href}>
                <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl ${item.bg} ${item.text} ${item.hover} ${item.border ?? ''} transition-all duration-150 shadow-sm cursor-pointer`}>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium flex-1 truncate">{item.label}</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-40 shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent projects + Contractors by location */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Recent projects */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="font-semibold text-gray-900">Recent Projects</p>
            <Link href="/company/contractors">
              <Button variant="ghost" size="sm" className="text-violet-600 text-xs font-semibold hover:bg-violet-50">
                View all <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          {!dashboard?.recentProjects?.length ? (
            <div className="py-10 text-center text-gray-400 text-sm">No projects yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {dashboard.recentProjects.map(proj => {
                const s = PROJECT_STATUS_MAP[proj.status] ?? { label: proj.status, cls: 'bg-gray-100 text-gray-600 border-gray-200' };
                return (
                  <div key={proj.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/80 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                      <FolderKanban className="h-4 w-4 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-sm">{proj.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{proj.city ?? '—'}</span>
                        <span><Users className="h-3 w-3 inline mr-0.5" />{proj._count.workforceAssignments} workers</span>
                        <span>{proj.contractor?.user ? `${proj.contractor.user.firstName} ${proj.contractor.user.lastName}` : ''}</span>
                      </div>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${s.cls}`}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Contractors by location */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="font-semibold text-gray-900">Contractors by City</p>
          </div>
          {!dashboard?.contractorsByLocation?.length ? (
            <div className="py-10 text-center text-gray-400 text-sm">No data</div>
          ) : (
            <div className="px-5 py-3 space-y-3">
              {dashboard.contractorsByLocation.map((loc, idx) => {
                const max = dashboard.contractorsByLocation[0]._count.id;
                const pct = max > 0 ? (loc._count.id / max) * 100 : 0;
                return (
                  <div key={loc.city ?? idx}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />{loc.city ?? 'Unknown'}
                      </span>
                      <span className="text-gray-500 font-semibold">{loc._count.id}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CTA banners */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-700 p-5 text-white shadow-md">
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
          <Briefcase className="h-8 w-8 text-violet-300 mb-3" />
          <h3 className="font-bold text-base">Manage Contractors</h3>
          <p className="text-violet-100 text-sm mt-1 mb-4">View and manage all contractor relationships</p>
          <Link href="/company/contractors">
            <Button size="sm" className="bg-white text-violet-700 hover:bg-violet-50 font-semibold gap-2">
              View Contractors <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-700 p-5 text-white shadow-md">
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
          <Users className="h-8 w-8 text-emerald-300 mb-3" />
          <h3 className="font-bold text-base">Workforce Overview</h3>
          <p className="text-emerald-100 text-sm mt-1 mb-4">See all deployed workers across projects</p>
          <Link href="/company/workforce">
            <Button size="sm" className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold gap-2">
              View Workforce <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
