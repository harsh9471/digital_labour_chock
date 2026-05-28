'use client';

import { useState, useEffect } from 'react';
import { Users, Briefcase, Building2, TrendingUp, Shield, AlertTriangle, Activity, BarChart2 } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { AdminStats } from '@/lib/admin-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-500 w-8 text-right">{value}</span>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Simulated monthly trend (real trend requires backend time-series endpoint)
  const trend = [18, 24, 31, 45, 52, 61, 74, 88, 97, 110, 130, stats?.totalWorkers ?? 150];
  const maxTrend = Math.max(...trend);

  const currentMonth = new Date().getMonth();
  const last6Months = Array.from({ length: 6 }, (_, i) => MONTHS[(currentMonth - 5 + i + 12) % 12]);
  const last6Trend = trend.slice(-6);

  const kycBreakdown = [
    { label: 'Pending KYC', value: stats?.pendingKyc ?? 0, color: 'bg-amber-500' },
    { label: 'Pending Accounts', value: stats?.pendingVerifications ?? 0, color: 'bg-rose-500' },
    { label: 'Verified Workers', value: Math.max(0, (stats?.totalWorkers ?? 0) - (stats?.pendingKyc ?? 0)), color: 'bg-emerald-500' },
  ];
  const maxKyc = Math.max(...kycBreakdown.map((k) => k.value), 1);

  const platformSummary = [
    { label: 'Workers', value: stats?.totalWorkers ?? 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Contractors', value: stats?.totalContractors ?? 0, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Companies', value: stats?.totalCompanies ?? 0, icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Jobs Posted', value: stats?.totalJobs ?? 0, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending KYC', value: stats?.pendingKyc ?? 0, icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Pending Accounts', value: stats?.pendingVerifications ?? 0, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Platform Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">Real-time platform metrics and insights</p>
      </div>

      {/* Platform Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />)
          : platformSummary.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.label} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                      <Icon className={`h-4.5 w-4.5 ${item.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{item.value.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-tight">{item.label}</p>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Worker Growth Trend */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-sm font-semibold text-slate-800">Worker Growth (Last 6 Months)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {last6Months.map((month, i) => (
                <div key={month} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-8 shrink-0">{month}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.round((last6Trend[i] / maxTrend) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 w-8 text-right">{last6Trend[i]}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4 border-t border-slate-50 pt-3">
              * Trend data is illustrative. Connect a time-series analytics endpoint for live data.
            </p>
          </CardContent>
        </Card>

        {/* KYC Breakdown */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-600" />
              <CardTitle className="text-sm font-semibold text-slate-800">KYC & Verification Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {kycBreakdown.map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>{label}</span>
                  <span className="font-semibold">{value.toLocaleString('en-IN')}</span>
                </div>
                <MiniBar value={value} max={maxKyc} color={color} />
              </div>
            ))}

            <div className="border-t border-slate-50 pt-3 mt-2">
              {stats && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">KYC Completion Rate</span>
                  <span className="font-bold text-emerald-600">
                    {stats.totalWorkers > 0
                      ? `${Math.round(((stats.totalWorkers - stats.pendingKyc) / stats.totalWorkers) * 100)}%`
                      : 'N/A'}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Platform Composition */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-purple-600" />
              <CardTitle className="text-sm font-semibold text-slate-800">Platform Composition</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {stats && (() => {
              const total = stats.totalWorkers + stats.totalContractors + stats.totalCompanies;
              const items = [
                { label: 'Workers', value: stats.totalWorkers, color: 'bg-blue-500', pct: total > 0 ? Math.round((stats.totalWorkers / total) * 100) : 0 },
                { label: 'Contractors', value: stats.totalContractors, color: 'bg-indigo-500', pct: total > 0 ? Math.round((stats.totalContractors / total) * 100) : 0 },
                { label: 'Companies', value: stats.totalCompanies, color: 'bg-purple-500', pct: total > 0 ? Math.round((stats.totalCompanies / total) * 100) : 0 },
              ];
              return items.map(({ label, value, color, pct }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                      {label}
                    </span>
                    <span className="font-semibold">{value.toLocaleString('en-IN')} ({pct}%)</span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ));
            })()}
          </CardContent>
        </Card>

        {/* Quick Metrics */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-sm font-semibold text-slate-800">Key Metrics</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {[
                { label: 'Jobs per Contractor', value: stats && stats.totalContractors > 0 ? (stats.totalJobs / stats.totalContractors).toFixed(1) : '—' },
                { label: 'Workers per Company', value: stats && stats.totalCompanies > 0 ? Math.round(stats.totalWorkers / stats.totalCompanies) : '—' },
                { label: 'KYC Pending Rate', value: stats && stats.totalWorkers > 0 ? `${Math.round((stats.pendingKyc / stats.totalWorkers) * 100)}%` : '—' },
                { label: 'Platform Users Total', value: stats ? (stats.totalWorkers + stats.totalContractors).toLocaleString('en-IN') : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-sm text-slate-600">{label}</span>
                  <span className="text-sm font-bold text-slate-900">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
