'use client';

import { useState, useEffect } from 'react';
import { reportsApi, AdminReport } from '@/lib/reports-api';
import { Button } from '@/components/ui/button';
import { Plus, FileBarChart, Trash2, Loader2, Calendar } from 'lucide-react';

const REPORT_TYPES = [
  'PLATFORM_OVERVIEW', 'REVENUE_REPORT', 'HIRING_ANALYTICS',
  'WORKFORCE_ANALYTICS', 'ATTENDANCE_ANALYTICS', 'COMPLIANCE_REPORT',
  'USER_ACTIVITY', 'CUSTOM',
];

const TYPE_COLORS: Record<string, string> = {
  PLATFORM_OVERVIEW: 'bg-blue-100 text-blue-800',
  REVENUE_REPORT: 'bg-green-100 text-green-800',
  HIRING_ANALYTICS: 'bg-purple-100 text-purple-800',
  WORKFORCE_ANALYTICS: 'bg-orange-100 text-orange-800',
  ATTENDANCE_ANALYTICS: 'bg-teal-100 text-teal-800',
  COMPLIANCE_REPORT: 'bg-red-100 text-red-800',
  USER_ACTIVITY: 'bg-yellow-100 text-yellow-800',
  CUSTOM: 'bg-gray-100 text-gray-700',
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', type: 'PLATFORM_OVERVIEW',
    periodStart: '', periodEnd: '',
  });
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await reportsApi.getAll();
      setReports((res.data as unknown as { data: { reports: AdminReport[] } }).data.reports);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleGenerate = async () => {
    if (!form.title || !form.type) return;
    setGenerating(true);
    try {
      const res = await reportsApi.generate({
        title: form.title,
        type: form.type,
        periodStart: form.periodStart || undefined,
        periodEnd: form.periodEnd || undefined,
      });
      const newReport = (res.data as unknown as { data: AdminReport }).data;
      setReports(prev => [newReport, ...prev]);
      setShowForm(false);
      setForm({ title: '', type: 'PLATFORM_OVERVIEW', periodStart: '', periodEnd: '' });
      setSelectedReport(newReport);
    } catch {
      // handled
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this report?')) return;
    try {
      await reportsApi.deleteReport(id);
      setReports(prev => prev.filter(r => r.id !== id));
      if (selectedReport?.id === id) setSelectedReport(null);
    } catch {
      // handled
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Generate and download platform reports</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Generate Report
        </Button>
      </div>

      {/* Generate Form */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Generate New Report</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Title</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Q1 2026 Hiring Report"
                value={form.title}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.type}
                onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
              >
                {REPORT_TYPES.map(t => (
                  <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period Start</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.periodStart}
                onChange={(e) => setForm(f => ({ ...f, periodStart: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period End</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.periodEnd}
                onChange={(e) => setForm(f => ({ ...f, periodEnd: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleGenerate} disabled={generating} className="gap-2">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileBarChart className="h-4 w-4" />}
              Generate Report
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-900">Generated Reports</h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileBarChart className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No reports yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {reports.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedReport(r)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedReport?.id === r.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{r.title}</p>
                      <span className={`inline-flex mt-1 px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[r.type] ?? 'bg-gray-100 text-gray-700'}`}>
                        {r.type.replace(/_/g, ' ')}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(r.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}
                      className="p-1 rounded hover:bg-red-50 text-red-500 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Report Detail */}
        <div className="lg:col-span-2 bg-white border rounded-xl">
          {selectedReport ? (
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedReport.title}</h2>
                  <div className="flex gap-2 mt-1">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[selectedReport.type] ?? 'bg-gray-100 text-gray-700'}`}>
                      {selectedReport.type.replace(/_/g, ' ')}
                    </span>
                    {selectedReport.periodStart && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                        <Calendar className="h-3 w-3" />
                        {new Date(selectedReport.periodStart).toLocaleDateString('en-IN')} –{' '}
                        {selectedReport.periodEnd ? new Date(selectedReport.periodEnd).toLocaleDateString('en-IN') : 'now'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {selectedReport.data && (
                <div className="bg-gray-50 rounded-xl p-4 overflow-auto max-h-[60vh]">
                  <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(selectedReport.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
              <FileBarChart className="h-14 w-14 mb-3 opacity-30" />
              <p className="font-medium">Select a report to view details</p>
              <p className="text-sm mt-1">Or generate a new report</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
