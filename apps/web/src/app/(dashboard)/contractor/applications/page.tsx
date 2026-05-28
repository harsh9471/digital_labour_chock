'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Users, Search, Filter, ChevronRight, MapPin,
  Star, CheckCircle, XCircle, Eye, Clock, Briefcase,
  UserCheck, Phone, MessageSquare, ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jobsApi } from '@/lib/jobs-api';
import { formatDate } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Application = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Job = any;

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  SUBMITTED:   { label: 'New',          cls: 'bg-blue-50 text-blue-700 border-blue-200',       icon: Clock },
  VIEWED:      { label: 'Viewed',       cls: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Eye },
  SHORTLISTED: { label: 'Shortlisted',  cls: 'bg-purple-50 text-purple-700 border-purple-200', icon: Star },
  HIRED:       { label: 'Hired',        cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  REJECTED:    { label: 'Rejected',     cls: 'bg-red-50 text-red-700 border-red-200',          icon: XCircle },
  WITHDRAWN:   { label: 'Withdrawn',    cls: 'bg-gray-50 text-gray-500 border-gray-200',       icon: Clock },
};

const FILTER_TABS = [
  { value: '', label: 'All' },
  { value: 'SUBMITTED', label: 'New' },
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
      <Icon className="h-3 w-3" /> {cfg.label}
    </span>
  );
}

