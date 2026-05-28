'use client';

import { useState, useEffect } from 'react';
import { User, Bell, Lock, Shield, Save, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { workersApi } from '@/lib/workers-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Tab = 'profile' | 'notifications' | 'security';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile form
  const [profile, setProfile] = useState({ bio: '', city: '', state: '', dailyRate: '', languages: '' });

  // Password form
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);

  // Notification prefs (local-only UI — extend with real API when backend endpoint exists)
  const [notifs, setNotifs] = useState({ email: true, sms: true, jobAlerts: true, paymentAlerts: true, systemUpdates: false });

  useEffect(() => {
    if (user?.role === 'WORKER') {
      workersApi.getMyProfile().then((res) => {
        const p = res.data;
        setProfile({
          bio: p.bio ?? '',
          city: p.location?.city ?? p.city ?? '',
          state: p.location?.state ?? p.state ?? '',
          dailyRate: p.dailyRate?.toString() ?? '',
          languages: p.languages?.join(', ') ?? '',
        });
      }).catch(() => {});
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (user?.role === 'WORKER') {
        await workersApi.updateMyProfile({
          bio: profile.bio || undefined,
          city: profile.city || undefined,
          state: profile.state || undefined,
          dailyRate: profile.dailyRate ? Number(profile.dailyRate) : undefined,
          languages: profile.languages ? profile.languages.split(',').map((l) => l.trim()).filter(Boolean) : undefined,
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your account preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-slate-500">{user?.email ?? user?.phone}</p>
                <Badge variant="secondary" className="mt-1 text-xs">{user?.role}</Badge>
              </div>
            </div>

            {user?.role === 'WORKER' ? (
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Bio</label>
                  <textarea
                    rows={3} value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Tell employers about yourself..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">City</label>
                    <input
                      value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">State</label>
                    <input
                      value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Daily Rate (₹)</label>
                  <input
                    type="number" min={0} value={profile.dailyRate}
                    onChange={(e) => setProfile({ ...profile, dailyRate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Languages (comma-separated)</label>
                  <input
                    value={profile.languages} onChange={(e) => setProfile({ ...profile, languages: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hindi, English, Marathi"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  {saved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
                  <button
                    type="submit" disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 text-sm text-slate-600">
                <p>Profile editing for your role is managed through the dedicated profile section.</p>
                <p className="text-slate-400">Contact support to update your account information.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
              { key: 'sms', label: 'SMS Notifications', desc: 'Receive SMS alerts on your phone' },
              { key: 'jobAlerts', label: 'Job Alerts', desc: 'Get notified about new matching jobs' },
              { key: 'paymentAlerts', label: 'Payment Alerts', desc: 'Notifications for payroll and payments' },
              { key: 'systemUpdates', label: 'System Updates', desc: 'Platform updates and announcements' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
                <button
                  onClick={() => setNotifs((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${notifs[key as keyof typeof notifs] ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifs[key as keyof typeof notifs] ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); alert('Password change requires backend endpoint.'); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">New Password</label>
                  <input
                    type="password" value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Confirm New Password</label>
                  <input
                    type="password" value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Update Password
                </button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-600" />
                <CardTitle className="text-base font-semibold">Account Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <span className="text-slate-600">Email Verified</span>
                <Badge variant={user?.role ? 'success' : 'warning'}>{user?.role ? 'Verified' : 'Not Verified'}</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Account Status</span>
                <Badge variant="success">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
