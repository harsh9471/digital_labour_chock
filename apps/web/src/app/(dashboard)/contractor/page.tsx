'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase, Users, Star, CheckCircle, Clock, Eye,
  TrendingUp, Plus, ChevronRight, MapPin, Zap,
  FileText, ArrowRight, DollarSign, Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { jobsApi } from '@/lib/jobs-api';
import { formatCurrency, formatDate } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Job = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Application = any;

interface ContractorStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  hiredWorkers: number;
  totalSpent: number;
  avgApplicationsPerJob: number;
}

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

function JobStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    DRAFT:     { label: 'Draft',     cls: 'bg-gray-100 text-gray-600 border-gray-200' },
    PUBLISHED: { label: 'Published', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    ACTIVE:    { label: 'Active',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    FILLED:    { label: 'Filled',    cls: 'bg-purple-50 text-purple-700 border-purple-200' },
    COMPLETED: { label: 'Completed', cls: 'bg-teal-50 text-teal-700 border-teal-200' },
    CLOSED:    { label: 'Closed',    cls: 'bg-orange-50 text-orange-700 border-orange-200' },
    CANCELLED: { label: 'Cancelled', cls: 'bg-red-50 text-red-700 border-red-200' },
  };
  const s = map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600 border-gray-200' };
  return (
    <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border ${s.cls}`}>
      {s.label}
    </span>
  );
}

function AppStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    SUBMITTED:   { label: 'New',          cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    VIEWED:      { label: 'Viewed',       cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    SHORTLISTED: { label: 'Shortlisted',  cls: 'bg-purple-50 text-purple-700 border-purple-200' },
    HIRED:       { label: 'Hired',        cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    REJECTED:    { label: 'Rejected',     cls: 'bg-red-50 text-red-700 border-red-200' },
    WITHDRAWN:   { label: 'Withdrawn',    cls: 'bg-gray-50 text-gray-500 border-gray-200' },
  };
  const s = map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600 border-gray-200' };
  return (
    <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border ${s.cls}`}>
      {s.label}
    </span>
  );
}

export default function ContractorDashboardPage() {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      jobsApi.listMy({ limit: 5 }).catch(() => null),
    ]).then(([jobsRes]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (jobsRes) setJobs((jobsRes as any).data ?? []);
      setLoading(false);
    });
  }, []);

  // Compute stats from loaded jobs
  const stats: ContractorStats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === 'ACTIVE' || j.status === 'PUBLISHED').length,
    totalApplications: jobs.reduce((s: number, j: Job) => s + (j._count?.applications ?? 0), 0),
    pendingApplications: 0,
    hiredWorkers: jobs.reduce((s: number, j: Job) => s + (j.filledCount ?? 0), 0),
    totalSpent: jobs.reduce((s: number, j: Job) => s + (Number(j.dailyWage ?? 0) * (j.filledCount ?? 0)), 0),
    avgApplicationsPerJob: jobs.length > 0
      ? Math.round(jobs.reduce((s: number, j: Job) => s + (j._count?.applications ?? 0), 0) / jobs.length)
      : 0,
  };

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
            Welcome, {user?.firstName ?? 'Contractor'}!
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your jobs and hiring activity</p>
        </div>
        <Link href="/contractor/jobs/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="h-4 w-4" /> Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Jobs"       value={stats.totalJobs}          icon={Briefcase}   color="bg-blue-500"    sub="All time" />
        <StatCard label="Active Jobs"      value={stats.activeJobs}         icon={Zap}         color="bg-emerald-500" sub="Live now" />
        <StatCard label="Total Applicants" value={stats.totalApplications}  icon={Users}       color="bg-purple-500"  sub="Across all jobs" />
        <StatCard label="Workers Hired"    value={stats.hiredWorkers}       icon={CheckCircle} color="bg-teal-500"    sub="Successful hires" />
      </div>

      {/* Stats row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Avg Apps/Job"  value={stats.avgApplicationsPerJob} icon={TrendingUp}  color="bg-indigo-500" sub="Interest level" />
        <StatCard label="Total Spent"   value={formatCurrency(stats.totalSpent)} icon={DollarSign} color="bg-green-600" sub="Wage payouts" />
        <StatCard label="Pending Review" value={stats.pendingApplications ?? 0} icon={Clock}   color="bg-amber-500" sub="Need action" />
        <StatCard label="Avg Rating"    value="4.6/5"                       icon={Star}        color="bg-yellow-500" sub="Worker satisfaction" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Post a Job',    href: '/contractor/jobs/new',       icon: Plus,       cls: 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600' },
          { label: 'My Jobs',       href: '/contractor/jobs',           icon: Briefcase,  cls: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200' },
          { label: 'Applications',  href: '/contractor/applications',   icon: FileText,   cls: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200' },
          { label: 'Find Workers',  href: '/workers',                   icon: Users,      cls: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200' },
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

      {/* Recent Jobs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Jobs</h2>
          <Link href="/contractor/jobs">
            <Button variant="ghost" size="sm" className="text-blue-600 text-xs">
              View all <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="py-12 text-center">
            <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No jobs posted yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">Post your first job to start hiring workers</p>
            <Link href="/contractor/jobs/new">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Plus className="h-4 w-4" /> Post a Job
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {jobs.map((job: Job) => (
              <Link key={job.id} href={`/contractor/jobs/${job.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate text-sm">{job.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="h-3 w-3" />{job.city}
                    </span>
                    {job.dailyWage && (
                      <span className="text-xs font-semibold text-emerald-600">
                        {formatCurrency(Number(job.dailyWage))}/day
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {job._count?.applications ?? 0} applicants
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <JobStatusBadge status={job.status} />
                  <span className="text-xs text-gray-400">{formatDate(job.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA banners */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
          <Building2 className="h-8 w-8 text-blue-300 mb-3" />
          <h3 className="font-bold text-base">Browse Skilled Workers</h3>
          <p className="text-blue-100 text-sm mt-1 mb-4">Find verified workers for your projects</p>
          <Link href="/workers">
            <Button size="sm" className="bg-white text-blue-700 hover:bg-blue-50">
              Find Workers <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white">
          <Eye className="h-8 w-8 text-emerald-300 mb-3" />
          <h3 className="font-bold text-base">Review Applications</h3>
          <p className="text-emerald-100 text-sm mt-1 mb-4">Shortlist and hire the best candidates</p>
          <Link href="/contractor/applications">
            <Button size="sm" className="bg-white text-emerald-700 hover:bg-emerald-50">
              View Applications <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
