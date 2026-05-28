export type UserRole = 'WORKER' | 'CONTRACTOR' | 'COMPANY_ADMIN' | 'SUPER_ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'BANNED';
export type OtpPurpose = 'LOGIN' | 'REGISTER' | 'PASSWORD_RESET' | 'EMAIL_VERIFY' | 'PHONE_VERIFY';
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface User {
  id: string;
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
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
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

export interface Location {
  id: string;
  city: string;
  state: string;
  country: string;
  pincode?: string;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;
}

export interface WorkerSkill {
  id: string;
  skillId: string;
  skill: Skill;
  level: SkillLevel;
  yearsOfExperience: number;
}

export interface Worker {
  id: string;
  userId: string;
  user: Partial<User>;
  bio?: string;
  availableForWork: boolean;
  hourlyRate?: number;
  dailyRate?: number;
  experienceYears: number;
  location?: Location;
  skills: WorkerSkill[];
  rating?: number;
  totalJobsDone: number;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  isVerified: boolean;
  location?: Location;
}

export interface Contractor {
  id: string;
  userId: string;
  user: Partial<User>;
  company?: Company;
  specializations: string[];
  rating?: number;
  totalProjectsDone: number;
  location?: Location;
  isVerified: boolean;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  password?: string;
  role: UserRole;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface OtpFormData {
  phone: string;
  code: string;
  purpose: OtpPurpose;
}
