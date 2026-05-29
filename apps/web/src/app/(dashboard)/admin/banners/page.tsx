'use client';

import { useState, useEffect } from 'react';
import { cmsApi, Banner } from '@/lib/cms-api';
import { Button } from '@/components/ui/button';
import { Plus, Image, Trash2, Edit, Eye, EyeOff, Loader2, TrendingUp } from 'lucide-react';

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
  const [showForm, setShowForm] = useState(false);
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
      setShowForm(false);
      setForm(defaultForm);
      setEditId(null);
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
    setShowForm(true);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage promotional banners across the platform</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditId(null); setForm(defaultForm); }} className="gap-2">
          <Plus className="h-4 w-4" /> Add Banner
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">{editId ? 'Edit' : 'Create'} Banner</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Title', key: 'title', placeholder: 'Banner title' },
              { label: 'Subtitle', key: 'subtitle', placeholder: 'Optional subtitle' },
              { label: 'Image URL', key: 'imageUrl', placeholder: 'https://...' },
              { label: 'Link URL', key: 'linkUrl', placeholder: 'https://... (optional)' },
              { label: 'Link Text', key: 'linkText', placeholder: 'Learn More' },
              { label: 'Priority', key: 'priority', placeholder: '0' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.target}
                onChange={(e) => setForm(f => ({ ...f, target: e.target.value }))}
              >
                <option value="ALL">All Users</option>
                <option value="WORKER">Workers Only</option>
                <option value="CONTRACTOR">Contractors Only</option>
                <option value="COMPANY_ADMIN">Company Admins Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.status}
                onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editId ? 'Update' : 'Create'} Banner
            </Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Banners Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
              {/* Preview */}
              <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 relative flex items-center justify-center">
                {banner.imageUrl ? (
                  <span className="w-full h-full block bg-cover bg-center" style={{ backgroundImage: `url(${banner.imageUrl})` }} />
                ) : (
                  <Image className="h-12 w-12 text-white/60" />
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[banner.status] ?? 'bg-gray-100 text-gray-700'}`}>
                    {banner.status}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <p className="font-semibold text-gray-900">{banner.title}</p>
                  {banner.subtitle && <p className="text-sm text-gray-500">{banner.subtitle}</p>}
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {banner.viewCount} views
                  </span>
                  <span>{banner.clickCount} clicks</span>
                  <span className="ml-auto font-medium text-gray-700">{banner.target}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleStatus(banner)}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded border hover:bg-gray-50 transition-colors"
                  >
                    {banner.status === 'ACTIVE' ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {banner.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleEdit(banner)}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded border hover:bg-blue-50 text-blue-600 transition-colors"
                  >
                    <Edit className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded border hover:bg-red-50 text-red-600 transition-colors ml-auto"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
