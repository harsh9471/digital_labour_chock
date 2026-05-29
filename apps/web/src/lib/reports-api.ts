import api from './api';

export interface AdminReport {
  id: string;
  title: string;
  type: string;
  data?: Record<string, unknown>;
  fileUrl?: string;
  periodStart?: string;
  periodEnd?: string;
  createdBy?: string;
  isScheduled: boolean;
  createdAt: string;
}

export interface RevenuePoint { month: string; revenue: number; batches: number }
export interface HiringPoint { date: string; applications: number; hired: number }

const BASE = '/reports';

export const reportsApi = {
  getAdminOverview: () =>
    api.get(`${BASE}/admin/overview`),

  getRevenue: (months = 6) =>
    api.get<{ trend: RevenuePoint[] }>(`${BASE}/revenue`, { params: { months } }),

  getWorkforce: () =>
    api.get(`${BASE}/workforce`),

  getHiring: (days = 30) =>
    api.get<{ trend: HiringPoint[] }>(`${BASE}/hiring`, { params: { days } }),

  getAll: (page = 1, limit = 20, type?: string) =>
    api.get<{ reports: AdminReport[] }>(`${BASE}`, { params: { page, limit, type } }),

  generate: (data: { title: string; type: string; periodStart?: string; periodEnd?: string }) =>
    api.post<AdminReport>(`${BASE}/generate`, data),

  getOne: (id: string) =>
    api.get<AdminReport>(`${BASE}/${id}`),

  deleteReport: (id: string) =>
    api.delete(`${BASE}/${id}`),
};
