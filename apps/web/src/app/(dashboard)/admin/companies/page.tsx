'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Building2, RefreshCw, Users, MapPin, Mail, X, Briefcase, FolderKanban, Hash } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { AdminCompany } from '@/lib/admin-api';
import { Card, CardContent } from '@/components/ui/card';

function CompanyModal({ company, onClose }: { company: AdminCompany; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <Card className="w-full max-w-md border-0 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Company Details</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            {/* Company Header */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                <Building2 className="h-7 w-7 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 text-base">{company.name}</p>
                {company.establishedYear && (
                  <p className="text-xs text-slate-500 mt-0.5">Est. {company.establishedYear}</p>
                )}
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-2.5">
              {company.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600 truncate">{company.email}</span>
                </div>
              )}
              {(company.location?.city || company.location?.state) && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600">{[company.location?.city, company.location?.state].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {company.gstNumber && (
                <div className="flex items-center gap-3 text-sm">
                  <Hash className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600 font-mono text-xs">{company.gstNumber}</span>
                </div>
              )}
              {company.employeeCount != null && (
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600">{company.employeeCount.toLocaleString('en-IN')} employees</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-indigo-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Briefcase className="h-4 w-4 text-indigo-500" />
                  <p className="text-lg font-bold text-indigo-700">{company._count?.contractors ?? 0}</p>
                </div>
                <p className="text-xs text-slate-500">Contractors</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <FolderKanban className="h-4 w-4 text-purple-500" />
                  <p className="text-lg font-bold text-purple-700">{company._count?.projects ?? 0}</p>
                </div>
                <p className="text-xs text-slate-500">Projects</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AdminCompany | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCompanies({ page, limit: 12, search: search || undefined });
      setCompanies(res.data);
      setTotal(res.meta.total);
      setTotalPages(res.meta.totalPages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchCompanies(); };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Companies</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} registered companies</p>
        </div>
        <button onClick={fetchCompanies} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by company name..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
              Search
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-16">
          <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No companies found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <Card key={company.id} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(company)}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{company.name}</p>
                    {company.location && (
                      <p className="text-xs text-slate-400 truncate">{company.location.city}, {company.location.state}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-500">
                  {company.email && <p className="truncate">{company.email}</p>}
                  {company.gstNumber && <p>GST: <span className="font-mono">{company.gstNumber}</span></p>}
                  {company.employeeCount != null && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {company.employeeCount} employees
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-400">
                  <span>{company._count?.contractors ?? 0} contractors</span>
                  <span>{company._count?.projects ?? 0} projects</span>
                  {company.establishedYear && <span>Est. {company.establishedYear}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
      {selected && <CompanyModal company={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
