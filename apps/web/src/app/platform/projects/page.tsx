'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowRight, MapPin, Users, IndianRupee,
  CheckCircle2, Clock, Filter, Search,
  Zap, Briefcase, ChevronLeft, ChevronRight, SlidersHorizontal,
  RefreshCw, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavActions from '@/components/home/NavActions';
import { jobsApi } from '@/lib/jobs-api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Job = any;

const CITIES = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur'];
const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'CONSTRUCTION', label: 'Construction' },
  { value: 'ELECTRICAL', label: 'Electrical' },
  { value: 'PLUMBING', label: 'Plumbing' },
  { value: 'CARPENTRY', label: 'Carpentry' },
  { value: 'PAINTING', label: 'Painting' },
  { value: 'WELDING', label: 'Welding' },
  { value: 'MASONRY', label: 'Masonry' },
  { value: 'HVAC', label: 'HVAC' },
  { value: 'GENERAL', label: 'General' },
];
const JOB_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'DAILY', label: 'Daily Wage' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'CONTRACT', label: 'Contract' },
];

const CARD_GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-violet-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
  'from-rose-500 to-pink-600',
  'from-teal-500 to-cyan-600',
];

const JOB_TYPE_LABEL: Record<string, string> = {
  DAILY: 'Daily Wage', WEEKLY: 'Weekly', MONTHLY: 'Monthly',
  CONTRACT: 'Contract', FIXED_TERM: 'Fixed Term',
};

