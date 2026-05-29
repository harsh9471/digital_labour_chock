import { api } from './api';

interface ApiResponse<T> { success: boolean; data: T; message: string; }
interface Meta { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean; }
interface PaginatedApiResponse<T> { success: boolean; data: T[]; meta: Meta; message: string; }

export interface AttendanceRecord {
  id: string;
  workerId: string;
  siteId: string;
  contractorId: string;
  checkInTime?: string;
  checkOutTime?: string;
  totalHours?: number;
  notes?: string;
  worker?: { id: string; user: { firstName: string; lastName: string; avatar?: string } };
  site?: { id: string; name: string; city: string };
  job?: { id: string; title: string };
}

export const attendanceApi = {
  // ── Worker self check-in/out ─────────────────────────────────────
  // Calls the WORKER-role endpoints that auto-resolve job/site from hire record.
  workerCheckIn: (payload?: { checkInLat?: number; checkInLon?: number; notes?: string }): Promise<ApiResponse<AttendanceRecord>> =>
    api.post('/attendance/worker/check-in', payload ?? {}),

  workerCheckOut: (payload?: { checkOutLat?: number; checkOutLon?: number; notes?: string }): Promise<ApiResponse<AttendanceRecord>> =>
    api.patch('/attendance/worker/check-out', payload ?? {}),

  workerList: (params?: { page?: number; limit?: number; siteId?: string; dateFrom?: string; dateTo?: string }): Promise<PaginatedApiResponse<AttendanceRecord>> => {
    const q = new URLSearchParams();
    if (params?.page)     q.set('page',     String(params.page));
    if (params?.limit)    q.set('limit',    String(params.limit));
    if (params?.siteId)   q.set('siteId',   params.siteId);
    if (params?.dateFrom) q.set('dateFrom', params.dateFrom);
    if (params?.dateTo)   q.set('dateTo',   params.dateTo);
    return api.get(`/attendance/worker?${q.toString()}`);
  },

  // ── Contractor endpoints (mark on behalf of workers) ─────────────
  list: (params?: { page?: number; limit?: number; workerId?: string; siteId?: string; dateFrom?: string; dateTo?: string; search?: string; status?: string }): Promise<PaginatedApiResponse<AttendanceRecord>> => {
    const q = new URLSearchParams();
    if (params?.page)     q.set('page',     String(params.page));
    if (params?.limit)    q.set('limit',    String(params.limit));
    if (params?.workerId) q.set('workerId', params.workerId);
    if (params?.siteId)   q.set('siteId',   params.siteId);
    if (params?.dateFrom) q.set('dateFrom', params.dateFrom);
    if (params?.dateTo)   q.set('dateTo',   params.dateTo);
    if (params?.search)   q.set('search',   params.search);
    if (params?.status)   q.set('status',   params.status);
    return api.get(`/attendance?${q.toString()}`);
  },

  checkIn: (payload: { workerId: string; jobId: string; siteId: string; notes?: string }): Promise<ApiResponse<AttendanceRecord>> =>
    api.post('/attendance/check-in', payload),

  checkOut: (recordId: string, payload?: { notes?: string }): Promise<ApiResponse<AttendanceRecord>> =>
    api.patch(`/attendance/${recordId}/check-out`, payload ?? {}),

  getToday: (): Promise<ApiResponse<unknown>> =>
    api.get('/attendance/today'),

  getWeeklyStats: (): Promise<ApiResponse<unknown>> =>
    api.get('/attendance/weekly-stats'),
};
