'use client';

import { useState, useEffect } from 'react';
import { cmsApi, CmsPage } from '@/lib/cms-api';
import { Button } from '@/components/ui/button';
import {
  Plus, FileText, Trash2, Edit2, Globe, Loader2, X,
  CheckCircle2, Clock, AlertCircle, EyeOff,
  FileX, Info,
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { cls: string; icon: React.ElementType; label: string }> = {
  PUBLISHED: { cls: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2, label: 'Published' },
  DRAFT:     { cls: 'bg-amber-100 text-amber-800 border-amber-200',        icon: Clock,         label: 'Draft' },
  ARCHIVED:  { cls: 'bg-gray-100 text-gray-600 border-gray-200',           icon: EyeOff,        label: 'Archived' },
};

const DEFAULT_FORM = {
  title: '', slug: '', content: '', excerpt: '',
  metaTitle: '', metaDesc: '', status: 'DRAFT',
};
type FormState = typeof DEFAULT_FORM;

function autoSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/* ─── Page Card ───────────────────────────────── */
function PageCard({ page, onEdit, onDelete, onToggle }: {
  page: CmsPage;
  onEdit: (p: CmsPage) => void;
  onDelete: (id: string) => void;
  onToggle: (p: CmsPage) => void;
}) {
  const cfg = STATUS_CONFIG[page.status] ?? STATUS_CONFIG.DRAFT;
  const StatusIcon = cfg.icon;
  const isPublished = page.status === 'PUBLISHED';

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden ${isPublished ? 'border-emerald-200' : 'border-gray-100'}`}>
      {/* Top accent */}
      {isPublished && <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isPublished ? 'bg-emerald-50' : 'bg-gray-50'}`}>
            <FileText className={`h-5 w-5 ${isPublished ? 'text-emerald-600' : 'text-gray-400'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{page.title}</h3>
            <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-mono mt-0.5">
              <span className="text-gray-300">/</span>{page.slug}
            </span>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 ${cfg.cls}`}>
            <StatusIcon className="h-3 w-3" />
            {cfg.label}
          </span>
        </div>

        {/* Excerpt */}
        {page.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">{page.excerpt}</p>
        )}

        {/* Home-page visibility indicator */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold mb-4 ${
          isPublished
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            : 'bg-gray-50 text-gray-400 border border-gray-100'
        }`}>
          <Globe className="h-3.5 w-3.5 shrink-0" />
          {isPublished
            ? 'Visible in Home Page navigation'
            : 'Hidden from Home Page — publish to show'}
        </div>

        {/* Dates */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          {page.publishedAt && (
            <span>Published {new Date(page.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          )}
          <span className="ml-auto">Updated {new Date(page.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-50">
          <button onClick={() => onToggle(page)}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-xl font-semibold border transition-all ${
              isPublished
                ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
            }`}>
            {isPublished
              ? <><EyeOff className="h-3.5 w-3.5" /> Unpublish</>
              : <><Globe className="h-3.5 w-3.5" /> Publish</>}
          </button>
          <button onClick={() => onEdit(page)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-xl font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all">
            <Edit2 className="h-3.5 w-3.5" /> Edit
          </button>
          <button onClick={() => onDelete(page.id)}
            className="p-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page Modal ──────────────────────────────── */
function PageModal({ form, editId, saving, onClose, onChange, onSave }: {
  form: FormState; editId: string | null; saving: boolean;
  onClose: () => void; onChange: (f: FormState) => void; onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col" style={{ maxHeight: '95vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-xl font-black text-gray-900">{editId ? 'Edit Page' : 'Create New Page'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Published pages appear in the Home Page navigation</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-7 space-y-5">

          {/* Title + Slug */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Page Title <span className="text-red-500">*</span></label>
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="About Us"
                value={form.title}
                onChange={e => onChange({ ...form, title: e.target.value, slug: editId ? form.slug : autoSlug(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                URL Slug <span className="text-red-500">*</span>
                <span className="font-normal text-gray-400 ml-1 text-xs">(auto-generated)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-mono">/</span>
                <input
                  className="w-full border border-gray-200 rounded-xl pl-6 pr-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="about-us"
                  value={form.slug}
                  onChange={e => onChange({ ...form, slug: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Content <span className="text-red-500">*</span>
              <span className="font-normal text-gray-400 ml-1 text-xs">(HTML supported)</span>
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-48 resize-none font-mono leading-relaxed"
              placeholder="<h2>About Us</h2><p>Digital Labour Chowk is India's first dedicated platform...</p>"
              value={form.content}
              onChange={e => onChange({ ...form, content: e.target.value })}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Excerpt <span className="text-gray-400 font-normal text-xs">(shown in listings)</span></label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief summary shown in search results and previews"
              value={form.excerpt}
              onChange={e => onChange({ ...form, excerpt: e.target.value })}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Publication Status</label>
            <div className="flex gap-3">
              {[
                { value: 'DRAFT',     label: 'Draft',     desc: 'Not visible on site',  icon: Clock,          cls: 'border-amber-200 bg-amber-50 text-amber-700' },
                { value: 'PUBLISHED', label: 'Published', desc: 'Live in Home Page nav', icon: CheckCircle2,  cls: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
                { value: 'ARCHIVED',  label: 'Archived',  desc: 'Hidden from site',      icon: EyeOff,        cls: 'border-gray-200 bg-gray-50 text-gray-600' },
              ].map(opt => {
                const Icon = opt.icon;
                const selected = form.status === opt.value;
                return (
                  <button key={opt.value} onClick={() => onChange({ ...form, status: opt.value })}
                    className={`flex-1 p-3 rounded-2xl border-2 text-left transition-all ${selected ? opt.cls + ' border-2' : 'border-gray-100 hover:border-gray-200'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-bold">{opt.label}</span>
                    </div>
                    <p className="text-xs opacity-70">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" /> SEO Settings
            </p>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Meta Title</label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="About Us — Digital Labour Chowk"
                value={form.metaTitle} onChange={e => onChange({ ...form, metaTitle: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Meta Description
                {form.metaDesc && <span className={`ml-2 font-normal ${form.metaDesc.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>({form.metaDesc.length}/160)</span>}
              </label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Learn about India's first labour marketplace platform"
                value={form.metaDesc} onChange={e => onChange({ ...form, metaDesc: e.target.value })} />
            </div>
          </div>

          {/* Publish notice */}
          {form.status === 'PUBLISHED' && (
            <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <Globe className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-emerald-800">Will appear in Home Page navigation</p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Visitors can access <span className="font-mono bg-emerald-100 px-1 rounded">/pages/{form.slug || 'your-slug'}</span> from the nav bar.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 shrink-0">
          <p className="text-xs text-gray-400">
            {form.title && form.slug && form.content
              ? <span className="text-emerald-600 font-semibold">✓ Ready to save</span>
              : 'Title, slug and content are required'}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
            <Button onClick={onSave} disabled={saving || !form.title || !form.slug || !form.content}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-xl px-6 disabled:opacity-50">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editId ? 'Update Page' : 'Create Page'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────── */
export default function AdminCmsPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

  const fetchPages = async () => {
    setLoading(true); setFetchError('');
    try {
      const data = await cmsApi.getAllPages(); // cms-api unwraps to CmsPage[]
      setPages(data);
    } catch {
      setFetchError('Failed to load pages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPages(); }, []);

  const openAdd = () => { setForm(DEFAULT_FORM); setEditId(null); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditId(null); setForm(DEFAULT_FORM); };

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.content) return;
    setSaving(true);
    try {
      editId ? await cmsApi.updatePage(editId, form) : await cmsApi.createPage(form);
      closeModal(); await fetchPages();
    } catch { /* handled */ } finally { setSaving(false); }
  };

  const handleEdit = async (p: CmsPage) => {
    setLoading(true);
    try {
      const fullPage = await cmsApi.getPage(p.id);
      setForm({ title: fullPage.title, slug: fullPage.slug, content: fullPage.content ?? '',
        excerpt: fullPage.excerpt ?? '', metaTitle: fullPage.metaTitle ?? '',
        metaDesc: fullPage.metaDesc ?? '', status: fullPage.status });
      setEditId(p.id);
      setShowModal(true);
    } catch {
      setFetchError('Failed to load full page content.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this page? It will be removed from the site.')) return;
    try { await cmsApi.deletePage(id); await fetchPages(); } catch { /* handled */ }
  };

  const handleToggle = async (p: CmsPage) => {
    try {
      await cmsApi.updatePage(p.id, { status: p.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' });
      await fetchPages();
    } catch { /* handled */ }
  };

  const publishedCnt = pages.filter(p => p.status === 'PUBLISHED').length;
  const filtered = filter === 'ALL' ? pages : pages.filter(p => p.status === filter);

  return (
    <div className="p-6 space-y-6">
      {showModal && (
        <PageModal form={form} editId={editId} saving={saving}
          onClose={closeModal} onChange={setForm} onSave={handleSave} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">CMS Pages</h1>
          <p className="text-sm text-gray-500 mt-1">
            {publishedCnt > 0
              ? <><span className="text-emerald-600 font-bold">{publishedCnt} page{publishedCnt > 1 ? 's' : ''}</span> published and visible in Home Page nav</>
              : 'Manage About Us, Terms, Privacy — published pages show in site navigation'}
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow">
          <Plus className="h-4 w-4" /> New Page
        </Button>
      </div>

      {/* How it works info */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <span className="font-bold">How CMS pages work:</span> Create a page here, set status to{' '}
          <strong>Published</strong>, and it will automatically appear as a link in the{' '}
          <strong>Home Page navigation bar</strong>. Visitors can click it to read the full content at{' '}
          <code className="bg-blue-100 px-1 rounded font-mono">/pages/your-slug</code>.
        </div>
      </div>

      {publishedCnt > 0 && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <Globe className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-800 font-medium">
            {publishedCnt} published page{publishedCnt > 1 ? 's are' : ' is'} currently visible in the Home Page navigation.
          </p>
        </div>
      )}

      {fetchError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{fetchError}</p>
          <button onClick={fetchPages} className="ml-auto text-xs font-bold text-red-600 underline">Retry</button>
        </div>
      )}

      {/* Filter tabs */}
      {pages.length > 0 && (
        <div className="flex gap-2">
          {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}>
              {f === 'ALL' ? `All (${pages.length})` : f === 'PUBLISHED' ? `Published (${publishedCnt})` : `Drafts (${pages.filter(p => p.status === 'DRAFT').length})`}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                </div>
              </div>
              <div className="h-10 bg-gray-100 rounded-xl" />
              <div className="h-9 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
            <FileX className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-700 mb-1">{filter === 'ALL' ? 'No pages yet' : `No ${filter.toLowerCase()} pages`}</h3>
          <p className="text-sm text-gray-400 mb-5">
            {filter === 'ALL'
              ? 'Create pages like About Us, Terms of Service, Privacy Policy'
              : `Switch to "All" to see other pages`}
          </p>
          {filter === 'ALL' && (
            <Button onClick={openAdd} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
              <Plus className="h-4 w-4" /> Create First Page
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <PageCard key={p.id} page={p}
              onEdit={handleEdit} onDelete={handleDelete} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
