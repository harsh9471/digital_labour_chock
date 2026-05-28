import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateSiteDto, SiteFilterDto, UpdateSiteDto } from './dto/site.dto';

@Injectable()
export class SitesService {
  private readonly logger = new Logger(SitesService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ============================================================
  // CREATE SITE
  // ============================================================
  async create(userId: string, dto: CreateSiteDto) {
    const contractor = await this.getContractorOrFail(userId);

    const site = await this.prisma.site.create({
      data: {
        contractorId: contractor.id,
        name: dto.name,
        description: dto.description,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        pincode: dto.pincode,
        latitude: dto.latitude != null ? dto.latitude : undefined,
        longitude: dto.longitude != null ? dto.longitude : undefined,
        radiusMeters: dto.radiusMeters ?? 200,
      },
    });

    this.logger.log(`Site created: ${site.id} by contractor ${contractor.id}`);
    return site;
  }

  // ============================================================
  // LIST OWN SITES
  // ============================================================
  async findMyAll(userId: string, filters: SiteFilterDto) {
    const contractor = await this.getContractorOrFail(userId);
    const { page = 1, limit = 20, city, isActive } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.SiteWhereInput = {
      contractorId: contractor.id,
      deletedAt: null,
    };

    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (isActive != null) where.isActive = isActive;

    const [sites, total] = await Promise.all([
      this.prisma.site.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              jobs: true,
              attendanceRecords: { where: { checkOutTime: null } },
            },
          },
        },
      }),
      this.prisma.site.count({ where }),
    ]);

    return {
      data: sites,
      meta: {
        total, page, limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  // ============================================================
  // GET SITE DETAIL
  // ============================================================
  async findById(siteId: string, userId: string) {
    const contractor = await this.getContractorOrFail(userId);

    const site = await this.prisma.site.findUnique({
      where: { id: siteId, deletedAt: null },
      include: {
        jobs: {
          where: { deletedAt: null, status: { in: ['PUBLISHED', 'ACTIVE'] } },
          select: {
            id: true, title: true, status: true, workerCount: true, filledCount: true,
          },
        },
        _count: {
          select: {
            jobs: true,
            attendanceRecords: true,
          },
        },
      },
    });

    if (!site) throw new NotFoundException('Site not found');
    if (site.contractorId !== contractor.id) {
      throw new ForbiddenException('You do not have access to this site');
    }

    return site;
  }

  // ============================================================
  // UPDATE SITE
  // ============================================================
  async update(siteId: string, userId: string, dto: UpdateSiteDto) {
    const contractor = await this.getContractorOrFail(userId);

    const site = await this.prisma.site.findUnique({
      where: { id: siteId, deletedAt: null },
    });

    if (!site) throw new NotFoundException('Site not found');
    if (site.contractorId !== contractor.id) {
      throw new ForbiddenException('You do not have access to this site');
    }

    return this.prisma.site.update({
      where: { id: siteId },
      data: {
        name: dto.name,
        description: dto.description,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        pincode: dto.pincode,
        latitude: dto.latitude != null ? dto.latitude : undefined,
        longitude: dto.longitude != null ? dto.longitude : undefined,
        radiusMeters: dto.radiusMeters,
        isActive: dto.isActive,
      },
    });
  }

  // ============================================================
  // SOFT DELETE SITE
  // ============================================================
  async remove(siteId: string, userId: string) {
    const contractor = await this.getContractorOrFail(userId);

    const site = await this.prisma.site.findUnique({
      where: { id: siteId, deletedAt: null },
    });

    if (!site) throw new NotFoundException('Site not found');
    if (site.contractorId !== contractor.id) {
      throw new ForbiddenException('You do not have access to this site');
    }

    // Check for active jobs
    const activeJobs = await this.prisma.job.count({
      where: { siteId, status: { in: ['PUBLISHED', 'ACTIVE'] }, deletedAt: null },
    });

    if (activeJobs > 0) {
      throw new ForbiddenException('Cannot delete a site with active jobs. Close jobs first.');
    }

    await this.prisma.site.update({
      where: { id: siteId },
      data: { deletedAt: new Date(), isActive: false },
    });

    return { message: 'Site deleted successfully' };
  }

  // ============================================================
  // GENERATE QR CODE
  // ============================================================
  async generateQrCode(siteId: string, userId: string, expiryHours: number = 8) {
    const contractor = await this.getContractorOrFail(userId);

    const site = await this.prisma.site.findUnique({ where: { id: siteId, deletedAt: null } });
    if (!site) throw new NotFoundException('Site not found');
    if (site.contractorId !== contractor.id) {
      throw new ForbiddenException('You do not have access to this site');
    }

    // Deactivate existing QR codes for this site
    await this.prisma.qrCode.updateMany({
      where: { siteId, isActive: true },
      data: { isActive: false },
    });

    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    const qrCode = await this.prisma.qrCode.create({
      data: {
        siteId,
        contractorId: contractor.id,
        expiresAt,
        isActive: true,
      },
    });

    this.logger.log(`QR code generated for site ${siteId}: ${qrCode.code}`);

    return {
      id: qrCode.id,
      code: qrCode.code,
      siteId: qrCode.siteId,
      expiresAt: qrCode.expiresAt,
      expiryHours,
    };
  }

  // ============================================================
  // HELPERS
  // ============================================================
  private async getContractorOrFail(userId: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { userId, deletedAt: null },
      select: { id: true },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor profile not found');
    }

    return contractor;
  }
}
