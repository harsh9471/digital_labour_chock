'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Briefcase, Plus, Search, Filter, MapPin, Clock, Users,
  ChevronRight, Loader2, AlertCircle, MoreVertical, Eye,
  Send, X, CheckCircle, XCircle, Edit2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { jobsApi } from '@/lib/jobs-api';
import { sitesApi } from '@/lib/sites-api';
import { workersApi } from '@/lib/workers-api';
import type { Job, JobFilters, Site, Skill, CreateJobPayload } from '@/types/jobs';
import { useAuthStore } from '@/store/auth.store';

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Job['status'] }) {
  const map: Record<string, { label: string; className: string }> = {
    DRAFT: { label: 'Draft', className: 'bg-slate-100 text-slate-600' },
    PUBLISHED: { label: 'Published', className: 'bg-blue-100 text-blue-700' },
    ACTIVE: { label: 'Active', className: 'bg-green-100 text-green-700' },
    FILLED: { label: 'Filled', className: 'bg-purple-100 text-purple-700' },
    COMPLETED: { label: 'Completed', className: 'bg-teal-100 text-teal-700' },
    CLOSED: { label: 'Closed', className: 'bg-slate-200 text-slate-500' },
    CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-600' },
  };
  const s = map[status] ?? map.DRAFT;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.className}`}>
      {s.label}
    </span>
  );
}

// ─── Job Form Modal ───────────────────────────────────────────────────────────
function JobFormModal({
  open,
  onClose,
  onSuccess,
  sites,
  skills,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sites: Site[];
  skills: Skill[];
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<CreateJobPayload>({
    title: '',
    description: '',
    city: '',
    state: '',
    workerCount: 1,
    jobType: 'DAILY',
    isUrgent: false,
  });

  const indianStates = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  ];

  const handleSubmit = async () => {
    if (!form.title || !form.city || !form.state) {
      setError('Please fill all required fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const created = await jobsApi.create(form);
      await jobsApi.publish(created.data.id);
      onSuccess();
      onClose();
      setForm({ title: '', description: '', city: '', state: '', workerCount: 1, jobType: 'DAILY', isUrgent: false });
      setStep(1);
    } catch (e: unknown) {
      setError((e as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message ?? 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Post New Job</DialogTitle>
          <div className="mt-2 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-blue-600' : 'bg-slate-200'}`}
              />
            ))}
          </div>
          <p className="text-sm text-slate-500">Step {step} of 3</p>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex gap-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Experienced Mason needed for residential project"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skill">Required Skill</Label>
                <Select
                  id="skill"
                  placeholder="Select a skill"
                  value={form.requiredSkillId ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, requiredSkillId: e.target.value || undefined }))}
                  options={skills.map((s) => ({ value: s.id, label: `${s.icon ?? ''} ${s.name}` }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Workers Needed *</Label>
                  <Input
                    type="number"
                    min={1}
                    max={500}
                    value={form.workerCount}
                    onChange={(e) => setForm((f) => ({ ...f, workerCount: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Select
                    value={form.jobType ?? 'DAILY'}
                    onChange={(e) => setForm((f) => ({ ...f, jobType: e.target.value as Job['jobType'] }))}
                    options={[
                      { value: 'DAILY', label: 'Daily' },
                      { value: 'WEEKLY', label: 'Weekly' },
                      { value: 'MONTHLY', label: 'Monthly' },
                      { value: 'CONTRACT', label: 'Contract' },
                      { value: 'FIXED_TERM', label: 'Fixed Term' },
                    ]}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe the job requirements, experience needed, tools required..."
                  rows={4}
                  value={form.description ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Daily Wage (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="e.g. 800"
                    value={form.dailyWage ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, dailyWage: e.target.value ? Number(e.target.value) : undefined }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Weekly Wage (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="e.g. 5000"
                    value={form.weeklyWage ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, weeklyWage: e.target.value ? Number(e.target.value) : undefined }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={form.startDate ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value || undefined }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={form.endDate ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value || undefined }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Site (optional)</Label>
                <Select
                  value={form.siteId ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, siteId: e.target.value || undefined }))}
                  placeholder="Select a site"
                  options={sites.map((s) => ({ value: s.id, label: `${s.name} — ${s.city}` }))}
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-orange-200 bg-orange-50">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded"
                  checked={form.isUrgent ?? false}
                  onChange={(e) => setForm((f) => ({ ...f, isUrgent: e.target.checked }))}
                />
                <div>
                  <p className="text-sm font-medium text-orange-800">Mark as Urgent</p>
                  <p className="text-xs text-orange-600">Urgent jobs appear at the top of listings</p>
                </div>
              </label>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Mumbai"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State *</Label>
                  <Select
                    value={form.state}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    placeholder="Select state"
                    options={indianStates.map((s) => ({ value: s, label: s }))}
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                <p className="text-sm font-semibold text-slate-800">Job Summary</p>
                <div className="space-y-1 text-sm text-slate-600">
                  <p>📋 <strong>{form.title}</strong></p>
                  <p>👷 {form.workerCount} workers · {form.jobType}</p>
                  {form.dailyWage && <p>💰 ₹{form.dailyWage}/day</p>}
                  <p>📍 {form.city}, {form.state}</p>
                  {form.isUrgent && <p>🚨 Urgent posting</p>}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={() => {
                if (step === 1 && !form.title) {
                  setError('Job title is required');
                  return;
                }
                setError('');
                setStep((s) => s + 1);
              }}
            >
              Continue
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Job
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchJobs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await jobsApi.listMy({
        page,
        limit: 20,
        search: search || undefined,
        status: statusFilter as Job['status'] || undefined,
      });
      setJobs(res.data);
      setMeta({ total: res.meta.total, page: res.meta.page, totalPages: res.meta.totalPages });
    } catch {
      // silently fail — show empty state
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    sitesApi.list(1, 100, true).then((r) => setSites(r.data)).catch(() => {});
    workersApi.getSkills().then((r) => setSkills(r.data)).catch(() => {});
  }, []);

  const handlePublish = async (jobId: string) => {
    setActionLoading(jobId);
    try {
      await jobsApi.publish(jobId);
      fetchJobs(meta.page);
    } finally {
      setActionLoading(null);
    }
  };

  const handleClose = async (jobId: string) => {
    if (!confirm('Are you sure you want to close this job?')) return;
    setActionLoading(jobId);
    try {
      await jobsApi.close(jobId);
      fetchJobs(meta.page);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jobs</h1>
          <p className="text-sm text-slate-500 mt-0.5">{meta.total} total jobs posted</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Post New Job
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search jobs..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48"
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'DRAFT', label: 'Draft' },
            { value: 'PUBLISHED', label: 'Published' },
            { value: 'ACTIVE', label: 'Active' },
            { value: 'FILLED', label: 'Filled' },
            { value: 'CLOSED', label: 'Closed' },
          ]}
        />
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">No jobs yet</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            Post your first job to start hiring verified workers for your site.
          </p>
          <Button onClick={() => setShowForm(true)} className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Post First Job
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-900 text-base truncate">{job.title}</h3>
                    <StatusBadge status={job.status} />
                    {job.isUrgent && (
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
                        🚨 Urgent
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.city}, {job.state}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {job.filledCount}/{job.workerCount} filled
                    </span>
                    {job.dailyWage && (
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        ₹{Number(job.dailyWage).toLocaleString()}/day
                      </span>
                    )}
                    {job.requiredSkill && (
                      <span className="flex items-center gap-1">
                        {job.requiredSkill.icon} {job.requiredSkill.name}
                      </span>
                    )}
                    {job._count && (
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {job._count.applications} applications
                      </span>
                    )}
                  </div>
                  {job.startDate && (
                    <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Starts {new Date(job.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {job.status === 'DRAFT' && (
                    <Button
                      size="sm"
                      onClick={() => handlePublish(job.id)}
                      disabled={actionLoading === job.id}
                      className="gap-1 text-xs"
                    >
                      {actionLoading === job.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      Publish
                    </Button>
                  )}
                  {(job.status === 'PUBLISHED' || job.status === 'ACTIVE') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleClose(job.id)}
                      disabled={actionLoading === job.id}
                      className="gap-1 text-xs text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Close
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { window.location.href = `/jobs/${job.id}`; }}
                    className="gap-1 text-xs"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                    View
                  </Button>
                </div>
              </div>

              {/* Progress bar */}
              {job.workerCount > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Slots filled</span>
                    <span>{job.filledCount}/{job.workerCount}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${Math.min((job.filledCount / job.workerCount) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-slate-500">
                Page {meta.page} of {meta.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={meta.page <= 1}
                  onClick={() => fetchJobs(meta.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => fetchJobs(meta.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <JobFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={() => fetchJobs(1)}
        sites={sites}
        skills={skills}
      />
    </div>
  );
}
