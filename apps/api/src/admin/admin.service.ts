import {
  Injectable, Logger, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdateUserStatusDto, VerifyDocumentDto, VerifyEntityDto,
  CreateRoleDto, UpdateRoleDto, CreatePermissionDto, AssignPermissionsDto,
} from './dto/admin.dto';
import { UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ── PLATFORM STATS ────────────────────────────────────────────────

  async getPlatformStats() {
    const [
      totalUsers, activeUsers, pendingUsers,
      totalWorkers, verifiedWorkers,
      totalContractors, verifiedContractors,
      totalCompanies, verifiedCompanies,
      totalJobs, activeJobs,
      totalApplications, hiredCount,
      openComplaints,
      pendingDocs,
      totalPayroll,
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      this.prisma.user.count({ where: { status: 'PENDING_VERIFICATION', deletedAt: null } }),
      this.prisma.worker.count({ where: { deletedAt: null } }),
      this.prisma.worker.count({ where: { kycStatus: 'VERIFIED', deletedAt: null } }),
      this.prisma.contractor.count({ where: { deletedAt: null } }),
      this.prisma.contractor.count({ where: { isVerified: true, deletedAt: null } }),
      this.prisma.company.count({ where: { deletedAt: null } }),
      this.prisma.company.count({ where: { isVerified: true, deletedAt: null } }),
      this.prisma.job.count({ where: { deletedAt: null } }),
      this.prisma.job.count({ where: { status: { in: ['PUBLISHED', 'ACTIVE'] }, deletedAt: null } }),
      this.prisma.jobApplication.count(),
      this.prisma.jobApplication.count({ where: { status: 'HIRED' } }),
      this.prisma.complaint.count({ where: { status: { in: ['OPEN', 'UNDER_REVIEW'] } } }),
      this.prisma.document.count({ where: { status: 'PENDING', deletedAt: null } }),
      this.prisma.payrollBatch.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalAmount: true },
      }),
    ]);

    const usersByRole = await this.prisma.user.groupBy({
      by: ['role'],
      where: { deletedAt: null },
      _count: { id: true },
    });

    const recentUsers = await this.prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true, firstName: true, lastName: true, email: true,
        phone: true, role: true, status: true, createdAt: true,
      },
    });

    return {
      users: {
        total: totalUsers, active: activeUsers, pending: pendingUsers,
        byRole: usersByRole.map((r) => ({ role: r.role, count: r._count.id })),
        recent: recentUsers,
      },
      workers: { total: totalWorkers, verified: verifiedWorkers },
      contractors: { total: totalContractors, verified: verifiedContractors },
      companies: { total: totalCompanies, verified: verifiedCompanies },
      jobs: { total: totalJobs, active: activeJobs },
      applications: { total: totalApplications, hired: hiredCount },
      complaints: { open: openComplaints },
      documents: { pending: pendingDocs },
      payroll: { totalProcessed: Number(totalPayroll._sum.totalAmount ?? 0) },
    };
  }

  // ── USER MANAGEMENT ───────────────────────────────────────────────

  async getUsers(
    page = 1, limit = 20,
    role?: UserRole, status?: UserStatus, search?: string,
  ) {
    const skip = (page - 1) * limit;
    const where = {
      deletedAt: null,
      ...(role ? { role } : {}),
      ...(status ? { status } : {}),
      ...(search
        ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
          ],
        }
        : {}),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, firstName: true, lastName: true, email: true,
          phone: true, role: true, status: true, avatar: true,
          emailVerified: true, phoneVerified: true,
          lastLoginAt: true, loginCount: true, createdAt: true,
          worker: { select: { id: true, kycStatus: true, rating: true } },
          contractor: { select: { id: true, isVerified: true, rating: true } },
          companyAdmin: { select: { id: true, companyId: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        worker: { include: { skills: { include: { skill: true } } } },
        contractor: true,
        companyAdmin: { include: { company: true } },
        documents: { where: { deletedAt: null } },
        sessions: { where: { isActive: true }, orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUserStatus(id: string, dto: UpdateUserStatusDto, adminId: string) {
    const user = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found');

    if (user.role === 'SUPER_ADMIN') {
      throw new BadRequestException('Cannot modify super admin status');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { status: dto.status },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminId, userRole: 'SUPER_ADMIN',
        action: 'UPDATE_USER_STATUS',
        resourceType: 'User', resourceId: id,
        before: { status: user.status },
        after: { status: dto.status, reason: dto.reason },
      },
    });

    this.logger.log(`Admin ${adminId} updated user ${id} status to ${dto.status}`);
    return updated;
  }

  async deleteUser(id: string, adminId: string) {
    const user = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === 'SUPER_ADMIN') throw new BadRequestException('Cannot delete super admin');

    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminId, userRole: 'SUPER_ADMIN',
        action: 'DELETE_USER',
        resourceType: 'User', resourceId: id,
        before: { status: user.status, email: user.email },
      },
    });

    return { deleted: true };
  }

  // ── DOCUMENT VERIFICATION ─────────────────────────────────────────

  async getPendingDocuments(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      this.prisma.document.findMany({
        where: { status: 'PENDING', deletedAt: null },
        skip, take: limit,
        orderBy: { createdAt: 'asc' },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, role: true } },
        },
      }),
      this.prisma.document.count({ where: { status: 'PENDING', deletedAt: null } }),
    ]);
    return { documents: docs, pagination: { total, page, limit } };
  }

  async verifyDocument(id: string, dto: VerifyDocumentDto, adminId: string) {
    const doc = await this.prisma.document.findFirst({ where: { id, deletedAt: null } });
    if (!doc) throw new NotFoundException('Document not found');

    const updated = await this.prisma.document.update({
      where: { id },
      data: {
        status: dto.status,
        verifiedAt: dto.status === 'VERIFIED' ? new Date() : null,
        verifiedBy: adminId,
        rejectionReason: dto.rejectionReason,
        notes: dto.notes,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminId, userRole: 'SUPER_ADMIN',
        action: `DOCUMENT_${dto.status}`,
        resourceType: 'Document', resourceId: id,
        after: { status: dto.status, reason: dto.rejectionReason },
      },
    });

    return updated;
  }

  // ── CONTRACTOR / COMPANY VERIFICATION ─────────────────────────────

  async verifyContractor(id: string, dto: VerifyEntityDto, adminId: string) {
    const contractor = await this.prisma.contractor.findFirst({
      where: { id, deletedAt: null },
    });
    if (!contractor) throw new NotFoundException('Contractor not found');

    const updated = await this.prisma.contractor.update({
      where: { id },
      data: {
        isVerified: dto.isVerified,
        verifiedAt: dto.isVerified ? new Date() : null,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminId, userRole: 'SUPER_ADMIN',
        action: dto.isVerified ? 'CONTRACTOR_VERIFIED' : 'CONTRACTOR_UNVERIFIED',
        resourceType: 'Contractor', resourceId: id,
      },
    });

    return updated;
  }

  async verifyCompany(id: string, dto: VerifyEntityDto, adminId: string) {
    const company = await this.prisma.company.findFirst({
      where: { id, deletedAt: null },
    });
    if (!company) throw new NotFoundException('Company not found');

    const updated = await this.prisma.company.update({
      where: { id },
      data: {
        isVerified: dto.isVerified,
        verifiedAt: dto.isVerified ? new Date() : null,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminId, userRole: 'SUPER_ADMIN',
        action: dto.isVerified ? 'COMPANY_VERIFIED' : 'COMPANY_UNVERIFIED',
        resourceType: 'Company', resourceId: id,
      },
    });

    return updated;
  }

  // ── WORKER KYC ────────────────────────────────────────────────────

  async updateWorkerKyc(workerId: string, status: string, adminId: string) {
    const worker = await this.prisma.worker.findFirst({
      where: { id: workerId, deletedAt: null },
    });
    if (!worker) throw new NotFoundException('Worker not found');

    const updated = await this.prisma.worker.update({
      where: { id: workerId },
      data: { kycStatus: status },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminId, userRole: 'SUPER_ADMIN',
        action: 'WORKER_KYC_UPDATE',
        resourceType: 'Worker', resourceId: workerId,
        before: { kycStatus: worker.kycStatus },
        after: { kycStatus: status },
      },
    });

    return updated;
  }

  // ── ROLES & PERMISSIONS ───────────────────────────────────────────

  async getRoles() {
    return this.prisma.role.findMany({
      include: { permissions: { include: { permission: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createRole(dto: CreateRoleDto) {
    const role = await this.prisma.role.create({
      data: {
        name: dto.name,
        displayName: dto.displayName,
        description: dto.description,
        permissions: dto.permissionIds?.length
          ? {
            create: dto.permissionIds.map((permissionId) => ({ permissionId })),
          }
          : undefined,
      },
      include: { permissions: { include: { permission: true } } },
    });
    return role;
  }

  async updateRole(id: string, dto: UpdateRoleDto) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    if (role.isSystem) throw new BadRequestException('Cannot modify system roles');

    if (dto.permissionIds !== undefined) {
      await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
      if (dto.permissionIds.length) {
        await this.prisma.rolePermission.createMany({
          data: dto.permissionIds.map((permissionId) => ({ roleId: id, permissionId })),
        });
      }
    }

    return this.prisma.role.update({
      where: { id },
      data: {
        displayName: dto.displayName,
        description: dto.description,
      },
      include: { permissions: { include: { permission: true } } },
    });
  }

  async deleteRole(id: string) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    if (role.isSystem) throw new BadRequestException('Cannot delete system roles');
    await this.prisma.role.delete({ where: { id } });
    return { deleted: true };
  }

  async getPermissions(resource?: string) {
    return this.prisma.permission.findMany({
      where: resource ? { resource } : undefined,
      orderBy: [{ resource: 'asc' }, { action: 'asc' }],
    });
  }

  async createPermission(dto: CreatePermissionDto) {
    return this.prisma.permission.create({ data: dto });
  }

  async assignPermissionsToRole(roleId: string, dto: AssignPermissionsDto) {
    await this.prisma.rolePermission.deleteMany({ where: { roleId } });
    await this.prisma.rolePermission.createMany({
      data: dto.permissionIds.map((permissionId) => ({ roleId, permissionId })),
      skipDuplicates: true,
    });
    return this.prisma.role.findUnique({
      where: { id: roleId },
      include: { permissions: { include: { permission: true } } },
    });
  }

  // ── AUDIT LOGS ────────────────────────────────────────────────────

  async getAuditLogs(page = 1, limit = 20, userId?: string, resourceType?: string) {
    const skip = (page - 1) * limit;
    const where = {
      ...(userId ? { userId } : {}),
      ...(resourceType ? { resourceType } : {}),
    };

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { logs, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
  }
}
