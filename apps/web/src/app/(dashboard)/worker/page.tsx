'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase, Star, Eye, DollarSign, CheckCircle, Clock,
  TrendingUp, Bookmark, AlertCircle, ArrowRight, MapPin,
  User, Settings, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: string | number; icon: React.ElementType; color: string; sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function AppStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    SUBMITTED:   { label: 'Applied',      cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    VIEWED:      { label: 'Viewed',       cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    SHORTLISTED: { label: 'Shortlisted',  cls: 'bg-purple-50 text-purple-700 border-purple-200' },
    HIRED:       { label: 'Hired',        cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    REJECTED:    { label: 'Not Selected', cls: 'bg-red-50 text-red-700 border-red-200' },
    WITHDRAWN:   { label: 'Withdrawn',    cls: 'bg-gray-50 text-gray-500 border-gray-200' },
  };
  const s = map[status] ?? { label: status, cls: 'bg-gray-50 text-gray-500 border-gray-200' };
  return (
    <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border ${s.cls}`}>
      {s.label}
    </span>
  );
}

export default function WorkerDashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<WorkerStats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      workersApi.getStats().catch(() => null),
      jobsApi.listMyApplications(1, 5).catch(() => null),
    ]).then(([statsRes, appsRes]) => {
      if (statsRes) setStats(statsRes.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (appsRes) setApplications((appsRes as any).data ?? []);
      setLoading(false);
    });
  }, []);

  const profilePercent = !stats ? 0
    : [stats.isProfileComplete, stats.totalJobsDone > 0, stats.totalRatings > 0, stats.totalApplications > 0].filter(Boolean).length * 25;

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName ?? 'Worker'}!
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Here&apos;s your work activity overview</p>
        </div>
        <Link href="/worker/profile">
          <Button variant="outline" size="sm" className="gap-2">
            <User className="h-4 w-4" /> My Profile
          </Button>
        </Link>
      </div>

      {/* Profile completion */}
      {!stats?.isProfileComplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">Complete your profile to get more job offers</p>
            <div className="mt-2 h-2 bg-amber-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${profilePercent}%` }} />
            </div>
            <p className="text-xs text-amber-600 mt-1">{profilePercent}% complete</p>
          </div>
          <Link href="/worker/profile">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white shrink-0">
              Complete
            </Button>
          </Link>
        </div>
      )}

      {/* Stats row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Jobs Applied"  value={stats?.totalApplications ?? 0} icon={Briefcase}   color="bg-blue-500"    sub="All time" />
        <StatCard label="Active Apps"   value={stats?.activeApplications ?? 0} icon={Clock}       color="bg-amber-500"   sub="Awaiting response" />
        <StatCard label="Times Hired"   value={stats?.hiredCount ?? 0}        icon={CheckCircle} color="bg-emerald-500" sub="Successful" />
        <StatCard label="Profile Views" value={stats?.profileViews ?? 0}      icon={Eye}         color="bg-purple-500"  sub="Total views" />
      </div>

      {/* Stats row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Earned"  value={formatCurrency(Number(stats?.totalEarnings ?? 0))} icon={DollarSign} color="bg-green-600" sub="Net earnings" />
        <StatCard label="Jobs Done"     value={stats?.totalJobsDone ?? 0}    icon={TrendingUp}  color="bg-indigo-500" sub="Completed" />
        <StatCard label="Saved Jobs"    value={stats?.savedCount ?? 0}       icon={Bookmark}    color="bg-pink-500"   sub="Bookmarked" />
        <StatCard
          label="My Rating"
          value={stats?.rating ? `${Number(stats.rating).toFixed(1)}/5` : 'N/A'}
          icon={Star} color="bg-yellow-500"
          sub={stats?.totalRatings ? `${stats.totalRatings} reviews` : 'No ratings yet'}
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Browse Jobs',  href: '/marketplace',    icon: Briefcase, cls: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100' },
          { label: 'Saved Jobs',   href: '/worker/saved',   icon: Bookmark,  cls: 'bg-pink-50 text-pink-700 hover:bg-pink-100 border-pink-100' },
          { label: 'Edit Profile', href: '/worker/profile', icon: User,      cls: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100' },
          { label: 'Settings',     href: '/settings',       icon: Settings,  cls: 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href}>
              <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border ${item.cls} transition-colors text-sm font-medium`}>
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
                <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-40" />
              </button>
            </Link>
          );
        })}
      </div>

      {/* Recent applications */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Applications</h2>
          <Link href="/worker/applications">
            <Button variant="ghost" size="sm" className="text-blue-600 text-xs">
              View all <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="py-12 text-center">
            <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No applications yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">Browse the marketplace and apply for jobs</p>
            <Link href="/marketplace">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Browse Jobs</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {applications.map((app: Application) => (
              <Link key={app.id} href={`/marketplace/${app.job?.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate text-sm">{app.job?.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{app.job?.city}</span>
                    {app.job?.dailyWage && (
                      <span className="text-xs font-semibold text-emerald-600">
                        {formatCurrency(Number(app.job.dailyWage))}/day
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <AppStatusBadge status={app.status} />
                  <span className="text-xs text-gray-400">{formatDate(app.appliedAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA banner */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-bold text-lg">Find Your Next Job</h3>
            <p className="text-emerald-100 text-sm mt-1">Hundreds of new jobs posted daily across India</p>
          </div>
          <Link href="/marketplace">
            <Button size="md" className="bg-white text-emerald-700 hover:bg-emerald-50 shrink-0">
              Browse Jobs <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
