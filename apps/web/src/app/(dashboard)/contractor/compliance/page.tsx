'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Shield, Plus, Calendar, AlertCircle, CheckCircle,
  Clock, FileText, Search, Loader2, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { complianceApi, ComplianceRecord, ComplianceSummary } from '@/lib/compliance-api';
import { formatDate } from '@/lib/utils';

const PAGE_SIZE = 10;

const STATUS_MAP: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  PENDING:   { label: 'Pending',   cls: 'bg-amber-50 text-amber-700 border-amber-200',    icon: Clock },
  IN_REVIEW: { label: 'In Review', cls: 'bg-blue-50 text-blue-700 border-blue-200',       icon: FileText },
  APPROVED:  { label: 'Approved',  cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  REJECTED:  { label: 'Rejected',  cls: 'bg-red-50 text-red-700 border-red-200',          icon: X },
  OVERDUE:   { label: 'Overdue',   cls: 'bg-red-100 text-red-800 border-red-300',         icon: AlertCircle },
};

const TYPE_LABELS: Record<string, string> = {
  PF: 'PF', ESI: 'ESI', LABOUR_LICENSE: 'Labour License',
  SAFETY_AUDIT: 'Safety Audit', TAX_FILING: 'Tax Filing',
  INSURANCE: 'Insurance', OTHER: 'Other',
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600 border-gray-200', icon: FileText };
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${s.cls}`}>
      <Icon className="h-3 w-3" />{s.label}
    </span>
  );
}

type ComplianceType = ComplianceRecord['type'];
const DEFAULT_FORM: { type: ComplianceType; title: string; description: string; dueDate: string; notes: string; documentUrl: string } = {
  type: 'PF', title: '', description: '', dueDate: '', notes: '', documentUrl: '',
};

function ComplianceModal({ open, record, onClose, onSave }: {
  open: boolean; record: ComplianceRecord | null; onClose: () => void; onSave: () => void;
}) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (record) {
      setForm({
        type: (record.type ?? 'PF') as ComplianceType,
        title: record.title ?? '',
        description: record.description ?? '',
        dueDate: record.dueDate ? record.dueDate.slice(0, 10) : '',
        notes: record.notes ?? '',
        documentUrl: record.documentUrl ?? '',
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setError('');
  }, [record, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (record) {
        await complianceApi.update(record.id, form);
      } else {
        await complianceApi.create(form);
      }
      onSave();
      onClose();
    } catch {
      setError('Failed to save compliance record.');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{record ? 'Edit Record' : 'New Compliance Record'}</h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Type *</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as ComplianceType }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {Object.entries(TYPE_LABELS).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Due Date *</label>
              <Input required type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Title *</label>
            <Input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. PF March 2025 Filing" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Additional details..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Document URL</label>
            <Input value={form.documentUrl} onChange={e => setForm(f => ({ ...f, documentUrl: e.target.value }))} placeholder="https://..." />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Notes</label>
            <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Internal notes..." />
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2">
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {record ? 'Save Changes' : 'Create Record'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ContractorCompliancePage() {
  const [records, setRecords] = useState<ComplianceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<ComplianceSummary | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<ComplianceRecord | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [listRes, summaryRes] = await Promise.all([
        complianceApi.list({ page, limit: PAGE_SIZE, status: statusFilter || undefined, type: typeFilter || undefined }),
        complianceApi.getSummary().catch(() => null),
      ]);
      setRecords(listRes.data ?? []);
      setTotal(listRes.meta?.total ?? 0);
      if (summaryRes?.data) setSummary(summaryRes.data);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, typeFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this compliance record?')) return;
    await complianceApi.delete(id).catch(() => null);
    fetchData();
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const filtered = search
    ? records.filter(r => r.title.toLowerCase().includes(search.toLowerCase()))
    : records;

  const isOverdue = (r: ComplianceRecord) => r.status === 'OVERDUE' || (r.status === 'PENDING' && new Date(r.dueDate) < new Date());

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track regulatory filings and compliance deadlines</p>
        </div>
        <Button onClick={() => { setEditRecord(null); setModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="h-4 w-4" /> New Record
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total',    value: summary?.total ?? '—',    color: 'text-blue-700',    bg: 'bg-blue-50' },
          { label: 'Pending',  value: summary?.pending ?? '—',  color: 'text-amber-700',   bg: 'bg-amber-50' },
          { label: 'Overdue',  value: summary?.overdue ?? '—',  color: 'text-red-700',     bg: 'bg-red-50' },
          { label: 'Approved', value: summary?.approved ?? '—', color: 'text-emerald-700', bg: 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input className="pl-9" placeholder="Search compliance..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">All Types</option>
          {Object.entries(TYPE_LABELS).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">All Statuses</option>
          {Object.entries(STATUS_MAP).map(([val, { label }]) => <option key={val} value={val}>{label}</option>)}
        </select>
      </div>

      {/* Records list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-900">Compliance Records</p>
          <p className="text-sm text-gray-400">{total} records</p>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><Loader2 className="h-7 w-7 animate-spin text-blue-500" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-7 w-7 text-blue-400" />
            </div>
            <p className="font-semibold text-gray-700">No compliance records found</p>
            <p className="text-sm text-gray-400 mt-1 mb-5">Add your first compliance record to stay on top of regulatory requirements</p>
            <Button onClick={() => { setEditRecord(null); setModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="h-4 w-4" /> New Record
            </Button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {filtered.map(record => (
                <div key={record.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50/80 transition-colors group ${isOverdue(record) ? 'border-l-2 border-red-400' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isOverdue(record) ? 'bg-red-50 group-hover:bg-red-100' : 'bg-blue-50 group-hover:bg-blue-100'}`}>
                    <Shield className={`h-4 w-4 ${isOverdue(record) ? 'text-red-500' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 truncate text-sm">{record.title}</p>
                      <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{TYPE_LABELS[record.type] ?? record.type}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due {formatDate(record.dueDate)}
                        {isOverdue(record) && <span className="text-red-500 font-semibold ml-1">Overdue</span>}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={record.status} />
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => { setEditRecord(record); setModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-medium transition-colors">Edit</button>
                      <button type="button" onClick={() => handleDelete(record.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors">Delete</button>
                    </div>
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

      <ComplianceModal open={modalOpen} record={editRecord} onClose={() => { setModalOpen(false); setEditRecord(null); }} onSave={fetchData} />
    </div>
  );
}
