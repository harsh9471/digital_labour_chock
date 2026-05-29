'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  FolderKanban, Plus, MapPin, Users, Calendar, IndianRupee,
  Search, ChevronRight, Loader2, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { projectsApi, Project } from '@/lib/projects-api';
import { formatDate } from '@/lib/utils';

const PAGE_SIZE = 10;

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  PLANNING:  { label: 'Planning',  cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  ACTIVE:    { label: 'Active',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ON_HOLD:   { label: 'On Hold',   cls: 'bg-orange-50 text-orange-700 border-orange-200' },
  COMPLETED: { label: 'Completed', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  CANCELLED: { label: 'Cancelled', cls: 'bg-red-50 text-red-700 border-red-200' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600 border-gray-200' };
  return (
    <span className={`inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full border ${s.cls}`}>
      {s.label}
    </span>
  );
}

type ProjectStatus = Project['status'];
interface ProjectFormData {
  name: string; description: string; city: string; state: string;
  address: string; startDate: string; endDate: string; budget: string; status: ProjectStatus;
}

const DEFAULT_FORM: ProjectFormData = {
  name: '', description: '', city: '', state: '', address: '',
  startDate: '', endDate: '', budget: '', status: 'PLANNING',
};

function ProjectModal({
  open, project, onClose, onSave,
}: {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState<ProjectFormData>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name ?? '',
        description: project.description ?? '',
        city: project.city ?? '',
        state: project.state ?? '',
        address: project.address ?? '',
        startDate: project.startDate ? project.startDate.slice(0, 10) : '',
        endDate: project.endDate ? project.endDate.slice(0, 10) : '',
        budget: project.budget != null ? String(project.budget) : '',
        status: (project.status ?? 'PLANNING') as ProjectStatus,
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setError('');
  }, [project, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        budget: form.budget ? Number(form.budget) : undefined,
        endDate: form.endDate || undefined,
      };
      if (project) {
        await projectsApi.update(project.id, payload);
      } else {
        await projectsApi.create(payload);
      }
      onSave();
      onClose();
    } catch {
      setError('Failed to save project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{project ? 'Edit Project' : 'New Project'}</h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Project Name *</label>
            <Input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Metro Construction Phase 1" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="Project overview..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">City *</label>
              <Input required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Mumbai" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">State</label>
              <Input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="Maharashtra" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Address</label>
            <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Full site address" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Start Date *</label>
              <Input required type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">End Date</label>
              <Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Budget (₹)</label>
              <Input type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} placeholder="500000" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as ProjectStatus }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(STATUS_MAP).map(([val, { label }]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2">
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {project ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ContractorProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await projectsApi.list({ page, limit: PAGE_SIZE, search: search || undefined, status: statusFilter || undefined });
      setProjects(res.data ?? []);
      setTotal(res.meta?.total ?? 0);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await projectsApi.delete(id).catch(() => null);
    fetchProjects();
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'ACTIVE').length,
    planning: projects.filter(p => p.status === 'PLANNING').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} total project{total !== 1 ? 's' : ''}</p>
        </div>
        <Button
          onClick={() => { setEditProject(null); setModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: total, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Active', value: stats.active, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Planning', value: stats.planning, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Completed', value: stats.completed, color: 'text-purple-700', bg: 'bg-purple-50' },
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
          <Input
            className="pl-9"
            placeholder="Search projects..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
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

      {/* Projects list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
          </div>
        ) : projects.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <FolderKanban className="h-7 w-7 text-blue-400" />
            </div>
            <p className="font-semibold text-gray-700">No projects found</p>
            <p className="text-sm text-gray-400 mt-1 mb-5">Create your first project to get started</p>
            <Button onClick={() => { setEditProject(null); setModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="h-4 w-4" /> New Project
            </Button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {projects.map(project => (
                <div key={project.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/80 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors">
                    <FolderKanban className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate text-sm">{project.name}</p>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />{project.city}
                      </span>
                      {project._count && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Users className="h-3 w-3" />{project._count.workforceAssignments} workers
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />{formatDate(project.startDate)}
                      </span>
                      {project.budget != null && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                          <IndianRupee className="h-3 w-3" />{Number(project.budget).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={project.status} />
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => { setEditProject(project); setModalOpen(true); }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(project.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400" />
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

      {/* Project form modal */}
      <ProjectModal
        open={modalOpen}
        project={editProject}
        onClose={() => { setModalOpen(false); setEditProject(null); }}
        onSave={fetchProjects}
      />
    </div>
  );
}
