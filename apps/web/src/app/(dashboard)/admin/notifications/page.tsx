'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { notificationsApi, NotificationTemplate } from '@/lib/notifications-api';
import { Button } from '@/components/ui/button';
import { Bell, Send, Plus, Trash2, Loader2, CheckCircle, X, User, Search, Info } from 'lucide-react';
import apiClient from '@/lib/api';

interface NotifStats {
  total: number;
  sent: number;
  delivered: number;
  failed: number;
  byChannel: { channel: string; count: number }[];
  byType: { type: string; count: number }[];
}

interface UserSuggestion {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
}

function UserAutocomplete({
  selected,
  onChange,
}: {
  selected: UserSuggestion[];
  onChange: (users: UserSuggestion[]) => void;
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 3) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await apiClient.get('/users', {
        params: { search: q, status: 'ACTIVE', limit: 10 },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: UserSuggestion[] = (res.data?.data ?? []).map((u: any) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        role: u.role,
      }));
      setSuggestions(data.filter(u => !selected.find(s => s.id === u.id)));
      setOpen(data.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [selected]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const addUser = (u: UserSuggestion) => {
    onChange([...selected, u]);
    setQuery('');
    setSuggestions([]);
    setOpen(false);
  };

  const removeUser = (id: string) => onChange(selected.filter(u => u.id !== id));

  return (
    <div ref={containerRef} className="relative">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map(u => (
            <span key={u.id} className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              <User className="h-3 w-3" />
              {u.firstName} {u.lastName}
              {u.phone && <span className="text-blue-600 font-normal">· {u.phone}</span>}
              <button onClick={() => removeUser(u.id)} className="ml-0.5 hover:text-blue-900">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type 3+ characters to search users by name or phone..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />}
      </div>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map(u => (
            <button
              key={u.id}
              onClick={() => addUser(u)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {u.firstName[0]}{u.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{u.firstName} {u.lastName}</p>
                <p className="text-xs text-gray-400">{u.phone} · <span className="capitalize">{u.role.toLowerCase().replace('_', ' ')}</span></p>
              </div>
              <Plus className="h-4 w-4 text-blue-500 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {query.length > 0 && query.length < 3 && (
        <p className="text-xs text-gray-400 mt-1">Type at least 3 characters to search</p>
      )}
      {selected.length > 0 && (
        <p className="text-xs text-gray-500 mt-1.5">{selected.length} user{selected.length > 1 ? 's' : ''} selected</p>
      )}
    </div>
  );
}

const NOTIFICATION_TYPES = [
  'GENERAL', 'JOB_APPLICATION', 'APPLICATION_UPDATE', 'ATTENDANCE_CHECKIN',
  'PAYROLL_PROCESSED', 'KYC_UPDATE', 'COMPLIANCE_ALERT', 'PAYMENT_RECEIVED',
  'JOB_POSTED', 'WORKER_HIRED', 'COMPLAINT_UPDATE', 'SYSTEM_ALERT',
];

export default function AdminNotificationsPage() {
  const [stats, setStats] = useState<NotifStats | null>(null);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'send' | 'templates' | 'stats'>('send');
  const [selectedUsers, setSelectedUsers] = useState<UserSuggestion[]>([]);
  const [sendForm, setSendForm] = useState({ title: '', body: '', type: 'GENERAL' });
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    name: '', type: 'GENERAL', channel: 'IN_APP', titleTemplate: '', bodyTemplate: '',
  });
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, tmplRes] = await Promise.all([
          notificationsApi.getStats(),
          notificationsApi.getTemplates(),
        ]);
        setStats((statsRes.data as unknown as { data: NotifStats }).data);
        setTemplates((tmplRes.data as unknown as { data: NotificationTemplate[] }).data);
      } catch { /* handled */ } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSend = async () => {
    if (!selectedUsers.length || !sendForm.title || !sendForm.body) return;
    setSending(true);
    try {
      await notificationsApi.bulkSend({
        userIds: selectedUsers.map(u => u.id),
        title: sendForm.title,
        body: sendForm.body,
        type: sendForm.type,
      });
      setSelectedUsers([]);
      setSendForm({ title: '', body: '', type: 'GENERAL' });
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 4000);
    } catch { /* handled */ } finally {
      setSending(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!templateForm.name || !templateForm.titleTemplate || !templateForm.bodyTemplate) return;
    setSavingTemplate(true);
    try {
      const res = await notificationsApi.createTemplate(templateForm);
      setTemplates(prev => [...prev, (res.data as unknown as { data: NotificationTemplate }).data]);
      setShowTemplateForm(false);
      setTemplateForm({ name: '', type: 'GENERAL', channel: 'IN_APP', titleTemplate: '', bodyTemplate: '' });
    } catch { /* handled */ } finally {
      setSavingTemplate(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    try {
      await notificationsApi.deleteTemplate(id);
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch { /* handled */ }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notification Management</h1>
        <p className="text-sm text-gray-500 mt-1">Send and manage platform notifications</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {(['send', 'templates', 'stats'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {tab === 'send' ? 'Send Notification' : tab === 'templates' ? 'Templates' : 'Statistics'}
          </button>
        ))}
      </div>

      {/* ── Send Tab ── */}
      {activeTab === 'send' && (
        <div className="bg-white border rounded-xl p-6 space-y-5 max-w-2xl">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Send className="h-4 w-4 text-blue-600" /> Send Notification
          </h2>

          {sendSuccess && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 text-sm">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
              Notification sent successfully to {selectedUsers.length || 'selected'} user(s).
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Recipients <span className="text-red-500">*</span>
            </label>
            <UserAutocomplete selected={selectedUsers} onChange={setSelectedUsers} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Notification title"
              value={sendForm.title}
              onChange={(e) => setSendForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Message <span className="text-red-500">*</span></label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              placeholder="Notification message..."
              value={sendForm.body}
              onChange={(e) => setSendForm(f => ({ ...f, body: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sendForm.type}
              onChange={(e) => setSendForm(f => ({ ...f, type: e.target.value }))}
            >
              {NOTIFICATION_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
            </select>
          </div>

          <Button
            onClick={handleSend}
            disabled={sending || !selectedUsers.length || !sendForm.title || !sendForm.body}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send to {selectedUsers.length > 0 ? `${selectedUsers.length} User${selectedUsers.length > 1 ? 's' : ''}` : 'Selected Users'}
          </Button>
        </div>
      )}

      {/* ── Templates Tab ── */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          {/* Explanation */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-3xl">
            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">What are Templates?</p>
              <p>Templates are reusable notification formats with dynamic placeholders (e.g. <code className="bg-blue-100 px-1 rounded">{'{{name}}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{{jobTitle}}'}</code>). The system uses these templates automatically when sending event-triggered notifications (e.g. "You have been hired", "Your KYC is approved"). Creating templates here makes those messages consistent and customizable without code changes.</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setShowTemplateForm(true)} className="gap-2">
              <Plus className="h-4 w-4" /> New Template
            </Button>
          </div>

          {showTemplateForm && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-4 max-w-3xl">
              <h3 className="font-semibold text-gray-900">Create Template</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (slug)</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. job_hired"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={templateForm.type}
                    onChange={(e) => setTemplateForm(f => ({ ...f, type: e.target.value }))}>
                    {NOTIFICATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={templateForm.channel}
                    onChange={(e) => setTemplateForm(f => ({ ...f, channel: e.target.value }))}>
                    <option value="IN_APP">In-App</option>
                    <option value="PUSH">Push</option>
                    <option value="SMS">SMS</option>
                    <option value="EMAIL">Email</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title Template</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hello {{name}}!"
                    value={templateForm.titleTemplate}
                    onChange={(e) => setTemplateForm(f => ({ ...f, titleTemplate: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body Template</label>
                  <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                    placeholder="You have been hired for {{jobTitle}}. Report to {{site}} on {{date}}."
                    value={templateForm.bodyTemplate}
                    onChange={(e) => setTemplateForm(f => ({ ...f, bodyTemplate: e.target.value }))} />
                  <p className="text-xs text-gray-400 mt-1">Use {'{{variableName}}'} for dynamic values</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleCreateTemplate} disabled={savingTemplate} className="gap-2">
                  {savingTemplate && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create Template
                </Button>
                <Button variant="outline" onClick={() => setShowTemplateForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            {loading ? (
              <div className="col-span-2 flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
            ) : templates.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-white border border-gray-100 rounded-xl text-gray-400">
                <Bell className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>No templates yet. Create one to standardize your notifications.</p>
              </div>
            ) : templates.map((t) => (
              <div key={t.id} className="bg-white border border-gray-100 rounded-xl p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 font-mono text-sm">{t.name}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">{t.type}</span>
                      <span className="inline-flex px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-800">{t.channel}</span>
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs ${t.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                        {t.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteTemplate(t.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                  <p className="font-medium text-gray-700">{t.titleTemplate}</p>
                  <p className="text-gray-500 text-xs">{t.bodyTemplate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Stats Tab ── */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
          ) : stats && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total',     value: stats.total,     icon: Bell,          color: 'text-blue-600 bg-blue-100' },
                  { label: 'Sent',      value: stats.sent,      icon: Send,          color: 'text-green-600 bg-green-100' },
                  { label: 'Delivered', value: stats.delivered, icon: CheckCircle,   color: 'text-teal-600 bg-teal-100' },
                  { label: 'Failed',    value: stats.failed,    icon: Bell,          color: 'text-red-600 bg-red-100' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-white border border-gray-100 rounded-xl p-4">
                    <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-100 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">By Channel</h3>
                  <div className="space-y-2">
                    {stats.byChannel.map(({ channel, count }) => (
                      <div key={channel} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-24">{channel}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(stats.total > 0 ? (count / stats.total) * 100 : 0, 100)}%` }} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-12 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">By Type</h3>
                  <div className="space-y-2">
                    {stats.byType.slice(0, 8).map(({ type, count }) => (
                      <div key={type} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-40 truncate">{type.replace(/_/g, ' ')}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${Math.min(stats.total > 0 ? (count / stats.total) * 100 : 0, 100)}%` }} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-12 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
