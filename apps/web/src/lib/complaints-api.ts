import { api } from './api';

interface ApiResponse<T> { success: boolean; data: T; message: string; }
interface Meta { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean; }
interface PaginatedApiResponse<T> { success: boolean; data: T[]; meta: Meta; message: string; }

export type ComplaintType = 'PAYMENT_DISPUTE' | 'HARASSMENT' | 'FRAUD' | 'SAFETY_VIOLATION' | 'CONTRACT_BREACH' | 'OTHER';
export type ComplaintStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';

export interface Complaint {
  id: string;
  reportedBy: string;
  reportedAgainst?: string;
  type: ComplaintType;
  status: ComplaintStatus;
  title: string;
  description: string;
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  reporter?: { id: string; firstName: string; lastName: string; role: string; };
}

export interface ComplaintSummary {
  total: number;
  open: number;
  underReview: number;
  resolved: number;
  dismissed: number;
}

export const complaintsApi = {
  list: (params?: { page?: number; limit?: number; type?: ComplaintType; status?: ComplaintStatus }): Promise<PaginatedApiResponse<Complaint>> => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.type) q.set('type', params.type);
    if (params?.status) q.set('status', params.status);
    return api.get(`/complaints?${q.toString()}`);
  },

  listMine: (params?: { page?: number; limit?: number; status?: ComplaintStatus }): Promise<PaginatedApiResponse<Complaint>> => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.status) q.set('status', params.status);
    return api.get(`/complaints/mine?${q.toString()}`);
  },

  getSummary: (): Promise<ApiResponse<ComplaintSummary>> =>
    api.get('/complaints/summary'),

  getById: (id: string): Promise<ApiResponse<Complaint>> =>
    api.get(`/complaints/${id}`),

  create: (payload: { type: ComplaintType; title: string; description: string; reportedAgainst?: string }): Promise<ApiResponse<Complaint>> =>
    api.post('/complaints', payload),

  update: (id: string, payload: { status?: ComplaintStatus; resolution?: string }): Promise<ApiResponse<Complaint>> =>
    api.patch(`/complaints/${id}`, payload),
};
