'use client';

import { useState, useEffect, useCallback } from 'react';
import { Shield, ShieldCheck, ShieldX, RefreshCw, MapPin } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { AdminWorker } from '@/lib/admin-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type KycFilter = '' | 'PENDING' | 'VERIFIED' | 'REJECTED';

const KYC_VARIANTS: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  VERIFIED: 'success', PENDING: 'warning', REJECTED: 'destructive',
};

export default function AdminKycPage() {
  const [workers, setWorkers] = useState<AdminWorker[]>([]);
  const [_total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [kycFilter, _setKycFilter] = useState<KycFilter>('PENDING');
  const [updatingKyc, setUpdatingKyc] = useState<string | null>(null);

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getWorkers({ page, limit: 20 });
      const filtered = kycFilter ? res.data.filter((w) => w.kycStatus === kycFilter) : res.data;
      setWorkers(filtered);
      setTotal(res.meta.total);
      setTotalPages(res.meta.totalPages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, kycFilter]);

  useEffect(() => { fetchWorkers(); }, [fetchWorkers]);

  const handleKycUpdate = async (workerId: string, kycStatus: string) => {
    setUpdatingKyc(workerId);
    try {
      await adminApi.updateWorkerKyc(workerId, kycStatus);
      setWorkers((prev) => prev.filter((w) => w.id !== workerId || kycFilter === ''));
    } catch {
      // ignore
    } finally {
      setUpdatingKyc(null);
    }
  };

  const filterCounts = {
    PENDING: workers.filter((w) => w.kycStatus === 'PENDING').length,
    VERIFIED: workers.filter((w) => w.kycStatus === 'VERIFIED').length,
    REJECTED: workers.filter((w) => w.kycStatus === 'REJECTED').length,
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">KYC Verifications</h1>
          <p className="text-sm text-slate-500 mt-0.5">Review and verify worker identity documents</p>
        </div>
        <button onClick={fetchWorkers} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', count: filterCounts.PENDING, color: 'bg-yellow-50 text-yellow-700', icon: Shield },
          { label: 'Verified', count: filterCounts.VERIFIED, color: 'bg-green-50 text-green-700', icon: ShieldCheck },
          { label: 'Rejected', count: filterCounts.REJECTED, color: 'bg-red-50 text-red-700', icon: ShieldX },
        ].map(({ label, count, color, icon: Icon }) => (
          <Card key={label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${color.split(' ')[0].replace('text-', 'bg-').replace('-700', '-100')} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${color.split(' ')[1]}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{count}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workers table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
      ) : workers.length === 0 ? (
        <div className="text-center py-16">
          <Shield className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No pending verifications</p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm overflow-hidden">
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
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {worker.location?.city ?? worker.city ?? '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={KYC_VARIANTS[worker.kycStatus] ?? 'secondary'} className="text-xs">
                        {worker.kycStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={worker.user.status === 'ACTIVE' ? 'success' : 'warning'} className="text-xs">
                        {worker.user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 justify-end">
                        {worker.kycStatus !== 'VERIFIED' && (
                          <button
                            onClick={() => handleKycUpdate(worker.id, 'VERIFIED')}
                            disabled={updatingKyc === worker.id}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Approve
                          </button>
                        )}
                        {worker.kycStatus === 'PENDING' && (
                          <button
                            onClick={() => handleKycUpdate(worker.id, 'REJECTED')}
                            disabled={updatingKyc === worker.id}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-60"
                          >
                            <ShieldX className="h-3.5 w-3.5" />
                            Reject
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
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
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
