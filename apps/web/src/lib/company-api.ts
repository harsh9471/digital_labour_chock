import { api } from './api';

interface ApiResponse<T> { success: boolean; data: T; message: string; }
interface Meta { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean; }
interface PaginatedApiResponse<T> { success: boolean; data: T[]; meta: Meta; message: string; }

export interface Company {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  gstNumber?: string;
  panNumber?: string;
  employeeCount?: number;
  establishedYear?: number;
  location?: { city: string; state: string; country: string; address?: string; };
  _count?: { contractors: number; admins: number; projects: number; };
}

export interface CompanyDashboard {
  stats: {
    totalContractors: number;
    totalProjects: number;
    activeProjects: number;
    companyWorkforce: number;
    monthPayroll: number;
    pendingCompliance: number;
  };
  recentProjects: { id: string; name: string; status: string; city: string; createdAt: string; contractor: { user: { firstName: string; lastName: string; } }; _count: { workforceAssignments: number; sites: number; }; }[];
  contractorsByLocation: { city: string; _count: { id: number; }; }[];
}

export interface CompanyContractor {
  id: string;
  city?: string;
  rating?: number;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; email: string; phone?: string; avatar?: string; status: string; };
  location?: { city: string; state: string; };
  _count: { sites: number; jobs: number; projects: number; };
}

export interface WorkforceMember {
  id: string;
  startDate: string;
  worker: { id: string; user: { firstName: string; lastName: string; avatar?: string; }; city?: string; rating?: number; skills: { skill: { name: string; } }[]; };
  project: { id: string; name: string; city: string; };
}

export const companyApi = {
  getMyCompany: (): Promise<ApiResponse<Company>> =>
    api.get('/company/me'),

  updateCompany: (payload: Partial<Company>): Promise<ApiResponse<Company>> =>
    api.patch('/company/me', payload),

  getDashboard: (): Promise<ApiResponse<CompanyDashboard>> =>
    api.get('/company/me/dashboard'),

  getContractors: (params?: { page?: number; limit?: number; search?: string; city?: string }): Promise<PaginatedApiResponse<CompanyContractor>> => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.search) q.set('search', params.search);
    if (params?.city) q.set('city', params.city);
    return api.get(`/company/me/contractors?${q.toString()}`);
  },

  getWorkforce: (): Promise<ApiResponse<{ assignments: WorkforceMember[]; total: number; }>> =>
    api.get('/company/me/workforce'),
};
