import { api } from './api';
import type { CreateSitePayload, PaginatedResponse, Site, UpdateSitePayload } from '../types/jobs';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface PaginatedApiResponse<T> extends PaginatedResponse<T> {
  success: boolean;
  message: string;
}

export const sitesApi = {
  list: (page: number = 1, limit: number = 20, isActive?: boolean): Promise<PaginatedApiResponse<Site>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (isActive != null) params.append('isActive', String(isActive));
    return api.get(`/sites?${params.toString()}`);
  },

  getById: (siteId: string): Promise<ApiResponse<Site>> =>
    api.get(`/sites/${siteId}`),

  create: (payload: CreateSitePayload): Promise<ApiResponse<Site>> =>
    api.post('/sites', payload),

  update: (siteId: string, payload: UpdateSitePayload): Promise<ApiResponse<Site>> =>
    api.patch(`/sites/${siteId}`, payload),

  delete: (siteId: string): Promise<ApiResponse<{ message: string }>> =>
    api.delete(`/sites/${siteId}`),

  generateQrCode: (siteId: string, expiryHours: number = 8): Promise<ApiResponse<{
    id: string;
    code: string;
    siteId: string;
    expiresAt: string;
    expiryHours: number;
  }>> =>
    api.post(`/sites/${siteId}/qr-code?expiryHours=${expiryHours}`),
};
