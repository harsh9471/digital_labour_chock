'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Briefcase, Plus, Search, MapPin, Users, Zap, Eye,
  ChevronRight, Pencil, X, CheckCircle, Clock,
  Filter, ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jobsApi } from '@/lib/jobs-api';
import { formatCurrency, formatDate } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Job = any;

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'FILLED', label: 'Filled' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CLOSED', label: 'Closed' },
];

const STATUS_CONFIG: Record<string, { cls: string }> = {
  DRAFT:     { cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  PUBLISHED: { cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  ACTIVE:    { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  FILLED:    { cls: 'bg-purple-50 text-purple-700 border-purple-200' },
  COMPLETED: { cls: 'bg-teal-50 text-teal-700 border-teal-200' },
  CLOSED:    { cls: 'bg-orange-50 text-orange-700 border-orange-200' },
  CANCELLED: { cls: 'bg-red-50 text-red-700 border-red-200' },
};

function JobCard({ job, onPublish, onClose }: {
  job: Job;
  onPublish: (id: string) => void;
  onClose: (id: string) => void;
}) {
  const cfg = STATUS_CONFIG[job.status] ?? { cls: 'bg-gray-100 text-gray-600 border-gray-200' };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {job.isUrgent && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
                  <Zap className="h-3 w-3" /> Urgent
                </span>
              )}
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cfg.cls}`}>
                {job.status}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 text-base line-clamp-1">{job.title}</h3>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3 text-gray-400" />
                {job.city}{job.state ? `, ${job.state}` : ''}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Users className="h-3 w-3 text-gray-400" />
                {job.filledCount ?? 0}/{job.slotsAvailable ?? job.workerCount ?? 1} filled
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Eye className="h-3 w-3 text-gray-400" />
                {job._count?.applications ?? 0} applicants
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            {job.dailyWage ? (
              <p className="font-bold text-emerald-600 text-base">
                {formatCurrency(Number(job.dailyWage))}<span className="text-xs font-normal text-gray-400">/day</span>
              </p>
            ) : null}
            <p className="text-xs text-gray-400 mt-0.5">{formatDate(job.createdAt)}</p>
          </div>
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
          <Link href={`/contractor/jobs/${job.id}`}>
            <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
              <Eye className="h-3 w-3" /> View
            </Button>
          </Link>
          <Link href={`/contractor/jobs/${job.id}/edit`}>
            <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
              <Pencil className="h-3 w-3" /> Edit
            </Button>
          </Link>
          {job.status === 'DRAFT' && (
            <Button
              size="sm" className="gap-1.5 h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => onPublish(job.id)}
            >
              <ArrowUpRight className="h-3 w-3" /> Publish
            </Button>
          )}
          {(job.status === 'PUBLISHED' || job.status === 'ACTIVE') && (
            <Button
              variant="outline" size="sm" className="gap-1.5 h-8 text-xs text-orange-500 border-orange-200 hover:bg-orange-50"
              onClick={() => onClose(job.id)}
            >
              <X className="h-3 w-3" /> Close
            </Button>
          )}
          <Link href={`/contractor/jobs/${job.id}/applications`} className="ml-auto">
            <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs text-blue-600">
              Applications ({job._count?.applications ?? 0}) <ChevronRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ContractorJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const load = useCallback(async (p = 1, status = '') => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await jobsApi.listMy({ page: p, limit, status: (status || undefined) as any }) as any;
      setJobs(res.data ?? []);
      setTotal(res.pagination?.total ?? res.total ?? 0);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    load(1, statusFilter);
  }, [statusFilter, load]);

  useEffect(() => { load(page, statusFilter); }, [page, load, statusFilter]);

  const handlePublish = async (jobId: string) => {
    try {
      await jobsApi.publish(jobId);
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'PUBLISHED' } : j));
    } catch { /* ignore */ }
  };

  const handleClose = async (jobId: string) => {
    if (!confirm('Close this job? Workers will no longer be able to apply.')) return;
    try {
      await jobsApi.close(jobId);
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'CLOSED' } : j));
    } catch { /* ignore */ }
  };

  const filtered = search.trim()
    ? jobs.filter(j => {
        const q = search.toLowerCase();
        return j.title?.toLowerCase().includes(q) || j.city?.toLowerCase().includes(q);
      })
    : jobs;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
            My Jobs
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} job{total !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/contractor/jobs/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="h-4 w-4" /> Post New Job
          </Button>
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors border ${
              statusFilter === tab.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2 shrink-0">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(5)].map((_, i) => <div key={i} className="h-40 bg-gray-100 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Briefcase className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-700 text-lg">
            {search || statusFilter ? 'No matching jobs' : 'No jobs posted yet'}
          </h3>
          <p className="text-gray-400 text-sm mt-1 mb-5">
            {search || statusFilter ? 'Try different filters' : 'Post your first job to start hiring workers'}
          </p>
          {!search && !statusFilter && (
            <Link href="/contractor/jobs/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Plus className="h-4 w-4" /> Post a Job
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {filtered.map(job => (
              <JobCard key={job.id} job={job} onPublish={handlePublish} onClose={handleClose} />
            ))}
          </div>

          {totalPages > 1 && !search && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    page === p ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >{p}</button>
              ))}
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
