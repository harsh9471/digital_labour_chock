'use client';

import React, { useEffect, useState } from 'react';
import {
  Building2, Mail, Phone, Globe, MapPin, Loader2, Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { companyApi, Company } from '@/lib/company-api';

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState<Partial<Company>>({});

  useEffect(() => {
    companyApi.getMyCompany()
      .then(res => {
        setCompany(res.data ?? null);
        setForm(res.data ?? {});
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await companyApi.updateCompany(form);
      setCompany(res.data);
      setForm(res.data);
      setEditing(false);
      setSuccess('Company profile updated successfully.');
    } catch {
      setError('Failed to update company profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-6 text-center py-20 text-gray-400">
        <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p className="font-semibold text-gray-600">Company not found</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Company</h1>
          <p className="text-sm text-gray-500 mt-0.5">View and update company details</p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing(true)} variant="outline" className="gap-2">
            Edit Profile
          </Button>
        )}
      </div>

      {success && <p className="text-sm text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">{success}</p>}
      {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl border border-red-200">{error}</p>}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Company banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-600 to-purple-700 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{company.name}</h2>
              {company.location && (
                <p className="text-violet-200 text-sm flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {company.location.city}, {company.location.state}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            {[
              { label: 'Contractors', value: company._count?.contractors ?? 0 },
              { label: 'Projects',    value: company._count?.projects ?? 0 },
              { label: 'Admins',      value: company._count?.admins ?? 0 },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-violet-200 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Edit fields */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Basic Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Company Name</label>
              {editing ? (
                <Input value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              ) : (
                <p className="text-sm text-gray-900 py-2">{company.name}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">GST Number</label>
              {editing ? (
                <Input value={form.gstNumber ?? ''} onChange={e => setForm(f => ({ ...f, gstNumber: e.target.value }))} placeholder="27AAPFU0939F1ZV" />
              ) : (
                <p className="text-sm text-gray-900 py-2">{company.gstNumber ?? '—'}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-gray-400" />Email</label>
              {editing ? (
                <Input type="email" value={form.email ?? ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              ) : (
                <p className="text-sm text-gray-900 py-2">{company.email ?? '—'}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-gray-400" />Phone</label>
              {editing ? (
                <Input value={form.phone ?? ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              ) : (
                <p className="text-sm text-gray-900 py-2">{company.phone ?? '—'}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-gray-400" />Website</label>
              {editing ? (
                <Input value={form.website ?? ''} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://..." />
              ) : (
                <p className="text-sm text-gray-900 py-2">{company.website ?? '—'}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Established Year</label>
              {editing ? (
                <Input type="number" value={form.establishedYear ?? ''} onChange={e => setForm(f => ({ ...f, establishedYear: Number(e.target.value) }))} min={1900} max={2030} />
              ) : (
                <p className="text-sm text-gray-900 py-2">{company.establishedYear ?? '—'}</p>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
            {editing ? (
              <textarea
                value={form.description ?? ''}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              />
            ) : (
              <p className="text-sm text-gray-700 py-2 leading-relaxed">{company.description ?? '—'}</p>
            )}
          </div>
        </div>

        {editing && (
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => { setEditing(false); setForm(company); }} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white gap-2">
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <Save className="h-3.5 w-3.5" /> Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
