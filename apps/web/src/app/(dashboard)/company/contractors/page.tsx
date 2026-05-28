'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Briefcase, MapPin, Star, Search, Loader2,
  Phone, Mail, FolderKanban,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { companyApi, CompanyContractor } from '@/lib/company-api';

const PAGE_SIZE = 12;

function RatingStars({ rating }: { rating?: number }) {
  if (!rating) return <span className="text-xs text-gray-400">No rating</span>;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
      {Number(rating).toFixed(1)}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const active = status === 'ACTIVE';
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
      {active ? 'Active' : status}
    </span>
  );
}

export default function CompanyContractorsPage() {
  const [contractors, setContractors] = useState<CompanyContractor[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchContractors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await companyApi.getContractors({ page, limit: PAGE_SIZE, search: search || undefined });
      setContractors(res.data ?? []);
      setTotal(res.meta?.total ?? 0);
    } catch {
      setContractors([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchContractors(); }, [fetchContractors]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contractors</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} contractor{total !== 1 ? 's' : ''} in your network</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Search by name, email..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors">
          Search
        </button>
        {search && (
          <button type="button" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors">
            Clear
          </button>
        )}
      </form>

      {/* Grid / List */}
      {loading ? (
        <div className="py-16 flex justify-center"><Loader2 className="h-7 w-7 animate-spin text-violet-500" /></div>
      ) : contractors.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-7 w-7 text-violet-400" />
          </div>
          <p className="font-semibold text-gray-700">No contractors found</p>
          <p className="text-sm text-gray-400 mt-1">Contractors assigned to your company will appear here</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contractors.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 group">
                {/* Avatar + name */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-white font-bold text-base">
                        {c.user.firstName?.[0]}{c.user.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{c.user.firstName} {c.user.lastName}</p>
                      <RatingStars rating={c.rating ?? undefined} />
                    </div>
                  </div>
                  <StatusDot status={c.user.status} />
                </div>

                {/* Contact info */}
                <div className="space-y-1.5 mb-4">
                  {c.user.email && (
                    <p className="flex items-center gap-2 text-xs text-gray-500 truncate">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />{c.user.email}
                    </p>
                  )}
                  {c.user.phone && (
                    <p className="flex items-center gap-2 text-xs text-gray-500">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />{c.user.phone}
                    </p>
                  )}
                  {c.city && (
                    <p className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />{c.city}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-100">
                  {[
                    { label: 'Sites',    value: c._count.sites,    icon: MapPin },
                    { label: 'Jobs',     value: c._count.jobs,     icon: Briefcase },
                    { label: 'Projects', value: c._count.projects, icon: FolderKanban },
                  ].map(stat => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="text-center">
                        <p className="text-base font-bold text-gray-900">{stat.value}</p>
                        <p className="text-[10px] text-gray-400 flex items-center justify-center gap-0.5 mt-0.5">
                          <Icon className="h-2.5 w-2.5" />{stat.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} totalItems={total} pageSize={PAGE_SIZE} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
