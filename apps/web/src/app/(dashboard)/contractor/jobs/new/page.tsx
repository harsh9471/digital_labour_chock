'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase, MapPin, DollarSign, Users, Calendar, ChevronLeft,
  Zap, FileText, Save, Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jobsApi } from '@/lib/jobs-api';
import { workersApi } from '@/lib/workers-api';
import type { Skill, JobType } from '@/types/jobs';

const JOB_TYPES = [
  { value: 'DAILY', label: 'Daily Wage' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'FIXED_TERM', label: 'Fixed Term' },
];

const SKILL_CATEGORIES = [
  'CONSTRUCTION', 'ELECTRICAL', 'PLUMBING', 'CARPENTRY', 'PAINTING',
  'WELDING', 'MASONRY', 'FLOORING', 'HVAC', 'GENERAL',
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

interface FormData {
  title: string;
  description: string;
  skillCategory: string;
  requiredSkillId: string;
  jobType: string;
  slotsAvailable: string;
  dailyWage: string;
  totalBudget: string;
  city: string;
  state: string;
  pincode: string;
  startDate: string;
  endDate: string;
  isUrgent: boolean;
  requirements: string;
}

function FormGroup({ label, required, children, hint }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export default function PostJobPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FormData>({
    title: '', description: '', skillCategory: '', requiredSkillId: '',
    jobType: 'DAILY', slotsAvailable: '1', dailyWage: '', totalBudget: '',
    city: '', state: 'Maharashtra', pincode: '',
    startDate: '', endDate: '', isUrgent: false, requirements: '',
  });

  useEffect(() => {
    workersApi.getSkills().then(res => setSkills(res.data ?? [])).catch(() => {});
  }, []);

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Job title is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state) e.state = 'State is required';
    if (!form.jobType) e.jobType = 'Job type is required';
    if (form.dailyWage && isNaN(Number(form.dailyWage))) e.dailyWage = 'Enter a valid amount';
    if (form.slotsAvailable && isNaN(Number(form.slotsAvailable))) e.slotsAvailable = 'Enter a valid number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (publish = false) => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        skillCategory: form.skillCategory || undefined,
        requiredSkillId: form.requiredSkillId || undefined,
        jobType: form.jobType as JobType,
        workerCount: Number(form.slotsAvailable) || 1,
        dailyWage: form.dailyWage ? Number(form.dailyWage) : undefined,
        city: form.city.trim(),
        state: form.state,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        isUrgent: form.isUrgent,
      };
      const res = await jobsApi.create(payload);
      if (publish && res.data?.id) {
        await jobsApi.publish(res.data.id);
      }
      router.push('/contractor/jobs');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrors({ submit: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (field: string) =>
    `w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-colors ${
      errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post a Job</h1>
          <p className="text-gray-500 text-sm mt-0.5">Fill in the details to attract the right workers</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {/* Section: Basic Info */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-blue-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Basic Information</h2>
          </div>
          <div className="space-y-4">
            <FormGroup label="Job Title" required hint="e.g. Mason needed for 3-floor residential project">
              <input
                type="text"
                placeholder="Enter job title"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                className={inputCls('title')}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </FormGroup>

            <FormGroup label="Description" hint="Describe the work, requirements, and expectations">
              <textarea
                rows={4}
                placeholder="Describe the job in detail..."
                value={form.description}
                onChange={e => set('description', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
              />
            </FormGroup>

            <div className="grid grid-cols-2 gap-4">
              <FormGroup label="Skill Category">
                <select value={form.skillCategory} onChange={e => set('skillCategory', e.target.value)} className={inputCls('skillCategory')}>
                  <option value="">Select category</option>
                  {SKILL_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.replace('_', ' ')}</option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup label="Specific Skill">
                <select value={form.requiredSkillId} onChange={e => set('requiredSkillId', e.target.value)} className={inputCls('requiredSkillId')}>
                  <option value="">Any skill</option>
                  {skills
                    .filter(s => !form.skillCategory || s.category === form.skillCategory)
                    .map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))
                  }
                </select>
              </FormGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormGroup label="Job Type" required>
                <select value={form.jobType} onChange={e => set('jobType', e.target.value)} className={inputCls('jobType')}>
                  {JOB_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup label="Slots Available" hint="Number of workers needed">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={form.slotsAvailable}
                  onChange={e => set('slotsAvailable', e.target.value)}
                  className={inputCls('slotsAvailable')}
                />
              </FormGroup>
            </div>

            {/* Urgent toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Mark as Urgent</p>
                  <p className="text-xs text-gray-500">Urgent jobs get priority placement and more visibility</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => set('isUrgent', !form.isUrgent)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  form.isUrgent ? 'bg-red-500' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  form.isUrgent ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Section: Compensation */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Compensation</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="Daily Wage (₹)" hint="Amount per worker per day">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">₹</span>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 800"
                  value={form.dailyWage}
                  onChange={e => set('dailyWage', e.target.value)}
                  className={`${inputCls('dailyWage')} pl-8`}
                />
              </div>
              {errors.dailyWage && <p className="text-xs text-red-500 mt-1">{errors.dailyWage}</p>}
            </FormGroup>
            <FormGroup label="Total Budget (₹)" hint="Overall project budget (optional)">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">₹</span>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 50000"
                  value={form.totalBudget}
                  onChange={e => set('totalBudget', e.target.value)}
                  className={`${inputCls('totalBudget')} pl-8`}
                />
              </div>
            </FormGroup>
          </div>
        </div>

        {/* Section: Location */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <MapPin className="h-4 w-4 text-purple-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Location</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="City" required>
              <input
                type="text"
                placeholder="e.g. Mumbai"
                value={form.city}
                onChange={e => set('city', e.target.value)}
                className={inputCls('city')}
              />
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </FormGroup>
            <FormGroup label="State" required>
              <select value={form.state} onChange={e => set('state', e.target.value)} className={inputCls('state')}>
                <option value="">Select state</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
            </FormGroup>
          </div>
        </div>

        {/* Section: Timeline */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-amber-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Timeline</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="Start Date">
              <input
                type="date"
                value={form.startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => set('startDate', e.target.value)}
                className={inputCls('startDate')}
              />
            </FormGroup>
            <FormGroup label="End Date">
              <input
                type="date"
                value={form.endDate}
                min={form.startDate || new Date().toISOString().split('T')[0]}
                onChange={e => set('endDate', e.target.value)}
                className={inputCls('endDate')}
              />
            </FormGroup>
          </div>
        </div>

        {/* Section: Requirements */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-teal-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Additional Requirements</h2>
          </div>
          <textarea
            rows={3}
            placeholder="Any specific requirements, tools to bring, safety equipment, certifications..."
            value={form.requirements}
            onChange={e => set('requirements', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
          />
        </div>
      </div>

      {/* Error */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {errors.submit}
        </div>
      )}

      {/* Submit buttons */}
      <div className="flex items-center gap-3 justify-end">
        <Button
          variant="outline"
          onClick={() => handleSubmit(false)}
          disabled={submitting}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {submitting ? 'Saving...' : 'Save as Draft'}
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          onClick={() => handleSubmit(true)}
          disabled={submitting}
        >
          <Send className="h-4 w-4" />
          {submitting ? 'Publishing...' : 'Publish Now'}
        </Button>
      </div>
    </div>
  );
}
