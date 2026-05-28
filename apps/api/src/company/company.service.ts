import {
  Injectable, Logger, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyFilterDto, UpdateCompanyDto } from './dto/company.dto';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async getCompanyAdminOrFail(userId: string) {
    const admin = await this.prisma.companyAdmin.findUnique({
      where: { userId },
      select: { companyId: true, isPrimary: true },
    });
    if (!admin) throw new NotFoundException('Company admin profile not found');
    return admin;
  }

  // ── GET OWN COMPANY ───────────────────────────────────────────────
  async getMyCompany(userId: string) {
    const admin = await this.getCompanyAdminOrFail(userId);
    const company = await this.prisma.company.findUnique({
      where: { id: admin.companyId },
      include: {
        location: true,
        _count: { select: { contractors: true, admins: true, projects: true } },
      },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  // ── UPDATE COMPANY ────────────────────────────────────────────────
  async updateCompany(userId: string, dto: UpdateCompanyDto) {
    const admin = await this.getCompanyAdminOrFail(userId);
    if (!admin.isPrimary) throw new ForbiddenException('Only primary admin can update company details');

    const updated = await this.prisma.company.update({
      where: { id: admin.companyId },
      data: {
        name: dto.name,
        description: dto.description,
        email: dto.email,
        phone: dto.phone,
        website: dto.website,
        logoUrl: dto.logoUrl,
        gstNumber: dto.gstNumber,
        panNumber: dto.panNumber,
        employeeCount: dto.employeeCount,
        establishedYear: dto.establishedYear,
      },
    });

    this.logger.log(`Company updated: ${admin.companyId}`);
    return updated;
  }

  // ── LIST COMPANY CONTRACTORS ──────────────────────────────────────
  async getContractors(userId: string, filters: CompanyFilterDto) {
    const admin = await this.getCompanyAdminOrFail(userId);
    const { page = 1, limit = 20, search, city } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ContractorWhereInput = {
      companyId: admin.companyId,
      deletedAt: null,
    };

    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (search) {
      where.user = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.contractor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true, firstName: true, lastName: true,
              email: true, phone: true, avatar: true, status: true,
            },
          },
          location: true,
          _count: { select: { sites: true, jobs: true, projects: true } },
        },
      }),
      this.prisma.contractor.count({ where }),
    ]);

    return {
      data,
      meta: {
        total, page, limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  // ── GET COMPANY DASHBOARD ─────────────────────────────────────────
  async getDashboard(userId: string) {
    const admin = await this.getCompanyAdminOrFail(userId);
    const { companyId } = admin;

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalContractors,
      totalProjects,
      activeProjects,
      companyWorkforce,
      monthPayroll,
      pendingCompliance,
      recentProjects,
      contractorsByLocation,
    ] = await Promise.all([
      this.prisma.contractor.count({ where: { companyId, deletedAt: null } }),
      this.prisma.project.count({ where: { companyId, deletedAt: null } }),
      this.prisma.project.count({ where: { companyId, status: 'ACTIVE', deletedAt: null } }),
      this.prisma.workforceAssignment.count({
        where: { project: { companyId }, isActive: true },
      }),
      this.prisma.payrollBatch.aggregate({
        where: {
          contractor: { companyId },
          status: 'COMPLETED',
          processedAt: { gte: startOfMonth },
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.complianceRecord.count({
        where: { companyId, status: { in: ['PENDING', 'OVERDUE'] }, deletedAt: null },
      }),
      this.prisma.project.findMany({
        where: { companyId, deletedAt: null },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          contractor: {
            select: { user: { select: { firstName: true, lastName: true } } },
          },
          _count: { select: { workforceAssignments: true, sites: true } },
        },
      }),
      this.prisma.contractor.groupBy({
        by: ['city'],
        where: { companyId, deletedAt: null, city: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
    ]);

    return {
      stats: {
        totalContractors,
        totalProjects,
        activeProjects,
        companyWorkforce,
        monthPayroll: Number(monthPayroll._sum.totalAmount ?? 0),
        pendingCompliance,
      },
      recentProjects,
      contractorsByLocation,
    };
  }

  // ── COMPANY WORKFORCE SUMMARY ─────────────────────────────────────
  async getWorkforceSummary(userId: string) {
    const admin = await this.getCompanyAdminOrFail(userId);

    const assignments = await this.prisma.workforceAssignment.findMany({
      where: { project: { companyId: admin.companyId }, isActive: true },
      include: {
        worker: {
          select: {
            id: true,
            user: { select: { firstName: true, lastName: true, avatar: true } },
            city: true, rating: true,
            skills: {
              take: 1,
              include: { skill: { select: { name: true } } },
            },
          },
        },
        project: { select: { id: true, name: true, city: true } },
      },
      take: 50,
      orderBy: { startDate: 'desc' },
    });

    const total = await this.prisma.workforceAssignment.count({
      where: { project: { companyId: admin.companyId }, isActive: true },
    });

    return { assignments, total };
  }

  // ── LIST ALL COMPANIES (admin) ────────────────────────────────────
  async findAll(filters: CompanyFilterDto) {
    const { page = 1, limit = 20, search } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.CompanyWhereInput = { deletedAt: null };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { contractors: true, admins: true, projects: true } },
          location: true,
        },
      }),
      this.prisma.company.count({ where }),
    ]);

    return {
      data,
      meta: {
        total, page, limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }
}
