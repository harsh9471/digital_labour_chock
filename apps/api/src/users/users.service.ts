import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UserRole, UserStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

interface PaginationOptions {
  page: number;
  limit: number;
}

interface UserFilterOptions {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  city?: string;
  state?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationOptions, filters: UserFilterOptions) {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { deletedAt: null };

    if (filters.role) where['role'] = filters.role;
    if (filters.status) where['status'] = filters.status;
    if (filters.search) {
      where['OR'] = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          avatar: true,
          emailVerified: true,
          phoneVerified: true,
          lastLoginAt: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async findById(id: string, requestingUserId: string, requestingRole: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: {
        worker: {
          include: {
            location: true,
            skills: { include: { skill: true } },
          },
        },
        contractor: {
          include: {
            location: true,
            company: true,
          },
        },
        companyAdmin: { include: { company: true } },
        admin: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    // Access control
    const isAdmin = requestingRole === UserRole.SUPER_ADMIN;
    const isSelf = requestingUserId === id;

    if (!isAdmin && !isSelf) {
      // Only return public profile info
      const { passwordHash: _pw, ...publicUser } = user;
      return publicUser;
    }

    const { passwordHash: _pw, ...safeUser } = user;
    return safeUser;
  }

  async updateStatus(id: string, status: UserStatus, adminId: string) {
    const user = await this.prisma.user.findUnique({ where: { id, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found');

    if (user.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot modify super admin status');
    }

    return this.prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, status: true, updatedAt: true },
    });
  }

  async softDelete(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found');

    if (user.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot delete super admin');
    }

    await this.prisma.userSession.updateMany({
      where: { userId: id },
      data: { isActive: false },
    });

    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), status: UserStatus.INACTIVE },
      select: { id: true, deletedAt: true },
    });
  }

  async getWorkers(pagination: PaginationOptions, filters: { city?: string; skillSlug?: string; available?: boolean }) {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { deletedAt: null };

    if (typeof filters.available === 'boolean') {
      where['availableForWork'] = filters.available;
    }

    if (filters.city) {
      where['location'] = { city: { contains: filters.city, mode: 'insensitive' } };
    }

    if (filters.skillSlug) {
      where['skills'] = { some: { skill: { slug: filters.skillSlug } } };
    }

    const [workers, total] = await Promise.all([
      this.prisma.worker.findMany({
        where,
        skip,
        take: limit,
        orderBy: { rating: 'desc' },
        include: {
          user: {
            select: {
              id: true, firstName: true, lastName: true,
              phone: true, avatar: true, status: true,
            },
          },
          location: true,
          skills: { include: { skill: true } },
        },
      }),
      this.prisma.worker.count({ where }),
    ]);

    return {
      data: workers,
      meta: {
        total, page, limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async getContractors(pagination: PaginationOptions, filters: { city?: string; companyId?: string }) {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { deletedAt: null };
    if (filters.city) where['location'] = { city: { contains: filters.city, mode: 'insensitive' } };
    if (filters.companyId) where['companyId'] = filters.companyId;

    const [contractors, total] = await Promise.all([
      this.prisma.contractor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { rating: 'desc' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true, avatar: true, status: true },
          },
          location: true,
          company: true,
        },
      }),
      this.prisma.contractor.count({ where }),
    ]);

    return {
      data: contractors,
      meta: {
        total, page, limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async getAdminStats() {
    const [totalWorkers, totalContractors, totalCompanies, totalJobs, pendingKyc, pendingVerifications] = await Promise.all([
      this.prisma.worker.count({ where: { deletedAt: null } }),
      this.prisma.contractor.count({ where: { deletedAt: null } }),
      this.prisma.company.count(),
      this.prisma.job.count(),
      this.prisma.worker.count({ where: { kycStatus: 'PENDING', deletedAt: null } }),
      this.prisma.user.count({ where: { status: 'PENDING_VERIFICATION', deletedAt: null } }),
    ]);
    return { totalWorkers, totalContractors, totalCompanies, totalJobs, pendingKyc, pendingVerifications };
  }
}
