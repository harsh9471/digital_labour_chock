'use client';

import { useState } from 'react';
import { Settings, Bell, Shield, Globe, Database, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Tab = 'general' | 'notifications' | 'security' | 'platform';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [saved, setSaved] = useState(false);

  // Platform settings (local UI — extend with real API when endpoint exists)
  const [general, setGeneral] = useState({
    platformName: 'Digital Labour Chowk',
    supportEmail: 'support@digitallabour.in',
    defaultCity: 'Mumbai',
    maxJobsPerContractor: 50,
    maxWorkersPerJob: 500,
  });

  const [features, setFeatures] = useState({
    kycRequired: true,
    autoApproveJobs: false,
    maintenanceMode: false,
    registrationOpen: true,
    jobMarketplace: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'platform', label: 'Platform', icon: Globe },
  ];

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Configure platform-wide settings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* General */}
      {activeTab === 'general' && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Platform Name</label>
                <input
                  value={general.platformName}
                  onChange={(e) => setGeneral({ ...general, platformName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Support Email</label>
                <input
                  type="email" value={general.supportEmail}
                  onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Default City</label>
                  <input
                    value={general.defaultCity}
                    onChange={(e) => setGeneral({ ...general, defaultCity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Max Jobs / Contractor</label>
                  <input
                    type="number" value={general.maxJobsPerContractor}
                    onChange={(e) => setGeneral({ ...general, maxJobsPerContractor: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                {saved && <span className="text-sm text-green-600 font-medium">Settings saved!</span>}
                <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'New User Registration', desc: 'Alert when new users sign up' },
              { label: 'KYC Submissions', desc: 'Alert when workers submit KYC documents' },
              { label: 'New Complaints', desc: 'Alert when complaints are filed' },
              { label: 'Job Reports', desc: 'Weekly job activity reports' },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
                <button className="relative w-11 h-6 rounded-full bg-violet-600 transition-colors">
                  <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-50">
              <div>
                <p className="text-sm font-medium text-slate-800">Two-Factor Authentication</p>
                <p className="text-xs text-slate-400">Require 2FA for admin accounts</p>
              </div>
              <Badge variant="warning" className="text-xs">Recommended</Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-50">
              <div>
                <p className="text-sm font-medium text-slate-800">Session Timeout</p>
                <p className="text-xs text-slate-400">Auto logout after inactivity</p>
              </div>
              <select className="px-2 py-1 border border-slate-200 rounded text-xs bg-white">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>8 hours</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-800">Audit Logs</p>
                <p className="text-xs text-slate-400">Track all admin actions</p>
              </div>
              <Badge variant="success" className="text-xs">Enabled</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform */}
      {activeTab === 'platform' && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-slate-600" />
              <CardTitle className="text-base font-semibold">Platform Features</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'kycRequired', label: 'KYC Required', desc: 'Require KYC verification for workers' },
              { key: 'autoApproveJobs', label: 'Auto-Approve Jobs', desc: 'Automatically publish submitted jobs' },
              { key: 'registrationOpen', label: 'Open Registration', desc: 'Allow new user registrations' },
              { key: 'jobMarketplace', label: 'Job Marketplace', desc: 'Enable public job marketplace' },
              { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Put platform in maintenance mode' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
                <button
                  onClick={() => setFeatures((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${features[key as keyof typeof features] ? 'bg-violet-600' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${features[key as keyof typeof features] ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
