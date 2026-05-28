'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Briefcase, Building2, TrendingUp, UserCheck, AlertTriangle, Bell, Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth.store';
import { getInitials } from '@/lib/utils';

const dashboardStats = [
  { label: 'Total Workers', value: '2,04,831', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Active Jobs', value: '8,429', change: '+5%', icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Companies', value: '1,247', change: '+8%', icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Revenue (MTD)', value: '₹24.5L', change: '+18%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
];

const pendingVerifications = [
  { name: 'Ramesh Yadav', type: 'Worker', document: 'Aadhar Card', submitted: '2025-05-26' },
  { name: 'Suresh Patil', type: 'Contractor', document: 'License', submitted: '2025-05-25' },
  { name: 'TechBuild Pvt Ltd', type: 'Company', document: 'GST Certificate', submitted: '2025-05-24' },
];

const recentActivity = [
  { text: 'New worker registered: Kavitha Nair', time: '5 mins ago', type: 'success' },
  { text: 'Contractor Suresh Patil verified', time: '1 hour ago', type: 'info' },
  { text: 'Job complaint filed against Worker #1029', time: '2 hours ago', type: 'warning' },
  { text: 'Company BuildRight updated profile', time: '3 hours ago', type: 'info' },
  { text: 'Payment dispute resolved for Job #4821', time: '5 hours ago', type: 'success' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (user?.role !== 'SUPER_ADMIN') { router.replace('/login'); }
  }, [isAuthenticated, user, router]);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 hidden lg:flex flex-col z-40">
        <div className="flex items-center gap-3 p-6 border-b border-gray-800">
          <div className="w-9 h-9 rounded-lg gradient-brand flex items-center justify-center">
            <span className="text-white font-bold text-sm">DL</span>
          </div>
          <div>
            <p className="font-bold text-white text-sm">Digital Labour</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: TrendingUp, label: 'Dashboard', active: true },
            { icon: Users, label: 'Workers' },
            { icon: Briefcase, label: 'Contractors' },
            { icon: Building2, label: 'Companies' },
            { icon: UserCheck, label: 'Verifications', badge: '3' },
            { icon: AlertTriangle, label: 'Complaints' },
            { icon: Settings, label: 'Settings' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-400">Super Admin</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full text-gray-400 hover:text-white" onClick={() => logout().then(() => router.push('/login'))}>
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 h-16 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-display font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">Welcome back, {user.firstName}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {dashboardStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="border-0 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <Badge variant="success" className="text-xs font-medium">{stat.change}</Badge>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Pending Verifications */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base font-semibold text-gray-900">Pending Verifications</CardTitle>
                  <Badge variant="warning" className="text-xs">3 Pending</Badge>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs font-medium text-gray-500 border-b">
                          <th className="pb-3 text-left">Name</th>
                          <th className="pb-3 text-left">Type</th>
                          <th className="pb-3 text-left">Document</th>
                          <th className="pb-3 text-left">Date</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-2">
                        {pendingVerifications.map((item, i) => (
                          <tr key={i} className="border-b border-gray-50 last:border-0">
                            <td className="py-3 text-sm font-medium text-gray-900">{item.name}</td>
                            <td className="py-3">
                              <Badge variant={item.type === 'Worker' ? 'info' : item.type === 'Contractor' ? 'warning' : 'secondary'} className="text-xs">
                                {item.type}
                              </Badge>
                            </td>
                            <td className="py-3 text-sm text-gray-600">{item.document}</td>
                            <td className="py-3 text-xs text-gray-500">{item.submitted}</td>
                            <td className="py-3 text-right">
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" size="sm" className="text-xs h-7 text-green-600 border-green-200 hover:bg-green-50">
                                  Approve
                                </Button>
                                <Button variant="outline" size="sm" className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50">
                                  Reject
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-900">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      item.type === 'success' ? 'bg-green-500' :
                      item.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="text-xs text-gray-700">{item.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
