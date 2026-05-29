'use client';

import { useState, useEffect } from 'react';
import { cmsApi, Banner } from '@/lib/cms-api';
import { Button } from '@/components/ui/button';
import { Plus, ImageIcon, Trash2, Edit, Eye, EyeOff, Loader2, TrendingUp, X } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-700',
  SCHEDULED: 'bg-blue-100 text-blue-800',
  EXPIRED: 'bg-red-100 text-red-700',
};

const defaultForm = {
  title: '', subtitle: '', imageUrl: '', linkUrl: '', linkText: '',
  target: 'ALL', status: 'ACTIVE', priority: '0',
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await cmsApi.getAllBanners();
      setBanners((res.data as unknown as { data: Banner[] }).data);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const openAddModal = () => {
    setForm(defaultForm);
    setEditId(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(defaultForm);
  };

  const handleSave = async () => {
    if (!form.title || !form.imageUrl) return;
    setSaving(true);
    try {
      const payload = { ...form, priority: Number(form.priority) };
      if (editId) {
        await cmsApi.updateBanner(editId, payload);
      } else {
        await cmsApi.createBanner(payload);
      }
      closeModal();
      await fetchBanners();
    } catch {
      // handled
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await cmsApi.deleteBanner(id);
      await fetchBanners();
    } catch {
      // handled
    }
  };

  const handleEdit = (banner: Banner) => {
    setForm({
      title: banner.title,
      subtitle: banner.subtitle ?? '',
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl ?? '',
      linkText: banner.linkText ?? '',
      target: banner.target,
      status: banner.status,
      priority: String(banner.priority),
    });
    setEditId(banner.id);
    setShowModal(true);
  };

  const toggleStatus = async (banner: Banner) => {
    try {
      await cmsApi.updateBanner(banner.id, {
        status: banner.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      });
      await fetchBanners();
    } catch {
      // handled
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage promotional banners across the platform</p>
        </div>
        <Button onClick={openAddModal} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4" /> Add Banner
        </Button>
      </div>

      {/* Banners Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
          <p className="font-medium text-gray-600">No banners yet</p>
          <p className="text-sm mt-1">Click &quot;Add Banner&quot; to create your first banner</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Preview */}
              <div className="h-44 bg-gradient-to-br from-blue-500 to-purple-600 relative flex items-center justify-center overflow-hidden">
                {banner.imageUrl ? (
                  <span className="w-full h-full block bg-cover bg-center" style={{ backgroundImage: `url(${banner.imageUrl})` }} />
                ) : (
                  <ImageIcon className="h-12 w-12 text-white/60" />
                )}
                <div className="absolute top-3 right-3 flex gap-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[banner.status] ?? 'bg-gray-100 text-gray-700'}`}>
                    {banner.status}
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-white/80 text-xs font-medium px-2 py-0.5 bg-black/30 rounded-full">{banner.target}</span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <p className="font-semibold text-gray-900 truncate">{banner.title}</p>
                  {banner.subtitle && <p className="text-sm text-gray-500 truncate">{banner.subtitle}</p>}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {banner.viewCount} views
                  </span>
                  <span>{banner.clickCount} clicks</span>
                  <span className="ml-auto text-gray-400">Priority: {banner.priority}</span>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => toggleStatus(banner)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-medium"
                  >
                    {banner.status === 'ACTIVE' ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {banner.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleEdit(banner)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 text-blue-600 transition-colors font-medium"
                  >
                    <Edit className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors font-medium ml-auto"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{editId ? 'Edit Banner' : 'Add New Banner'}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{editId ? 'Update the banner details below' : 'Fill in the details to create a new banner'}</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Banner title"
                  value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subtitle</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Optional subtitle"
                  value={form.subtitle}
                  onChange={(e) => setForm(f => ({ ...f, subtitle: e.target.value }))}
                />
              </div>

              {/* Image URL */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/banner.jpg"
                  value={form.imageUrl}
                  onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                />
                {form.imageUrl && (
                  <div className="mt-2 h-24 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                    <span className="w-full h-full block bg-cover bg-center" style={{ backgroundImage: `url(${form.imageUrl})` }} />
                  </div>
                )}
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Link URL</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://... (optional)"
                  value={form.linkUrl}
                  onChange={(e) => setForm(f => ({ ...f, linkUrl: e.target.value }))}
                />
              </div>

              {/* Link Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Link Text</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Learn More"
                  value={form.linkText}
                  onChange={(e) => setForm(f => ({ ...f, linkText: e.target.value }))}
                />
              </div>

              {/* Target */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target Audience</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  value={form.target}
                  onChange={(e) => setForm(f => ({ ...f, target: e.target.value }))}
                >
                  <option value="ALL">All Users</option>
                  <option value="WORKER">Workers Only</option>
                  <option value="CONTRACTOR">Contractors Only</option>
                  <option value="COMPANY_ADMIN">Company Admins Only</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  value={form.status}
                  onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SCHEDULED">Scheduled</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Priority</label>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0 = lowest"
                  value={form.priority}
                  onChange={(e) => setForm(f => ({ ...f, priority: e.target.value }))}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="h-px bg-gray-100" />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={closeModal} className="px-5 rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !form.title || !form.imageUrl}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editId ? 'Update Banner' : 'Create Banner'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
