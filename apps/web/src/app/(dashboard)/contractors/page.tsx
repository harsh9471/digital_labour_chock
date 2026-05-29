'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Star, Briefcase, RefreshCw, UserX, UserCheck, X, Phone, Mail, Building2 } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { AdminContractor } from '@/lib/admin-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function ContractorModal({ contractor, onClose, onStatusChange }: {
  contractor: AdminContractor;
  onClose: () => void;
  onStatusChange: (userId: string, status: string) => void;
}) {
  const [updating, setUpdating] = useState(false);

  const handleStatus = async (status: string) => {
    setUpdating(true);
    await onStatusChange(contractor.user.id, status);
    setUpdating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <Card className="w-full max-w-md border-0 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Contractor Details</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Profile */}
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shrink-0">
                {contractor.user.firstName[0]}{contractor.user.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-base">{contractor.user.firstName} {contractor.user.lastName}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant={contractor.user.status === 'ACTIVE' ? 'success' : contractor.user.status === 'SUSPENDED' ? 'destructive' : 'warning'} className="text-xs">
                    {contractor.user.status}
                  </Badge>
                  {contractor.rating != null && (
                    <span className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                      <Star className="h-3 w-3 fill-current" />{Number(contractor.rating).toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2.5">
              {contractor.user.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600 truncate">{contractor.user.email}</span>
                </div>
              )}
              {contractor.user.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600">{contractor.user.phone}</span>
                </div>
              )}
              {(contractor.location?.city || contractor.location?.state) && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600">{[contractor.location?.city, contractor.location?.state].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {contractor.company && (
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600">{contractor.company.name}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {[
                { label: 'Sites', value: contractor._count?.sites ?? 0 },
                { label: 'Jobs', value: contractor._count?.jobs ?? 0 },
                { label: 'Projects', value: contractor._count?.projects ?? 0 },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-slate-900">{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>

            {/* Action */}
            {contractor.user.status !== 'ACTIVE' ? (
              <button onClick={() => handleStatus('ACTIVE')} disabled={updating}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60">
                <UserCheck className="h-4 w-4" /> Activate Account
              </button>
            ) : (
              <button onClick={() => handleStatus('SUSPENDED')} disabled={updating}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-60">
                <UserX className="h-4 w-4" /> Suspend Account
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminContractorsPage() {
  const [contractors, setContractors] = useState<AdminContractor[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [selected, setSelected] = useState<AdminContractor | null>(null);

  const fetchContractors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getContractors({ page, limit: 12, city: city || undefined });
      setContractors(res.data);
      setTotal(res.meta.total);
      setTotalPages(res.meta.totalPages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, city]);

  useEffect(() => { fetchContractors(); }, [fetchContractors]);

  const handleStatusUpdate = async (userId: string, status: string) => {
    try {
      await adminApi.updateUserStatus(userId, status);
      setContractors((prev) => prev.map((c) => c.user.id === userId ? { ...c, user: { ...c.user, status } } : c));
      setSelected((prev) => prev && prev.user.id === userId ? { ...prev, user: { ...prev.user, status } } : prev);
    } catch {
      // ignore
    }
  };

  const filtered = search
    ? contractors.filter((c) =>
        `${c.user.firstName} ${c.user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        c.user.email?.toLowerCase().includes(search.toLowerCase())
      )
    : contractors;

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Contractors</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} registered contractors</p>
        </div>
        <button onClick={fetchContractors} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
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

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No contractors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((contractor) => (
            <Card key={contractor.id} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(contractor)}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                    {contractor.user.firstName[0]}{contractor.user.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{contractor.user.firstName} {contractor.user.lastName}</p>
                    <p className="text-xs text-slate-400 truncate">{contractor.user.email ?? contractor.user.phone}</p>
                  </div>
                  <Badge variant={contractor.user.status === 'ACTIVE' ? 'success' : contractor.user.status === 'SUSPENDED' ? 'destructive' : 'warning'} className="text-xs shrink-0">
                    {contractor.user.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
                  {contractor.location?.city && (
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{contractor.location.city}</span>
                  )}
                  {contractor.rating != null && (
                    <span className="flex items-center gap-1 text-amber-500"><Star className="h-3 w-3 fill-current" />{Number(contractor.rating).toFixed(1)}</span>
                  )}
                  {contractor.company && (
                    <span className="text-slate-400 truncate max-w-[120px]">{contractor.company.name}</span>
                  )}
                </div>

                <div className="flex gap-3 text-xs text-slate-400 pt-3 border-t border-slate-50">
                  <span>{contractor._count?.sites ?? 0} sites</span>
                  <span>{contractor._count?.jobs ?? 0} jobs</span>
                  <span>{contractor._count?.projects ?? 0} projects</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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

      {/* Detail Modal */}
      {selected && (
        <ContractorModal
          contractor={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusUpdate}
        />
      )}
    </div>
  );
}
