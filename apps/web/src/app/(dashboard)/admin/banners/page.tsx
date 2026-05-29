'use client';

import { useState, useEffect } from 'react';
import { cmsApi, Banner } from '@/lib/cms-api';
import { Button } from '@/components/ui/button';
import {
  Plus, ImageIcon, Trash2, Edit2, Eye, EyeOff, Loader2,
  TrendingUp, X, MousePointerClick, AlertCircle, CheckCircle2,
  Globe, ExternalLink,
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { cls: string; dot: string; label: string }> = {
  ACTIVE:    { cls: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', label: 'Active' },
  INACTIVE:  { cls: 'bg-gray-100 text-gray-600 border-gray-200',          dot: 'bg-gray-400',   label: 'Inactive' },
  SCHEDULED: { cls: 'bg-blue-100 text-blue-800 border-blue-200',          dot: 'bg-blue-500',   label: 'Scheduled' },
  EXPIRED:   { cls: 'bg-red-100 text-red-700 border-red-200',             dot: 'bg-red-400',    label: 'Expired' },
};

const TARGET_OPTIONS = [
  { value: 'ALL',           label: 'All Users',       icon: '🌐' },
  { value: 'WORKER',        label: 'Workers',         icon: '👷' },
  { value: 'CONTRACTOR',    label: 'Contractors',     icon: '🏗️' },
  { value: 'COMPANY_ADMIN', label: 'Company Admins',  icon: '🏢' },
];

const DEFAULT_FORM = {
  title: '', subtitle: '', imageUrl: '', linkUrl: '', linkText: '',
  target: 'ALL', status: 'ACTIVE', priority: '0',
};
type FormState = typeof DEFAULT_FORM;

/* ─── Banner Card ─────────────────────────────── */
function BannerCard({ banner, onEdit, onDelete, onToggle }: {
  banner: Banner;
  onEdit: (b: Banner) => void;
  onDelete: (id: string) => void;
  onToggle: (b: Banner) => void;
}) {
  const cfg = STATUS_CONFIG[banner.status] ?? STATUS_CONFIG.INACTIVE;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Image preview */}
      <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden">
        {banner.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={banner.imageUrl} alt={banner.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-500">
            <ImageIcon className="h-12 w-12 opacity-30" />
            <p className="text-xs opacity-40 font-medium">No image set</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Status */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${cfg.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${banner.status === 'ACTIVE' ? 'animate-pulse' : ''}`} />
            {cfg.label}
          </span>
        </div>

        {/* Target */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-black/40 text-white backdrop-blur-sm">
            {TARGET_OPTIONS.find(t => t.value === banner.target)?.icon}{' '}
            {banner.target.replace('_', ' ')}
          </span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-bold text-sm drop-shadow-lg line-clamp-1">{banner.title}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {banner.subtitle && (
          <p className="text-sm text-gray-500 truncate mb-3">{banner.subtitle}</p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {banner.viewCount.toLocaleString()}</span>
          <span className="flex items-center gap-1"><MousePointerClick className="h-3 w-3" /> {banner.clickCount.toLocaleString()}</span>
          <span className="ml-auto text-gray-300">P{banner.priority}</span>
        </div>

        {/* Link */}
        {banner.linkUrl && (
          <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-500 hover:underline mb-3 truncate">
            <ExternalLink className="h-3 w-3 shrink-0" />
            {banner.linkText || banner.linkUrl}
          </a>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-50">
          <button onClick={() => onToggle(banner)}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-xl font-semibold border transition-all ${
              banner.status === 'ACTIVE'
                ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
            }`}>
            {banner.status === 'ACTIVE' ? <><EyeOff className="h-3.5 w-3.5" /> Deactivate</> : <><Eye className="h-3.5 w-3.5" /> Activate</>}
          </button>
          <button onClick={() => onEdit(banner)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-xl font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all">
            <Edit2 className="h-3.5 w-3.5" /> Edit
          </button>
          <button onClick={() => onDelete(banner.id)}
            className="p-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Banner Modal ────────────────────────────── */
function BannerModal({ form, editId, saving, onClose, onChange, onSave }: {
  form: FormState; editId: string | null; saving: boolean;
  onClose: () => void; onChange: (f: FormState) => void; onSave: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col" style={{ maxHeight: '95vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-xl font-black text-gray-900">{editId ? 'Edit Banner' : 'Create New Banner'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Active banners appear on the Home Page carousel</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-7 space-y-5">

          {/* Image URL + Live Preview — most important field first */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Banner Image URL <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://images.unsplash.com/photo-...?w=1400&q=80"
              value={form.imageUrl}
              onChange={e => { onChange({ ...form, imageUrl: e.target.value }); setImgError(false); }}
            />
            <p className="text-xs text-gray-400 mt-1">Paste any direct image URL (Unsplash, Cloudinary, S3, etc.)</p>

            {/* Live preview box */}
            <div className={`mt-3 rounded-2xl overflow-hidden border ${form.imageUrl && !imgError ? 'border-gray-200 h-52' : 'border-dashed border-gray-200 h-32 bg-gray-50'}`}>
              {form.imageUrl && !imgError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.imageUrl}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                  onLoad={() => setImgError(false)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
                  {form.imageUrl && imgError ? (
                    <>
                      <AlertCircle className="h-7 w-7 text-red-300" />
                      <p className="text-xs text-red-400 font-medium">Cannot load image — check the URL</p>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-7 w-7" />
                      <p className="text-xs font-medium">Image preview appears here</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Title / Subtitle */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="India's #1 Labour Platform" value={form.title}
                onChange={e => onChange({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Subtitle</label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2.5 Lakh+ verified workers" value={form.subtitle}
                onChange={e => onChange({ ...form, subtitle: e.target.value })} />
            </div>
          </div>

          {/* Link */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Button Link</label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/platform/projects" value={form.linkUrl}
                onChange={e => onChange({ ...form, linkUrl: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Button Text</label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Browse Projects" value={form.linkText}
                onChange={e => onChange({ ...form, linkText: e.target.value })} />
            </div>
          </div>

          {/* Target / Status / Priority */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Target Audience</label>
              <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={form.target} onChange={e => onChange({ ...form, target: e.target.value })}>
                {TARGET_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Status</label>
              <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={form.status} onChange={e => onChange({ ...form, status: e.target.value })}>
                <option value="ACTIVE">✅ Active (Live)</option>
                <option value="INACTIVE">⏸️ Inactive</option>
                <option value="SCHEDULED">🗓️ Scheduled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Priority</label>
              <input type="number" min={0} max={100}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0" value={form.priority}
                onChange={e => onChange({ ...form, priority: e.target.value })} />
              <p className="text-xs text-gray-400 mt-1">Higher = shown first</p>
            </div>
          </div>

          {form.status === 'ACTIVE' && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <Globe className="h-5 w-5 text-emerald-600 shrink-0" />
              <p className="text-sm text-emerald-800">
                <strong>This banner will go live</strong> on the Home Page carousel immediately after saving.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 shrink-0">
          <p className="text-xs text-gray-400">
            {form.title && form.imageUrl
              ? <span className="text-emerald-600 font-semibold">✓ Ready to save</span>
              : 'Title and Image URL are required'}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
            <Button onClick={onSave} disabled={saving || !form.title || !form.imageUrl}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-xl px-6 disabled:opacity-50">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editId ? 'Update Banner' : 'Create Banner'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────── */
export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const fetchBanners = async () => {
    setLoading(true); setFetchError('');
    try {
      const data = await cmsApi.getAllBanners(); // cms-api unwraps to Banner[]
      setBanners(data);
    } catch {
      setFetchError('Failed to load banners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const openAdd = () => { setForm(DEFAULT_FORM); setEditId(null); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditId(null); setForm(DEFAULT_FORM); };

  const handleSave = async () => {
    if (!form.title || !form.imageUrl) return;
    setSaving(true);
    try {
      const payload = { ...form, priority: Number(form.priority) || 0 };
      editId ? await cmsApi.updateBanner(editId, payload) : await cmsApi.createBanner(payload);
      closeModal();
      await fetchBanners();
    } catch { /* handled */ } finally { setSaving(false); }
  };

  const handleEdit = (b: Banner) => {
    setForm({ title: b.title, subtitle: b.subtitle ?? '', imageUrl: b.imageUrl,
      linkUrl: b.linkUrl ?? '', linkText: b.linkText ?? '',
      target: b.target, status: b.status, priority: String(b.priority) });
    setEditId(b.id); setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try { await cmsApi.deleteBanner(id); await fetchBanners(); } catch { /* handled */ }
  };

  const handleToggle = async (b: Banner) => {
    try {
      await cmsApi.updateBanner(b.id, { status: b.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' });
      await fetchBanners();
    } catch { /* handled */ }
  };

  const activeCnt = banners.filter(b => b.status === 'ACTIVE').length;

  return (
    <div className="p-6 space-y-6">
      {showModal && (
        <BannerModal form={form} editId={editId} saving={saving}
          onClose={closeModal} onChange={setForm} onSave={handleSave} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Banner Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeCnt > 0
              ? <><span className="text-emerald-600 font-bold">{activeCnt} banner{activeCnt > 1 ? 's' : ''}</span> live on Home Page</>
              : 'No active banners — create one to show on Home Page'}
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow">
          <Plus className="h-4 w-4" /> Add Banner
        </Button>
      </div>

      {activeCnt > 0 && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-800 font-medium">
            {activeCnt} active banner{activeCnt > 1 ? 's are' : ' is'} showing on the Home Page carousel in real-time.
          </p>
        </div>
      )}

      {fetchError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{fetchError}</p>
          <button onClick={fetchBanners} className="ml-auto text-xs text-red-600 font-bold underline">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-100" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                <div className="h-9 bg-gray-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-blue-50 flex items-center justify-center">
            <TrendingUp className="h-10 w-10 text-blue-200" />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No banners yet</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
            Create banners to promote features, jobs or announcements on your home page.
          </p>
          <Button onClick={openAdd} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            <Plus className="h-4 w-4" /> Create First Banner
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {banners.map(b => (
            <BannerCard key={b.id} banner={b}
              onEdit={handleEdit} onDelete={handleDelete} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
