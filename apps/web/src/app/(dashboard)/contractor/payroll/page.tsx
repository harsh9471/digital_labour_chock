'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Wallet, Plus, IndianRupee, Calendar, Users,
  CheckCircle, Clock, Loader2, X, ChevronRight, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { payrollApi, PayrollBatch, PayrollSummary } from '@/lib/payroll-api';
import { formatDate } from '@/lib/utils';

const PAGE_SIZE = 10;

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  DRAFT:      { label: 'Draft',      cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  PROCESSING: { label: 'Processing', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  COMPLETED:  { label: 'Completed',  cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  FAILED:     { label: 'Failed',     cls: 'bg-red-50 text-red-700 border-red-200' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600' };
  return <span className={`inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full border ${s.cls}`}>{s.label}</span>;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

interface CreateBatchForm { title: string; month: number; year: number; autoGenerate: boolean; }

function CreateBatchModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: () => void }) {
  const now = new Date();
  const [form, setForm] = useState<CreateBatchForm>({ title: '', month: now.getMonth() + 1, year: now.getFullYear(), autoGenerate: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) { setForm({ title: '', month: now.getMonth() + 1, year: now.getFullYear(), autoGenerate: false }); setError(''); }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { title: form.title || `${MONTHS[form.month - 1]} ${form.year} Payroll`, month: form.month, year: form.year };
      if (form.autoGenerate) {
        await payrollApi.generateFromAttendance(payload);
      } else {
        await payrollApi.createBatch(payload);
      }
      onSave();
      onClose();
    } catch {
      setError('Failed to create payroll batch.');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">New Payroll Batch</h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Title (optional)</label>
            <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder={`${MONTHS[form.month - 1]} ${form.year} Payroll`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Month</label>
              <select value={form.month} onChange={e => setForm(f => ({ ...f, month: Number(e.target.value) }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Year</label>
              <Input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))} min={2020} max={2030} />
            </div>
          </div>
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
            <input type="checkbox" checked={form.autoGenerate} onChange={e => setForm(f => ({ ...f, autoGenerate: e.target.checked }))} className="mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-500" /> Auto-generate from attendance</p>
              <p className="text-xs text-gray-500 mt-0.5">Automatically calculate wages based on attendance records for this month</p>
            </div>
          </label>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2">
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Create Batch
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ContractorPayrollPage() {
  const [batches, setBatches] = useState<PayrollBatch[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [batchRes, summaryRes] = await Promise.all([
        payrollApi.listBatches({ page, limit: PAGE_SIZE, status: statusFilter || undefined }),
        payrollApi.getSummary().catch(() => null),
      ]);
      setBatches(batchRes.data ?? []);
      setTotal(batchRes.meta?.total ?? 0);
      if (summaryRes?.data) setSummary(summaryRes.data);
    } catch {
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleProcess = async (batchId: string) => {
    if (!confirm('Process this payroll batch? This will mark it as completed.')) return;
    setProcessing(batchId);
    await payrollApi.processBatch(batchId).catch(() => null);
    setProcessing(null);
    fetchData();
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const formatAmount = (n: number) => `₹${Number(n).toLocaleString('en-IN')}`;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage worker salary batches and disbursements</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="h-4 w-4" /> New Batch
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Batches',    value: summary?.totalBatches ?? '—',       color: 'text-blue-700',    bg: 'bg-blue-50' },
          { label: 'Completed',        value: summary?.completedBatches ?? '—',   color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Total Paid',       value: summary ? formatAmount(summary.totalPaid) : '—', color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'This Month',       value: summary ? formatAmount(summary.currentMonthTotal) : '—', color: 'text-indigo-700', bg: 'bg-indigo-50' },
          { label: 'Avg Monthly',      value: summary ? formatAmount(summary.avgMonthlyPayroll) : '—', color: 'text-purple-700', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide leading-tight">{s.label}</p>
            <p className={`text-lg font-bold mt-1 ${s.color} truncate`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_MAP).map(([val, { label }]) => <option key={val} value={val}>{label}</option>)}
        </select>
      </div>

      {/* Batches list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-900">Payroll Batches</p>
          <p className="text-sm text-gray-400">{total} batches</p>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><Loader2 className="h-7 w-7 animate-spin text-blue-500" /></div>
        ) : batches.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-7 w-7 text-green-400" />
            </div>
            <p className="font-semibold text-gray-700">No payroll batches yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-5">Create your first payroll batch to get started</p>
            <Button onClick={() => setModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="h-4 w-4" /> New Batch
            </Button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {batches.map(batch => (
                <div key={batch.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/80 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center shrink-0 transition-colors">
                    <IndianRupee className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate text-sm">{batch.title}</p>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{MONTHS[(batch.month ?? 1) - 1]} {batch.year}</span>
                      {batch._count && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{batch._count.records} workers</span>}
                      {batch.processedAt && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Processed {formatDate(batch.processedAt)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="font-bold text-gray-900 text-sm">{formatAmount(Number(batch.totalAmount ?? 0))}</p>
                      <p className="text-xs text-gray-400">Total</p>
                    </div>
                    <StatusBadge status={batch.status} />
                    {batch.status === 'DRAFT' && (
                      <button
                        type="button"
                        onClick={() => handleProcess(batch.id)}
                        disabled={processing === batch.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        {processing === batch.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                        Process
                      </button>
                    )}
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-gray-100">
                <Pagination page={page} totalPages={totalPages} totalItems={total} pageSize={PAGE_SIZE} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>

      <CreateBatchModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={fetchData} />
    </div>
  );
}
