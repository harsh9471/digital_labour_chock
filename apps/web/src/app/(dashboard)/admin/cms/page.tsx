'use client';

import { useState, useEffect } from 'react';
import { cmsApi, CmsPage } from '@/lib/cms-api';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Trash2, Edit, Globe, FileX, Loader2 } from 'lucide-react';

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
  const [showForm, setShowForm] = useState(false);
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

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.content) return;
    setSaving(true);
    try {
      if (editId) {
        await cmsApi.updatePage(editId, form);
      } else {
        await cmsApi.createPage(form);
      }
      setShowForm(false);
      setForm(defaultForm);
      setEditId(null);
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
    setShowForm(true);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CMS Pages</h1>
          <p className="text-sm text-gray-500 mt-1">Manage static content pages (About, Terms, Privacy, etc.)</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditId(null); setForm(defaultForm); }} className="gap-2">
          <Plus className="h-4 w-4" /> New Page
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-50 border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">{editId ? 'Edit' : 'Create'} Page</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Page title"
                value={form.title}
                onChange={(e) => setForm(f => ({
                  ...f, title: e.target.value,
                  slug: editId ? f.slug : autoSlug(e.target.value),
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="url-slug"
                value={form.slug}
                onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML/Markdown)</label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-48 resize-none font-mono"
                placeholder="Page content..."
                value={form.content}
                onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description..."
                value={form.excerpt}
                onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.status}
                onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="SEO title"
                value={form.metaTitle}
                onChange={(e) => setForm(f => ({ ...f, metaTitle: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="SEO description"
                value={form.metaDesc}
                onChange={(e) => setForm(f => ({ ...f, metaDesc: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editId ? 'Update' : 'Create'} Page
            </Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Pages Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FileX className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No pages yet</p>
            <p className="text-sm mt-1">Create your first CMS page</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Page</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Slug</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Published</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Updated</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{page.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-500 text-xs">{page.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[page.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {page.publishedAt ? new Date(page.publishedAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(page.updatedAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePublish(page)}
                        className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors"
                        title={page.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      >
                        <Globe className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(page)}
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors"
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
    </div>
  );
}
