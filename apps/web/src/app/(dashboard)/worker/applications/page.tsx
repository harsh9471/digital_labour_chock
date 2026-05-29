'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Briefcase, MapPin, Clock, ChevronRight, Search,
  Filter, CheckCircle, XCircle, Eye, Star, RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jobsApi } from '@/lib/jobs-api';
import { formatCurrency, formatDate } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Application = any;

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  SUBMITTED:   { label: 'Applied',      cls: 'bg-blue-50 text-blue-700 border-blue-200',     icon: Clock },
  VIEWED:      { label: 'Viewed',       cls: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Eye },
  SHORTLISTED: { label: 'Shortlisted',  cls: 'bg-purple-50 text-purple-700 border-purple-200', icon: Star },
  HIRED:       { label: 'Hired',        cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  REJECTED:    { label: 'Not Selected', cls: 'bg-red-50 text-red-700 border-red-200',        icon: XCircle },
  WITHDRAWN:   { label: 'Withdrawn',    cls: 'bg-gray-50 text-gray-500 border-gray-200',     icon: RotateCcw },
};

const FILTER_TABS = [
  { value: '', label: 'All' },
  { value: 'SUBMITTED', label: 'Applied' },
  { value: 'VIEWED', label: 'Viewed' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'HIRED', label: 'Hired' },
  { value: 'REJECTED', label: 'Rejected' },
];

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, cls: 'bg-gray-50 text-gray-500 border-gray-200', icon: Clock };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.cls}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

function AppCard({ app, onWithdraw }: { app: Application; onWithdraw: (id: string) => void }) {
  const [withdrawing, setWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    if (!confirm('Withdraw this application?')) return;
    setWithdrawing(true);
    try {
      await jobsApi.withdrawApplication(app.id);
      onWithdraw(app.id);
    } catch {
      setWithdrawing(false);
    }
  };

  const canWithdraw = app.status === 'SUBMITTED' || app.status === 'VIEWED';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Briefcase className="h-5 w-5 text-blue-600" />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link href={`/marketplace/${app.job?.id}`}>
                  <h3 className="font-semibold text-gray-900 text-sm hover:text-blue-600 transition-colors line-clamp-1">
                    {app.job?.title}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {app.job?.contractor?.user?.firstName} {app.job?.contractor?.user?.lastName}
                  {app.job?.contractor?.companyName && ` · ${app.job.contractor.companyName}`}
                </p>
              </div>
              <StatusBadge status={app.status} />
            </div>

            {/* Job details */}
            <div className="flex items-center gap-3 mt-2.5 flex-wrap">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <MapPin className="h-3 w-3" />
                {app.job?.city}{app.job?.state ? `, ${app.job.state}` : ''}
              </div>
              {app.job?.dailyWage && (
                <span className="text-xs font-semibold text-emerald-600">
                  {formatCurrency(Number(app.job.dailyWage))}/day
                </span>
              )}
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                Applied {formatDate(app.appliedAt)}
              </div>
            </div>

            {/* Cover note */}
            {app.coverNote && (
              <p className="mt-2 text-xs text-gray-500 line-clamp-2 bg-gray-50 rounded-lg px-3 py-2 italic">
                &ldquo;{app.coverNote}&rdquo;
              </p>
            )}

            {/* Contractor note */}
            {app.contractorNote && (
              <div className="mt-2 flex items-start gap-2 bg-blue-50 rounded-lg px-3 py-2">
                <AlertCircle className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700">{app.contractorNote}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3">
              <Link href={`/marketplace/${app.job?.id}`}>
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                  View Job <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
              {canWithdraw && (
                <Button
                  variant="outline" size="sm"
                  className="gap-1.5 h-8 text-xs text-red-500 border-red-200 hover:bg-red-50"
                  onClick={handleWithdraw}
                  disabled={withdrawing}
                >
                  <XCircle className="h-3 w-3" />
                  {withdrawing ? 'Withdrawing...' : 'Withdraw'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
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
      const res = await jobsApi.listMyApplications(p, limit, status || undefined) as any;
      setApps(res.data ?? []);
      setTotal(res.pagination?.total ?? res.total ?? 0);
    } catch {
      setApps([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    load(1, statusFilter);
  }, [statusFilter, load]);

  useEffect(() => {
    load(page, statusFilter);
  }, [page, load, statusFilter]);

  const handleWithdraw = (id: string) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status: 'WITHDRAWN' } : a));
  };

  const filtered = search.trim()
    ? apps.filter(a => {
        const q = search.toLowerCase();
        return (
          a.job?.title?.toLowerCase().includes(q) ||
          a.job?.city?.toLowerCase().includes(q) ||
          a.job?.contractor?.companyName?.toLowerCase().includes(q)
        );
      })
    : apps;

  const totalPages = Math.ceil(total / limit);

  // Status counts for tab badges
  const statusCounts = FILTER_TABS.slice(1).reduce((acc, tab) => {
    acc[tab.value] = apps.filter(a => a.status === tab.value).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
            My Applications
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} application{total !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/marketplace">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" /> Find Jobs
          </Button>
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors border ${
              statusFilter === tab.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            {tab.value && statusCounts[tab.value] > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                statusFilter === tab.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {statusCounts[tab.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by job title, city, company..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-36 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Briefcase className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-700 text-lg">
            {search || statusFilter ? 'No matching applications' : 'No applications yet'}
          </h3>
          <p className="text-gray-400 text-sm mt-1 mb-5">
            {search || statusFilter
              ? 'Try changing your filters'
              : 'Browse the marketplace and apply for jobs'}
          </p>
          {!search && !statusFilter && (
            <Link href="/marketplace">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Browse Jobs</Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {filtered.map(app => (
              <AppCard key={app.id} app={app} onWithdraw={handleWithdraw} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && !search && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                Previous
              </Button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
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
              ))}
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
