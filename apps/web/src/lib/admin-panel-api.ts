import api from './api';

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isSystem: boolean;
  permissions: { permission: Permission }[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userRole?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

const BASE = '/admin';

export const adminPanelApi = {
  // Stats
  getStats: () => api.get(`${BASE}/stats`),

  // Users
  getUsers: (params?: { page?: number; limit?: number; role?: string; status?: string; search?: string }) =>
    api.get(`${BASE}/users`, { params }),

  getUser: (id: string) =>
    api.get(`${BASE}/users/${id}`),

  updateUserStatus: (id: string, status: string, reason?: string) =>
    api.patch(`${BASE}/users/${id}/status`, { status, reason }),

  deleteUser: (id: string) =>
    api.delete(`${BASE}/users/${id}`),

  // Documents
  getPendingDocuments: (page = 1, limit = 20) =>
    api.get(`${BASE}/documents/pending`, { params: { page, limit } }),

  verifyDocument: (id: string, status: 'VERIFIED' | 'REJECTED', rejectionReason?: string) =>
    api.patch(`${BASE}/documents/${id}/verify`, { status, rejectionReason }),

  // Contractor / Company verification
  verifyContractor: (id: string, isVerified: boolean) =>
    api.patch(`${BASE}/contractors/${id}/verify`, { isVerified }),

  verifyCompany: (id: string, isVerified: boolean) =>
    api.patch(`${BASE}/companies/${id}/verify`, { isVerified }),

  updateWorkerKyc: (id: string, status: string) =>
    api.patch(`${BASE}/workers/${id}/kyc`, { status }),

  // Roles
  getRoles: () => api.get<Role[]>(`${BASE}/roles`),
  createRole: (data: { name: string; displayName: string; description?: string; permissionIds?: string[] }) =>
    api.post<Role>(`${BASE}/roles`, data),
  updateRole: (id: string, data: { displayName?: string; description?: string; permissionIds?: string[] }) =>
    api.patch<Role>(`${BASE}/roles/${id}`, data),
  deleteRole: (id: string) => api.delete(`${BASE}/roles/${id}`),
  assignPermissions: (roleId: string, permissionIds: string[]) =>
    api.patch(`${BASE}/roles/${roleId}/permissions`, { permissionIds }),

  // Permissions
  getPermissions: (resource?: string) =>
    api.get<Permission[]>(`${BASE}/permissions`, { params: { resource } }),
  createPermission: (data: { name: string; resource: string; action: string; description?: string }) =>
    api.post<Permission>(`${BASE}/permissions`, data),

  // Audit Logs
  getAuditLogs: (params?: { page?: number; limit?: number; userId?: string; resourceType?: string }) =>
    api.get<{ logs: AuditLog[] }>(`${BASE}/audit-logs`, { params }),
};
