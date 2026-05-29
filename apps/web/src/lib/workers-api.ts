import { api } from './api';
import type { PaginatedResponse, Skill, WorkerFilters, WorkerProfile } from '../types/jobs';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface PaginatedApiResponse<T> extends PaginatedResponse<T> {
  success: boolean;
  message: string;
}

export const workersApi = {
  list: (filters: WorkerFilters = {}): Promise<PaginatedApiResponse<WorkerProfile>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v != null && v !== '') params.append(k, String(v));
    });
    return api.get(`/workers?${params.toString()}`);
  },

  getById: (workerId: string): Promise<ApiResponse<WorkerProfile>> =>
    api.get(`/workers/${workerId}`),

  getSkills: (category?: string): Promise<ApiResponse<Skill[]>> => {
    const params = category ? `?category=${category}` : '';
    return api.get(`/workers/skills${params}`);
  },

  getMyProfile: (): Promise<ApiResponse<WorkerProfile>> =>
    api.get('/workers/me/profile'),

  updateMyProfile: (data: Partial<WorkerProfile>): Promise<ApiResponse<WorkerProfile>> =>
    api.patch('/workers/me/profile', data),

  toggleAvailability: (): Promise<ApiResponse<{ availableForWork: boolean }>> =>
    api.patch('/workers/me/availability'),

  addSkill: (skillId: string, level: string, yearsOfExperience?: number): Promise<ApiResponse<unknown>> =>
    api.post('/workers/me/skills', { skillId, level, yearsOfExperience }),

  updateSkill: (skillId: string, level: string, yearsOfExperience?: number): Promise<ApiResponse<unknown>> =>
    api.patch(`/workers/me/skills/${skillId}`, { level, yearsOfExperience }),

  removeSkill: (skillId: string): Promise<ApiResponse<unknown>> =>
    api.delete(`/workers/me/skills/${skillId}`),

  addExperience: (data: {
    title: string; company: string; city?: string; description?: string;
    startDate: string; endDate?: string; isCurrent?: boolean;
  }): Promise<ApiResponse<unknown>> =>
    api.post('/workers/me/experience', data),

  updateExperience: (expId: string, data: Partial<{
    title: string; company: string; city?: string; description?: string;
    startDate: string; endDate?: string; isCurrent?: boolean;
  }>): Promise<ApiResponse<unknown>> =>
    api.patch(`/workers/me/experience/${expId}`, data),

  deleteExperience: (expId: string): Promise<ApiResponse<unknown>> =>
    api.delete(`/workers/me/experience/${expId}`),

  getStats: (): Promise<ApiResponse<{
    totalApplications: number; activeApplications: number; hiredCount: number;
    savedCount: number; totalEarnings: number; rating: number | null;
    totalRatings: number; totalJobsDone: number; profileViews: number; isProfileComplete: boolean;
  }>> =>
    api.get('/workers/me/stats'),

  saveJob: (jobId: string): Promise<ApiResponse<unknown>> =>
    api.post(`/workers/me/saved-jobs/${jobId}`),

  unsaveJob: (jobId: string): Promise<ApiResponse<unknown>> =>
    api.delete(`/workers/me/saved-jobs/${jobId}`),

  getSavedJobs: (page?: number, limit?: number): Promise<PaginatedApiResponse<unknown>> => {
    const params = new URLSearchParams();
    if (page) params.append('page', String(page));
    if (limit) params.append('limit', String(limit));
    return api.get(`/workers/me/saved-jobs?${params.toString()}`);
  },

  getRatings: (workerId: string): Promise<PaginatedApiResponse<unknown>> =>
    api.get(`/workers/${workerId}/ratings`),

  updateAvatar: (avatarUrl: string): Promise<{ success: boolean; data: { id: string; avatar: string | null } }> =>
    api.patch('/users/me/avatar', { avatar: avatarUrl }),
};
