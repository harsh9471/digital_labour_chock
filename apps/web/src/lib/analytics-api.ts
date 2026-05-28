import { api } from './api';

interface ApiResponse<T> { success: boolean; data: T; message: string; }

export interface ContractorOverview {
  totalWorkers: number;
  activeJobs: number;
  totalJobs: number;
  totalApplications: number;
  hiredWorkers: number;
  avgRating: number;
  totalSites: number;
  activeSites: number;
}

export interface AttendanceTrend {
  byDay: { date: string; presentCount: number; absentCount: number; rate: number; }[];
  avgRate: number;
  totalPresent: number;
  totalAbsent: number;
}

export interface TopWorker {
  workerId: string;
  name: string;
  avatar?: string;
  daysPresent: number;
  rating: number;
  skills: string[];
  city?: string;
}

export interface HiringPipeline {
  applied: number;
  shortlisted: number;
  interviewed: number;
  hired: number;
  rejected: number;
  conversionRate: number;
}

export interface SkillDistribution {
  skill: string;
  count: number;
  percentage: number;
}

export interface CompanyOverview {
  totalContractors: number;
  totalProjects: number;
  activeProjects: number;
  totalWorkforce: number;
  monthPayroll: number;
  pendingCompliance: number;
}

export const analyticsApi = {
  getContractorOverview: (): Promise<ApiResponse<ContractorOverview>> =>
    api.get('/analytics/contractor/overview'),

  getAttendanceTrend: (days?: number): Promise<ApiResponse<AttendanceTrend>> =>
    api.get(`/analytics/contractor/attendance-trend${days ? `?days=${days}` : ''}`),

  getTopWorkers: (limit?: number): Promise<ApiResponse<TopWorker[]>> =>
    api.get(`/analytics/contractor/top-workers${limit ? `?limit=${limit}` : ''}`),

  getHiringPipeline: (): Promise<ApiResponse<HiringPipeline>> =>
    api.get('/analytics/contractor/hiring-pipeline'),

  getSkillDistribution: (): Promise<ApiResponse<SkillDistribution[]>> =>
    api.get('/analytics/contractor/skill-distribution'),

  getCompanyOverview: (): Promise<ApiResponse<CompanyOverview>> =>
    api.get('/analytics/company/overview'),

  getContractorPerformance: (): Promise<ApiResponse<{ contractors: { id: string; name: string; activeWorkers: number; totalJobs: number; rating: number; }[] }>> =>
    api.get('/analytics/company/contractor-performance'),
};
