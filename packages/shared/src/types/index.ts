export type UserRole = 'WORKER' | 'CONTRACTOR' | 'COMPANY_ADMIN' | 'SUPER_ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'BANNED';
export type OtpPurpose = 'LOGIN' | 'REGISTER' | 'PASSWORD_RESET' | 'EMAIL_VERIFY' | 'PHONE_VERIFY';
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type DocumentType = 'AADHAR' | 'PAN' | 'DRIVING_LICENSE' | 'PASSPORT' | 'VOTER_ID' | 'WORK_PERMIT' | 'SKILL_CERTIFICATE' | 'EDUCATION_CERTIFICATE' | 'OTHER';
export type DocumentStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt?: string;
  deletedAt?: string;
}

export interface Worker extends BaseEntity {
  userId: string;
  user?: Partial<User>;
  bio?: string;
  availableForWork: boolean;
  hourlyRate?: number;
  dailyRate?: number;
  experienceYears: number;
  rating?: number;
  totalJobsDone: number;
  location?: Location;
  skills?: WorkerSkill[];
}

export interface Contractor extends BaseEntity {
  userId: string;
  user?: Partial<User>;
  companyId?: string;
  company?: Company;
  specializations: string[];
  rating?: number;
  totalProjectsDone: number;
  isVerified: boolean;
  location?: Location;
}

export interface Company extends BaseEntity {
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  isVerified: boolean;
  location?: Location;
}

export interface Location extends BaseEntity {
  city: string;
  state: string;
  country: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

export interface Skill extends BaseEntity {
  name: string;
  slug: string;
  category: string;
}

export interface WorkerSkill {
  id: string;
  workerId: string;
  skillId: string;
  skill: Skill;
  level: SkillLevel;
  yearsOfExperience: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
  timestamp: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
}
