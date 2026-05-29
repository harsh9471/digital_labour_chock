'use client';

import React, { useEffect, useState } from 'react';
import { Users, MapPin, Star, FolderKanban, Loader2 } from 'lucide-react';
import { companyApi, WorkforceMember } from '@/lib/company-api';

export default function CompanyWorkforcePage() {
  const [assignments, setAssignments] = useState<WorkforceMember[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyApi.getWorkforce()
      .then(res => {
        setAssignments(res.data?.assignments ?? []);
        setTotal(res.data?.total ?? 0);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Workforce</h1>
        <p className="text-sm text-gray-500 mt-0.5">{total} active worker{total !== 1 ? 's' : ''} deployed across projects</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-violet-50 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Deployed</p>
          <p className="text-2xl font-bold mt-1 text-violet-700">{total}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Shown</p>
          <p className="text-2xl font-bold mt-1 text-emerald-700">{assignments.length}</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Projects</p>
          <p className="text-2xl font-bold mt-1 text-blue-700">
            {new Set(assignments.map(a => a.project?.id).filter(Boolean)).size}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center"><Loader2 className="h-7 w-7 animate-spin text-violet-500" /></div>
      ) : assignments.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
            <Users className="h-7 w-7 text-violet-400" />
          </div>
          <p className="font-semibold text-gray-700">No workforce deployed</p>
          <p className="text-sm text-gray-400 mt-1">Workers assigned to company projects will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Worker</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Project</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Skills</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {assignments.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shrink-0">
                          <span className="text-white text-xs font-bold">
                            {a.worker?.user.firstName?.[0]}{a.worker?.user.lastName?.[0]}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{a.worker?.user.firstName} {a.worker?.user.lastName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <FolderKanban className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{a.project?.name ?? '—'}</span>
                      </div>
                      {a.project?.city && (
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 ml-5">
                          <MapPin className="h-2.5 w-2.5" />{a.project.city}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {a.worker?.skills?.length ? (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          {a.worker.skills[0]?.skill?.name}
                        </span>
                      ) : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-sm">{a.worker?.city ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      {a.worker?.rating ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {Number(a.worker.rating).toFixed(1)}
                        </span>
                      ) : <span className="text-xs text-gray-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-50">
            {assignments.map(a => (
              <div key={a.id} className="px-4 py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-bold">
                        {a.worker?.user.firstName?.[0]}{a.worker?.user.lastName?.[0]}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{a.worker?.user.firstName} {a.worker?.user.lastName}</p>
                  </div>
                  {a.worker?.rating && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {Number(a.worker.rating).toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FolderKanban className="h-3 w-3" />{a.project?.name ?? '—'}
                  {a.project?.city && <span>· {a.project.city}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
