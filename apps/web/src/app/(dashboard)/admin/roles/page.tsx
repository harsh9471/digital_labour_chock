'use client';

import { useState, useEffect } from 'react';
import { adminPanelApi, Role, Permission } from '@/lib/admin-panel-api';
import { Button } from '@/components/ui/button';
import {
  Plus, Shield, Trash2, Loader2, Lock, X, ChevronRight,
  FileText, Settings, Check, AlertCircle,
} from 'lucide-react';

const MODAL_SECTIONS = [
  { id: 'details',      label: 'Role Details',   icon: FileText,  desc: 'Name and description' },
  { id: 'permissions',  label: 'Permissions',    icon: Shield,    desc: 'Access control' },
  { id: 'review',       label: 'Review',         icon: Settings,  desc: 'Confirm and create' },
] as const;
type ModalSection = typeof MODAL_SECTIONS[number]['id'];

function CreateRoleModal({
  permissions,
  onClose,
  onCreate,
}: {
  permissions: Permission[];
  onClose: () => void;
  onCreate: (data: { name: string; displayName: string; description: string; permissionIds: string[] }) => Promise<void>;
}) {
  const [section, setSection] = useState<ModalSection>('details');
  const [form, setForm] = useState({ name: '', displayName: '', description: '' });
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const groupedPerms = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    if (!acc[p.resource]) acc[p.resource] = [];
    acc[p.resource].push(p);
    return acc;
  }, {});

  const validateDetails = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Slug is required';
    if (!/^[a-z0-9_]+$/.test(form.name)) e.name = 'Only lowercase letters, numbers, underscores';
    if (!form.displayName.trim()) e.displayName = 'Display name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goTo = (id: ModalSection) => {
    if (id === 'permissions' || id === 'review') {
      if (!validateDetails()) return;
    }
    setSection(id);
  };

  const handleCreate = async () => {
    if (!validateDetails()) { setSection('details'); return; }
    setSaving(true);
    try {
      await onCreate({ ...form, permissionIds: selectedPerms });
    } finally { setSaving(false); }
  };

  const togglePerm = (id: string) =>
    setSelectedPerms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);

  const toggleResource = (perms: Permission[]) => {
    const allSelected = perms.every(p => selectedPerms.includes(p.id));
    if (allSelected) {
      setSelectedPerms(prev => prev.filter(id => !perms.find(p => p.id === id)));
    } else {
      setSelectedPerms(prev => [...new Set([...prev, ...perms.map(p => p.id)])]);
    }
  };

  const sectionIdx = MODAL_SECTIONS.findIndex(s => s.id === section);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl flex overflow-hidden" style={{ maxHeight: '90vh' }}>

        {/* Sidebar */}
        <div className="w-52 shrink-0 bg-slate-900 flex flex-col">
          <div className="p-5 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-3">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-bold text-white text-base">Create Role</h2>
            <p className="text-xs text-slate-400 mt-0.5">Define access control</p>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {MODAL_SECTIONS.map((s, i) => {
              const active = section === s.id;
              const done = i < sectionIdx;
              return (
                <button key={s.id} onClick={() => goTo(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                    active ? 'bg-blue-600 text-white' : done ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                  }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    active ? 'bg-white text-blue-600' : done ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight">{s.label}</p>
                    <p className="text-xs opacity-60 leading-tight">{s.desc}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          {selectedPerms.length > 0 && (
            <div className="p-4 border-t border-slate-800">
              <p className="text-xs text-slate-400">
                <span className="font-bold text-emerald-400">{selectedPerms.length}</span> permission{selectedPerms.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900">{MODAL_SECTIONS.find(s => s.id === section)?.label}</h3>
              <p className="text-xs text-gray-400">{MODAL_SECTIONS.find(s => s.id === section)?.desc}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">

            {/* ── Details ── */}
            {section === 'details' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Role Slug <span className="text-red-500">*</span>
                    <span className="text-xs font-normal text-gray-400 ml-1">(system identifier)</span>
                  </label>
                  <input
                    className={`w-full border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    placeholder="e.g. site_manager"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.name}</p>}
                  <p className="text-xs text-gray-400 mt-1">Lowercase letters, numbers and underscores only. Cannot be changed after creation.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.displayName ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    placeholder="e.g. Site Manager"
                    value={form.displayName}
                    onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                  />
                  {errors.displayName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.displayName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                  <textarea
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    placeholder="What is this role responsible for? Who should have it?"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>

                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <p className="text-xs font-semibold text-blue-800 mb-1">💡 Role Tips</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Use descriptive slugs like <code className="bg-blue-100 px-1 rounded">site_supervisor</code></li>
                    <li>• Assign permissions on the next step</li>
                    <li>• System roles cannot be deleted once created</li>
                  </ul>
                </div>
              </div>
            )}

            {/* ── Permissions ── */}
            {section === 'permissions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Select the permissions this role should have access to:</p>
                  <button onClick={() => setSelectedPerms(permissions.map(p => p.id))}
                    className="text-xs text-blue-600 hover:underline font-semibold">Select All</button>
                </div>

                {Object.entries(groupedPerms).map(([resource, perms]) => {
                  const allSelected = perms.every(p => selectedPerms.includes(p.id));
                  const someSelected = perms.some(p => selectedPerms.includes(p.id));
                  return (
                    <div key={resource} className="border border-gray-100 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => toggleResource(perms)}
                        className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${allSelected ? 'bg-blue-50' : someSelected ? 'bg-amber-50' : 'bg-gray-50 hover:bg-gray-100'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded flex items-center justify-center border-2 ${allSelected ? 'bg-blue-600 border-blue-600' : someSelected ? 'bg-amber-400 border-amber-400' : 'border-gray-300'}`}>
                            {(allSelected || someSelected) && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span className="text-sm font-bold text-gray-800 capitalize">{resource.replace(/_/g, ' ')}</span>
                        </div>
                        <span className="text-xs text-gray-400">{perms.filter(p => selectedPerms.includes(p.id)).length}/{perms.length}</span>
                      </button>
                      <div className="px-4 py-3 flex flex-wrap gap-2 bg-white">
                        {perms.map(p => (
                          <label key={p.id}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer transition-all text-xs font-semibold ${
                              selectedPerms.includes(p.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                            }`}>
                            <input type="checkbox" className="hidden" checked={selectedPerms.includes(p.id)} onChange={() => togglePerm(p.id)} />
                            {p.action}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Review ── */}
            {section === 'review' && (
              <div className="space-y-5">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{form.displayName || '—'}</p>
                      <p className="text-slate-400 text-sm font-mono">{form.name || '—'}</p>
                    </div>
                  </div>
                  {form.description && (
                    <p className="text-slate-300 text-sm">{form.description}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Permissions ({selectedPerms.length} selected)
                  </p>
                  {selectedPerms.length === 0 ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      No permissions selected. This role will have no access. You can still create it and add permissions later.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedPerms.map(id => {
                        const p = permissions.find(perm => perm.id === id);
                        return p ? (
                          <span key={id} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs bg-blue-100 text-blue-800 font-semibold font-mono">
                            {p.resource}:{p.action}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
            <Button variant="outline" onClick={() => sectionIdx > 0 ? setSection(MODAL_SECTIONS[sectionIdx - 1].id) : onClose()}
              className="gap-2">
              {sectionIdx === 0 ? 'Cancel' : '← Back'}
            </Button>

            {section !== 'review' ? (
              <Button onClick={() => goTo(MODAL_SECTIONS[sectionIdx + 1].id)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleCreate} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-6">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Create Role
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        adminPanelApi.getRoles(),
        adminPanelApi.getPermissions(),
      ]);
      setRoles((rolesRes.data as unknown as { data: Role[] }).data);
      setPermissions((permsRes.data as unknown as { data: Permission[] }).data);
    } catch { /* handled */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (data: { name: string; displayName: string; description: string; permissionIds: string[] }) => {
    await adminPanelApi.createRole(data);
    setShowModal(false);
    await fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this role?')) return;
    try {
      await adminPanelApi.deleteRole(id);
      await fetchData();
    } catch { /* handled */ }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {showModal && (
        <CreateRoleModal
          permissions={permissions}
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage roles and their permissions</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4" /> Create Role
        </Button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <div key={role.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role.isSystem ? 'bg-slate-100' : 'bg-blue-100'}`}>
                  {role.isSystem
                    ? <Lock className="h-5 w-5 text-slate-500" />
                    : <Shield className="h-5 w-5 text-blue-600" />
                  }
                </div>
                <div>
                  <p className="font-bold text-gray-900">{role.displayName}</p>
                  <p className="text-xs text-gray-400 font-mono">{role.name}</p>
                </div>
              </div>
              {role.isSystem ? (
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">System</span>
              ) : (
                <button onClick={() => handleDelete(role.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {role.description && (
              <p className="text-sm text-gray-500 mb-3">{role.description}</p>
            )}

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">{role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}</p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 3).map((rp) => (
                  <span key={rp.permission.id} className="inline-flex px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500 font-mono">
                    {rp.permission.action}
                  </span>
                ))}
                {role.permissions.length > 3 && (
                  <span className="text-xs text-gray-400 px-1">+{role.permissions.length - 3}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
