// ============================================================
// Job & Marketplace Types
// ============================================================

export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'FILLED' | 'COMPLETED' | 'CLOSED' | 'CANCELLED';
export type JobType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CONTRACT' | 'FIXED_TERM';
export type ApplicationStatus = 'SUBMITTED' | 'VIEWED' | 'SHORTLISTED' | 'HIRED' | 'REJECTED' | 'WITHDRAWN';
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;
  icon?: string;
  description?: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  bio?: string;
  gender?: string;
  languages: string[];
  availableForWork: boolean;
  hourlyRate?: number;
  dailyRate?: number;
  weeklyRate?: number;
  experienceYears: number;
  city?: string;
  state?: string;
  pincode?: string;
  rating?: number;
  totalRatings: number;
  totalJobsDone: number;
  isProfileComplete: boolean;
  kycStatus: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    status: string;
  };
  skills: Array<{
    id: string;
    level: SkillLevel;
    yearsOfExperience: number;
    isVerified: boolean;
    skill: Skill;
  }>;
  location?: {
    id: string;
    city: string;
    state: string;
    pincode?: string;
  };
}

export interface Site {
  id: string;
  contractorId: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  radiusMeters: number;
  isActive: boolean;
  totalWorkers: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    jobs: number;
    attendanceRecords: number;
  };
}

export interface Job {
  id: string;
  contractorId: string;
  siteId?: string;
  title: string;
  description?: string;
  requiredSkillId?: string;
  skillCategory?: string;
  workerCount: number;
  filledCount: number;
  dailyWage?: number;
  weeklyWage?: number;
  jobType: JobType;
  status: JobStatus;
  startDate?: string;
  endDate?: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  isUrgent: boolean;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  contractor: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  };
  site?: {
    id: string;
    name: string;
    city: string;
    latitude?: number;
    longitude?: number;
  };
  requiredSkill?: Skill;
  _count?: {
    applications: number;
  };
  myApplication?: {
    id: string;
    status: ApplicationStatus;
    appliedAt: string;
  } | null;
}

export interface JobApplication {
  id: string;
  jobId: string;
  workerId: string;
  status: ApplicationStatus;
  coverNote?: string;
  contractorNote?: string;
  appliedAt: string;
  viewedAt?: string;
  shortlistedAt?: string;
  hiredAt?: string;
  rejectedAt?: string;
  withdrawnAt?: string;
  worker?: WorkerProfile;
  job?: Job;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── Request DTOs ──────────────────────────────────────────────────────────

export interface CreateJobPayload {
  title: string;
  description?: string;
  requiredSkillId?: string;
  skillCategory?: string;
  workerCount?: number;
  dailyWage?: number;
  weeklyWage?: number;
  jobType?: JobType;
  siteId?: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  startDate?: string;
  endDate?: string;
  isUrgent?: boolean;
}

export interface UpdateJobPayload extends Partial<CreateJobPayload> {}

export interface CreateSitePayload {
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  radiusMeters?: number;
}

export interface UpdateSitePayload extends Partial<CreateSitePayload> {
  isActive?: boolean;
}

export interface JobFilters {
  status?: JobStatus;
  jobType?: JobType;
  city?: string;
  state?: string;
  skillSlug?: string;
  skillCategory?: string;
  search?: string;
  minWage?: number;
  maxWage?: number;
  isUrgent?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface WorkerFilters {
  city?: string;
  state?: string;
  skillSlug?: string;
  skillCategory?: string;
  available?: boolean;
  minRating?: number;
  minExperience?: number;
  maxDailyRate?: number;
  search?: string;
  page?: number;
  limit?: number;
}
