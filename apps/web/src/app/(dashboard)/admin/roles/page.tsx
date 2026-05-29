'use client';

import { useState, useEffect } from 'react';
import { adminPanelApi, Role, Permission } from '@/lib/admin-panel-api';
import { Button } from '@/components/ui/button';
import { Plus, Shield, Trash2, Loader2, Lock } from 'lucide-react';

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', displayName: '', description: '' });
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        adminPanelApi.getRoles(),
        adminPanelApi.getPermissions(),
      ]);
      setRoles((rolesRes.data as unknown as { data: Role[] }).data);
      setPermissions((permsRes.data as unknown as { data: Permission[] }).data);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    if (!form.name || !form.displayName) return;
    setSaving(true);
    try {
      await adminPanelApi.createRole({ ...form, permissionIds: selectedPerms });
      setShowCreate(false);
      setForm({ name: '', displayName: '', description: '' });
      setSelectedPerms([]);
      await fetchData();
    } catch {
      // handled
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this role?')) return;
    try {
      await adminPanelApi.deleteRole(id);
      await fetchData();
    } catch {
      // handled
    }
  };

  const groupedPerms = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    if (!acc[p.resource]) acc[p.resource] = [];
    acc[p.resource].push(p);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage roles and their permissions</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Create Role
        </Button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Create New Role</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (slug)</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. site_manager"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Site Manager"
                value={form.displayName}
                onChange={(e) => setForm(f => ({ ...f, displayName: e.target.value }))}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Role description..."
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>

          {/* Permission Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
            <div className="bg-white border rounded-lg p-4 max-h-64 overflow-y-auto space-y-4">
              {Object.entries(groupedPerms).map(([resource, perms]) => (
                <div key={resource}>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{resource}</p>
                  <div className="flex flex-wrap gap-2">
                    {perms.map((p) => (
                      <label key={p.id} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPerms.includes(p.id)}
                          onChange={(e) => {
                            setSelectedPerms(prev =>
                              e.target.checked
                                ? [...prev, p.id]
                                : prev.filter(id => id !== p.id),
                            );
                          }}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700">{p.action}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleCreate} disabled={saving} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Role
            </Button>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <div key={role.id} className="bg-white border rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{role.displayName}</p>
                  <p className="text-xs text-gray-500 font-mono">{role.name}</p>
                </div>
              </div>
              {role.isSystem ? (
                <Lock className="h-4 w-4 text-gray-400" />
              ) : (
                <button
                  onClick={() => handleDelete(role.id)}
                  className="p-1 rounded hover:bg-red-50 text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {role.description && (
              <p className="text-sm text-gray-500">{role.description}</p>
            )}

            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5">
                {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 5).map((rp) => (
                  <span key={rp.permission.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 font-mono">
                    {rp.permission.resource}:{rp.permission.action}
                  </span>
                ))}
                {role.permissions.length > 5 && (
                  <span className="text-xs text-gray-400">+{role.permissions.length - 5} more</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
