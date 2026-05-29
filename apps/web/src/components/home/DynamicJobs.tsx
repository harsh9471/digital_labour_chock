'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  MapPin, Users, Zap, ArrowRight, Search, SlidersHorizontal,
  Briefcase, Clock, IndianRupee,
} from 'lucide-react';
import { jobsApi } from '@/lib/jobs-api';
import { Button } from '@/components/ui/button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Job = any;

const SKILL_CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'CONSTRUCTION', label: 'Construction' },
  { value: 'ELECTRICAL', label: 'Electrical' },
  { value: 'PLUMBING', label: 'Plumbing' },
  { value: 'CARPENTRY', label: 'Carpentry' },
  { value: 'PAINTING', label: 'Painting' },
  { value: 'WELDING', label: 'Welding' },
  { value: 'MASONRY', label: 'Masonry' },
  { value: 'GENERAL', label: 'General' },
];

const JOB_TYPE_LABEL: Record<string, string> = {
  DAILY: 'Daily Wage', WEEKLY: 'Weekly', MONTHLY: 'Monthly',
  CONTRACT: 'Contract', FIXED_TERM: 'Fixed Term',
};

function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/marketplace?job=${job.id}`} className="group">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {job.isUrgent && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
                  <Zap className="h-2.5 w-2.5" /> Urgent
                </span>
              )}
              {job.jobType && (
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  {JOB_TYPE_LABEL[job.jobType] ?? job.jobType}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
          </div>
          {job.dailyWage && (
            <div className="text-right shrink-0">
              <p className="font-bold text-emerald-600 text-base flex items-center gap-0.5">
                <IndianRupee className="h-3.5 w-3.5" />
                {Number(job.dailyWage).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-gray-400">/day</p>
            </div>
          )}
        </div>

        {job.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{job.description}</p>
        )}

        <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-gray-400" />
            {job.city}{job.state ? `, ${job.state}` : ''}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3 text-gray-400" />
            {job.workerCount ?? 1} position{(job.workerCount ?? 1) > 1 ? 's' : ''}
          </span>
          {job.skillCategory && (
            <span className="flex items-center gap-1">
              <Briefcase className="h-3 w-3 text-gray-400" />
              {job.skillCategory.replace('_', ' ')}
            </span>
          )}
          {job.publishedAt && (
            <span className="flex items-center gap-1 ml-auto">
              <Clock className="h-3 w-3 text-gray-400" />
              {new Date(job.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function DynamicJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await jobsApi.list({ limit: 6, page: 1, status: 'PUBLISHED' } as any) as any;
      const filtered = (res.data ?? []).filter((j: Job) => {
        if (search && !j.title?.toLowerCase().includes(search.toLowerCase()) && !j.city?.toLowerCase().includes(search.toLowerCase())) return false;
        if (category && j.skillCategory !== category) return false;
        if (city && !j.city?.toLowerCase().includes(city.toLowerCase())) return false;
        return true;
      });
      setJobs(filtered);
      setTotal(res.pagination?.total ?? res.total ?? filtered.length);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, city]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <section id="projects" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Live Opportunities</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Available Projects
            </h2>
            <p className="text-gray-500 mt-1">{total > 0 ? `${total.toLocaleString()} jobs available right now` : 'Browse open positions'}</p>
          </div>
          <Link href="/marketplace">
            <Button variant="outline" className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 gap-2 shrink-0">
              View All Jobs <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job title or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
            >
              {SKILL_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="City..."
              value={city}
              onChange={e => setCity(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-36"
            />
          </div>
        </div>

        {/* Job cards */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Briefcase className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No jobs found matching your filters</p>
            <p className="text-sm text-gray-400 mt-1">Try different search terms or browse all jobs</p>
            <Link href="/marketplace" className="mt-4 inline-block">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 mt-2">
                Browse All Jobs <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>
    </section>
  );
}
