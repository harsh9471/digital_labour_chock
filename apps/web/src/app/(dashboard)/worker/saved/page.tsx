'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Bookmark, MapPin, Briefcase, Clock, Zap,
  Search, ArrowRight, SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { workersApi } from '@/lib/workers-api';
import { formatCurrency, formatDate } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SavedJobEntry = any;

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full Time', PART_TIME: 'Part Time', CONTRACT: 'Contract',
  DAILY_WAGE: 'Daily Wage', SEASONAL: 'Seasonal',
};

const SKILL_CAT_COLORS: Record<string, string> = {
  CONSTRUCTION: 'bg-orange-100 text-orange-700',
  ELECTRICAL:   'bg-yellow-100 text-yellow-700',
  PLUMBING:     'bg-blue-100 text-blue-700',
  CARPENTRY:    'bg-amber-100 text-amber-700',
  PAINTING:     'bg-pink-100 text-pink-700',
  WELDING:      'bg-red-100 text-red-700',
  MASONRY:      'bg-stone-100 text-stone-700',
  GENERAL:      'bg-gray-100 text-gray-600',
};

function JobCard({ entry, onUnsave }: { entry: SavedJobEntry; onUnsave: (jobId: string) => void }) {
  const job = entry.job ?? entry;
  const catColor = SKILL_CAT_COLORS[job?.skillCategory] ?? 'bg-gray-100 text-gray-600';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {job?.isUrgent && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
                  <Zap className="h-3 w-3" /> Urgent
                </span>
              )}
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${catColor}`}>
                {job?.skillCategory?.replace('_', ' ') ?? 'General'}
              </span>
            </div>
            <Link href={`/marketplace/${job?.id}`}>
              <h3 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors line-clamp-1">
                {job?.title ?? 'Job Title'}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 mt-0.5 truncate">
              {job?.contractor?.user?.firstName} {job?.contractor?.user?.lastName}
              {job?.contractor?.companyName && ` · ${job?.contractor?.companyName}`}
            </p>
          </div>
          <button
            onClick={() => onUnsave(job?.id)}
            title="Remove from saved"
            className="p-2 rounded-xl text-blue-500 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
          >
            <Bookmark className="h-5 w-5 fill-current" />
          </button>
        </div>

        {/* Info row */}
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            {job?.city}{job?.state ? `, ${job?.state}` : ''}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            {JOB_TYPE_LABELS[job?.jobType] ?? job?.jobType}
          </div>
          {job?.slotsAvailable > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Briefcase className="h-3.5 w-3.5 text-gray-400" />
              {job?.slotsAvailable} slots
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <div>
            {job?.dailyWage ? (
              <span className="text-lg font-bold text-emerald-600">
                {formatCurrency(Number(job.dailyWage))}<span className="text-xs font-normal text-gray-400">/day</span>
              </span>
            ) : job?.totalBudget ? (
              <span className="text-lg font-bold text-emerald-600">
                {formatCurrency(Number(job.totalBudget))}<span className="text-xs font-normal text-gray-400"> total</span>
              </span>
            ) : null}
            <p className="text-xs text-gray-400 mt-0.5">Saved {formatDate(entry.createdAt)}</p>
          </div>
          <Link href={`/marketplace/${job?.id}`}>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
              View Job <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SavedJobsPage() {
  const [saved, setSaved] = useState<SavedJobEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await workersApi.getSavedJobs(p, limit) as any;
      setSaved(res.data ?? []);
      setTotal(res.pagination?.total ?? res.total ?? 0);
    } catch {
      setSaved([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [load, page]);

  const handleUnsave = async (jobId: string) => {
    try {
      await workersApi.unsaveJob(jobId);
      setSaved(prev => prev.filter(e => (e.job?.id ?? e.id) !== jobId));
      setTotal(t => t - 1);
    } catch { /* ignore */ }
  };

  const filtered = search.trim()
    ? saved.filter(e => {
        const job = e.job ?? e;
        const q = search.toLowerCase();
        return (
          job?.title?.toLowerCase().includes(q) ||
          job?.city?.toLowerCase().includes(q) ||
          job?.skillCategory?.toLowerCase().includes(q)
        );
      })
    : saved;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-blue-600" />
            Saved Jobs
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} job{total !== 1 ? 's' : ''} bookmarked</p>
        </div>
        <Link href="/marketplace">
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Browse More Jobs
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search saved jobs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-52 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Bookmark className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-700 text-lg">
            {search ? 'No matching saved jobs' : 'No saved jobs yet'}
          </h3>
          <p className="text-gray-400 text-sm mt-1 mb-5">
            {search ? 'Try a different search term' : 'Bookmark jobs from the marketplace to find them here later'}
          </p>
          {!search && (
            <Link href="/marketplace">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                Browse Jobs <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(entry => (
              <JobCard key={entry.id} entry={entry} onUnsave={handleUnsave} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && !search && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline" size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      page === p
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <Button
                variant="outline" size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
