import { api } from './api';

interface ApiResponse<T> { success: boolean; data: T; message: string; }
interface Meta { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean; }
interface PaginatedApiResponse<T> { success: boolean; data: T[]; meta: Meta; message: string; }

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  city: string;
  state?: string;
  address?: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  contractorId: string;
  companyId?: string;
  createdAt: string;
  _count?: { workforceAssignments: number; sites: number; };
}

export interface WorkforceAssignment {
  id: string;
  projectId: string;
  workerId: string;
  role?: string;
  dailyWage?: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  worker?: { id: string; user: { firstName: string; lastName: string; avatar?: string; }; city?: string; rating?: number; };
  project?: { id: string; name: string; city: string; };
}

export interface ProjectStats {
  totalWorkers: number;
  activeWorkers: number;
  totalDays: number;
  totalWageCost: number;
  siteCount: number;
}

export const projectsApi = {
  list: (params?: { page?: number; limit?: number; status?: string; search?: string; city?: string }): Promise<PaginatedApiResponse<Project>> => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.status) q.set('status', params.status);
    if (params?.search) q.set('search', params.search);
    if (params?.city) q.set('city', params.city);
    return api.get(`/projects?${q.toString()}`);
  },

  getById: (id: string): Promise<ApiResponse<Project>> =>
    api.get(`/projects/${id}`),

  create: (payload: Partial<Project>): Promise<ApiResponse<Project>> =>
    api.post('/projects', payload),

  update: (id: string, payload: Partial<Project>): Promise<ApiResponse<Project>> =>
    api.patch(`/projects/${id}`, payload),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    api.delete(`/projects/${id}`),

  getStats: (id: string): Promise<ApiResponse<ProjectStats>> =>
    api.get(`/projects/${id}/stats`),

  assignWorker: (projectId: string, payload: { workerId: string; role?: string; dailyWage?: number; startDate: string; endDate?: string }): Promise<ApiResponse<WorkforceAssignment>> =>
    api.post(`/projects/${projectId}/assign-worker`, payload),

  removeAssignment: (projectId: string, assignmentId: string): Promise<ApiResponse<{ message: string }>> =>
    api.delete(`/projects/${projectId}/assignments/${assignmentId}`),
};
