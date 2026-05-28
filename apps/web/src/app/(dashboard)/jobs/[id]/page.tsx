'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, MapPin, Users, Clock, Briefcase, CheckCircle,
  XCircle, Eye, AlertCircle, Loader2, User, Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { jobsApi } from '@/lib/jobs-api';
import type { Job, JobApplication, ApplicationStatus } from '@/types/jobs';

const statusStyles: Record<ApplicationStatus, { label: string; className: string }> = {
  SUBMITTED: { label: 'Submitted', className: 'bg-blue-100 text-blue-700' },
  VIEWED: { label: 'Viewed', className: 'bg-slate-100 text-slate-600' },
  SHORTLISTED: { label: 'Shortlisted', className: 'bg-yellow-100 text-yellow-700' },
  HIRED: { label: 'Hired', className: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-600' },
  WITHDRAWN: { label: 'Withdrawn', className: 'bg-slate-200 text-slate-500' },
};

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [appMeta, setAppMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [appLoading, setAppLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'applications'>('details');

  useEffect(() => {
    jobsApi.getById(params.id).then((r) => {
      setJob(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.id]);

  const fetchApplications = useCallback(async (page = 1) => {
    setAppLoading(true);
    try {
      const res = await jobsApi.listApplications(
        params.id, page, 20,
        statusFilter || undefined,
      );
      setApplications(res.data);
      setAppMeta({ total: res.meta.total, page: res.meta.page, totalPages: res.meta.totalPages });
    } finally {
      setAppLoading(false);
    }
  }, [params.id, statusFilter]);

  useEffect(() => {
    if (activeTab === 'applications') fetchApplications();
  }, [activeTab, fetchApplications]);

  const handleUpdateStatus = async (appId: string, status: 'SHORTLISTED' | 'HIRED' | 'REJECTED') => {
    if (status === 'HIRED' && !confirm('Confirm hiring this worker?')) return;
    if (status === 'REJECTED' && !confirm('Reject this application?')) return;

    setActionLoading(appId);
    try {
      await jobsApi.updateApplicationStatus(params.id, appId, status);
      fetchApplications(appMeta.page);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">Job not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Back */}
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </button>

      {/* Job Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{job.title}</h1>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                job.status === 'PUBLISHED' ? 'bg-blue-100 text-blue-700' :
                job.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                job.status === 'FILLED' ? 'bg-purple-100 text-purple-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {job.status}
              </span>
              {job.isUrgent && (
                <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                  🚨 Urgent
                </span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400" />
                {job.city}, {job.state}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-slate-400" />
                {job.filledCount}/{job.workerCount} workers filled
              </span>
              {job.dailyWage && (
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  ₹{Number(job.dailyWage).toLocaleString()}/day
                </span>
              )}
              {job.requiredSkill && (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                  {job.requiredSkill.icon} {job.requiredSkill.name}
                </span>
              )}
              {job.startDate && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {new Date(job.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {job.endDate && ` – ${new Date(job.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500">
              <Eye className="inline h-4 w-4 mr-1" />{job.viewCount} views
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>Worker slots filled</span>
            <span>{job.filledCount} / {job.workerCount}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${Math.min((job.filledCount / job.workerCount) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {(['details', 'applications'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'details' ? 'Job Details' : `Applications (${appMeta.total})`}
          </button>
        ))}
      </div>

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800 mb-3">Job Description</h2>
          {job.description ? (
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          ) : (
            <p className="text-sm text-slate-400 italic">No description provided</p>
          )}
          {job.site && (
            <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-1">📍 Site</p>
              <p className="text-sm text-slate-600">{job.site.name}</p>
              <p className="text-xs text-slate-400">{job.site.city}</p>
            </div>
          )}
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | '')}
              className="w-48"
              options={[
                { value: '', label: 'All Applications' },
                { value: 'SUBMITTED', label: 'Submitted' },
                { value: 'SHORTLISTED', label: 'Shortlisted' },
                { value: 'HIRED', label: 'Hired' },
                { value: 'REJECTED', label: 'Rejected' },
              ]}
            />
          </div>

          {appLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16">
              <User className="h-12 w-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400">No applications yet</p>
              <p className="text-xs text-slate-300 mt-1">Workers will appear here when they apply</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {app.worker?.user?.avatar ? (
                        <img src={app.worker.user.avatar} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-sm font-semibold text-slate-500">
                          {app.worker?.user?.firstName?.[0]}{app.worker?.user?.lastName?.[0]}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {app.worker?.user?.firstName} {app.worker?.user?.lastName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[app.status].className}`}>
                          {statusStyles[app.status].label}
                        </span>
                        {app.worker?.skills?.slice(0, 2).map((ws) => (
                          <span key={ws.id} className="text-xs text-slate-400">
                            {ws.skill.icon} {ws.skill.name}
                          </span>
                        ))}
                        {app.worker?.rating && (
                          <span className="flex items-center gap-0.5 text-xs text-amber-600">
                            <Star className="h-3 w-3" />
                            {Number(app.worker.rating).toFixed(1)}
                          </span>
                        )}
                      </div>
                      {app.coverNote && (
                        <p className="text-xs text-slate-400 mt-1 truncate">"{app.coverNote}"</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <p className="text-xs text-slate-400 hidden sm:block">
                      {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>

                    {(app.status === 'SUBMITTED' || app.status === 'VIEWED') && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1 text-yellow-700 border-yellow-200 hover:bg-yellow-50"
                        onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')}
                        disabled={actionLoading === app.id}
                      >
                        Shortlist
                      </Button>
                    )}

                    {(app.status === 'SUBMITTED' || app.status === 'VIEWED' || app.status === 'SHORTLISTED') && (
                      <>
                        <Button
                          size="sm"
                          className="text-xs gap-1 bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleUpdateStatus(app.id, 'HIRED')}
                          disabled={actionLoading === app.id}
                        >
                          {actionLoading === app.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                          Hire
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                          disabled={actionLoading === app.id}
                        >
                          <XCircle className="h-3 w-3" />
                          Reject
                        </Button>
                      </>
                    )}

                    {app.status === 'HIRED' && (
                      <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" /> Hired
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {appMeta.totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-2">
                  <Button size="sm" variant="outline" disabled={appMeta.page <= 1} onClick={() => fetchApplications(appMeta.page - 1)}>Previous</Button>
                  <Button size="sm" variant="outline" disabled={appMeta.page >= appMeta.totalPages} onClick={() => fetchApplications(appMeta.page + 1)}>Next</Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
