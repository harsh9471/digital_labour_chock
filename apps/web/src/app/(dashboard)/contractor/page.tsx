'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase, Users, Star, CheckCircle, Clock,
  TrendingUp, Plus, ChevronRight, MapPin, Zap,
  FileText, ArrowRight, IndianRupee, Building2, Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { useAuthStore } from '@/store/auth.store';
import { jobsApi } from '@/lib/jobs-api';
import { formatCurrency, formatDate } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Job = any;

const PAGE_SIZE = 5;

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
    <span className={`inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full border ${s.cls}`}>
      {s.label}
    </span>
  );
}

export default function ContractorDashboardPage() {
  const { user } = useAuthStore();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(false);

  useEffect(() => {
    jobsApi.listMy({ limit: 100 }).catch(() => null).then((res) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const all = (res as any)?.data ?? [];
      setAllJobs(all);
      setTotal(all.length);
      setJobs(all.slice(0, PAGE_SIZE));
      setLoading(false);
    });
  }, []);

  const handlePageChange = (p: number) => {
    setPage(p);
    setJobsLoading(true);
    const start = (p - 1) * PAGE_SIZE;
    setTimeout(() => {
      setJobs(allJobs.slice(start, start + PAGE_SIZE));
      setJobsLoading(false);
    }, 150);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const stats = {
    totalJobs: allJobs.length,
    activeJobs: allJobs.filter((j: Job) => j.status === 'ACTIVE' || j.status === 'PUBLISHED').length,
    totalApps: allJobs.reduce((s: number, j: Job) => s + (j._count?.applications ?? 0), 0),
    hiredWorkers: allJobs.reduce((s: number, j: Job) => s + (j.filledCount ?? 0), 0),
    totalSpent: allJobs.reduce((s: number, j: Job) => s + (Number(j.dailyWage ?? 0) * (j.filledCount ?? 0)), 0),
    avgApps: allJobs.length > 0
      ? Math.round(allJobs.reduce((s: number, j: Job) => s + (j._count?.applications ?? 0), 0) / allJobs.length)
      : 0,
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-36 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* ── Hero welcome banner ── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-16 w-32 h-32 rounded-full bg-white blur-2xl" />
        </div>
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Contractor Portal 🏗️</p>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome, {user?.firstName}!
            </h1>
            <p className="text-blue-100 text-sm mt-2">
              {stats.activeJobs > 0
                ? `${stats.activeJobs} active job${stats.activeJobs > 1 ? 's' : ''} · ${stats.totalApps} total applicants`
                : 'Post your first job to start hiring'}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link href="/contractor/applications">
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur gap-2">
                <FileText className="h-3.5 w-3.5" /> Applications
              </Button>
            </Link>
            <Link href="/contractor/jobs/new">
              <Button size="sm" className="bg-white text-blue-700 hover:bg-blue-50 gap-2 font-semibold">
                <Plus className="h-3.5 w-3.5" /> Post New Job
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick summary strip */}
        <div className="relative mt-5 grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
          {[
            { label: 'Active Jobs', value: stats.activeJobs },
            { label: 'Total Applicants', value: stats.totalApps },
            { label: 'Hired Workers', value: stats.hiredWorkers },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className="text-xl font-bold">{item.value}</p>
              <p className="text-blue-200 text-xs mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total Jobs" value={stats.totalJobs}
          icon={Briefcase} sub="All time"
          gradient="bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-900"
          iconBg="bg-blue-500 text-white"
        />
        <StatCard
          label="Active Jobs" value={stats.activeJobs}
          icon={Zap} sub="Live now"
          gradient="bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-900"
          iconBg="bg-emerald-500 text-white"
        />
        <StatCard
          label="Total Applicants" value={stats.totalApps}
          icon={Users} sub="Across all jobs"
          gradient="bg-gradient-to-br from-purple-50 to-violet-100 text-purple-900"
          iconBg="bg-purple-500 text-white"
        />
        <StatCard
          label="Workers Hired" value={stats.hiredWorkers}
          icon={CheckCircle} sub="Successful hires"
          gradient="bg-gradient-to-br from-teal-50 to-cyan-100 text-teal-900"
          iconBg="bg-teal-500 text-white"
        />
        <StatCard
          label="Avg Apps/Job" value={stats.avgApps}
          icon={TrendingUp} sub="Interest level"
          gradient="bg-gradient-to-br from-indigo-50 to-blue-100 text-indigo-900"
          iconBg="bg-indigo-500 text-white"
        />
        <StatCard
          label="Total Spent" value={formatCurrency(stats.totalSpent)}
          icon={IndianRupee} sub="Wage payouts"
          gradient="bg-gradient-to-br from-green-50 to-emerald-100 text-green-900"
          iconBg="bg-green-600 text-white"
        />
        <StatCard
          label="Pending Review" value={0}
          icon={Clock} sub="Need action"
          gradient="bg-gradient-to-br from-amber-50 to-orange-100 text-amber-900"
          iconBg="bg-amber-500 text-white"
        />
        <StatCard
          label="Avg Rating" value="4.6/5"
          icon={Star} sub="Worker satisfaction"
          gradient="bg-gradient-to-br from-yellow-50 to-amber-100 text-yellow-900"
          iconBg="bg-yellow-500 text-white"
        />
      </div>

      {/* ── Quick actions ── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Post a Job',   href: '/contractor/jobs/new',     icon: Plus,      bg: 'bg-blue-600', text: 'text-white', hover: 'hover:bg-blue-700' },
            { label: 'My Jobs',      href: '/contractor/jobs',         icon: Briefcase, bg: 'bg-white', text: 'text-gray-700', hover: 'hover:bg-gray-50', border: 'border border-gray-200' },
            { label: 'Applications', href: '/contractor/applications', icon: FileText,  bg: 'bg-white', text: 'text-gray-700', hover: 'hover:bg-gray-50', border: 'border border-gray-200' },
            { label: 'Find Workers', href: '/workers',                 icon: Users,     bg: 'bg-white', text: 'text-gray-700', hover: 'hover:bg-gray-50', border: 'border border-gray-200' },
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

      {/* ── Recent Jobs with Pagination ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">My Jobs</h2>
            {total > 0 && <p className="text-xs text-gray-400 mt-0.5">{total} total jobs posted</p>}
          </div>
          <Link href="/contractor/jobs">
            <Button variant="ghost" size="sm" className="text-blue-600 text-xs font-semibold hover:bg-blue-50">
              View all <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {jobs.length === 0 && !jobsLoading ? (
          <div className="py-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-7 w-7 text-blue-400" />
            </div>
            <p className="text-gray-700 font-semibold">No jobs posted yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-5">Post your first job to start hiring workers</p>
            <Link href="/contractor/jobs/new">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Plus className="h-4 w-4" /> Post a Job
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className={`divide-y divide-gray-50 transition-opacity ${jobsLoading ? 'opacity-50' : ''}`}>
              {jobs.map((job: Job) => (
                <Link key={job.id} href={`/contractor/jobs/${job.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/80 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate text-sm">{job.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />{job.city}
                      </span>
                      {job.dailyWage && (
                        <span className="text-xs font-semibold text-emerald-600">
                          {formatCurrency(Number(job.dailyWage))}/day
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Users className="h-3 w-3" />
                        {job._count?.applications ?? 0} applicants
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <JobStatusBadge status={job.status} />
                    <span className="text-[11px] text-gray-400">{formatDate(job.createdAt)}</span>
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

      {/* ── CTA banners ── */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-md">
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
          <Building2 className="h-8 w-8 text-blue-300 mb-3" />
          <h3 className="font-bold text-base">Browse Skilled Workers</h3>
          <p className="text-blue-100 text-sm mt-1 mb-4">Find verified workers for your projects</p>
          <Link href="/workers">
            <Button size="sm" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold gap-2">
              Find Workers <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-700 p-5 text-white shadow-md">
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
          <Eye className="h-8 w-8 text-emerald-300 mb-3" />
          <h3 className="font-bold text-base">Review Applications</h3>
          <p className="text-emerald-100 text-sm mt-1 mb-4">Shortlist and hire the best candidates</p>
          <Link href="/contractor/applications">
            <Button size="sm" className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold gap-2">
              View Applications <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
