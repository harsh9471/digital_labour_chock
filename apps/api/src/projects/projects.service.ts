import {
  Injectable, Logger, NotFoundException,
  ForbiddenException, ConflictException,
} from '@nestjs/common';
import { Prisma, ProjectStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, ProjectFilterDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async getContractorOrFail(userId: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { userId, deletedAt: null },
      select: { id: true },
    });
    if (!contractor) throw new NotFoundException('Contractor profile not found');
    return contractor;
  }

  // ── CREATE ──────────────────────────────────────────────────────
  async create(userId: string, dto: CreateProjectDto) {
    const contractor = await this.getContractorOrFail(userId);

    if (dto.code) {
      const exists = await this.prisma.project.findUnique({ where: { code: dto.code } });
      if (exists) throw new ConflictException('Project code already in use');
    }

    const project = await this.prisma.project.create({
      data: {
        contractorId: contractor.id,
        companyId: dto.companyId ?? null,
        name: dto.name,
        description: dto.description,
        code: dto.code,
        status: dto.status ?? ProjectStatus.ACTIVE,
        budget: dto.budget != null ? dto.budget : undefined,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        city: dto.city,
        state: dto.state,
        address: dto.address,
        latitude: dto.latitude != null ? dto.latitude : undefined,
        longitude: dto.longitude != null ? dto.longitude : undefined,
      },
    });

    // attach sites
    if (dto.siteIds?.length) {
      await this.prisma.projectSite.createMany({
        data: dto.siteIds.map((siteId) => ({ projectId: project.id, siteId })),
        skipDuplicates: true,
      });
    }

    this.logger.log(`Project created: ${project.id} by contractor ${contractor.id}`);
    return this.findById(project.id, contractor.id);
  }

  // ── FIND ALL (paginated, contractor-scoped) ──────────────────────
  async findAll(userId: string, filters: ProjectFilterDto) {
    const contractor = await this.getContractorOrFail(userId);
    const { page = 1, limit = 20, search, status, city } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {
      contractorId: contractor.id,
      deletedAt: null,
    };

    if (status) where.status = status;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: { select: { id: true, name: true, logoUrl: true } },
          sites: {
            include: { site: { select: { id: true, name: true, city: true, isActive: true } } },
          },
          _count: { select: { workforceAssignments: true, complianceRecords: true } },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data,
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

  // ── FIND ONE ─────────────────────────────────────────────────────
  async findById(projectId: string, contractorId?: string) {
    const where: Prisma.ProjectWhereUniqueInput = { id: projectId };
    const project = await this.prisma.project.findUnique({
      where,
      include: {
        contractor: {
          select: {
            id: true,
            user: { select: { firstName: true, lastName: true, avatar: true } },
          },
        },
        company: { select: { id: true, name: true, logoUrl: true, isVerified: true } },
        sites: {
          include: {
            site: {
              select: {
                id: true, name: true, city: true, state: true,
                isActive: true, totalWorkers: true, address: true,
              },
            },
          },
        },
        workforceAssignments: {
          where: { isActive: true },
          include: {
            worker: {
              select: {
                id: true,
                user: { select: { firstName: true, lastName: true, avatar: true } },
                rating: true, city: true,
              },
            },
          },
          take: 10,
        },
        complianceRecords: {
          where: { deletedAt: null },
          orderBy: { dueDate: 'asc' },
          take: 5,
        },
        _count: {
          select: {
            workforceAssignments: true,
            complianceRecords: true,
            reports: true,
          },
        },
      },
    });

    if (!project) throw new NotFoundException('Project not found');
    if (contractorId && project.contractorId !== contractorId) {
      throw new ForbiddenException('Access denied');
    }

    return project;
  }

  // ── UPDATE ───────────────────────────────────────────────────────
  async update(userId: string, projectId: string, dto: UpdateProjectDto) {
    const contractor = await this.getContractorOrFail(userId);
    const project = await this.prisma.project.findUnique({
      where: { id: projectId, deletedAt: null },
    });
    if (!project) throw new NotFoundException('Project not found');
    if (project.contractorId !== contractor.id) throw new ForbiddenException('Access denied');

    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        name: dto.name,
        description: dto.description,
        status: dto.status,
        budget: dto.budget != null ? dto.budget : undefined,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        city: dto.city,
        state: dto.state,
        address: dto.address,
      },
    });

    if (dto.siteIds !== undefined) {
      await this.prisma.projectSite.deleteMany({ where: { projectId } });
      if (dto.siteIds.length) {
        await this.prisma.projectSite.createMany({
          data: dto.siteIds.map((siteId) => ({ projectId, siteId })),
          skipDuplicates: true,
        });
      }
    }

    this.logger.log(`Project updated: ${projectId}`);
    return this.findById(projectId, contractor.id);
  }

  // ── SOFT DELETE ──────────────────────────────────────────────────
  async remove(userId: string, projectId: string) {
    const contractor = await this.getContractorOrFail(userId);
    const project = await this.prisma.project.findUnique({
      where: { id: projectId, deletedAt: null },
    });
    if (!project) throw new NotFoundException('Project not found');
    if (project.contractorId !== contractor.id) throw new ForbiddenException('Access denied');

    await this.prisma.project.update({
      where: { id: projectId },
      data: { deletedAt: new Date() },
    });

    this.logger.log(`Project soft-deleted: ${projectId}`);
    return { message: 'Project deleted successfully' };
  }

  // ── ASSIGN WORKER ────────────────────────────────────────────────
  async assignWorker(
    userId: string,
    projectId: string,
    dto: { workerId: string; role?: string; startDate: string; endDate?: string; dailyRate?: number; siteId?: string; notes?: string },
  ) {
    const contractor = await this.getContractorOrFail(userId);
    const project = await this.prisma.project.findUnique({ where: { id: projectId, deletedAt: null } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.contractorId !== contractor.id) throw new ForbiddenException('Access denied');

    const worker = await this.prisma.worker.findUnique({ where: { id: dto.workerId } });
    if (!worker) throw new NotFoundException('Worker not found');

    const assignment = await this.prisma.workforceAssignment.create({
      data: {
        projectId,
        workerId: dto.workerId,
        contractorId: contractor.id,
        siteId: dto.siteId ?? null,
        role: dto.role,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        dailyRate: dto.dailyRate ?? null,
        notes: dto.notes ?? null,
        isActive: true,
      },
      include: {
        worker: {
          select: {
            id: true,
            user: { select: { firstName: true, lastName: true, avatar: true } },
            rating: true,
          },
        },
      },
    });

    // bump totalWorkers
    await this.prisma.project.update({
      where: { id: projectId },
      data: { totalWorkers: { increment: 1 } },
    });

    return assignment;
  }

  // ── UNASSIGN WORKER ─────────────────────────────────────────────
  async unassignWorker(userId: string, projectId: string, assignmentId: string) {
    const contractor = await this.getContractorOrFail(userId);
    const assignment = await this.prisma.workforceAssignment.findUnique({
      where: { id: assignmentId },
    });
    if (!assignment || assignment.projectId !== projectId) throw new NotFoundException('Assignment not found');
    if (assignment.contractorId !== contractor.id) throw new ForbiddenException('Access denied');

    await this.prisma.workforceAssignment.update({
      where: { id: assignmentId },
      data: { isActive: false, endDate: new Date() },
    });

    await this.prisma.project.update({
      where: { id: projectId },
      data: { totalWorkers: { decrement: 1 } },
    });

    return { message: 'Worker unassigned successfully' };
  }

  // ── PROJECT STATS ────────────────────────────────────────────────
  async getProjectStats(userId: string, projectId: string) {
    const contractor = await this.getContractorOrFail(userId);
    const project = await this.prisma.project.findUnique({ where: { id: projectId, deletedAt: null } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.contractorId !== contractor.id) throw new ForbiddenException('Access denied');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Get all site IDs for this project
    const projectSites = await this.prisma.projectSite.findMany({
      where: { projectId },
      select: { siteId: true },
    });
    const siteIds = projectSites.map((ps) => ps.siteId);

    const [activeWorkers, todayAttendance, totalPayroll, complianceIssues] = await Promise.all([
      this.prisma.workforceAssignment.count({ where: { projectId, isActive: true } }),
      siteIds.length
        ? this.prisma.attendanceRecord.count({
            where: { siteId: { in: siteIds }, checkInTime: { gte: today, lt: tomorrow } },
          })
        : 0,
      this.prisma.payrollBatch.aggregate({
        where: { contractorId: contractor.id, status: 'COMPLETED' },
        _sum: { totalAmount: true },
      }),
      this.prisma.complianceRecord.count({
        where: { projectId, status: { in: ['PENDING', 'OVERDUE'] }, deletedAt: null },
      }),
    ]);

    return {
      activeWorkers,
      todayAttendance,
      totalPayrollSpent: totalPayroll._sum.totalAmount ?? 0,
      complianceIssues,
      totalSites: siteIds.length,
    };
  }

  // ── COMPANY: ALL PROJECTS ────────────────────────────────────────
  async findAllForCompany(companyId: string, filters: ProjectFilterDto) {
    const { page = 1, limit = 20, search, status, city } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = { companyId, deletedAt: null };
    if (status) where.status = status;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          contractor: {
            select: {
              id: true,
              user: { select: { firstName: true, lastName: true, avatar: true } },
            },
          },
          _count: { select: { workforceAssignments: true, sites: true } },
        },
      }),
      this.prisma.project.count({ where }),
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
