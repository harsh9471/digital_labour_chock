'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  CalendarCheck, TrendingUp, Search,
  CheckCircle, XCircle, MinusCircle, Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { attendanceApi, AttendanceRecord } from '@/lib/attendance-api';
import { formatDate } from '@/lib/utils';

const PAGE_SIZE = 15;

const STATUS_MAP: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
  PRESENT:  { label: 'Present',  icon: CheckCircle, cls: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  ABSENT:   { label: 'Absent',   icon: XCircle,     cls: 'text-red-500 bg-red-50 border-red-200' },
  HALF_DAY: { label: 'Half Day', icon: MinusCircle, cls: 'text-amber-600 bg-amber-50 border-amber-200' },
  HOLIDAY:  { label: 'Holiday',  icon: CalendarCheck, cls: 'text-blue-600 bg-blue-50 border-blue-200' },
  LEAVE:    { label: 'Leave',    icon: MinusCircle, cls: 'text-purple-600 bg-purple-50 border-purple-200' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status];
  if (!s) return <span className="text-xs text-gray-400">{status}</span>;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${s.cls}`}>
      <Icon className="h-3 w-3" />{s.label}
    </span>
  );
}

export default function ContractorAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [todaySummary, setTodaySummary] = useState<{ totalPresent: number; totalAbsent: number; totalHalfDay: number; attendanceRate: number } | null>(null);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const [listRes, todayRes] = await Promise.all([
        attendanceApi.list({
          page, limit: PAGE_SIZE,
          status: statusFilter || undefined,
          startDate: dateFilter || undefined,
          endDate: dateFilter || undefined,
        }),
        attendanceApi.getToday().catch(() => null),
      ]);
      setRecords(listRes.data ?? []);
      setTotal(listRes.meta?.total ?? 0);
      if (todayRes?.data) setTodaySummary(todayRes.data);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, dateFilter]);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const filtered = search
    ? records.filter(r => {
        const name = `${r.worker?.user.firstName ?? ''} ${r.worker?.user.lastName ?? ''}`.toLowerCase();
        return name.includes(search.toLowerCase());
      })
    : records;

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track daily worker attendance across all sites</p>
      </div>

      {/* Today summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Today's Present", value: todaySummary?.totalPresent ?? '—', color: 'text-emerald-700', bg: 'bg-emerald-50', icon: CheckCircle, iconCls: 'text-emerald-500' },
          { label: "Today's Absent",  value: todaySummary?.totalAbsent ?? '—',  color: 'text-red-700',     bg: 'bg-red-50',     icon: XCircle,     iconCls: 'text-red-400' },
          { label: 'Half Day',        value: todaySummary?.totalHalfDay ?? '—', color: 'text-amber-700',   bg: 'bg-amber-50',   icon: MinusCircle, iconCls: 'text-amber-500' },
          { label: 'Attendance Rate', value: todaySummary ? `${todaySummary.attendanceRate.toFixed(0)}%` : '—', color: 'text-blue-700', bg: 'bg-blue-50', icon: TrendingUp, iconCls: 'text-blue-500' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 flex items-start justify-between`}>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
              <Icon className={`h-6 w-6 mt-1 ${s.iconCls}`} />
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Search worker..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={e => { setDateFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_MAP).map(([val, { label }]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* Records table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-900">Attendance Records</p>
          <p className="text-sm text-gray-400">{total} records</p>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <CalendarCheck className="h-7 w-7 text-blue-400" />
            </div>
            <p className="font-semibold text-gray-700">No attendance records found</p>
            <p className="text-sm text-gray-400 mt-1">Attendance will appear here once workers check in</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Worker</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Site</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Check In</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Check Out</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Hours</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-900">
                        {r.worker?.user.firstName} {r.worker?.user.lastName}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{r.site?.name ?? '—'}</td>
                      <td className="px-5 py-3.5 text-gray-500">{formatDate(r.date)}</td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-700 font-medium">
                        {r.totalHours != null ? `${Number(r.totalHours).toFixed(1)}h` : '—'}
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {filtered.map(r => (
                <div key={r.id} className="px-4 py-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 text-sm">
                      {r.worker?.user.firstName} {r.worker?.user.lastName}
                    </p>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>{r.site?.name ?? '—'}</span>
                    <span>{formatDate(r.date)}</span>
                    {r.totalHours != null && <span className="font-medium text-gray-700">{Number(r.totalHours).toFixed(1)}h</span>}
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
    </div>
  );
}
