'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CalendarCheck, Clock, CheckCircle, XCircle,
  TrendingUp, RefreshCw, LogIn, LogOut, MapPin, Loader2,
} from 'lucide-react';
import { attendanceApi } from '@/lib/attendance-api';
import type { AttendanceRecord } from '@/lib/attendance-api';
import { useAuthStore } from '@/store/auth.store';

/* ── status badge styles ── */
const STATUS_STYLES: Record<string, string> = {
  PRESENT:  'bg-emerald-100 text-emerald-700 border-emerald-300',
  ABSENT:   'bg-red-100 text-red-700 border-red-300',
  HALF_DAY: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  HOLIDAY:  'bg-blue-100 text-blue-700 border-blue-300',
  LEAVE:    'bg-purple-100 text-purple-700 border-purple-300',
};

/* ── small toast ── */
function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-semibold transition-all
      ${ok ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
      {ok ? <CheckCircle className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
      {msg}
    </div>
  );
}

export default function WorkerAttendancePage() {
  const { user } = useAuthStore();

  /* clock */
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* attendance state */
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  /* filters */
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  /* monthly summary computed from loaded data */
  const [summary, setSummary] = useState({ present: 0, absent: 0, halfDay: 0, totalHours: 0 });

  /* today's record (first PRESENT record from today if any) */
  const todayStr = now.toISOString().split('T')[0];
  const todayRecord = records.find(
    (r) => r.date?.startsWith(todayStr) && (r.status === 'PRESENT' || r.checkInTime)
  ) ?? null;
  const isSignedIn = !!todayRecord?.checkInTime && !todayRecord?.checkOutTime;

  /* ── fetch ── */
  const fetchAttendance = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await attendanceApi.list({
        page,
        limit: 30,
        workerId: user.id,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        status: statusFilter || undefined,
      });
      setRecords(res.data);
      setTotal(res.meta.total);
      setTotalPages(res.meta.totalPages);
      const present    = res.data.filter((r) => r.status === 'PRESENT').length;
      const absent     = res.data.filter((r) => r.status === 'ABSENT').length;
      const halfDay    = res.data.filter((r) => r.status === 'HALF_DAY').length;
      const totalHours = res.data.reduce((acc, r) => acc + (r.totalHours ?? 0), 0);
      setSummary({ present, absent, halfDay, totalHours });
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [page, user?.id, startDate, endDate, statusFilter]);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  /* ── show toast helper ── */
  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── sign in ── */
  const handleSignIn = async () => {
    if (!user?.id) return;
    setActionLoading(true);
    try {
      await attendanceApi.checkIn({
        workerId: user.id,
        siteId: 'demo-site-001',
        notes: 'Checked in via app',
      });
      showToast('Signed in successfully!', true);
      await fetchAttendance();
    } catch {
      showToast('Failed to sign in. Please try again.', false);
    } finally {
      setActionLoading(false);
    }
  };

  /* ── sign out ── */
  const handleSignOut = async () => {
    if (!todayRecord?.id) return;
    setActionLoading(true);
    try {
      await attendanceApi.checkOut(todayRecord.id, { notes: 'Checked out via app' });
      showToast('Signed out successfully!', true);
      await fetchAttendance();
    } catch {
      showToast('Failed to sign out. Please try again.', false);
    } finally {
      setActionLoading(false);
    }
  };

  const attendanceRate =
    summary.present + summary.absent + summary.halfDay > 0
      ? Math.round((summary.present / (summary.present + summary.absent + summary.halfDay)) * 100)
      : 0;

  /* ── helpers ── */
  const fmtTime = (iso?: string) =>
    iso ? new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—';
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  /* hours worked today */
  const hoursToday = todayRecord?.totalHours
    ? `${Number(todayRecord.totalHours).toFixed(1)}h`
    : todayRecord?.checkInTime
    ? (() => {
        const diff = (Date.now() - new Date(todayRecord.checkInTime).getTime()) / 3_600_000;
        return `${diff.toFixed(1)}h`;
      })()
    : '0h';

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 space-y-6">
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Attendance</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track your daily sign-in & sign-out</p>
        </div>
        <button
          onClick={fetchAttendance}
          className="p-2 rounded-xl hover:bg-white text-slate-500 transition-colors shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* ── Unified clock + action card ── */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl p-5 sm:p-6 text-white shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-5">

          {/* Left: Live clock */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-1">
              {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-4xl sm:text-5xl font-bold font-mono tabular-nums tracking-tight">
              {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>

          {/* Right: status + compact action buttons */}
          <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
            {/* Status badge */}
            {isSignedIn ? (
              <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-4 py-1.5 rounded-full">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-emerald-300 font-bold text-xs tracking-widest uppercase">Signed In</span>
                {todayRecord?.checkInTime && (
                  <span className="text-emerald-400/70 text-xs">· since {fmtTime(todayRecord.checkInTime)}</span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-slate-700/60 border border-slate-600 px-4 py-1.5 rounded-full">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
                <span className="text-slate-400 font-bold text-xs tracking-widest uppercase">Not Signed In</span>
              </div>
            )}

            {/* Compact Sign In / Sign Out buttons side by side */}
            <div className="flex gap-2.5">
              <button
                onClick={handleSignIn}
                disabled={actionLoading || isSignedIn}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-md
                  bg-gradient-to-r from-emerald-500 to-teal-600 text-white
                  ${isSignedIn || actionLoading
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:shadow-emerald-500/40 hover:shadow-lg hover:scale-105 active:scale-95'
                  }`}
              >
                {actionLoading && !isSignedIn
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <LogIn className="h-4 w-4" />
                }
                Sign In
              </button>

              <button
                onClick={handleSignOut}
                disabled={actionLoading || !isSignedIn}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-md
                  bg-gradient-to-r from-red-500 to-rose-600 text-white
                  ${!isSignedIn || actionLoading
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:shadow-red-500/40 hover:shadow-lg hover:scale-105 active:scale-95'
                  }`}
              >
                {actionLoading && isSignedIn
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <LogOut className="h-4 w-4" />
                }
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Today's summary ── */}
      {(isSignedIn || todayRecord) && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Today&apos;s Summary</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-900">{hoursToday}</p>
              <p className="text-xs text-slate-500 mt-0.5">Hours Worked</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{fmtTime(todayRecord?.checkInTime)}</p>
              <p className="text-xs text-slate-500 mt-0.5">Check-In</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{fmtTime(todayRecord?.checkOutTime)}</p>
              <p className="text-xs text-slate-500 mt-0.5">Check-Out</p>
            </div>
          </div>
          {todayRecord?.site && (
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 justify-center">
              <MapPin className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-medium text-slate-700">{todayRecord.site.name}</span>
              <span>·</span>
              <span>{todayRecord.site.city}</span>
            </div>
          )}
        </div>
      )}

      {/* ── Monthly stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Days Present */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-75">Days Present</p>
              <p className="text-3xl font-bold mt-1">{summary.present}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </div>
        {/* Days Absent */}
        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-4 text-white shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-75">Days Absent</p>
              <p className="text-3xl font-bold mt-1">{summary.absent}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <XCircle className="h-5 w-5" />
            </div>
          </div>
        </div>
        {/* Total Hours */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-75">Total Hours</p>
              <p className="text-3xl font-bold mt-1">{summary.totalHours.toFixed(0)}h</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </div>
        {/* Attendance Rate */}
        <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-4 text-white shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-75">Attendance Rate</p>
              <p className="text-3xl font-bold mt-1">{attendanceRate}%</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
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
      </div>

      {/* ── History table ── */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <CalendarCheck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No attendance records found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900 text-sm">Attendance History</h2>
            <p className="text-xs text-slate-400 mt-0.5">{total} total records</p>
          </div>
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
                  <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">
                      {fmtDate(record.date)}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {record.site?.name ?? '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[record.status] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {record.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{fmtTime(record.checkInTime)}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{fmtTime(record.checkOutTime)}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {record.totalHours != null ? `${Number(record.totalHours).toFixed(1)}h` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm border border-slate-200 bg-white rounded-xl disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-sm"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500 font-medium px-2">
            {page} / {totalPages} &middot; {total} records
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm border border-slate-200 bg-white rounded-xl disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
