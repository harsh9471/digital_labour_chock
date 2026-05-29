'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { adminPanelApi, AuditLog } from '@/lib/admin-panel-api';
import { Button } from '@/components/ui/button';
import { Search, FileText, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

const ACTION_COLORS: Record<string, string> = {
  UPDATE_USER_STATUS: 'bg-yellow-100 text-yellow-800',
  DELETE_USER: 'bg-red-100 text-red-800',
  DOCUMENT_VERIFIED: 'bg-green-100 text-green-800',
  DOCUMENT_REJECTED: 'bg-red-100 text-red-800',
  CONTRACTOR_VERIFIED: 'bg-green-100 text-green-800',
  CONTRACTOR_UNVERIFIED: 'bg-orange-100 text-orange-800',
  COMPANY_VERIFIED: 'bg-green-100 text-green-800',
  WORKER_KYC_UPDATE: 'bg-blue-100 text-blue-800',
};

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminPanelApi.getAuditLogs({
        page, limit: 25,
        userId: userId || undefined,
        resourceType: resourceType || undefined,
      });
      const d = (res.data as unknown as { data: { logs: AuditLog[]; pagination: { total: number } } }).data;
      setLogs(d.logs);
      setTotal(d.pagination.total);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, [page, userId, resourceType]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const RESOURCE_TYPES = ['User', 'Worker', 'Contractor', 'Company', 'Document', 'Job'];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-sm text-gray-500 mt-1">Track all administrative actions — {total} entries</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            placeholder="Filter by user ID..."
            value={userId}
            onChange={(e) => { setUserId(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={resourceType}
          onChange={(e) => { setResourceType(e.target.value); setPage(1); }}
        >
          <option value="">All Resource Types</option>
          {RESOURCE_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Logs */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No audit logs found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Action</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Resource</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Admin</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">IP</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">When</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <React.Fragment key={log.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ACTION_COLORS[log.action] ?? 'bg-gray-100 text-gray-700'}`}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{log.resourceType}</p>
                      {log.resourceId && (
                        <p className="text-xs text-gray-400 font-mono">{log.resourceId.slice(-8)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700 font-mono text-xs">{log.userId?.slice(-12) ?? '—'}</p>
                      <p className="text-xs text-gray-400">{log.userRole ?? '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{log.ipAddress ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(log.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-4 py-3">
                      {(log.before || log.after) && (
                        <button
                          onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                        >
                          {expanded === log.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          {expanded === log.id ? 'Hide' : 'Show'}
                        </button>
                      )}
                    </td>
                  </tr>
                  {expanded === log.id && (log.before || log.after) && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-4 py-3">
                        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                          {log.before && (
                            <div>
                              <p className="font-semibold text-gray-500 mb-1">Before</p>
                              <pre className="bg-white border rounded p-2 overflow-x-auto">
                                {JSON.stringify(log.before, null, 2)}
                              </pre>
                            </div>
                          )}
                          {log.after && (
                            <div>
                              <p className="font-semibold text-gray-500 mb-1">After</p>
                              <pre className="bg-white border rounded p-2 overflow-x-auto">
                                {JSON.stringify(log.after, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}

        {!loading && total > 25 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * 25 + 1}–{Math.min(page * 25, total)} of {total}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page * 25 >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
