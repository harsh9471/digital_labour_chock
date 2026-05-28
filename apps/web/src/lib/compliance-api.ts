import { api } from './api';

interface ApiResponse<T> { success: boolean; data: T; message: string; }
interface Meta { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean; }
interface PaginatedApiResponse<T> { success: boolean; data: T[]; meta: Meta; message: string; }

export interface ComplianceRecord {
  id: string;
  contractorId: string;
  companyId?: string;
  type: 'PF' | 'ESI' | 'LABOUR_LICENSE' | 'SAFETY_AUDIT' | 'TAX_FILING' | 'INSURANCE' | 'OTHER';
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'OVERDUE';
  dueDate: string;
  completedAt?: string;
  documentUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface ComplianceSummary {
  total: number;
  pending: number;
  overdue: number;
  approved: number;
  inReview: number;
}

export const complianceApi = {
  list: (params?: { page?: number; limit?: number; type?: string; status?: string }): Promise<PaginatedApiResponse<ComplianceRecord>> => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.type) q.set('type', params.type);
    if (params?.status) q.set('status', params.status);
    return api.get(`/compliance?${q.toString()}`);
  },

  getById: (id: string): Promise<ApiResponse<ComplianceRecord>> =>
    api.get(`/compliance/${id}`),

  getSummary: (): Promise<ApiResponse<ComplianceSummary>> =>
    api.get('/compliance/summary'),

  create: (payload: Partial<ComplianceRecord>): Promise<ApiResponse<ComplianceRecord>> =>
    api.post('/compliance', payload),

  update: (id: string, payload: Partial<ComplianceRecord>): Promise<ApiResponse<ComplianceRecord>> =>
    api.patch(`/compliance/${id}`, payload),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    api.delete(`/compliance/${id}`),
};
