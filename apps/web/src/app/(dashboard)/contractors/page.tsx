'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Star, Briefcase, RefreshCw, UserX, UserCheck } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { AdminContractor } from '@/lib/admin-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminContractorsPage() {
  const [contractors, setContractors] = useState<AdminContractor[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchContractors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getContractors({ page, limit: 15, city: city || undefined });
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
    setUpdating(userId);
    try {
      await adminApi.updateUserStatus(userId, status);
      setContractors((prev) => prev.map((c) => c.user.id === userId ? { ...c, user: { ...c.user, status } } : c));
    } catch {
      // ignore
    } finally {
      setUpdating(null);
    }
  };

  const filtered = search
    ? contractors.filter((c) =>
        `${c.user.firstName} ${c.user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        c.user.email?.toLowerCase().includes(search.toLowerCase())
      )
    : contractors;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contractors</h1>
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
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }}
                placeholder="City"
                className="sm:w-36 pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-36 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No contractors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((contractor) => (
            <Card key={contractor.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm shrink-0">
                    {contractor.user.firstName[0]}{contractor.user.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{contractor.user.firstName} {contractor.user.lastName}</p>
                    <p className="text-xs text-slate-400 truncate">{contractor.user.email}</p>
                  </div>
                  <Badge variant={contractor.user.status === 'ACTIVE' ? 'success' : contractor.user.status === 'SUSPENDED' ? 'destructive' : 'warning'} className="text-xs shrink-0">
                    {contractor.user.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  {contractor.location?.city && (
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{contractor.location.city}</span>
                  )}
                  {contractor.rating != null && (
                    <span className="flex items-center gap-1 text-amber-500"><Star className="h-3 w-3 fill-current" />{contractor.rating.toFixed(1)}</span>
                  )}
                  {contractor.company && (
                    <span className="text-slate-400 truncate">{contractor.company.name}</span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <span>{contractor._count?.sites ?? 0} sites</span>
                  <span>{contractor._count?.jobs ?? 0} jobs</span>
                  <span>{contractor._count?.projects ?? 0} projects</span>
                </div>

                <div className="flex items-center gap-2">
                  {contractor.user.status !== 'ACTIVE' ? (
                    <button
                      onClick={() => handleStatusUpdate(contractor.user.id, 'ACTIVE')}
                      disabled={updating === contractor.user.id}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <UserCheck className="h-3 w-3" />
                      Activate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusUpdate(contractor.user.id, 'SUSPENDED')}
                      disabled={updating === contractor.user.id}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <UserX className="h-3 w-3" />
                      Suspend
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
