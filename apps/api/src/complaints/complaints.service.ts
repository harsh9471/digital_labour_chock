import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ComplaintStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto, UpdateComplaintDto, ComplaintFilterDto } from './dto/complaint.dto';

@Injectable()
export class ComplaintsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateComplaintDto) {
    return this.prisma.complaint.create({
      data: {
        reportedBy: userId,
        reportedAgainst: dto.reportedAgainst,
        type: dto.type,
        title: dto.title,
        description: dto.description,
      },
      include: { reporter: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async findAll(filters: ComplaintFilterDto) {
    const page = Number(filters.page) || 1;
    const limit = Math.min(Number(filters.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (filters.type) where['type'] = filters.type;
    if (filters.status) where['status'] = filters.status;

    const [data, total] = await Promise.all([
      this.prisma.complaint.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: { select: { id: true, firstName: true, lastName: true, role: true } },
        },
      }),
      this.prisma.complaint.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPrevPage: page > 1 },
    };
  }

  async findMine(userId: string, filters: ComplaintFilterDto) {
    const page = Number(filters.page) || 1;
    const limit = Math.min(Number(filters.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { reportedBy: userId };
    if (filters.status) where['status'] = filters.status;

    const [data, total] = await Promise.all([
      this.prisma.complaint.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.complaint.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPrevPage: page > 1 },
    };
  }

  async findById(id: string) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
      include: { reporter: { select: { id: true, firstName: true, lastName: true, role: true } } },
    });
    if (!complaint) throw new NotFoundException('Complaint not found');
    return complaint;
  }

  async update(id: string, adminId: string, dto: UpdateComplaintDto) {
    const complaint = await this.prisma.complaint.findUnique({ where: { id } });
    if (!complaint) throw new NotFoundException('Complaint not found');

    const data: Record<string, unknown> = {};
    if (dto.status) data['status'] = dto.status;
    if (dto.resolution) data['resolution'] = dto.resolution;
    if (dto.status === ComplaintStatus.RESOLVED || dto.status === ComplaintStatus.DISMISSED) {
      data['resolvedBy'] = adminId;
      data['resolvedAt'] = new Date();
    }

    return this.prisma.complaint.update({ where: { id }, data });
  }

  async getSummary() {
    const [total, open, underReview, resolved, dismissed] = await Promise.all([
      this.prisma.complaint.count(),
      this.prisma.complaint.count({ where: { status: ComplaintStatus.OPEN } }),
      this.prisma.complaint.count({ where: { status: ComplaintStatus.UNDER_REVIEW } }),
      this.prisma.complaint.count({ where: { status: ComplaintStatus.RESOLVED } }),
      this.prisma.complaint.count({ where: { status: ComplaintStatus.DISMISSED } }),
    ]);
    return { total, open, underReview, resolved, dismissed };
  }
}