function WorkerCard({ app, jobId, onStatusChange }: {
  app: Application;
  jobId: string;
  onStatusChange: (appId: string, status: string) => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState(app.contractorNote ?? '');
  const worker = app.worker;
  const workerUser = worker?.user;

  const handleStatus = async (status: 'SHORTLISTED' | 'HIRED' | 'REJECTED') => {
    setUpdating(true);
    try {
      await jobsApi.updateApplicationStatus(jobId, app.id, status, note || undefined);
      onStatusChange(app.id, status);
    } catch { /* ignore */ }
    finally { setUpdating(false); }
  };

  const initials = workerUser
    ? `${workerUser.firstName?.[0] ?? ''}${workerUser.lastName?.[0] ?? ''}`
    : '?';

  const canAct = app.status !== 'WITHDRAWN' && app.status !== 'HIRED';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {initials}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {workerUser?.firstName} {workerUser?.lastName}
                </h3>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {worker?.city && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="h-3 w-3" /> {worker.city}
                    </span>
                  )}
                  {worker?.rating && (
                    <span className="flex items-center gap-1 text-xs text-yellow-600 font-semibold">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {Number(worker.rating).toFixed(1)} ({worker.totalRatings ?? 0})
                    </span>
                  )}
                  {worker?.experienceYears > 0 && (
                    <span className="text-xs text-gray-400">{worker.experienceYears}y exp</span>
                  )}
                </div>
              </div>
              <StatusBadge status={app.status} />
            </div>

            {/* Skills */}
            {worker?.skills?.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {worker.skills.slice(0, 3).map((ws: { id: string; skill?: { name: string } }) => (
                  <span key={ws.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    {ws.skill?.name}
                  </span>
                ))}
              </div>
            )}

            {/* Cover note */}
            {app.coverNote && (
              <p className="mt-2 text-xs text-gray-500 line-clamp-2 bg-gray-50 rounded-lg px-3 py-2 italic">
                &ldquo;{app.coverNote}&rdquo;
              </p>
            )}

            <div className="flex items-center gap-1 mt-2">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-400">Applied {formatDate(app.appliedAt)}</span>
            </div>

            {/* Contractor note input */}
            {showNote && (
              <div className="mt-3">
                <textarea
                  rows={2}
                  placeholder="Add a note for the worker (optional)..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>
            )}

            {/* Action buttons */}
            {canAct && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {app.status !== 'SHORTLISTED' && (
                  <Button
                    size="sm" variant="outline"
                    className="gap-1.5 h-8 text-xs text-purple-600 border-purple-200 hover:bg-purple-50"
                    onClick={() => handleStatus('SHORTLISTED')}
                    disabled={updating}
                  >
                    <Star className="h-3 w-3" /> Shortlist
                  </Button>
                )}
                {(app.status === 'SUBMITTED' || app.status === 'VIEWED' || app.status === 'SHORTLISTED') && (
                  <Button
                    size="sm"
                    className="gap-1.5 h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleStatus('HIRED')}
                    disabled={updating}
                  >
                    <UserCheck className="h-3 w-3" /> Hire
                  </Button>
                )}
                {app.status !== 'REJECTED' && (
                  <Button
                    size="sm" variant="outline"
                    className="gap-1.5 h-8 text-xs text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => handleStatus('REJECTED')}
                    disabled={updating}
                  >
                    <XCircle className="h-3 w-3" /> Reject
                  </Button>
                )}
                <button
                  className="ml-auto text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                  onClick={() => setShowNote(s => !s)}
                >
                  <MessageSquare className="h-3 w-3" />
                  {showNote ? 'Hide note' : 'Add note'}
                </button>
              </div>
            )}

            {app.status === 'HIRED' && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                  <CheckCircle className="h-4 w-4" /> Worker Hired
                </div>
                {workerUser?.phone && (
                  <a href={`tel:${workerUser.phone}`} className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline ml-auto">
                    <Phone className="h-3 w-3" /> Contact
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContractorApplicationsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [appsLoading, setAppsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15;

  // Load jobs first
  useEffect(() => {
    jobsApi.listMy({ limit: 50 }).then(res => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (res as any).data ?? [];
      setJobs(data);
      if (data.length > 0 && !selectedJob) {
        setSelectedJob(data[0].id);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const loadApps = useCallback(async (jobId: string, p = 1, status = '') => {
    if (!jobId) return;
    setAppsLoading(true);
    try {
      const res = await jobsApi.listApplications(jobId, p, limit, status || undefined);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setApps((res as any).data ?? []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTotal((res as any).pagination?.total ?? (res as any).total ?? 0);
    } catch {
      setApps([]);
    } finally {
      setAppsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedJob) {
      setPage(1);
      loadApps(selectedJob, 1, statusFilter);
    }
  }, [selectedJob, statusFilter, loadApps]);

  useEffect(() => {
    if (selectedJob) loadApps(selectedJob, page, statusFilter);
  }, [page, selectedJob, statusFilter, loadApps]);

  const handleStatusChange = (appId: string, status: string) => {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
  };

  const filtered = search.trim()
    ? apps.filter(a => {
        const q = search.toLowerCase();
        return (
          a.worker?.user?.firstName?.toLowerCase().includes(q) ||
          a.worker?.user?.lastName?.toLowerCase().includes(q) ||
          a.worker?.city?.toLowerCase().includes(q)
        );
      })
    : apps;

  const totalPages = Math.ceil(total / limit);
  const selectedJobData = jobs.find(j => j.id === selectedJob);

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Applications
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Review and manage worker applications</p>
        </div>
        <Link href="/contractor/jobs/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            Post New Job
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Briefcase className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-700 text-lg">No jobs posted yet</h3>
          <p className="text-gray-400 text-sm mt-1 mb-5">Post a job to start receiving applications</p>
          <Link href="/contractor/jobs/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Post a Job</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Job selector */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
              Select Job
            </label>
            <div className="relative">
              <select
                value={selectedJob}
                onChange={e => setSelectedJob(e.target.value)}
                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
              >
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.title} — {j.city} ({j._count?.applications ?? 0} applicants) [{j.status}]
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {selectedJobData && (
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {selectedJobData.city}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" /> {selectedJobData.filledCount ?? 0}/{selectedJobData.slotsAvailable ?? selectedJobData.workerCount ?? 1} filled
                </span>
                <Link href={`/contractor/jobs/${selectedJobData.id}`} className="text-blue-600 flex items-center gap-1 hover:underline ml-auto">
                  View job <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {FILTER_TABS.map(tab => (
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
                placeholder="Search by worker name, city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2 shrink-0">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{total} application{total !== 1 ? 's' : ''}</p>
          </div>

          {/* Applications */}
          {appsLoading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(4)].map((_, i) => <div key={i} className="h-44 bg-gray-100 rounded-2xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <Users className="h-10 w-10 text-gray-200 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700">
                {search || statusFilter ? 'No matching applications' : 'No applications yet'}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {search || statusFilter ? 'Try changing filters' : 'Applications will appear here when workers apply'}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {filtered.map(app => (
                  <WorkerCard
                    key={app.id}
                    app={app}
                    jobId={selectedJob}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>

              {totalPages > 1 && !search && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        page === p ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}>{p}</button>
                  ))}
                  <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
