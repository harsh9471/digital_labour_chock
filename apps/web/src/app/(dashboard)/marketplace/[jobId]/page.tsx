'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, MapPin, Clock, Users, DollarSign, Zap, Calendar,
  Building2, Briefcase, Star, Eye, Bookmark, BookmarkCheck,
  CheckCircle, X, AlertCircle, Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth.store';
import { jobsApi } from '@/lib/jobs-api';
import { workersApi } from '@/lib/workers-api';
import { formatCurrency, formatDate } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JobDetail = any;

function ApplicationModal({
  job, onClose, onSuccess,
}: { job: JobDetail; onClose: () => void; onSuccess: () => void }) {
  const { toast } = useToast();
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleApply = async () => {
    setSubmitting(true);
    try {
      await jobsApi.apply(job.id, coverNote || undefined);
      toast({ title: 'Application submitted!', description: 'Your application has been sent to the contractor.' });
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to submit application';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">Apply for Job</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Job summary */}
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="font-semibold text-blue-900 text-sm">{job.title}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-blue-700">
              <span>{job.city}, {job.state}</span>
              {job.dailyWage && <span className="font-semibold">{formatCurrency(Number(job.dailyWage))}/day</span>}
            </div>
          </div>

          {/* Cover note */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Cover Note <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={coverNote}
              onChange={e => setCoverNote(e.target.value)}
              rows={4}
              placeholder="Briefly describe your relevant experience and why you are a good fit for this role..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{coverNote.length}/500 characters</p>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-gray-600">Your profile will be shared with the contractor when you apply.</p>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-5 border-t border-gray-100">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
            loading={submitting}
            onClick={handleApply}
          >
            <Send className="h-4 w-4" /> Submit Application
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const isWorker = user?.role === 'WORKER';

  useEffect(() => {
    if (!jobId) return;
    jobsApi.getById(jobId)
      .then(res => { setJob(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [jobId]);

  const handleSaveToggle = async () => {
    if (!isWorker) return;
    try {
      if (isSaved) {
        await workersApi.unsaveJob(jobId);
        setIsSaved(false);
        toast({ title: 'Removed from saved jobs' });
      } else {
        await workersApi.saveJob(jobId);
        setIsSaved(true);
        toast({ title: 'Job saved!' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to update saved jobs', variant: 'destructive' });
    }
  };

  const handleApplySuccess = () => {
    setShowApplyModal(false);
    setJob((j: JobDetail) => ({ ...j, myApplication: { status: 'SUBMITTED', appliedAt: new Date().toISOString() } }));
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-gray-100 rounded-xl w-48" />
        <div className="h-64 bg-gray-100 rounded-2xl" />
        <div className="h-40 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center py-20">
        <AlertCircle className="h-12 w-12 text-gray-200 mx-auto mb-4" />
        <h3 className="font-semibold text-gray-600">Job not found</h3>
        <Link href="/marketplace" className="mt-4 inline-block">
          <Button variant="brand" size="sm">Browse Jobs</Button>
        </Link>
      </div>
    );
  }

  const slotsLeft = job.workerCount - (job.filledCount ?? 0);
  const isFull = slotsLeft <= 0;
  const hasApplied = !!job.myApplication;
  const myAppStatus = job.myApplication?.status;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Back nav */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Marketplace
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Job details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
                  {job.isUrgent && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
                      <Zap className="h-3 w-3" /> URGENT
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Building2 className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {job.contractor?.user?.firstName} {job.contractor?.user?.lastName}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="flex items-center gap-1.5 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                    <MapPin className="h-3.5 w-3.5" /> {job.city}, {job.state}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                    <Clock className="h-3.5 w-3.5" /> {job.jobType}
                  </span>
                  {job.requiredSkill && (
                    <span className="flex items-center gap-1.5 text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-full">
                      {job.requiredSkill.icon} {job.requiredSkill.name}
                    </span>
                  )}
                  {job.skillCategory && (
                    <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full">
                      {job.skillCategory}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Job Description</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
          )}

          {/* Job details grid */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Job Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Daily Wage', value: job.dailyWage ? formatCurrency(Number(job.dailyWage)) : 'Not specified', icon: DollarSign, color: 'text-emerald-600' },
                { label: 'Weekly Wage', value: job.weeklyWage ? formatCurrency(Number(job.weeklyWage)) : '—', icon: DollarSign, color: 'text-emerald-600' },
                { label: 'Positions', value: `${slotsLeft} of ${job.workerCount} open`, icon: Users, color: slotsLeft === 0 ? 'text-red-500' : 'text-blue-600' },
                { label: 'Start Date', value: job.startDate ? formatDate(job.startDate) : 'Immediate', icon: Calendar, color: 'text-gray-700' },
                { label: 'End Date', value: job.endDate ? formatDate(job.endDate) : 'Ongoing', icon: Calendar, color: 'text-gray-700' },
                { label: 'Total Applied', value: `${job._count?.applications ?? 0} applicants`, icon: Eye, color: 'text-gray-700' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Icon className={`h-4 w-4 ${item.color} shrink-0`} />
                    <div>
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Site info */}
          {job.site && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Work Site</h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{job.site.name}</p>
                  <p className="text-xs text-gray-400">{job.site.city}, {job.site.state}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Application sidebar */}
        <div className="space-y-4">
          {/* Wage highlight */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white">
            <p className="text-emerald-100 text-sm">Daily Wage</p>
            <p className="text-3xl font-bold mt-1">
              {job.dailyWage ? formatCurrency(Number(job.dailyWage)) : 'TBD'}
            </p>
            {job.weeklyWage && (
              <p className="text-emerald-100 text-sm mt-1">
                = {formatCurrency(Number(job.weeklyWage))}/week
              </p>
            )}
            <div className="flex items-center gap-2 mt-3 text-sm text-emerald-100">
              <Users className="h-4 w-4" />
              <span>{slotsLeft} slots remaining</span>
            </div>
          </div>

          {/* Apply button / status */}
          {isWorker && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              {hasApplied ? (
                <div className="space-y-3">
                  <div className={`flex items-center gap-3 p-3 rounded-xl ${
                    myAppStatus === 'HIRED' ? 'bg-emerald-50' :
                    myAppStatus === 'SHORTLISTED' ? 'bg-purple-50' :
                    myAppStatus === 'REJECTED' ? 'bg-red-50' :
                    'bg-blue-50'
                  }`}>
                    <CheckCircle className={`h-5 w-5 shrink-0 ${
                      myAppStatus === 'HIRED' ? 'text-emerald-600' :
                      myAppStatus === 'SHORTLISTED' ? 'text-purple-600' :
                      myAppStatus === 'REJECTED' ? 'text-red-500' :
                      'text-blue-600'
                    }`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {myAppStatus === 'HIRED' ? 'You are Hired!' :
                         myAppStatus === 'SHORTLISTED' ? 'Shortlisted' :
                         myAppStatus === 'REJECTED' ? 'Not Selected' :
                         'Application Submitted'}
                      </p>
                      <p className="text-xs text-gray-400">
                        Applied {formatDate(job.myApplication?.appliedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                    disabled={isFull || job.status !== 'PUBLISHED'}
                    onClick={() => setShowApplyModal(true)}
                  >
                    <Send className="h-4 w-4" />
                    {isFull ? 'Positions Filled' : 'Apply Now'}
                  </Button>
                  {isFull && <p className="text-xs text-red-500 text-center">All positions have been filled</p>}
                </>
              )}

              <button
                onClick={handleSaveToggle}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  isSaved ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                {isSaved ? 'Saved' : 'Save Job'}
              </button>
            </div>
          )}

          {/* Contractor info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Posted By</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700">
                {job.contractor?.user?.firstName?.[0]}{job.contractor?.user?.lastName?.[0]}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {job.contractor?.user?.firstName} {job.contractor?.user?.lastName}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span>{job.contractor?.rating ? Number(job.contractor.rating).toFixed(1) : 'N/A'}</span>
                  <span>Contractor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply modal */}
      {showApplyModal && (
        <ApplicationModal
          job={job}
          onClose={() => setShowApplyModal(false)}
          onSuccess={handleApplySuccess}
        />
      )}
    </div>
  );
}
