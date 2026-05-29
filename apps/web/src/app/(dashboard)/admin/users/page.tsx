'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminPanelApi } from '@/lib/admin-panel-api';
import { Button } from '@/components/ui/button';
import {
  Search, CheckCircle, XCircle, Ban, Loader2,
} from 'lucide-react';

interface UserRecord {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: string;
  status: string;
  lastLoginAt?: string;
  createdAt: string;
  worker?: { kycStatus: string; rating?: number } | null;
  contractor?: { isVerified: boolean; rating?: number } | null;
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-700',
  SUSPENDED: 'bg-yellow-100 text-yellow-800',
  PENDING_VERIFICATION: 'bg-blue-100 text-blue-800',
  BANNED: 'bg-red-100 text-red-800',
};

const ROLE_COLORS: Record<string, string> = {
  WORKER: 'bg-purple-100 text-purple-800',
  CONTRACTOR: 'bg-orange-100 text-orange-800',
  COMPANY_ADMIN: 'bg-teal-100 text-teal-800',
  SUPER_ADMIN: 'bg-red-100 text-red-800',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminPanelApi.getUsers({
        page, limit: 20,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
        search: search || undefined,
      });
      const d = (res.data as unknown as { data: { users: UserRecord[]; pagination: { total: number } } }).data;
      setUsers(d.users);
      setTotal(d.pagination.total);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await adminPanelApi.updateUserStatus(id, status);
      await fetchUsers();
    } catch {
      // handled
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all platform users — {total} total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Roles</option>
          <option value="WORKER">Worker</option>
          <option value="CONTRACTOR">Contractor</option>
          <option value="COMPANY_ADMIN">Company Admin</option>
        </select>
        <select
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING_VERIFICATION">Pending</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="BANNED">Banned</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">User</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Contact</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">KYC / Verified</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Joined</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                          {u.firstName[0]}{u.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-gray-500">{u.id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700">{u.email || '—'}</p>
                      <p className="text-xs text-gray-500">{u.phone || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[u.role] ?? 'bg-gray-100 text-gray-700'}`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[u.status] ?? 'bg-gray-100 text-gray-700'}`}>
                        {u.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.worker && (
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${u.worker.kycStatus === 'VERIFIED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          KYC: {u.worker.kycStatus}
                        </span>
                      )}
                      {u.contractor && (
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${u.contractor.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {u.contractor.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      )}
                      {!u.worker && !u.contractor && <span className="text-gray-400 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {u.status !== 'ACTIVE' && (
                          <button
                            onClick={() => updateStatus(u.id, 'ACTIVE')}
                            disabled={actionLoading === u.id}
                            className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors"
                            title="Activate"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {u.status !== 'SUSPENDED' && (
                          <button
                            onClick={() => updateStatus(u.id, 'SUSPENDED')}
                            disabled={actionLoading === u.id}
                            className="p-1.5 rounded hover:bg-yellow-50 text-yellow-600 transition-colors"
                            title="Suspend"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                        {u.status !== 'BANNED' && (
                          <button
                            onClick={() => updateStatus(u.id, 'BANNED')}
                            disabled={actionLoading === u.id}
                            className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors"
                            title="Ban"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && total > 20 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