function JobCard({ job, idx }: { job: Job; idx: number }) {
  const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
  const isUrgent = job.isUrgent;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden group">
      {/* Gradient header */}
      <div className={`h-36 bg-gradient-to-br ${gradient} relative p-5 flex flex-col justify-between overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-8 -translate-x-8" />
        <div className="relative flex items-start justify-between">
          {isUrgent ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-sm">
              <Zap className="h-3 w-3" /> Urgent Hire
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm">
              <CheckCircle2 className="h-3 w-3" /> Active
            </span>
          )}
          {job.skillCategory && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
              {job.skillCategory.replace('_', ' ')}
            </span>
          )}
        </div>
        <div className="relative">
          <p className="font-bold text-white text-base leading-snug line-clamp-2 drop-shadow-sm">{job.title}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
          <span className="truncate font-medium">{job.city}{job.state ? `, ${job.state}` : ''}</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {job.dailyWage && (
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
              <div className="flex items-center gap-1 text-xs text-emerald-600 mb-1">
                <IndianRupee className="h-3 w-3" /> Daily Wage
              </div>
              <p className="font-bold text-emerald-800 text-sm">
                ₹{Number(job.dailyWage).toLocaleString('en-IN')}/day
              </p>
            </div>
          )}
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <div className="flex items-center gap-1 text-xs text-blue-600 mb-1">
              <Users className="h-3 w-3" /> Workers Needed
            </div>
            <p className="font-bold text-blue-800 text-sm">
              {job.workerCount ?? 1} position{(job.workerCount ?? 1) > 1 ? 's' : ''}
            </p>
          </div>
          {job.jobType && (
            <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
              <div className="flex items-center gap-1 text-xs text-purple-600 mb-1">
                <Briefcase className="h-3 w-3" /> Type
              </div>
              <p className="font-bold text-purple-800 text-sm">{JOB_TYPE_LABEL[job.jobType] ?? job.jobType}</p>
            </div>
          )}
          {job.publishedAt && (
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <Clock className="h-3 w-3" /> Posted
              </div>
              <p className="font-bold text-gray-700 text-sm">
                {new Date(job.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          )}
        </div>

        {job.description && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{job.description}</p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <Link href={`/register?role=WORKER`} className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold py-2.5 gap-2 transition-all group-hover:shadow-lg group-hover:shadow-blue-500/25 text-sm">
              Apply Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [jobType, setJobType] = useState('');
  const [urgentOnly, setUrgentOnly] = useState(false);

  const LIMIT = 9;

  const fetchJobs = useCallback(async (p = 1) => {
    setLoading(true);
    setError(false);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filters: any = { page: p, limit: LIMIT, status: 'PUBLISHED' };
      if (city && city !== 'All Cities') filters.city = city;
      if (category) filters.skillCategory = category;
      if (jobType) filters.jobType = jobType;
      if (urgentOnly) filters.isUrgent = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await jobsApi.list(filters) as any;
      let data: Job[] = res.data ?? [];
      if (search.trim()) {
        const q = search.toLowerCase();
        data = data.filter((j: Job) =>
          j.title?.toLowerCase().includes(q) ||
          j.city?.toLowerCase().includes(q) ||
          j.description?.toLowerCase().includes(q),
        );
      }
      setJobs(data);
      setTotal(res.pagination?.total ?? res.total ?? data.length);
      setTotalPages(res.pagination?.pages ?? res.totalPages ?? 1);
    } catch {
      setError(true);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [city, category, jobType, urgentOnly, search]);

  useEffect(() => {
    setPage(1);
    fetchJobs(1);
  }, [city, category, jobType, urgentOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchJobs(page);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    setPage(1);
    fetchJobs(1);
  };

  const clearFilters = () => {
    setSearch(''); setCity(''); setCategory(''); setJobType(''); setUrgentOnly(false); setPage(1);
  };
  const hasFilters = search || (city && city !== 'All Cities') || category || jobType || urgentOnly;

  return (
    <div className="min-h-screen bg-white">

      {/* ── Navigation ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">DL</span>
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">
              Digital Labour <span className="text-blue-600">Chowk</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/business', label: 'Business' },
              { href: '/platform/workers', label: 'Workers' },
              { href: '/platform/projects', label: 'Projects' },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${href === '/platform/projects' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}>
                {label}
              </Link>
            ))}
          </div>
          <NavActions />
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-28 pb-16 px-4 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 30%, #60a5fa 0%, transparent 50%), radial-gradient(circle at 20% 70%, #a78bfa 0%, transparent 50%)' }} />
        <div className="relative container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-4 py-1.5 text-sm text-emerald-300 font-semibold mb-6 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {total > 0 ? `${total.toLocaleString()} Jobs Live Right Now` : 'Live Job Listings'}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            Available Projects &amp;
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Job Opportunities
            </span>
          </h1>
          <p className="text-lg text-blue-100/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Real jobs posted by verified contractors across India. Filter by skill, city, and job type to find the perfect opportunity.
          </p>

          {/* Hero search bar */}
          <div className="flex gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by job title or city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-lg"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-500/30 shrink-0"
            >
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* ── Sticky Filters ── */}
      <section className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 shrink-0">
              <Filter className="h-4 w-4" /> Filters:
            </div>

            {/* City pills */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              {CITIES.slice(0, 6).map((c) => (
                <button key={c} onClick={() => { setCity(c === 'All Cities' ? '' : c); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors shrink-0 ${
                    (c === 'All Cities' && !city) || city === c
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 bg-white'
                  }`}>
                  {c}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              {/* Category */}
              <div className="relative">
                <SlidersHorizontal className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
                  className="pl-8 pr-8 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none">
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              {/* Job type */}
              <select value={jobType} onChange={e => { setJobType(e.target.value); setPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>

              {/* Urgent toggle */}
              <button onClick={() => { setUrgentOnly(p => !p); setPage(1); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  urgentOnly ? 'bg-red-500 text-white border-red-500' : 'border-gray-200 text-gray-600 bg-white hover:border-red-300 hover:text-red-500'
                }`}>
                <Zap className="h-3.5 w-3.5" /> Urgent
              </button>

              {hasFilters && (
                <button onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 px-2 py-2">
                  <RefreshCw className="h-3.5 w-3.5" /> Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Jobs Grid ── */}
      <section className="py-10 px-4 bg-gray-50 min-h-[60vh]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {loading ? 'Loading jobs...' : `${total.toLocaleString()} Job${total !== 1 ? 's' : ''} Found`}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {hasFilters ? 'Filtered results' : 'All published jobs across India'}
              </p>
            </div>
            <Link href="/register?role=CONTRACTOR">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2 rounded-xl font-bold shadow-sm text-sm">
                Post a Job <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
              <AlertCircle className="h-6 w-6 text-red-500 shrink-0" />
              <div>
                <p className="font-semibold text-red-800">Failed to load jobs</p>
                <p className="text-sm text-red-600 mt-0.5">Check your connection and try again.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => fetchJobs(page)} className="ml-auto shrink-0">
                <RefreshCw className="h-4 w-4 mr-1" /> Retry
              </Button>
            </div>
          )}

          {/* Skeleton */}
          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: LIMIT }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-36 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-16 bg-gray-100 rounded-xl" />
                      <div className="h-16 bg-gray-100 rounded-xl" />
                    </div>
                    <div className="h-10 bg-gray-100 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && jobs.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-blue-50 flex items-center justify-center">
                <Briefcase className="h-10 w-10 text-blue-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No jobs found</h3>
              <p className="text-gray-400 mb-6">
                {hasFilters ? 'Try different filters or clear all filters.' : 'No published jobs at the moment. Check back soon!'}
              </p>
              {hasFilters && (
                <Button onClick={clearFilters} variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  Clear All Filters
                </Button>
              )}
            </div>
          )}

          {/* Job cards */}
          {!loading && !error && jobs.length > 0 && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.map((job, idx) => <JobCard key={job.id} job={job} idx={idx} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-10">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2.5 rounded-xl border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>

                  <div className="flex gap-1.5">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      const p = i + 1;
                      return (
                        <button key={p} onClick={() => setPage(p)}
                          className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                            page === p ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}>
                          {p}
                        </button>
                      );
                    })}
                    {totalPages > 7 && <span className="flex items-center px-2 text-gray-400">...</span>}
                  </div>

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2.5 rounded-xl border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>

                  <span className="text-sm text-gray-400 ml-2">
                    Page {page} of {totalPages} · {total} jobs
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── For Contractors CTA ── */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-blue-500/20">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 50%)' }} />
            <div className="relative md:flex items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Have a Project? Post It Today</h2>
                <p className="text-blue-200 text-lg mb-6 md:mb-0 max-w-lg">
                  Connect with 2.5 Lakh+ verified skilled workers. Post your project and start receiving applications within minutes.
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  {['Free to post', 'Verified workers only', 'Direct communication', 'Digital contracts'].map(t => (
                    <span key={t} className="flex items-center gap-1.5 text-blue-100 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="shrink-0 mt-6 md:mt-0">
                <Link href="/register?role=CONTRACTOR">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold gap-2 px-8 py-5 rounded-full text-lg shadow-xl transition-transform hover:scale-105 whitespace-nowrap">
                    Post Your Project <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-gray-400 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">DL</span>
              </div>
              <span className="font-bold text-white">Digital Labour Chowk</span>
            </Link>
            <div className="flex items-center gap-6 text-sm">
              {[{ href: '/', label: 'Home' }, { href: '/about', label: 'About' }, { href: '/business', label: 'Business' }, { href: '/platform/workers', label: 'Workers' }].map(l => (
                <Link key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
            <p>© 2026 Digital Labour Chowk. All rights reserved.</p>
            <p className="text-gray-600">Made with ❤️ in India 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
