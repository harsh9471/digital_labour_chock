import { api } from './api';

interface ApiResponse<T> { success: boolean; data: T; message: string; }
interface Meta { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean; }
interface PaginatedApiResponse<T> { success: boolean; data: T[]; meta: Meta; message: string; }

export interface AdminStats {
  totalWorkers: number;
  totalContractors: number;
  totalCompanies: number;
  totalJobs: number;
  pendingKyc: number;
  pendingVerifications: number;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: string;
  status: string;
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface AdminWorker {
  id: string;
  userId: string;
  city?: string;
  rating?: number;
  kycStatus: string;
  availableForWork: boolean;
  experienceYears: number;
  dailyRate?: number;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; email?: string; phone?: string; avatar?: string; status: string; };
  location?: { city: string; state: string; };
  skills: { skill: { name: string; }; level: string; }[];
}

export interface AdminContractor {
  id: string;
  userId: string;
  city?: string;
  rating?: number;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; email?: string; phone?: string; avatar?: string; status: string; };
  location?: { city: string; state: string; };
  company?: { id: string; name: string; };
  _count?: { sites: number; jobs: number; projects: number; };
}

export interface AdminCompany {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  gstNumber?: string;
  panNumber?: string;
  employeeCount?: number;
  establishedYear?: number;
  location?: { city: string; state: string; country: string; };
  _count?: { contractors: number; admins: number; projects: number; };
}

export const adminApi = {
  getStats: (): Promise<ApiResponse<AdminStats>> =>
    api.get('/users/admin/stats'),

  getUsers: (params?: { page?: number; limit?: number; role?: string; status?: string; search?: string }): Promise<PaginatedApiResponse<AdminUser>> => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.role) q.set('role', params.role);
    if (params?.status) q.set('status', params.status);
    if (params?.search) q.set('search', params.search);
    return api.get(`/users?${q.toString()}`);
  },

  getWorkers: (params?: { page?: number; limit?: number; city?: string; available?: string }): Promise<PaginatedApiResponse<AdminWorker>> => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.city) q.set('city', params.city);
    if (params?.available) q.set('available', params.available);
    return api.get(`/users/workers?${q.toString()}`);
  },

  getContractors: (params?: { page?: number; limit?: number; city?: string }): Promise<PaginatedApiResponse<AdminContractor>> => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.city) q.set('city', params.city);
    return api.get(`/contractors?${q.toString()}`);
  },

  getCompanies: (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedApiResponse<AdminCompany>> => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.search) q.set('search', params.search);
    return api.get(`/company?${q.toString()}`);
  },

  updateUserStatus: (userId: string, status: string): Promise<ApiResponse<{ id: string; status: string }>> =>
    api.patch(`/users/${userId}/status`, { status }),

  updateWorkerKyc: (workerId: string, kycStatus: string): Promise<ApiResponse<{ id: string; kycStatus: string }>> =>
    api.patch(`/workers/${workerId}/kyc`, { kycStatus }),

  deleteUser: (userId: string): Promise<ApiResponse<{ message: string }>> =>
    api.delete(`/users/${userId}`),

  getPendingKyc: (params?: { page?: number; limit?: number }): Promise<PaginatedApiResponse<AdminWorker>> => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    q.set('available', 'true');
    return api.get(`/users/workers?${q.toString()}`);
  },
};
