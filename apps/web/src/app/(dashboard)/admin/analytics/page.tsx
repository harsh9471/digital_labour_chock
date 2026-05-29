'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  Users, Briefcase, Building2, TrendingUp, IndianRupee,
  CheckCircle, UserCheck, Loader2,
} from 'lucide-react';
import { reportsApi } from '@/lib/reports-api';
import { adminPanelApi } from '@/lib/admin-panel-api';

const COLORS = ['#3B82F6', '#8B5CF6', '#22C55E', '#F59E0B', '#EF4444', '#14B8A6', '#F97316', '#6366F1'];

interface PlatformStats {
  users: { total: number; active: number; pending: number; byRole: { role: string; count: number }[] };
  workers: { total: number; verified: number };
  contractors: { total: number; verified: number };
  companies: { total: number; verified: number };
  jobs: { total: number; active: number };
  applications: { total: number; hired: number };
  complaints: { open: number };
  documents: { pending: number };
  payroll: { totalProcessed: number };
}

function StatCard({ label, value, sub, icon: Icon, color, change }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string; change?: number;
}) {
  return (
    <div className="bg-white rounded-xl border p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {change !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      <p className="text-sm font-medium text-gray-600 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [revenueTrend, setRevenueTrend] = useState<{ month: string; revenue: number }[]>([]);
  const [hiringTrend, setHiringTrend] = useState<{ date: string; applications: number; hired: number }[]>([]);
  const [workforceData, setWorkforceData] = useState<{
    total: number; available: number; utilization: number; avgRating: string;
    skillDistribution: { skill: string; count: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, revRes, hiringRes, workRes] = await Promise.all([
          adminPanelApi.getStats(),
          reportsApi.getRevenue(6),
          reportsApi.getHiring(30),
          reportsApi.getWorkforce(),
        ]);
        setStats((statsRes.data as unknown as { data: PlatformStats }).data);
        setRevenueTrend((revRes.data as unknown as { data: { trend: { month: string; revenue: number }[] } }).data.trend);
        setHiringTrend((hiringRes.data as unknown as { data: { trend: { date: string; applications: number; hired: number }[] } }).data.trend);
        setWorkforceData((workRes.data as unknown as { data: typeof workforceData }).data);
      } catch {
        // handled
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const usersByRole = stats?.users.byRole ?? [];
  const conversionRate = stats && stats.applications.total > 0
    ? Math.round((stats.applications.hired / stats.applications.total) * 100)
    : 0;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time insights across all platform metrics</p>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={stats.users.total} sub={`${stats.users.active} active`} icon={Users} color="bg-blue-600" />
          <StatCard label="Total Workers" value={stats.workers.total} sub={`${stats.workers.verified} KYC verified`} icon={UserCheck} color="bg-purple-600" />
          <StatCard label="Total Jobs" value={stats.jobs.total} sub={`${stats.jobs.active} active`} icon={Briefcase} color="bg-green-600" />
          <StatCard label="Total Payroll" value={`₹${(stats.payroll.totalProcessed / 100000).toFixed(1)}L`} sub="all-time processed" icon={IndianRupee} color="bg-amber-600" />
          <StatCard label="Contractors" value={stats.contractors.total} sub={`${stats.contractors.verified} verified`} icon={TrendingUp} color="bg-orange-600" />
          <StatCard label="Companies" value={stats.companies.total} sub={`${stats.companies.verified} verified`} icon={Building2} color="bg-teal-600" />
          <StatCard label="Applications" value={stats.applications.total} sub={`${conversionRate}% conversion`} icon={CheckCircle} color="bg-indigo-600" />
          <StatCard label="Open Complaints" value={stats.complaints.open} sub={`${stats.documents.pending} docs pending`} icon={Briefcase} color="bg-red-600" />
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-white border rounded-xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Revenue Trend (6 Months)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueTrend} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="url(#revenueGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Users by Role */}
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Users by Role</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={usersByRole}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="count"
                nameKey="role"
                paddingAngle={4}
              >
                {usersByRole.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [Number(v).toLocaleString(), 'Users']} />
              <Legend
                formatter={(v) => v.replace('_', ' ')}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Trend */}
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Hiring Trend (30 Days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={hiringTrend.slice(-14)} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="applications" stroke="#8B5CF6" strokeWidth={2} dot={false} name="Applications" />
              <Line type="monotone" dataKey="hired" stroke="#22C55E" strokeWidth={2} dot={false} name="Hired" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Distribution */}
        {workforceData && workforceData.skillDistribution.length > 0 && (
          <div className="bg-white border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Top Skills (Workers)</h2>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{workforceData.utilization}%</p>
                <p className="text-xs text-gray-500">Utilization</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={workforceData.skillDistribution}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 60, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="skill" tick={{ fontSize: 11 }} width={60} />
                <Tooltip />
                <Bar dataKey="count" name="Workers" radius={[0, 4, 4, 0]}>
                  {workforceData.skillDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Platform Health */}
      {stats && (
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Platform Health Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                label: 'Worker Verification Rate',
                value: stats.workers.total > 0 ? Math.round((stats.workers.verified / stats.workers.total) * 100) : 0,
                color: 'bg-purple-600',
              },
              {
                label: 'Contractor Verification Rate',
                value: stats.contractors.total > 0 ? Math.round((stats.contractors.verified / stats.contractors.total) * 100) : 0,
                color: 'bg-orange-600',
              },
              {
                label: 'Hiring Conversion Rate',
                value: conversionRate,
                color: 'bg-green-600',
              },
              {
                label: 'Active User Rate',
                value: stats.users.total > 0 ? Math.round((stats.users.active / stats.users.total) * 100) : 0,
                color: 'bg-blue-600',
              },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm text-gray-600">{label}</p>
                  <p className="text-sm font-bold text-gray-900">{value}%</p>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all duration-700`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
