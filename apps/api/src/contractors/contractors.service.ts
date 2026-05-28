import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { ContractorFilterDto, UpdateContractorProfileDto } from './dto/contractor.dto';

@Injectable()
export class ContractorsService {
  private readonly logger = new Logger(ContractorsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ============================================================
  // GET OWN PROFILE
  // ============================================================
  async getMyProfile(userId: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { userId, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
            status: true,
            emailVerified: true,
            phoneVerified: true,
            createdAt: true,
          },
        },
        company: true,
        location: true,
      },
    });

    if (!contractor) throw new NotFoundException('Contractor profile not found');

    return contractor;
  }

  // ============================================================
  // UPDATE OWN PROFILE
  // ============================================================
  async updateMyProfile(userId: string, dto: UpdateContractorProfileDto) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { userId, deletedAt: null },
    });

    if (!contractor) throw new NotFoundException('Contractor profile not found');

    // Check GSTIN uniqueness if being updated
    if (dto.gstin && dto.gstin !== contractor.gstin) {
      const existing = await this.prisma.contractor.findFirst({
        where: { gstin: dto.gstin, id: { not: contractor.id } },
      });
      if (existing) throw new ConflictException('GSTIN already registered');
    }

    const updated = await this.prisma.contractor.update({
      where: { id: contractor.id },
      data: {
        bio: dto.bio,
        specializations: dto.specializations ?? undefined,
        licenseNumber: dto.licenseNumber,
        licenseExpiry: dto.licenseExpiry ? new Date(dto.licenseExpiry) : undefined,
        gstin: dto.gstin,
        city: dto.city,
        state: dto.state,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
            status: true,
          },
        },
        company: true,
        location: true,
      },
    });

    this.logger.log(`Contractor profile updated: ${contractor.id}`);
    return updated;
  }

  // ============================================================
  // LIST ALL CONTRACTORS (admin only)
  // ============================================================
  async findAll(filters: ContractorFilterDto) {
    const { page = 1, limit = 20, city, state, companyId, search } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ContractorWhereInput = { deletedAt: null };

    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (state) where.state = { contains: state, mode: 'insensitive' };
    if (companyId) where.companyId = companyId;

    if (search) {
      where.user = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const [contractors, total] = await Promise.all([
      this.prisma.contractor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              avatar: true,
              status: true,
            },
          },
          company: {
            select: { id: true, name: true, logoUrl: true, isVerified: true },
          },
          location: true,
        },
      }),
      this.prisma.contractor.count({ where }),
    ]);

    return {
      data: contractors,
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

  // ============================================================
  // GET CONTRACTOR BY ID
  // ============================================================
  async findById(contractorId: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id: contractorId, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            status: true,
            createdAt: true,
          },
        },
        company: true,
        location: true,
      },
    });

    if (!contractor) throw new NotFoundException('Contractor not found');
    return contractor;
  }

  // ============================================================
  // GET DASHBOARD STATS
  // ============================================================
  async getDashboardStats(userId: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { userId, deletedAt: null },
      select: { id: true },
    });

    if (!contractor) throw new NotFoundException('Contractor profile not found');

    const [totalSites, activeJobs, totalWorkers, pendingApplications] = await Promise.all([
      this.prisma.site.count({ where: { contractorId: contractor.id, isActive: true, deletedAt: null } }),
      this.prisma.job.count({ where: { contractorId: contractor.id, status: 'PUBLISHED', deletedAt: null } }),
      this.prisma.hireRecord.count({ where: { contractorId: contractor.id, isActive: true } }),
      this.prisma.jobApplication.count({
        where: { job: { contractorId: contractor.id }, status: 'SUBMITTED' },
      }),
    ]);

    return {
      totalSites,
      activeJobs,
      totalWorkers,
      pendingApplications,
    };
  }
}
