import {
  Injectable, Logger, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { Prisma, PayrollStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AddPayrollRecordDto, CreatePayrollBatchDto, PayrollFilterDto } from './dto/payroll.dto';

@Injectable()
export class PayrollService {
  private readonly logger = new Logger(PayrollService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async getContractorOrFail(userId: string) {
    const c = await this.prisma.contractor.findUnique({
      where: { userId, deletedAt: null }, select: { id: true },
    });
    if (!c) throw new NotFoundException('Contractor profile not found');
    return c;
  }

  // ── CREATE BATCH ──────────────────────────────────────────────────
  async createBatch(userId: string, dto: CreatePayrollBatchDto) {
    const contractor = await this.getContractorOrFail(userId);

    const batch = await this.prisma.payrollBatch.create({
      data: {
        contractorId: contractor.id,
        jobId: dto.jobId ?? null,
        periodStart: new Date(dto.periodStart),
        periodEnd: new Date(dto.periodEnd),
        status: PayrollStatus.DRAFT,
        notes: dto.notes ?? null,
      },
    });

    this.logger.log(`Payroll batch created: ${batch.id}`);
    return batch;
  }

  // ── ADD RECORD TO BATCH ───────────────────────────────────────────
  async addRecord(userId: string, batchId: string, dto: AddPayrollRecordDto) {
    const contractor = await this.getContractorOrFail(userId);
    const batch = await this.prisma.payrollBatch.findUnique({ where: { id: batchId } });
    if (!batch) throw new NotFoundException('Payroll batch not found');
    if (batch.contractorId !== contractor.id) throw new ForbiddenException('Access denied');
    if (batch.status !== PayrollStatus.DRAFT) throw new BadRequestException('Cannot modify non-draft batch');

    const gross = dto.workingDays * dto.dailyWage;
    const pf = dto.pfDeduction ?? 0;
    const esi = dto.esiDeduction ?? 0;
    const other = dto.otherDeductions ?? 0;
    const net = gross - pf - esi - other;

    const record = await this.prisma.payrollRecord.create({
      data: {
        batchId,
        workerId: dto.workerId,
        jobId: dto.jobId,
        workingDays: dto.workingDays,
        totalHours: dto.totalHours ?? null,
        dailyWage: dto.dailyWage,
        grossAmount: gross,
        pfDeduction: pf,
        esiDeduction: esi,
        otherDeductions: other,
        netAmount: net,
        paymentStatus: 'PENDING',
      },
      include: {
        worker: {
          select: { id: true, user: { select: { firstName: true, lastName: true } } },
        },
        job: { select: { id: true, title: true } },
      },
    });

    // update batch totals
    const allRecords = await this.prisma.payrollRecord.aggregate({
      where: { batchId },
      _sum: { netAmount: true },
      _count: { id: true },
    });

    await this.prisma.payrollBatch.update({
      where: { id: batchId },
      data: {
        totalWorkers: allRecords._count.id,
        totalAmount: allRecords._sum.netAmount ?? 0,
      },
    });

    return record;
  }

  // ── PROCESS BATCH (PENDING_APPROVAL → PROCESSING → COMPLETED) ────
  async processBatch(userId: string, batchId: string) {
    const contractor = await this.getContractorOrFail(userId);
    const batch = await this.prisma.payrollBatch.findUnique({
      where: { id: batchId },
      include: { records: true },
    });
    if (!batch) throw new NotFoundException('Payroll batch not found');
    if (batch.contractorId !== contractor.id) throw new ForbiddenException('Access denied');
    if (batch.status !== PayrollStatus.DRAFT && batch.status !== PayrollStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Batch is not in a processable state');
    }
    if (!batch.records.length) throw new BadRequestException('Batch has no payroll records');

    const updated = await this.prisma.payrollBatch.update({
      where: { id: batchId },
      data: {
        status: PayrollStatus.COMPLETED,
        processedAt: new Date(),
      },
    });

    await this.prisma.payrollRecord.updateMany({
      where: { batchId },
      data: { paymentStatus: 'PAID', paidAt: new Date() },
    });

    this.logger.log(`Payroll batch processed: ${batchId}`);
    return updated;
  }

  // ── LIST BATCHES ──────────────────────────────────────────────────
  async findBatches(userId: string, filters: PayrollFilterDto) {
    const contractor = await this.getContractorOrFail(userId);
    const { page = 1, limit = 20, status, dateFrom, dateTo, jobId } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.PayrollBatchWhereInput = { contractorId: contractor.id };
    if (status) where.status = status;
    if (jobId) where.jobId = jobId;
    if (dateFrom || dateTo) {
      where.periodStart = {};
      if (dateFrom) (where.periodStart as Prisma.DateTimeFilter).gte = new Date(dateFrom);
      if (dateTo) (where.periodStart as Prisma.DateTimeFilter).lte = new Date(dateTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.payrollBatch.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { records: true } },
          records: {
            take: 3,
            include: {
              worker: { select: { user: { select: { firstName: true, lastName: true } } } },
            },
          },
        },
      }),
      this.prisma.payrollBatch.count({ where }),
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

  // ── GET BATCH DETAIL ──────────────────────────────────────────────
  async findBatchById(userId: string, batchId: string) {
    const contractor = await this.getContractorOrFail(userId);
    const batch = await this.prisma.payrollBatch.findUnique({
      where: { id: batchId },
      include: {
        records: {
          include: {
            worker: {
              select: {
                id: true,
                user: { select: { firstName: true, lastName: true, avatar: true, phone: true } },
                upiId: true, bankAccountNumber: true,
              },
            },
            job: { select: { id: true, title: true, city: true } },
          },
        },
      },
    });
    if (!batch) throw new NotFoundException('Payroll batch not found');
    if (batch.contractorId !== contractor.id) throw new ForbiddenException('Access denied');
    return batch;
  }

  // ── PAYROLL SUMMARY (dashboard) ───────────────────────────────────
  async getSummary(userId: string) {
    const contractor = await this.getContractorOrFail(userId);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [
      thisMonth,
      lastMonth,
      pendingBatches,
      totalPaid,
      draftBatches,
    ] = await Promise.all([
      this.prisma.payrollBatch.aggregate({
        where: {
          contractorId: contractor.id,
          status: PayrollStatus.COMPLETED,
          processedAt: { gte: startOfMonth },
        },
        _sum: { totalAmount: true },
        _count: { id: true },
      }),
      this.prisma.payrollBatch.aggregate({
        where: {
          contractorId: contractor.id,
          status: PayrollStatus.COMPLETED,
          processedAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.payrollBatch.count({
        where: { contractorId: contractor.id, status: PayrollStatus.PENDING_APPROVAL },
      }),
      this.prisma.payrollBatch.aggregate({
        where: { contractorId: contractor.id, status: PayrollStatus.COMPLETED },
        _sum: { totalAmount: true },
      }),
      this.prisma.payrollBatch.count({
        where: { contractorId: contractor.id, status: PayrollStatus.DRAFT },
      }),
    ]);

    return {
      thisMonthTotal: Number(thisMonth._sum.totalAmount ?? 0),
      thisMonthBatches: thisMonth._count.id,
      lastMonthTotal: Number(lastMonth._sum.totalAmount ?? 0),
      pendingBatches,
      draftBatches,
      totalPaidAllTime: Number(totalPaid._sum.totalAmount ?? 0),
    };
  }

  // ── AUTO-GENERATE BATCH FROM ATTENDANCE ──────────────────────────
  async generateFromAttendance(userId: string, dto: CreatePayrollBatchDto) {
    const contractor = await this.getContractorOrFail(userId);

    const batch = await this.prisma.payrollBatch.create({
      data: {
        contractorId: contractor.id,
        jobId: dto.jobId ?? null,
        periodStart: new Date(dto.periodStart),
        periodEnd: new Date(dto.periodEnd),
        status: PayrollStatus.DRAFT,
        notes: dto.notes ?? null,
      },
    });

    // Fetch hire records for this contractor in the period
    const hireRecords = await this.prisma.hireRecord.findMany({
      where: {
        contractorId: contractor.id,
        isActive: true,
        jobId: dto.jobId ?? undefined,
      },
      include: { worker: true },
    });

    const records = [];
    for (const hire of hireRecords) {
      const attendanceAgg = await this.prisma.attendanceRecord.aggregate({
        where: {
          workerId: hire.workerId,
          jobId: hire.jobId,
          contractorId: contractor.id,
          checkInTime: {
            gte: new Date(dto.periodStart),
            lte: new Date(dto.periodEnd),
          },
          checkOutTime: { not: null },
        },
        _count: { id: true },
        _sum: { totalHours: true },
      });

      const workingDays = attendanceAgg._count.id;
      if (workingDays === 0) continue;

      const dailyWage = Number(hire.agreedDailyWage);
      const gross = workingDays * dailyWage;
      const pf = Math.round(gross * 0.12 * 100) / 100;
      const esi = Math.round(gross * 0.0075 * 100) / 100;
      const net = gross - pf - esi;

      records.push({
        batchId: batch.id,
        workerId: hire.workerId,
        jobId: hire.jobId,
        workingDays,
        totalHours: Number(attendanceAgg._sum.totalHours ?? 0),
        dailyWage,
        grossAmount: gross,
        pfDeduction: pf,
        esiDeduction: esi,
        otherDeductions: 0,
        netAmount: net,
        paymentStatus: 'PENDING' as const,
      });
    }

    if (records.length) {
      await this.prisma.payrollRecord.createMany({ data: records });
      const totalAmount = records.reduce((s, r) => s + r.netAmount, 0);
      await this.prisma.payrollBatch.update({
        where: { id: batch.id },
        data: { totalWorkers: records.length, totalAmount },
      });
    }

    this.logger.log(`Auto-generated payroll batch: ${batch.id} with ${records.length} records`);
    return this.findBatchById(userId, batch.id);
  }
}
