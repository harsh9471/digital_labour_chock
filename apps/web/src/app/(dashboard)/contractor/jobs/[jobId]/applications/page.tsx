'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft, User, MapPin, Star, Clock, CheckCircle, XCircle,
  Briefcase, Phone, Search, Filter, ChevronRight, Award,
  AlertCircle, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jobsApi } from '@/lib/jobs-api';
import { useToast } from '@/hooks/use-toast';
import { formatDate, formatCurrency } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Application = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Job = any;

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  PENDING:     { label: 'Pending',     cls: 'bg-yellow-50 text-yellow-700 border-yellow-200',  icon: Clock },
  SHORTLISTED: { label: 'Shortlisted', cls: 'bg-blue-50 text-blue-700 border-blue-200',        icon: Star },
  HIRED:       { label: 'Hired',       cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  REJECTED:    { label: 'Rejected',    cls: 'bg-red-50 text-red-700 border-red-200',            icon: XCircle },
  WITHDRAWN:   { label: 'Withdrawn',   cls: 'bg-gray-50 text-gray-600 border-gray-200',         icon: AlertCircle },
};

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'HIRED', label: 'Hired' },
  { value: 'REJECTED', label: 'Rejected' },
];

function ApplicationCard({
  app,
  selected,
  onClick,
}: {
  app: Application;
  selected: boolean;
  onClick: () => void;
}) {
  const cfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.PENDING;
  const Icon = cfg.icon;
  const worker = app.worker?.user;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        selected
          ? 'border-blue-500 bg-blue-50 shadow-sm'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
          {worker?.firstName?.[0]}{worker?.lastName?.[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {worker?.firstName} {worker?.lastName}
            </p>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border shrink-0 ${cfg.cls}`}>
              <Icon className="h-3 w-3" />
              {cfg.label}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {app.worker?.city && (
              <span className="flex items-center gap-0.5 text-xs text-gray-400">
                <MapPin className="h-3 w-3" /> {app.worker.city}
              </span>
            )}
            {app.worker?.dailyRate && (
              <span className="text-xs text-gray-400">
                {formatCurrency(Number(app.worker.dailyRate))}/day
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">Applied {formatDate(app.appliedAt)}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 mt-1" />
      </div>
    </button>
  );
}

function ApplicationDetail({
  app,
  jobId,
  onUpdate,
}: {
  app: Application;
  jobId: string;
  onUpdate: (updated: Application) => void;
}) {
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);
  const worker = app.worker;
  const user = worker?.user;

  const handleUpdateStatus = async (status: 'SHORTLISTED' | 'HIRED' | 'REJECTED') => {
    setUpdating(status);
    try {
      const res = await jobsApi.updateApplicationStatus(jobId, app.id, status);
      onUpdate(res.data);
      toast({ title: `Application ${status.toLowerCase()} successfully` });
    } catch {
      toast({ title: 'Error', description: 'Failed to update application status', variant: 'destructive' });
    } finally {
      setUpdating(null);
    }
  };

  const cfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.PENDING;
  const Icon = cfg.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
      {/* Worker header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
          {worker?.city && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
              <MapPin className="h-3.5 w-3.5" /> {worker.city}{worker.state ? `, ${worker.state}` : ''}
            </div>
          )}
          <div className="mt-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${cfg.cls}`}>
              <Icon className="h-3.5 w-3.5" /> {cfg.label}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Rating',     value: worker?.rating ? `${Number(worker.rating).toFixed(1)}★` : 'N/A',           icon: Star },
          { label: 'Jobs Done',  value: worker?.totalJobsDone ?? 0,                                                  icon: Briefcase },
          { label: 'Daily Rate', value: worker?.dailyRate ? formatCurrency(Number(worker.dailyRate)) : 'N/A',       icon: Award },
        ].map(item => {
          const ItemIcon = item.icon;
          return (
            <div key={item.label} className="text-center bg-gray-50 rounded-xl p-3">
              <ItemIcon className="h-4 w-4 text-gray-400 mx-auto mb-1" />
              <p className="font-bold text-gray-900 text-sm">{item.value}</p>
              <p className="text-xs text-gray-400">{item.label}</p>
            </div>
          );
        })}
      </div>

      {/* Contact */}
      {user?.phone && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
          <Phone className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Phone</p>
            <p className="font-semibold text-gray-900 text-sm">{user.phone}</p>
          </div>
        </div>
      )}

      {/* Worker bio */}
      {worker?.bio && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">About</p>
          <p className="text-sm text-gray-600 leading-relaxed">{worker.bio}</p>
        </div>
      )}

      {/* Skills */}
      {worker?.skills?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skills</p>
          <div className="flex flex-wrap gap-2">
            {worker.skills.slice(0, 6).map((ws: { id: string; skill: { name: string; icon?: string }; level: string }) => (
              <span key={ws.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">
                {ws.skill?.icon && <span>{ws.skill.icon}</span>}
                {ws.skill?.name}
                <span className="text-gray-400">· {ws.level.charAt(0) + ws.level.slice(1).toLowerCase()}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Cover note */}
      {app.coverNote && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Cover Note</p>
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <p className="text-sm text-gray-700 italic">"{app.coverNote}"</p>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 mb-5">Applied on {formatDate(app.appliedAt)}</p>

      {/* Actions */}
      {app.status === 'PENDING' && (
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
            onClick={() => handleUpdateStatus('SHORTLISTED')}
            disabled={!!updating}
          >
            {updating === 'SHORTLISTED' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
            Shortlist
          </Button>
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            onClick={() => handleUpdateStatus('HIRED')}
            disabled={!!updating}
          >
            {updating === 'HIRED' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            Hire
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-red-600 border-red-200 hover:bg-red-50 gap-2"
            onClick={() => handleUpdateStatus('REJECTED')}
            disabled={!!updating}
          >
            {updating === 'REJECTED' ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
            Reject
          </Button>
        </div>
      )}
      {app.status === 'SHORTLISTED' && (
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            onClick={() => handleUpdateStatus('HIRED')}
            disabled={!!updating}
          >
            {updating === 'HIRED' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            Hire Now
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-red-600 border-red-200 hover:bg-red-50 gap-2"
            onClick={() => handleUpdateStatus('REJECTED')}
            disabled={!!updating}
          >
            {updating === 'REJECTED' ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}

export default function JobApplicationsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const loadApplications = useCallback(async (p = 1, status = '') => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await jobsApi.listApplications(jobId, p, 20, status || undefined) as any;
      const apps: Application[] = res.data ?? [];
      setApplications(apps);
      setTotal(res.pagination?.total ?? res.total ?? 0);
      setTotalPages(res.pagination?.pages ?? res.totalPages ?? 1);
      if (apps.length > 0 && !selectedApp) setSelectedApp(apps[0]);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [jobId, selectedApp]);

  useEffect(() => {
    jobsApi.getById(jobId).then(res => setJob(res.data)).catch(() => {});
  }, [jobId]);

  useEffect(() => {
    setPage(1);
    loadApplications(1, statusFilter);
  }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadApplications(page, statusFilter);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpdate = (updated: Application) => {
    setApplications(prev => prev.map(a => a.id === updated.id ? updated : a));
    setSelectedApp(updated);
  };

  const filtered = search.trim()
    ? applications.filter(a => {
        const q = search.toLowerCase();
        const name = `${a.worker?.user?.firstName ?? ''} ${a.worker?.user?.lastName ?? ''}`.toLowerCase();
        return name.includes(q);
      })
    : applications;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              Applications{job ? ` — ${job.title}` : ''}
            </h1>
            <p className="text-sm text-gray-500">{total} total applicant{total !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Status filter tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
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

        <div className="flex gap-5" style={{ height: 'calc(100vh - 220px)' }}>
          {/* Left panel: list */}
          <div className="w-80 shrink-0 flex flex-col gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-20 bg-white rounded-xl animate-pulse border border-gray-100" />
                ))
              ) : filtered.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                  <User className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    {search ? 'No matching applicants' : 'No applications yet'}
                  </p>
                </div>
              ) : (
                filtered.map(app => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    selected={selectedApp?.id === app.id}
                    onClick={() => setSelectedApp(app)}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && !search && (
              <div className="flex items-center justify-between gap-2 pt-1">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                <span className="text-xs text-gray-500">{page}/{totalPages}</span>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            )}
          </div>

          {/* Right panel: detail */}
          <div className="flex-1 min-w-0 overflow-y-auto">
            {selectedApp ? (
              <ApplicationDetail app={selectedApp} jobId={jobId} onUpdate={handleUpdate} />
            ) : (
              <div className="h-full flex items-center justify-center bg-white rounded-2xl border border-gray-100">
                <div className="text-center">
                  <Filter className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500">Select an application to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
