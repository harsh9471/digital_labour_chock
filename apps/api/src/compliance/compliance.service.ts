import {
  Injectable, Logger, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ComplianceFilterDto, CreateComplianceDto, UpdateComplianceDto } from './dto/compliance.dto';

@Injectable()
export class ComplianceService {
  private readonly logger = new Logger(ComplianceService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async getContractorOrFail(userId: string) {
    const c = await this.prisma.contractor.findUnique({
      where: { userId, deletedAt: null }, select: { id: true },
    });
    if (!c) throw new NotFoundException('Contractor profile not found');
    return c;
  }

  async create(userId: string, dto: CreateComplianceDto) {
    const contractor = await this.getContractorOrFail(userId);

    const record = await this.prisma.complianceRecord.create({
      data: {
        contractorId: contractor.id,
        projectId: dto.projectId ?? null,
        type: dto.type,
        title: dto.title,
        description: dto.description ?? null,
        status: dto.status ?? 'PENDING',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        fileUrl: dto.fileUrl ?? null,
        notes: dto.notes ?? null,
        issuedBy: dto.issuedBy ?? null,
        referenceNo: dto.referenceNo ?? null,
      },
    });

    this.logger.log(`Compliance record created: ${record.id}`);
    return record;
  }

  async findAll(userId: string, filters: ComplianceFilterDto) {
    const contractor = await this.getContractorOrFail(userId);
    const { page = 1, limit = 20, status, type, projectId, search } = filters;
    const skip = (page - 1) * limit;

    // auto-flag overdue records
    await this.prisma.complianceRecord.updateMany({
      where: {
        contractorId: contractor.id,
        status: 'PENDING',
        dueDate: { lt: new Date() },
        deletedAt: null,
      },
      data: { status: 'OVERDUE' },
    });

    const where: Prisma.ComplianceRecordWhereInput = {
      contractorId: contractor.id,
      deletedAt: null,
    };

    if (status) where.status = status;
    if (type) where.type = type;
    if (projectId) where.projectId = projectId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { referenceNo: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.complianceRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
        include: {
          project: { select: { id: true, name: true } },
        },
      }),
      this.prisma.complianceRecord.count({ where }),
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

  async findById(userId: string, recordId: string) {
    const contractor = await this.getContractorOrFail(userId);
    const record = await this.prisma.complianceRecord.findUnique({
      where: { id: recordId, deletedAt: null },
      include: { project: { select: { id: true, name: true } } },
    });
    if (!record) throw new NotFoundException('Compliance record not found');
    if (record.contractorId !== contractor.id) throw new ForbiddenException('Access denied');
    return record;
  }

  async update(userId: string, recordId: string, dto: UpdateComplianceDto) {
    const contractor = await this.getContractorOrFail(userId);
    const record = await this.prisma.complianceRecord.findUnique({ where: { id: recordId, deletedAt: null } });
    if (!record) throw new NotFoundException('Compliance record not found');
    if (record.contractorId !== contractor.id) throw new ForbiddenException('Access denied');

    const updated = await this.prisma.complianceRecord.update({
      where: { id: recordId },
      data: {
        status: dto.status,
        notes: dto.notes,
        fileUrl: dto.fileUrl,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        completedAt: dto.completedAt ? new Date(dto.completedAt)
          : (dto.status === 'COMPLETED' ? new Date() : undefined),
        referenceNo: dto.referenceNo,
      },
    });

    this.logger.log(`Compliance record updated: ${recordId}`);
    return updated;
  }

  async remove(userId: string, recordId: string) {
    const contractor = await this.getContractorOrFail(userId);
    const record = await this.prisma.complianceRecord.findUnique({ where: { id: recordId, deletedAt: null } });
    if (!record) throw new NotFoundException('Compliance record not found');
    if (record.contractorId !== contractor.id) throw new ForbiddenException('Access denied');

    await this.prisma.complianceRecord.update({
      where: { id: recordId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Compliance record deleted' };
  }

  async getSummary(userId: string) {
    const contractor = await this.getContractorOrFail(userId);

    // auto-flag overdue
    await this.prisma.complianceRecord.updateMany({
      where: {
        contractorId: contractor.id,
        status: 'PENDING',
        dueDate: { lt: new Date() },
        deletedAt: null,
      },
      data: { status: 'OVERDUE' },
    });

    const byStatus = await this.prisma.complianceRecord.groupBy({
      by: ['status'],
      where: { contractorId: contractor.id, deletedAt: null },
      _count: { id: true },
    });

    const byType = await this.prisma.complianceRecord.groupBy({
      by: ['type'],
      where: { contractorId: contractor.id, deletedAt: null },
      _count: { id: true },
    });

    const upcoming = await this.prisma.complianceRecord.findMany({
      where: {
        contractorId: contractor.id,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        dueDate: { gte: new Date() },
        deletedAt: null,
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
      include: { project: { select: { id: true, name: true } } },
    });

    return { byStatus, byType, upcoming };
  }
}
