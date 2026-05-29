'use client';

import { useState, useEffect } from 'react';
import { cmsApi, CmsPage } from '@/lib/cms-api';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Trash2, Edit, Globe, FileX, Loader2, X } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: 'bg-green-100 text-green-800',
  DRAFT: 'bg-yellow-100 text-yellow-800',
  ARCHIVED: 'bg-gray-100 text-gray-700',
};

const defaultForm = {
  title: '', slug: '', content: '', excerpt: '',
  metaTitle: '', metaDesc: '', status: 'DRAFT',
};

export default function AdminCmsPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await cmsApi.getAllPages();
      setPages((res.data as unknown as { data: CmsPage[] }).data);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPages(); }, []);

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

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
    if (!form.title || !form.slug || !form.content) return;
    setSaving(true);
    try {
      if (editId) {
        await cmsApi.updatePage(editId, form);
      } else {
        await cmsApi.createPage(form);
      }
      closeModal();
      await fetchPages();
    } catch {
      // handled
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this page?')) return;
    try {
      await cmsApi.deletePage(id);
      await fetchPages();
    } catch {
      // handled
    }
  };

  const handleEdit = (page: CmsPage) => {
    setForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      excerpt: page.excerpt ?? '',
      metaTitle: page.metaTitle ?? '',
      metaDesc: page.metaDesc ?? '',
      status: page.status,
    });
    setEditId(page.id);
    setShowModal(true);
  };

  const togglePublish = async (page: CmsPage) => {
    try {
      await cmsApi.updatePage(page.id, {
        status: page.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
      });
      await fetchPages();
    } catch {
      // handled
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CMS Pages</h1>
          <p className="text-sm text-gray-500 mt-1">Manage static content pages (About, Terms, Privacy, etc.)</p>
        </div>
        <Button onClick={openAddModal} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4" /> New Page
        </Button>
      </div>

      {/* Pages Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <FileX className="h-8 w-8 text-gray-400" />
            </div>
            <p className="font-medium text-gray-600">No pages yet</p>
            <p className="text-sm mt-1">Create your first CMS page to get started</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Page</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Slug</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Published</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Updated</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-900">{page.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-gray-500 text-xs">/{page.slug}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[page.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {page.publishedAt ? new Date(page.publishedAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {new Date(page.updatedAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePublish(page)}
                        className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                        title={page.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      >
                        <Globe className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(page)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{editId ? 'Edit Page' : 'Create New Page'}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{editId ? 'Update the page content and settings' : 'Fill in the details to create a new CMS page'}</p>
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
                  placeholder="Page title"
                  value={form.title}
                  onChange={(e) => setForm(f => ({
                    ...f, title: e.target.value,
                    slug: editId ? f.slug : autoSlug(e.target.value),
                  }))}
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Slug <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">/</span>
                  <input
                    className="w-full border border-gray-200 rounded-xl pl-6 pr-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="url-slug"
                    value={form.slug}
                    onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Content <span className="text-red-500">*</span>
                  <span className="font-normal text-gray-400 ml-1">(HTML or Markdown)</span>
                </label>
                <textarea
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-52 resize-none font-mono leading-relaxed"
                  placeholder="Write your page content here..."
                  value={form.content}
                  onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                />
              </div>

              {/* Excerpt */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Excerpt</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Brief description for listings and search results..."
                  value={form.excerpt}
                  onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  value={form.status}
                  onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              {/* Meta Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Meta Title
                  <span className="font-normal text-gray-400 ml-1">(SEO)</span>
                </label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="SEO-optimized title"
                  value={form.metaTitle}
                  onChange={(e) => setForm(f => ({ ...f, metaTitle: e.target.value }))}
                />
              </div>

              {/* Meta Description */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Meta Description
                  <span className="font-normal text-gray-400 ml-1">(SEO)</span>
                </label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Brief SEO description (150-160 characters recommended)"
                  value={form.metaDesc}
                  onChange={(e) => setForm(f => ({ ...f, metaDesc: e.target.value }))}
                />
                {form.metaDesc && (
                  <p className={`text-xs mt-1 ${form.metaDesc.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                    {form.metaDesc.length}/160 characters
                  </p>
                )}
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
                disabled={saving || !form.title || !form.slug || !form.content}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editId ? 'Update Page' : 'Create Page'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
