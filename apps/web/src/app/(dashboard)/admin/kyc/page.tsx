'use client';

import { useState, useEffect, useCallback } from 'react';
import { Shield, ShieldCheck, ShieldX, RefreshCw, MapPin, Clock, CheckCircle } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { AdminWorker } from '@/lib/admin-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type KycFilter = '' | 'PENDING' | 'VERIFIED' | 'REJECTED';
const KYC_VARIANTS: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  VERIFIED: 'success', PENDING: 'warning', REJECTED: 'destructive',
};

export default function AdminKycPage() {
  const [allWorkers, setAllWorkers] = useState<AdminWorker[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [kycFilter, setKycFilter] = useState<KycFilter>('PENDING');
  const [updatingKyc, setUpdatingKyc] = useState<string | null>(null);

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getWorkers({ page, limit: 20 });
      setAllWorkers(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchWorkers(); }, [fetchWorkers]);

  const workers = kycFilter ? allWorkers.filter((w) => w.kycStatus === kycFilter) : allWorkers;

  const counts = {
    PENDING: allWorkers.filter((w) => w.kycStatus === 'PENDING').length,
    VERIFIED: allWorkers.filter((w) => w.kycStatus === 'VERIFIED').length,
    REJECTED: allWorkers.filter((w) => w.kycStatus === 'REJECTED').length,
  };

  const handleKycUpdate = async (workerId: string, kycStatus: string) => {
    setUpdatingKyc(workerId);
    try {
      await adminApi.updateWorkerKyc(workerId, kycStatus);
      setAllWorkers((prev) => prev.map((w) => w.id === workerId ? { ...w, kycStatus } : w));
    } catch {
      // ignore
    } finally {
      setUpdatingKyc(null);
    }
  };

  const filterTabs: { value: KycFilter; label: string; icon: React.ElementType; count: number }[] = [
    { value: 'PENDING', label: 'Pending', icon: Clock, count: counts.PENDING },
    { value: 'VERIFIED', label: 'Verified', icon: CheckCircle, count: counts.VERIFIED },
    { value: 'REJECTED', label: 'Rejected', icon: ShieldX, count: counts.REJECTED },
    { value: '', label: 'All', icon: Shield, count: allWorkers.length },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">KYC Verifications</h1>
          <p className="text-sm text-slate-500 mt-0.5">Review and verify worker identity documents</p>
        </div>
        <button onClick={fetchWorkers} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Pending', count: counts.PENDING, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          { label: 'Verified', count: counts.VERIFIED, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Rejected', count: counts.REJECTED, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
          { label: 'Total', count: allWorkers.length, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' },
        ].map(({ label, count, color, border }) => (
          <Card key={label} className={`border ${border} shadow-sm`}>
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${color}`}>{count}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit flex-wrap">
        {filterTabs.map(({ value, label, count }) => (
          <button
            key={value}
            onClick={() => setKycFilter(value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              kycFilter === value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
            {count > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full ${kycFilter === value ? 'bg-violet-100 text-violet-700' : 'bg-slate-200 text-slate-500'}`}>{count}</span>}
          </button>
        ))}
      </div>

      {/* Table / Cards */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
      ) : workers.length === 0 ? (
        <div className="text-center py-16">
          <ShieldCheck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No workers in this category</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <Card className="border-0 shadow-sm overflow-hidden hidden sm:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <th className="py-3 px-4 text-left">Worker</th>
                    <th className="py-3 px-4 text-left">Location</th>
                    <th className="py-3 px-4 text-left">KYC Status</th>
                    <th className="py-3 px-4 text-left">Account</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {workers.map((worker) => (
                    <tr key={worker.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs shrink-0">
                            {worker.user.firstName[0]}{worker.user.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{worker.user.firstName} {worker.user.lastName}</p>
                            <p className="text-xs text-slate-400">{worker.user.phone ?? worker.user.email ?? '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-400" />{worker.location?.city ?? worker.city ?? '—'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={KYC_VARIANTS[worker.kycStatus] ?? 'secondary'} className="text-xs">{worker.kycStatus}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={worker.user.status === 'ACTIVE' ? 'success' : 'warning'} className="text-xs">{worker.user.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 justify-end">
                          {worker.kycStatus !== 'VERIFIED' && (
                            <button onClick={() => handleKycUpdate(worker.id, 'VERIFIED')} disabled={updatingKyc === worker.id}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60">
                              <ShieldCheck className="h-3.5 w-3.5" /> Approve
                            </button>
                          )}
                          {worker.kycStatus === 'PENDING' && (
                            <button onClick={() => handleKycUpdate(worker.id, 'REJECTED')} disabled={updatingKyc === worker.id}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-60">
                              <ShieldX className="h-3.5 w-3.5" /> Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {workers.map((worker) => (
              <Card key={worker.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm shrink-0">
                      {worker.user.firstName[0]}{worker.user.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm">{worker.user.firstName} {worker.user.lastName}</p>
                      <p className="text-xs text-slate-400">{worker.user.phone ?? worker.user.email}</p>
                    </div>
                    <Badge variant={KYC_VARIANTS[worker.kycStatus] ?? 'secondary'} className="text-xs shrink-0">{worker.kycStatus}</Badge>
                  </div>
                  <div className="flex gap-2">
                    {worker.kycStatus !== 'VERIFIED' && (
                      <button onClick={() => handleKycUpdate(worker.id, 'VERIFIED')} disabled={updatingKyc === worker.id}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                        <ShieldCheck className="h-3.5 w-3.5" /> Approve
                      </button>
                    )}
                    {worker.kycStatus === 'PENDING' && (
                      <button onClick={() => handleKycUpdate(worker.id, 'REJECTED')} disabled={updatingKyc === worker.id}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        <ShieldX className="h-3.5 w-3.5" /> Reject
                      </button>
                    )}
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
          <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
