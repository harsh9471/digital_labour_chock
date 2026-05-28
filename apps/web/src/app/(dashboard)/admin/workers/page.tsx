'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Star, Users, RefreshCw, ShieldCheck, ShieldX, UserX, UserCheck } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { AdminWorker } from '@/lib/admin-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const KYC_VARIANTS: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  VERIFIED: 'success', PENDING: 'warning', REJECTED: 'destructive',
};

export default function AdminWorkersPage() {
  const [workers, setWorkers] = useState<AdminWorker[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [updatingKyc, setUpdatingKyc] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getWorkers({ page, limit: 15, city: city || undefined });
      setWorkers(res.data);
      setTotal(res.meta.total);
      setTotalPages(res.meta.totalPages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, city]);

  useEffect(() => { fetchWorkers(); }, [fetchWorkers]);

  const handleKycUpdate = async (workerId: string, kycStatus: string) => {
    setUpdatingKyc(workerId);
    try {
      await adminApi.updateWorkerKyc(workerId, kycStatus);
      setWorkers((prev) => prev.map((w) => w.id === workerId ? { ...w, kycStatus } : w));
    } catch {
      // ignore
    } finally {
      setUpdatingKyc(null);
    }
  };

  const handleStatusUpdate = async (userId: string, status: string) => {
    setUpdatingStatus(userId);
    try {
      await adminApi.updateUserStatus(userId, status);
      setWorkers((prev) => prev.map((w) => w.user.id === userId ? { ...w, user: { ...w.user, status } } : w));
    } catch {
      // ignore
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filtered = search
    ? workers.filter((w) =>
        `${w.user.firstName} ${w.user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        w.user.email?.toLowerCase().includes(search.toLowerCase())
      )
    : workers;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Workers</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} registered workers</p>
        </div>
        <button onClick={fetchWorkers} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="relative sm:w-44">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }}
                placeholder="Filter by city"
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table / Mobile Cards */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No workers found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <Card className="border-0 shadow-sm overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <th className="py-3 px-4 text-left">Worker</th>
                    <th className="py-3 px-4 text-left">Location</th>
                    <th className="py-3 px-4 text-left">Rating</th>
                    <th className="py-3 px-4 text-left">KYC</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((worker) => (
                    <tr key={worker.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs shrink-0">
                            {worker.user.firstName[0]}{worker.user.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{worker.user.firstName} {worker.user.lastName}</p>
                            <p className="text-xs text-slate-400">{worker.user.email ?? worker.user.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{worker.location?.city ?? worker.city ?? '—'}</td>
                      <td className="py-3 px-4">
                        {worker.rating != null ? (
                          <span className="flex items-center gap-1 text-sm text-amber-500">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            {Number(worker.rating).toFixed(1)}
                          </span>
                        ) : <span className="text-xs text-slate-400">—</span>}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={KYC_VARIANTS[worker.kycStatus] ?? 'secondary'} className="text-xs">{worker.kycStatus}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={worker.user.status === 'ACTIVE' ? 'success' : worker.user.status === 'SUSPENDED' ? 'destructive' : 'warning'} className="text-xs">
                          {worker.user.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <WorkerActions worker={worker} updatingKyc={updatingKyc} updatingStatus={updatingStatus} onKyc={handleKycUpdate} onStatus={handleStatusUpdate} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((worker) => (
              <Card key={worker.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm shrink-0">
                      {worker.user.firstName[0]}{worker.user.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm">{worker.user.firstName} {worker.user.lastName}</p>
                      <p className="text-xs text-slate-400 truncate">{worker.user.email ?? worker.user.phone}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <Badge variant={KYC_VARIANTS[worker.kycStatus] ?? 'secondary'} className="text-xs">KYC: {worker.kycStatus}</Badge>
                        <Badge variant={worker.user.status === 'ACTIVE' ? 'success' : 'destructive'} className="text-xs">{worker.user.status}</Badge>
                        {worker.location?.city && (
                          <span className="text-xs text-slate-400 flex items-center gap-0.5"><MapPin className="h-3 w-3" />{worker.location.city}</span>
                        )}
                      </div>
                      <div className="mt-3">
                        <WorkerActions worker={worker} updatingKyc={updatingKyc} updatingStatus={updatingStatus} onKyc={handleKycUpdate} onStatus={handleStatusUpdate} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between sm:justify-center gap-3">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors">
            Previous
          </button>
          <span className="text-sm text-slate-500">Page {page} of {totalPages} &bull; {total} total</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function WorkerActions({ worker, updatingKyc, updatingStatus, onKyc, onStatus }: {
  worker: AdminWorker;
  updatingKyc: string | null;
  updatingStatus: string | null;
  onKyc: (id: string, status: string) => void;
  onStatus: (id: string, status: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {worker.kycStatus !== 'VERIFIED' && (
        <button onClick={() => onKyc(worker.id, 'VERIFIED')} disabled={updatingKyc === worker.id}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-60 border border-green-200">
          <ShieldCheck className="h-3 w-3" /> Verify
        </button>
      )}
      {worker.kycStatus !== 'REJECTED' && (
        <button onClick={() => onKyc(worker.id, 'REJECTED')} disabled={updatingKyc === worker.id}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-60 border border-red-200">
          <ShieldX className="h-3 w-3" /> Reject
        </button>
      )}
      {worker.user.status !== 'SUSPENDED' ? (
        <button onClick={() => onStatus(worker.user.id, 'SUSPENDED')} disabled={updatingStatus === worker.user.id}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-60 border border-slate-200">
          <UserX className="h-3 w-3" /> Suspend
        </button>
      ) : (
        <button onClick={() => onStatus(worker.user.id, 'ACTIVE')} disabled={updatingStatus === worker.user.id}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-60 border border-emerald-200">
          <UserCheck className="h-3 w-3" /> Activate
        </button>
      )}
    </div>
  );
}
