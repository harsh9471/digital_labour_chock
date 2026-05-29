'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase, MapPin, Users, DollarSign, Calendar, Eye,
  ChevronLeft, Pencil, X, ArrowUpRight, Zap, Clock,
  CheckCircle, Star, UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jobsApi } from '@/lib/jobs-api';
import { formatCurrency, formatDate } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Job = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Application = any;

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  SUBMITTED:   { label: 'New',          cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  VIEWED:      { label: 'Viewed',       cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  SHORTLISTED: { label: 'Shortlisted',  cls: 'bg-purple-50 text-purple-700 border-purple-200' },
  HIRED:       { label: 'Hired',        cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  REJECTED:    { label: 'Rejected',     cls: 'bg-red-50 text-red-700 border-red-200' },
  WITHDRAWN:   { label: 'Withdrawn',    cls: 'bg-gray-50 text-gray-500 border-gray-200' },
};

const JOB_STATUS_CONFIG: Record<string, { cls: string }> = {
  DRAFT:     { cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  PUBLISHED: { cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  ACTIVE:    { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  FILLED:    { cls: 'bg-purple-50 text-purple-700 border-purple-200' },
  COMPLETED: { cls: 'bg-teal-50 text-teal-700 border-teal-200' },
  CLOSED:    { cls: 'bg-orange-50 text-orange-700 border-orange-200' },
};

export default function ContractorJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<Job>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(false);

  useEffect(() => {
    Promise.all([
      jobsApi.getById(jobId).catch(() => null),
      jobsApi.listApplications(jobId, 1, 5).catch(() => null),
    ]).then(([jobRes, appsRes]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (jobRes) setJob((jobRes as any).data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (appsRes) setApps((appsRes as any).data ?? []);
      setLoading(false);
    });
  }, [jobId]);

  const handlePublish = async () => {
    setActioning(true);
    try {
      await jobsApi.publish(jobId);
      setJob((j: Job) => ({ ...j, status: 'PUBLISHED' }));
    } finally { setActioning(false); }
  };

  const handleClose = async () => {
    if (!confirm('Close this job? Workers will no longer be able to apply.')) return;
    setActioning(true);
    try {
      await jobsApi.close(jobId);
      setJob((j: Job) => ({ ...j, status: 'CLOSED' }));
    } finally { setActioning(false); }
  };

  const handleAppStatus = async (appId: string, status: 'SHORTLISTED' | 'HIRED' | 'REJECTED') => {
    try {
      await jobsApi.updateApplicationStatus(jobId, appId, status);
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    } catch { /* ignore */ }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse max-w-4xl">
        <div className="h-8 bg-gray-100 rounded-xl w-48" />
        <div className="h-56 bg-gray-100 rounded-2xl" />
        <div className="h-72 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6 max-w-4xl text-center py-20">
        <Briefcase className="h-12 w-12 text-gray-200 mx-auto mb-4" />
        <h3 className="font-semibold text-gray-700 text-lg">Job not found</h3>
        <Link href="/contractor/jobs"><Button variant="outline" className="mt-4">Back to Jobs</Button></Link>
      </div>
    );
  }

  const jobStatusCfg = JOB_STATUS_CONFIG[job.status] ?? { cls: 'bg-gray-100 text-gray-600 border-gray-200' };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl">
      {/* Back */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Job Details</h1>
      </div>

      {/* Job card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {job.isUrgent && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
                    <Zap className="h-3 w-3" /> Urgent
                  </span>
                )}
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${jobStatusCfg.cls}`}>
                  {job.status}
                </span>
                {job.skillCategory && (
                  <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    {job.skillCategory.replace('_', ' ')}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
              {job.description && (
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">{job.description}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href={`/contractor/jobs/${job.id}/edit`}>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
              </Link>
              {job.status === 'DRAFT' && (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5" onClick={handlePublish} disabled={actioning}>
                  <ArrowUpRight className="h-3.5 w-3.5" /> Publish
                </Button>
              )}
              {(job.status === 'PUBLISHED' || job.status === 'ACTIVE') && (
                <Button variant="outline" size="sm" className="text-orange-500 border-orange-200 hover:bg-orange-50 gap-1.5" onClick={handleClose} disabled={actioning}>
                  <X className="h-3.5 w-3.5" /> Close
                </Button>
              )}
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
            {[
              {
                icon: DollarSign, label: 'Daily Wage',
                value: job.dailyWage ? formatCurrency(Number(job.dailyWage)) : 'Not set',
                color: 'text-emerald-600',
              },
              {
                icon: Users, label: 'Slots',
                value: `${job.filledCount ?? 0} / ${job.slotsAvailable ?? job.workerCount ?? 1}`,
                color: 'text-blue-600',
              },
              {
                icon: Eye, label: 'Applicants',
                value: job._count?.applications ?? 0,
                color: 'text-purple-600',
              },
              {
                icon: Clock, label: 'Posted',
                value: formatDate(job.createdAt),
                color: 'text-gray-600',
              },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`h-4 w-4 ${item.color}`} />
                    <span className="text-xs text-gray-500">{item.label}</span>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{item.value}</p>
                </div>
              );
            })}
          </div>

          {/* Dates & Location */}
          <div className="flex items-center gap-4 mt-4 flex-wrap text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-gray-400" />
              {job.city}{job.state ? `, ${job.state}` : ''}
            </span>
            {job.startDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                {formatDate(job.startDate)}
                {job.endDate && ` → ${formatDate(job.endDate)}`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Applications</h2>
          <Link href="/contractor/applications">
            <Button variant="ghost" size="sm" className="text-blue-600 text-xs">
              View all <ChevronLeft className="ml-1 h-3.5 w-3.5 rotate-180" />
            </Button>
          </Link>
        </div>

        {apps.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No applications yet</p>
            <p className="text-sm text-gray-400 mt-1">Workers will appear here when they apply</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {apps.map((app: Application) => {
              const statusCfg = STATUS_CONFIG[app.status] ?? { label: app.status, cls: 'bg-gray-100 text-gray-600 border-gray-200' };
              const worker = app.worker;
              const workerUser = worker?.user;
              const initials = workerUser ? `${workerUser.firstName?.[0] ?? ''}${workerUser.lastName?.[0] ?? ''}` : '?';

              return (
                <div key={app.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                    {workerUser?.avatar ? (
                      <img src={workerUser.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {workerUser?.firstName} {workerUser?.lastName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {worker?.city && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <MapPin className="h-3 w-3" /> {worker.city}
                            </span>
                          )}
                          {worker?.rating && (
                            <span className="flex items-center gap-1 text-xs text-yellow-600">
                              <Star className="h-3 w-3 fill-yellow-400" /> {Number(worker.rating).toFixed(1)}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">{formatDate(app.appliedAt)}</span>
                        </div>
                      </div>
                      <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border ${statusCfg.cls} shrink-0`}>
                        {statusCfg.label}
                      </span>
                    </div>
                    {(app.status === 'SUBMITTED' || app.status === 'VIEWED') && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline"
                          className="h-7 text-xs gap-1 text-purple-600 border-purple-200 hover:bg-purple-50"
                          onClick={() => handleAppStatus(app.id, 'SHORTLISTED')}>
                          <Star className="h-3 w-3" /> Shortlist
                        </Button>
                        <Button size="sm"
                          className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => handleAppStatus(app.id, 'HIRED')}>
                          <UserCheck className="h-3 w-3" /> Hire
                        </Button>
                        <Button size="sm" variant="outline"
                          className="h-7 text-xs gap-1 text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => handleAppStatus(app.id, 'REJECTED')}>
                          <X className="h-3 w-3" /> Reject
                        </Button>
                      </div>
                    )}
                    {app.status === 'HIRED' && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-semibold">
                        <CheckCircle className="h-3.5 w-3.5" /> Hired
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
