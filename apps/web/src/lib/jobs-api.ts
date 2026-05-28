import { api } from './api';
import type {
  Job,
  JobApplication,
  JobFilters,
  PaginatedResponse,
  CreateJobPayload,
  UpdateJobPayload,
} from '../types/jobs';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface PaginatedApiResponse<T> extends PaginatedResponse<T> {
  success: boolean;
  message: string;
}

// ─── Jobs ──────────────────────────────────────────────────────────────────

export const jobsApi = {
  // Public — workers can discover
  list: (filters: JobFilters = {}): Promise<PaginatedApiResponse<Job>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v != null && v !== '') params.append(k, String(v));
    });
    return api.get(`/jobs?${params.toString()}`);
  },

  getById: (jobId: string): Promise<ApiResponse<Job>> =>
    api.get(`/jobs/${jobId}`),

  // Contractor — manage own jobs
  listMy: (filters: JobFilters = {}): Promise<PaginatedApiResponse<Job>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v != null && v !== '') params.append(k, String(v));
    });
    return api.get(`/jobs/my?${params.toString()}`);
  },

  create: (payload: CreateJobPayload): Promise<ApiResponse<Job>> =>
    api.post('/jobs', payload),

  update: (jobId: string, payload: UpdateJobPayload): Promise<ApiResponse<Job>> =>
    api.patch(`/jobs/${jobId}`, payload),

  publish: (jobId: string): Promise<ApiResponse<Job>> =>
    api.post(`/jobs/${jobId}/publish`),

  close: (jobId: string): Promise<ApiResponse<Job>> =>
    api.post(`/jobs/${jobId}/close`),

  delete: (jobId: string): Promise<ApiResponse<{ message: string }>> =>
    api.delete(`/jobs/${jobId}`),

  // Applications — contractor side
  listApplications: (
    jobId: string,
    page: number = 1,
    limit: number = 20,
    status?: string,
  ): Promise<PaginatedApiResponse<JobApplication>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);
    return api.get(`/jobs/${jobId}/applications?${params.toString()}`);
  },

  updateApplicationStatus: (
    jobId: string,
    applicationId: string,
    status: 'SHORTLISTED' | 'HIRED' | 'REJECTED',
    contractorNote?: string,
  ): Promise<ApiResponse<JobApplication>> =>
    api.patch(`/jobs/${jobId}/applications/${applicationId}`, { status, contractorNote }),

  // Worker side
  apply: (jobId: string, coverNote?: string): Promise<ApiResponse<JobApplication>> =>
    api.post(`/jobs/${jobId}/apply`, { coverNote }),

  listMyApplications: (
    page: number = 1,
    limit: number = 20,
    status?: string,
  ): Promise<PaginatedApiResponse<JobApplication>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);
    return api.get(`/jobs/applications/my?${params.toString()}`);
  },

  withdrawApplication: (applicationId: string): Promise<ApiResponse<JobApplication>> =>
    api.patch(`/jobs/applications/${applicationId}/withdraw`),
};
