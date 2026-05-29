'use client';

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, RefreshCw, CheckCircle, Clock, XCircle } from 'lucide-react';
import { complaintsApi } from '@/lib/complaints-api';
import type { Complaint, ComplaintStatus, ComplaintType } from '@/lib/complaints-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const STATUS_VARIANTS: Record<ComplaintStatus, 'warning' | 'info' | 'success' | 'secondary'> = {
  OPEN: 'warning', UNDER_REVIEW: 'info', RESOLVED: 'success', DISMISSED: 'secondary',
};
const TYPE_LABELS: Record<ComplaintType, string> = {
  PAYMENT_DISPUTE: 'Payment Dispute', HARASSMENT: 'Harassment', FRAUD: 'Fraud',
  SAFETY_VIOLATION: 'Safety Violation', CONTRACT_BREACH: 'Contract Breach', OTHER: 'Other',
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [_total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | ''>('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolution, setResolution] = useState('');

  // Summary
  const [summary, setSummary] = useState({ total: 0, open: 0, underReview: 0, resolved: 0, dismissed: 0 });

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const [listRes, summaryRes] = await Promise.all([
        complaintsApi.list({ page, limit: 15, status: statusFilter || undefined }),
        complaintsApi.getSummary(),
      ]);
      setComplaints(listRes.data);
      setTotal(listRes.meta.total);
      setTotalPages(listRes.meta.totalPages);
      setSummary(summaryRes.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleUpdateStatus = async (id: string, status: ComplaintStatus, res?: string) => {
    setUpdating(id);
    try {
      await complaintsApi.update(id, { status, resolution: res });
      setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, status, resolution: res ?? c.resolution } : c));
      setSelectedComplaint(null);
      setResolution('');
    } catch {
      // ignore
    } finally {
      setUpdating(null);
    }
  };

  const summaryItems = [
    { label: 'Total', value: summary.total, color: 'text-slate-900', bg: 'bg-slate-100', icon: AlertTriangle },
    { label: 'Open', value: summary.open, color: 'text-yellow-700', bg: 'bg-yellow-50', icon: Clock },
    { label: 'Resolved', value: summary.resolved, color: 'text-green-700', bg: 'bg-green-50', icon: CheckCircle },
    { label: 'Dismissed', value: summary.dismissed, color: 'text-slate-500', bg: 'bg-slate-50', icon: XCircle },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Complaints</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage platform complaints and disputes</p>
        </div>
        <button onClick={fetchComplaints} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryItems.map(({ label, value, color, bg, icon: Icon }) => (
          <Card key={label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`h-4.5 w-4.5 ${color}`} />
              </div>
              <div>
                <div className={`text-xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-slate-400">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <select
            value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as ComplaintStatus | ''); setPage(1); }}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </CardContent>
      </Card>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-16">
          <AlertTriangle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No complaints found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map((complaint) => (
            <Card key={complaint.id} className={`border-0 shadow-sm ${complaint.status === 'OPEN' ? 'border-l-2 border-l-yellow-400' : ''}`}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900 text-sm">{complaint.title}</h3>
                      <Badge variant={STATUS_VARIANTS[complaint.status]} className="text-xs">
                        {complaint.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">{TYPE_LABELS[complaint.type] ?? complaint.type}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{complaint.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 flex-wrap">
                      {complaint.reporter && (
                        <span>By: {complaint.reporter.firstName} {complaint.reporter.lastName} ({complaint.reporter.role})</span>
                      )}
                      <span>{new Date(complaint.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    {complaint.resolution && (
                      <p className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded mt-2">
                        Resolution: {complaint.resolution}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 sm:shrink-0 flex-wrap">
                    {complaint.status === 'OPEN' && (
                      <button
                        onClick={() => handleUpdateStatus(complaint.id, 'UNDER_REVIEW')}
                        disabled={updating === complaint.id}
                        className="flex-1 sm:flex-none px-2.5 py-1.5 text-xs border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-center"
                      >
                        Review
                      </button>
                    )}
                    {(complaint.status === 'OPEN' || complaint.status === 'UNDER_REVIEW') && (
                      <button
                        onClick={() => { setSelectedComplaint(complaint); setResolution(''); }}
                        className="flex-1 sm:flex-none px-2.5 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
                      >
                        Resolve
                      </button>
                    )}
                    {complaint.status !== 'DISMISSED' && complaint.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleUpdateStatus(complaint.id, 'DISMISSED')}
                        disabled={updating === complaint.id}
                        className="flex-1 sm:flex-none px-2.5 py-1.5 text-xs border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition-colors text-center"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors">
            Previous
          </button>
          <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors">
            Next
          </button>
        </div>
      )}

      {/* Resolve Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md border-0 shadow-2xl">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 mb-2">Resolve Complaint</h3>
              <p className="text-sm text-slate-500 mb-4">{selectedComplaint.title}</p>
              <textarea
                rows={4} value={resolution} onChange={(e) => setResolution(e.target.value)}
                placeholder="Describe the resolution..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setSelectedComplaint(null)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedComplaint.id, 'RESOLVED', resolution)}
                  disabled={!resolution || updating === selectedComplaint.id}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
                >
                  {updating === selectedComplaint.id ? 'Resolving...' : 'Mark Resolved'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
