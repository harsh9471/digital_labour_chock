'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Shield, Calendar, AlertCircle, CheckCircle,
  Clock, FileText, Search, Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { complianceApi, ComplianceRecord, ComplianceSummary } from '@/lib/compliance-api';
import { formatDate } from '@/lib/utils';

const PAGE_SIZE = 10;

const STATUS_MAP: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  PENDING:   { label: 'Pending',   cls: 'bg-amber-50 text-amber-700 border-amber-200',       icon: Clock },
  IN_REVIEW: { label: 'In Review', cls: 'bg-blue-50 text-blue-700 border-blue-200',          icon: FileText },
  APPROVED:  { label: 'Approved',  cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  REJECTED:  { label: 'Rejected',  cls: 'bg-red-50 text-red-700 border-red-200',             icon: AlertCircle },
  OVERDUE:   { label: 'Overdue',   cls: 'bg-red-100 text-red-800 border-red-300',            icon: AlertCircle },
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

export default function CompanyCompliancePage() {
  const [records, setRecords] = useState<ComplianceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<ComplianceSummary | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [listRes, summaryRes] = await Promise.all([
        complianceApi.list({ page, limit: PAGE_SIZE, status: statusFilter || undefined }),
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
  }, [page, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtered = search ? records.filter(r => r.title.toLowerCase().includes(search.toLowerCase())) : records;
  const isOverdue = (r: ComplianceRecord) => r.status === 'OVERDUE' || (r.status === 'PENDING' && new Date(r.dueDate) < new Date());

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compliance</h1>
        <p className="text-sm text-gray-500 mt-0.5">Monitor regulatory compliance across your organization</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total',    value: summary?.total ?? '—',    color: 'text-violet-700', bg: 'bg-violet-50' },
          { label: 'Pending',  value: summary?.pending ?? '—',  color: 'text-amber-700',  bg: 'bg-amber-50' },
          { label: 'Overdue',  value: summary?.overdue ?? '—',  color: 'text-red-700',    bg: 'bg-red-50' },
          { label: 'Approved', value: summary?.approved ?? '—', color: 'text-emerald-700',bg: 'bg-emerald-50' },
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
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
          <option value="">All Statuses</option>
          {Object.entries(STATUS_MAP).map(([val, { label }]) => <option key={val} value={val}>{label}</option>)}
        </select>
      </div>

      {/* Records */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-900">Compliance Records</p>
          <p className="text-sm text-gray-400">{total} records</p>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><Loader2 className="h-7 w-7 animate-spin text-violet-500" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-600">No compliance records found</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {filtered.map(record => (
                <div key={record.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50/80 transition-colors ${isOverdue(record) ? 'border-l-2 border-red-400' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isOverdue(record) ? 'bg-red-50' : 'bg-violet-50'}`}>
                    <Shield className={`h-4 w-4 ${isOverdue(record) ? 'text-red-500' : 'text-violet-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 truncate text-sm">{record.title}</p>
                      <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{TYPE_LABELS[record.type] ?? record.type}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due {formatDate(record.dueDate)}
                      {isOverdue(record) && <span className="text-red-500 font-semibold ml-1">Overdue</span>}
                    </p>
                  </div>
                  <StatusBadge status={record.status} />
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
    </div>
  );
}
