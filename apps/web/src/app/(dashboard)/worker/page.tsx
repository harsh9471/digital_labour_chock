'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase, Star, Eye, CheckCircle, Clock,
  TrendingUp, Bookmark, AlertCircle, ArrowRight, MapPin,
  User, Settings, ChevronRight, IndianRupee, Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { useAuthStore } from '@/store/auth.store';
import { workersApi } from '@/lib/workers-api';
import { jobsApi } from '@/lib/jobs-api';
import { formatCurrency, formatDate } from '@/lib/utils';

interface WorkerStats {
  totalApplications: number; activeApplications: number; hiredCount: number;
  savedCount: number; totalEarnings: number; rating: number | null;
  totalRatings: number; totalJobsDone: number; profileViews: number; isProfileComplete: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Application = any;

const PAGE_SIZE = 5;

function AppStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    SUBMITTED:   { label: 'Applied',      cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    VIEWED:      { label: 'Viewed',       cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    SHORTLISTED: { label: 'Shortlisted',  cls: 'bg-purple-50 text-purple-700 border-purple-200' },
    HIRED:       { label: 'Hired',        cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    REJECTED:    { label: 'Not Selected', cls: 'bg-red-50 text-red-700 border-red-200' },
    WITHDRAWN:   { label: 'Withdrawn',    cls: 'bg-gray-50 text-gray-600 border-gray-200' },
  };
  const s = map[status] ?? { label: status, cls: 'bg-gray-50 text-gray-600 border-gray-200' };
  return (
    <span className={`inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full border ${s.cls}`}>
      {s.label}
    </span>
  );
}

interface StatCardProps {
  label: string; value: string | number; icon: React.ElementType;
  gradient: string; iconBg: string; sub?: string;
}
function StatCard({ label, value, icon: Icon, gradient, iconBg, sub }: StatCardProps) {
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

export default function WorkerDashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<WorkerStats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [appsLoading, setAppsLoading] = useState(false);

  // Initial load
  useEffect(() => {
    Promise.all([
      workersApi.getStats().catch(() => null),
      jobsApi.listMyApplications(1, PAGE_SIZE).catch(() => null),
    ]).then(([statsRes, appsRes]) => {
      if (statsRes) setStats(statsRes.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = appsRes as any;
      if (r) { setApplications(r.data ?? []); setTotal(r.meta?.total ?? r.data?.length ?? 0); }
      setLoading(false);
    });
  }, []);

  // Page change
  const handlePageChange = async (p: number) => {
    setPage(p);
    setAppsLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = await jobsApi.listMyApplications(p, PAGE_SIZE) as any;
      setApplications(r.data ?? []);
      setTotal(r.meta?.total ?? r.data?.length ?? 0);
    } finally {
      setAppsLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const profilePercent = !stats ? 0
    : [stats.isProfileComplete, stats.totalJobsDone > 0, stats.totalRatings > 0, stats.totalApplications > 0].filter(Boolean).length * 25;

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-32 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">

      {/* ── Hero welcome banner ── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-6 text-white shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-10 w-32 h-32 rounded-full bg-white blur-2xl" />
        </div>
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1">Welcome back 👋</p>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-emerald-100 text-sm mt-2">
              {stats?.activeApplications
                ? `You have ${stats.activeApplications} active application${stats.activeApplications > 1 ? 's' : ''} awaiting response`
                : 'Start browsing jobs and apply today'}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link href="/marketplace">
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur gap-2">
                <Search className="h-3.5 w-3.5" /> Browse Jobs
              </Button>
            </Link>
            <Link href="/worker/profile">
              <Button size="sm" className="bg-white text-emerald-700 hover:bg-emerald-50 gap-2">
                <User className="h-3.5 w-3.5" /> My Profile
              </Button>
            </Link>
          </div>
        </div>
        {/* Progress bar if profile incomplete */}
        {!stats?.isProfileComplete && (
          <div className="relative mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-emerald-100 font-medium">Profile completion</span>
              <span className="text-white font-bold">{profilePercent}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${profilePercent}%` }} />
            </div>
            <p className="text-emerald-100 text-xs mt-1.5">Complete your profile to get 3× more job offers</p>
          </div>
        )}
      </div>

      {/* ── Profile incomplete alert (mobile fallback) ── */}
      {!stats?.isProfileComplete && (
        <div className="sm:hidden bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-amber-800">Complete your profile</p>
            <p className="text-xs text-amber-600 mt-0.5">{profilePercent}% done</p>
          </div>
          <Link href="/worker/profile">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white text-xs h-7 px-3">Go</Button>
          </Link>
        </div>
      )}

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Jobs Applied" value={stats?.totalApplications ?? 0}
          icon={Briefcase} sub="All time"
          gradient="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900"
          iconBg="bg-blue-500 text-white"
        />
        <StatCard
          label="Active Apps" value={stats?.activeApplications ?? 0}
          icon={Clock} sub="Awaiting response"
          gradient="bg-gradient-to-br from-amber-50 to-orange-100 text-amber-900"
          iconBg="bg-amber-500 text-white"
        />
        <StatCard
          label="Times Hired" value={stats?.hiredCount ?? 0}
          icon={CheckCircle} sub="Successful"
          gradient="bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-900"
          iconBg="bg-emerald-500 text-white"
        />
        <StatCard
          label="Profile Views" value={stats?.profileViews ?? 0}
          icon={Eye} sub="Total views"
          gradient="bg-gradient-to-br from-purple-50 to-violet-100 text-purple-900"
          iconBg="bg-purple-500 text-white"
        />
        <StatCard
          label="Total Earned"
          value={formatCurrency(Number(stats?.totalEarnings ?? 0))}
          icon={IndianRupee} sub="Net earnings"
          gradient="bg-gradient-to-br from-green-50 to-emerald-100 text-green-900"
          iconBg="bg-green-600 text-white"
        />
        <StatCard
          label="Jobs Done" value={stats?.totalJobsDone ?? 0}
          icon={TrendingUp} sub="Completed"
          gradient="bg-gradient-to-br from-indigo-50 to-blue-100 text-indigo-900"
          iconBg="bg-indigo-500 text-white"
        />
        <StatCard
          label="Saved Jobs" value={stats?.savedCount ?? 0}
          icon={Bookmark} sub="Bookmarked"
          gradient="bg-gradient-to-br from-pink-50 to-rose-100 text-pink-900"
          iconBg="bg-pink-500 text-white"
        />
        <StatCard
          label="My Rating"
          value={stats?.rating ? `${Number(stats.rating).toFixed(1)}/5` : 'N/A'}
          icon={Star} sub={stats?.totalRatings ? `${stats.totalRatings} reviews` : 'No ratings yet'}
          gradient="bg-gradient-to-br from-yellow-50 to-amber-100 text-yellow-900"
          iconBg="bg-yellow-500 text-white"
        />
      </div>

      {/* ── Quick actions ── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Browse Jobs',    href: '/marketplace',    icon: Search,   bg: 'bg-emerald-600', text: 'text-white', hover: 'hover:bg-emerald-700' },
            { label: 'Saved Jobs',     href: '/worker/saved',   icon: Bookmark, bg: 'bg-white', text: 'text-gray-700', hover: 'hover:bg-gray-50', border: 'border border-gray-200' },
            { label: 'Edit Profile',   href: '/worker/profile', icon: User,     bg: 'bg-white', text: 'text-gray-700', hover: 'hover:bg-gray-50', border: 'border border-gray-200' },
            { label: 'Settings',       href: '/settings',       icon: Settings, bg: 'bg-white', text: 'text-gray-700', hover: 'hover:bg-gray-50', border: 'border border-gray-200' },
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

      {/* ── Recent Applications with Pagination ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">Recent Applications</h2>
            {total > 0 && <p className="text-xs text-gray-400 mt-0.5">{total} total applications</p>}
          </div>
          <Link href="/worker/applications">
            <Button variant="ghost" size="sm" className="text-emerald-600 text-xs font-semibold hover:bg-emerald-50">
              View all <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {applications.length === 0 && !appsLoading ? (
          <div className="py-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-gray-700 font-semibold">No applications yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-5">Start browsing jobs and apply to get hired</p>
            <Link href="/marketplace">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <Search className="h-4 w-4" /> Browse Jobs
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className={`divide-y divide-gray-50 transition-opacity ${appsLoading ? 'opacity-50' : ''}`}>
              {applications.map((app: Application) => (
                <Link key={app.id} href={`/marketplace/${app.job?.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/80 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center shrink-0 transition-colors">
                    <Briefcase className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate text-sm">{app.job?.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />{app.job?.city}
                      </span>
                      {app.job?.dailyWage && (
                        <span className="text-xs font-semibold text-emerald-600">
                          {formatCurrency(Number(app.job.dailyWage))}/day
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <AppStatusBadge status={app.status} />
                    <span className="text-[11px] text-gray-400">{formatDate(app.appliedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-gray-100">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  totalItems={total}
                  pageSize={PAGE_SIZE}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* ── CTA banner ── */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-bold text-lg">Find Your Next Opportunity</h3>
            <p className="text-emerald-100 text-sm mt-1">Hundreds of new jobs posted daily across India</p>
          </div>
          <Link href="/marketplace">
            <Button size="sm" className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold gap-2 shadow">
              Browse Jobs <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
