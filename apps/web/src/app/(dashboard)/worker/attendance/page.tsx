'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarCheck, Clock, CheckCircle, XCircle, TrendingUp, RefreshCw } from 'lucide-react';
import { attendanceApi } from '@/lib/attendance-api';
import type { AttendanceRecord } from '@/lib/attendance-api';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth.store';

const STATUS_STYLES: Record<string, string> = {
  PRESENT: 'bg-green-50 text-green-700 border-green-200',
  ABSENT: 'bg-red-50 text-red-700 border-red-200',
  HALF_DAY: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  HOLIDAY: 'bg-blue-50 text-blue-700 border-blue-200',
  LEAVE: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function WorkerAttendancePage() {
  const { user } = useAuthStore();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Summary
  const [summary, setSummary] = useState({ present: 0, absent: 0, halfDay: 0, totalHours: 0 });

  const fetchAttendance = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await attendanceApi.list({
        page,
        limit: 15,
        workerId: user.id,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        status: statusFilter || undefined,
      });
      setRecords(res.data);
      setTotal(res.meta.total);
      setTotalPages(res.meta.totalPages);

      // Compute summary from loaded data
      const present = res.data.filter((r) => r.status === 'PRESENT').length;
      const absent = res.data.filter((r) => r.status === 'ABSENT').length;
      const halfDay = res.data.filter((r) => r.status === 'HALF_DAY').length;
      const totalHours = res.data.reduce((acc, r) => acc + (r.totalHours ?? 0), 0);
      setSummary({ present, absent, halfDay, totalHours });
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, user?.id, startDate, endDate, statusFilter]);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  const attendanceRate = summary.present + summary.absent + summary.halfDay > 0
    ? Math.round((summary.present / (summary.present + summary.absent + summary.halfDay)) * 100)
    : 0;

  const summaryCards = [
    { label: 'Days Present', value: summary.present, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Days Absent', value: summary.absent, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Half Days', value: summary.halfDay, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Attendance Rate', value: `${attendanceRate}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Attendance</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track your work attendance records</p>
        </div>
        <button onClick={fetchAttendance} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`h-4.5 w-4.5 ${card.color}`} />
                </div>
                <div className="text-2xl font-bold text-slate-900">{card.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{card.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">From</label>
              <input
                type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">To</label>
              <input
                type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select
                value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="HALF_DAY">Half Day</option>
                <option value="HOLIDAY">Holiday</option>
                <option value="LEAVE">Leave</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-16">
          <CalendarCheck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No attendance records found</p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Site</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Check In</th>
                  <th className="py-3 px-4 text-left">Check Out</th>
                  <th className="py-3 px-4 text-left">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">
                      {new Date(record.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {record.site?.name ?? '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[record.status] ?? 'bg-slate-50 text-slate-600'}`}>
                        {record.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {record.totalHours != null ? `${Number(record.totalHours).toFixed(1)}h` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">{page} / {totalPages} ({total} records)</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
