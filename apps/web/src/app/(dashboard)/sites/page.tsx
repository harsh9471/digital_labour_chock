'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, Plus, QrCode, Pencil, Trash2, RefreshCw, Building2 } from 'lucide-react';
import { sitesApi } from '@/lib/sites-api';
import type { Site } from '@/types/jobs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type SiteForm = {
  name: string; description: string; address: string;
  city: string; state: string; pincode: string; radiusMeters: number;
};
const DEFAULT_FORM: SiteForm = { name: '', description: '', address: '', city: '', state: '', pincode: '', radiusMeters: 100 };

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [form, setForm] = useState<SiteForm>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [generatingQr, setGeneratingQr] = useState<string | null>(null);

  const fetchSites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await sitesApi.list(page, 10);
      setSites(res.data);
      setTotal(res.meta.total);
      setTotalPages(res.meta.totalPages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchSites(); }, [fetchSites]);

  const openCreate = () => { setEditingSite(null); setForm(DEFAULT_FORM); setShowModal(true); };
  const openEdit = (site: Site) => {
    setEditingSite(site);
    setForm({ name: site.name, description: site.description ?? '', address: site.address, city: site.city, state: site.state, pincode: site.pincode ?? '', radiusMeters: site.radiusMeters });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingSite) {
        await sitesApi.update(editingSite.id, form);
      } else {
        await sitesApi.create(form);
      }
      setShowModal(false);
      fetchSites();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (siteId: string) => {
    if (!confirm('Delete this site?')) return;
    try {
      await sitesApi.delete(siteId);
      fetchSites();
    } catch {
      // ignore
    }
  };

  const handleGenerateQr = async (siteId: string) => {
    setGeneratingQr(siteId);
    try {
      const res = await sitesApi.generateQrCode(siteId, 8);
      setQrCodes((prev) => ({ ...prev, [siteId]: res.data.code }));
    } catch {
      // ignore
    } finally {
      setGeneratingQr(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sites</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} construction sites</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchSites} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Site
          </button>
        </div>
      </div>

      {/* Sites List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : sites.length === 0 ? (
        <div className="text-center py-20">
          <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No sites yet</p>
          <p className="text-slate-400 text-sm mt-1">Create your first construction site</p>
          <button onClick={openCreate} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
            Create Site
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sites.map((site) => (
            <Card key={site.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900">{site.name}</h3>
                      <Badge variant={site.isActive ? 'success' : 'secondary'} className="text-xs">
                        {site.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5 truncate">{site.address}, {site.city}, {site.state}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>{site.totalWorkers} workers assigned</span>
                      <span>{site._count?.jobs ?? 0} jobs</span>
                      <span>Radius: {site.radiusMeters}m</span>
                    </div>
                    {qrCodes[site.id] && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg text-xs text-blue-700 font-mono break-all">
                        QR Code: {qrCodes[site.id]}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleGenerateQr(site.id)}
                      disabled={generatingQr === site.id}
                      className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-500 transition-colors"
                      title="Generate QR Code"
                    >
                      <QrCode className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openEdit(site)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(site.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
          <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg border-0 shadow-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                {editingSite ? 'Edit Site' : 'New Construction Site'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Site Name *</label>
                    <input
                      required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Sector 5 Housing Project"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Address *</label>
                    <input
                      required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Full address"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">City *</label>
                    <input
                      required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">State *</label>
                    <input
                      required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Pincode</label>
                    <input
                      value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Attendance Radius (m)</label>
                    <input
                      type="number" min={50} max={1000}
                      value={form.radiusMeters} onChange={(e) => setForm({ ...form, radiusMeters: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                    <textarea
                      rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60">
                    {saving ? 'Saving...' : editingSite ? 'Update' : 'Create Site'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
