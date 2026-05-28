import { api } from './api';

interface ApiResponse<T> { success: boolean; data: T; message: string; }
interface Meta { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean; }
interface PaginatedApiResponse<T> { success: boolean; data: T[]; meta: Meta; message: string; }

export interface AttendanceRecord {
  id: string;
  workerId: string;
  siteId: string;
  contractorId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  totalHours?: number;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'HOLIDAY' | 'LEAVE';
  notes?: string;
  worker?: { id: string; user: { firstName: string; lastName: string; avatar?: string; }; };
  site?: { id: string; name: string; city: string; };
}

export interface TodaySummary {
  date: string;
  totalPresent: number;
  totalAbsent: number;
  totalHalfDay: number;
  attendanceRate: number;
  records: AttendanceRecord[];
}

export interface WeeklyStats {
  week: string;
  avgAttendanceRate: number;
  totalWorkHours: number;
  presentCount: number;
  absentCount: number;
  byDay: { date: string; presentCount: number; absentCount: number; rate: number; }[];
}

export const attendanceApi = {
  list: (params?: { page?: number; limit?: number; workerId?: string; siteId?: string; startDate?: string; endDate?: string; status?: string }): Promise<PaginatedApiResponse<AttendanceRecord>> => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.workerId) q.set('workerId', params.workerId);
    if (params?.siteId) q.set('siteId', params.siteId);
    if (params?.startDate) q.set('startDate', params.startDate);
    if (params?.endDate) q.set('endDate', params.endDate);
    if (params?.status) q.set('status', params.status);
    return api.get(`/attendance?${q.toString()}`);
  },

  getToday: (): Promise<ApiResponse<TodaySummary>> =>
    api.get('/attendance/today'),

  getWeeklyStats: (): Promise<ApiResponse<WeeklyStats>> =>
    api.get('/attendance/weekly-stats'),

  getById: (id: string): Promise<ApiResponse<AttendanceRecord>> =>
    api.get(`/attendance/${id}`),

  checkIn: (payload: { workerId: string; siteId: string; date?: string; notes?: string }): Promise<ApiResponse<AttendanceRecord>> =>
    api.post('/attendance/check-in', payload),

  checkOut: (id: string, payload?: { notes?: string }): Promise<ApiResponse<AttendanceRecord>> =>
    api.patch(`/attendance/${id}/check-out`, payload ?? {}),
};
