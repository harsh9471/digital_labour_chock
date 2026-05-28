'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, MapPin, X, ChevronLeft, ChevronRight,
  Briefcase, Clock, Zap, Bookmark, BookmarkCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth.store';
import { jobsApi } from '@/lib/jobs-api';
import { workersApi } from '@/lib/workers-api';
import { formatCurrency, debounce } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Job = any;

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Surat'];
const JOB_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'CONTRACT', label: 'Contract' },
];
const SKILL_CATEGORIES = ['Construction', 'Manufacturing', 'Domestic', 'Transport', 'Technology', 'Agriculture'];

function JobCard({
  job, savedIds, onSave, onUnsave,
}: {
  job: Job; savedIds: Set<string>;
  onSave: (id: string) => void; onUnsave: (id: string) => void;
}) {
  const isSaved = savedIds.has(job.id);
  const { user } = useAuthStore();
  const isWorker = user?.role === 'WORKER';

  return (
    <Link href={`/marketplace/${job.id}`} className="block">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Briefcase className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors truncate">
                    {job.title}
                  </h3>
                  {job.isUrgent && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                      <Zap className="h-3 w-3" /> Urgent
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {job.contractor?.user?.firstName} {job.contractor?.user?.lastName}
                  {job.site && ` · ${job.site.name}`}
                </p>
              </div>
              {isWorker && (
                <button
                  onClick={e => {
                    e.preventDefault();
                    isSaved ? onUnsave(job.id) : onSave(job.id);
                  }}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                >
                  {isSaved
                    ? <BookmarkCheck className="h-4 w-4 text-blue-600" />
                    : <Bookmark className="h-4 w-4 text-gray-400" />}
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs text-gray-500">{job.city}, {job.state}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs text-gray-500">{job.jobType?.charAt(0) + job.jobType?.slice(1).toLowerCase()}</span>
              </div>
              {job.requiredSkill && (
                <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full">
                  {job.requiredSkill.icon} {job.requiredSkill.name}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between mt-3">
              <div>
                {job.dailyWage && (
                  <span className="font-bold text-emerald-600 text-base">
                    {formatCurrency(Number(job.dailyWage))}<span className="text-xs font-normal text-gray-400">/day</span>
                  </span>
                )}
                {job.weeklyWage && !job.dailyWage && (
                  <span className="font-bold text-emerald-600 text-base">
                    {formatCurrency(Number(job.weeklyWage))}<span className="text-xs font-normal text-gray-400">/week</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{job._count?.applications ?? 0} applied</span>
                <span>{job.workerCount - (job.filledCount ?? 0)} slots left</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FiltersPanel({
  filters, onChange, onReset,
}: {
  filters: Record<string, string | number>; onChange: (k: string, v: string | number) => void; onReset: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-sm">Filters</h3>
        <button onClick={onReset} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Reset all</button>
      </div>

      {/* City */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">City</p>
        <select
          value={String(filters.city ?? '')}
          onChange={e => onChange('city', e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Cities</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Job Type */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Job Type</p>
        <div className="flex flex-wrap gap-2">
          {JOB_TYPES.map(jt => (
            <button key={jt.value}
              onClick={() => onChange('jobType', jt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filters.jobType === jt.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {jt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skill Category */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skill Category</p>
        <div className="flex flex-wrap gap-2">
          {SKILL_CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => onChange('skillCategory', filters.skillCategory === cat ? '' : cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filters.skillCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Wage Range */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Min Daily Wage</p>
        <input type="range" min={0} max={3000} step={100}
          value={Number(filters.minWage ?? 0)}
          onChange={e => onChange('minWage', Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
          <span>₹0</span>
          <span className="font-semibold text-blue-600">₹{filters.minWage || 0}+/day</span>
          <span>₹3000</span>
        </div>
      </div>

      {/* Urgent only */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">Urgent Jobs Only</p>
          <p className="text-xs text-gray-400">High priority, immediate hiring</p>
        </div>
        <button
          onClick={() => onChange('isUrgent', filters.isUrgent ? '' : 'true')}
          className={`relative w-11 h-6 rounded-full transition-colors ${filters.isUrgent ? 'bg-orange-500' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${filters.isUrgent ? 'translate-x-5' : ''}`} />
        </button>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const { toast } = useToast();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string | number>>({
    city: '', jobType: '', skillCategory: '', minWage: 0, isUrgent: '',
  });
  const [page, setPage] = useState(1);

  const fetchJobs = useCallback(async (searchTerm: string, activeFilters: typeof filters, activePage: number) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page: activePage, limit: 12 };
      if (searchTerm) params.search = searchTerm;
      Object.entries(activeFilters).forEach(([k, v]) => { if (v) params[k] = v; });

      const res = await jobsApi.list(params as Parameters<typeof jobsApi.list>[0]);
      setJobs(res.data ?? []);
      setMeta(res.meta ?? { total: 0, page: 1, totalPages: 1 });
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debounce((...args: any[]) => fetchJobs(args[0], args[1], args[2]), 400),
    [fetchJobs],
  );

  useEffect(() => {
    debouncedFetch(search, filters, page);
  }, [search, filters, page, debouncedFetch]);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSave = async (jobId: string) => {
    try {
      await workersApi.saveJob(jobId);
      setSavedIds(prev => new Set([...prev, jobId]));
      toast({ title: 'Job saved' });
    } catch {
      toast({ title: 'Error', description: 'Could not save job', variant: 'destructive' });
    }
  };

  const handleUnsave = async (jobId: string) => {
    try {
      await workersApi.unsaveJob(jobId);
      setSavedIds(prev => { const s = new Set(prev); s.delete(jobId); return s; });
      toast({ title: 'Job removed from saved' });
    } catch {
      toast({ title: 'Error', description: 'Could not unsave job', variant: 'destructive' });
    }
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 0).length;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Marketplace</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {meta.total > 0 ? `${meta.total} jobs available across India` : 'Searching jobs...'}
        </p>
      </div>

      {/* Search + Filter bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title, skill, or city..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
          {search && (
            <button onClick={() => { setSearch(''); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
            activeFilterCount > 0
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Filters sidebar (desktop) */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-72 shrink-0`}>
          <FiltersPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={() => { setFilters({ city: '', jobType: '', skillCategory: '', minWage: 0, isUrgent: '' }); setPage(1); }}
          />
        </div>

        {/* Job list */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <Briefcase className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-600">No jobs found</h3>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search term</p>
              <button
                onClick={() => { setFilters({ city: '', jobType: '', skillCategory: '', minWage: 0, isUrgent: '' }); setSearch(''); }}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                {jobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    savedIds={savedIds}
                    onSave={handleSave}
                    onUnsave={handleUnsave}
                  />
                ))}
              </div>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                      const pageNum = page <= 3 ? i + 1 : page - 2 + i;
                      if (pageNum > meta.totalPages) return null;
                      return (
                        <button key={pageNum} onClick={() => setPage(pageNum)}
                          className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                            pageNum === page ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                    disabled={page === meta.totalPages}
                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-gray-400">
                    {page} / {meta.totalPages} pages
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
