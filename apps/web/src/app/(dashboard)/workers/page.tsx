'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Star, Briefcase, Users, Filter, UserCheck, RefreshCw } from 'lucide-react';
import { workersApi } from '@/lib/workers-api';
import type { WorkerProfile } from '@/types/jobs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SKILL_CATEGORIES = ['All', 'Construction', 'Plumbing', 'Electrical', 'Carpentry', 'Masonry', 'Painting', 'Welding'];

export default function WorkersPage() {
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [skillCategory, setSkillCategory] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await workersApi.list({
        page,
        limit: 12,
        search: search || undefined,
        city: city || undefined,
        skillCategory: skillCategory && skillCategory !== 'All' ? skillCategory : undefined,
        available: availableOnly || undefined,
      });
      setWorkers(res.data);
      setTotal(res.meta.total);
      setTotalPages(res.meta.totalPages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, search, city, skillCategory, availableOnly]);

  useEffect(() => { fetchWorkers(); }, [fetchWorkers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchWorkers();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workers</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} workers available on the platform</p>
        </div>
        <button onClick={fetchWorkers} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or skill..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full sm:w-36 pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={skillCategory}
              onChange={(e) => { setSkillCategory(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {SKILL_CATEGORIES.map((c) => (
                <option key={c} value={c === 'All' ? '' : c}>{c}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm cursor-pointer hover:bg-slate-50 whitespace-nowrap">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => { setAvailableOnly(e.target.checked); setPage(1); }}
                className="rounded"
              />
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              Available only
            </label>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Search
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Workers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : workers.length === 0 ? (
        <div className="text-center py-20">
          <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No workers found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function WorkerCard({ worker }: { worker: WorkerProfile }) {
  const fullName = `${worker.user.firstName} ${worker.user.lastName}`;
  const initials = `${worker.user.firstName[0]}${worker.user.lastName[0]}`;
  const topSkills = worker.skills?.slice(0, 3) ?? [];

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
            {worker.user.avatar ? (
              <img src={worker.user.avatar} alt={fullName} className="w-full h-full rounded-full object-cover" />
            ) : initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 text-sm truncate">{fullName}</h3>
              {worker.availableForWork && (
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" title="Available" />
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {worker.location?.city && (
                <span className="text-xs text-slate-500 flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" />
                  {worker.location.city}
                </span>
              )}
            </div>
          </div>
          {worker.rating != null && (
            <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-xs font-semibold">{worker.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            {worker.experienceYears ?? 0}y exp
          </span>
          {worker.dailyRate != null && (
            <span className="font-medium text-slate-700">₹{worker.dailyRate}/day</span>
          )}
          <span className="flex items-center gap-1">
            <UserCheck className="h-3.5 w-3.5" />
            {worker.totalJobsDone ?? 0} jobs
          </span>
        </div>

        {topSkills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {topSkills.map((ws) => (
              <Badge key={ws.id} variant="secondary" className="text-xs px-2 py-0.5">
                {ws.skill.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <Badge
            variant={worker.availableForWork ? 'success' : 'secondary'}
            className="text-xs"
          >
            {worker.availableForWork ? 'Available' : 'Unavailable'}
          </Badge>
          <Badge
            variant={worker.kycStatus === 'VERIFIED' ? 'success' : worker.kycStatus === 'REJECTED' ? 'destructive' : 'warning'}
            className="text-xs"
          >
            KYC: {worker.kycStatus}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
