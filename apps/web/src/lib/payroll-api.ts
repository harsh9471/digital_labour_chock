import { api } from './api';

interface ApiResponse<T> { success: boolean; data: T; message: string; }
interface Meta { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean; }
interface PaginatedApiResponse<T> { success: boolean; data: T[]; meta: Meta; message: string; }

export interface PayrollRecord {
  id: string;
  batchId: string;
  workerId: string;
  workerName?: string;
  daysWorked: number;
  dailyWage: number;
  grossAmount: number;
  pfDeduction: number;
  esiDeduction: number;
  otherDeductions: number;
  netAmount: number;
  worker?: { id: string; user: { firstName: string; lastName: string; }; };
}

export interface PayrollBatch {
  id: string;
  contractorId: string;
  title: string;
  month: number;
  year: number;
  status: 'DRAFT' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalAmount: number;
  processedAt?: string;
  createdAt: string;
  records?: PayrollRecord[];
  _count?: { records: number; };
}

export interface PayrollSummary {
  totalBatches: number;
  completedBatches: number;
  totalPaid: number;
  currentMonthTotal: number;
  avgMonthlyPayroll: number;
}

export const payrollApi = {
  listBatches: (params?: { page?: number; limit?: number; status?: string; month?: number; year?: number }): Promise<PaginatedApiResponse<PayrollBatch>> => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.status) q.set('status', params.status);
    if (params?.month) q.set('month', String(params.month));
    if (params?.year) q.set('year', String(params.year));
    return api.get(`/payroll/batches?${q.toString()}`);
  },

  getBatch: (batchId: string): Promise<ApiResponse<PayrollBatch>> =>
    api.get(`/payroll/batches/${batchId}`),

  getSummary: (): Promise<ApiResponse<PayrollSummary>> =>
    api.get('/payroll/summary'),

  createBatch: (payload: { title: string; month: number; year: number }): Promise<ApiResponse<PayrollBatch>> =>
    api.post('/payroll/batches', payload),

  generateFromAttendance: (payload: { title: string; month: number; year: number }): Promise<ApiResponse<PayrollBatch>> =>
    api.post('/payroll/batches/generate', payload),

  addRecord: (batchId: string, payload: { workerId: string; daysWorked: number; dailyWage: number; otherDeductions?: number }): Promise<ApiResponse<PayrollRecord>> =>
    api.post(`/payroll/batches/${batchId}/records`, payload),

  processBatch: (batchId: string): Promise<ApiResponse<PayrollBatch>> =>
    api.patch(`/payroll/batches/${batchId}/process`, {}),
};
