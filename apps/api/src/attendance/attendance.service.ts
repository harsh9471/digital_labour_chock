import {
  Injectable, Logger, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceFilterDto, CheckOutDto, MarkAttendanceDto, WorkerSelfCheckInDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async getContractorOrFail(userId: string) {
    const c = await this.prisma.contractor.findUnique({ where: { userId, deletedAt: null }, select: { id: true } });
    if (!c) throw new NotFoundException('Contractor profile not found');
    return c;
  }

  private async getWorkerOrFail(userId: string) {
    const w = await this.prisma.worker.findUnique({ where: { userId, deletedAt: null }, select: { id: true } });
    if (!w) throw new NotFoundException('Worker profile not found');
    return w;
  }

  // ── WORKER SELF CHECK-IN ──────────────────────────────────────────
  // Resolves jobId / siteId / contractorId from the worker's most recent active hire record.
  async workerSelfCheckIn(userId: string, dto: WorkerSelfCheckInDto) {
    const worker = await this.getWorkerOrFail(userId);

    // Find the most recent active hire record for this worker
    const hire = await this.prisma.hireRecord.findFirst({
      where: { workerId: worker.id, isActive: true },
      orderBy: { startDate: 'desc' },
      select: { jobId: true, siteId: true, contractorId: true },
    });

    if (!hire) {
      throw new BadRequestException('No active job assignment found. You must be hired for a job before checking in.');
    }

    // Resolve siteId: hire record may not have one, fall back to the job's site
    let resolvedSiteId = hire.siteId;
    if (!resolvedSiteId) {
      const job = await this.prisma.job.findUnique({
        where: { id: hire.jobId },
        select: { siteId: true },
      });
      resolvedSiteId = job?.siteId ?? null;
    }

    if (!resolvedSiteId) {
      throw new BadRequestException('No site assigned to your job. Ask your contractor to assign a site first.');
    }

    // Prevent duplicate active check-in
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existing = await this.prisma.attendanceRecord.findFirst({
      where: { workerId: worker.id, checkInTime: { gte: today }, checkOutTime: null },
    });
    if (existing) throw new BadRequestException('You are already checked in for today.');

    const record = await this.prisma.attendanceRecord.create({
      data: {
        workerId: worker.id,
        jobId: hire.jobId,
        siteId: resolvedSiteId,
        contractorId: hire.contractorId,
        checkInTime: new Date(),
        checkInLat: dto.checkInLat ?? null,
        checkInLon: dto.checkInLon ?? null,
        method: dto.method ?? 'GPS',
        geoFenceValid: true,
        notes: dto.notes ?? null,
      },
      include: {
        site: { select: { id: true, name: true, city: true } },
        job: { select: { id: true, title: true } },
      },
    });

    this.logger.log(`Worker self check-in: ${worker.id} at ${record.checkInTime}`);
    return record;
  }

  // ── WORKER SELF CHECK-OUT ─────────────────────────────────────────
  async workerSelfCheckOut(userId: string, dto: CheckOutDto) {
    const worker = await this.getWorkerOrFail(userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await this.prisma.attendanceRecord.findFirst({
      where: { workerId: worker.id, checkInTime: { gte: today }, checkOutTime: null },
      orderBy: { checkInTime: 'desc' },
    });

    if (!record) throw new BadRequestException("No open check-in found for today. Please check in first.");

    const checkOut = new Date();
    const totalHours = parseFloat(((checkOut.getTime() - record.checkInTime.getTime()) / 3_600_000).toFixed(2));

    const updated = await this.prisma.attendanceRecord.update({
      where: { id: record.id },
      data: {
        checkOutTime: checkOut,
        checkOutLat: dto.checkOutLat ?? null,
        checkOutLon: dto.checkOutLon ?? null,
        totalHours,
        notes: dto.notes ?? record.notes,
      },
      include: {
        site: { select: { id: true, name: true, city: true } },
        job: { select: { id: true, title: true } },
      },
    });

    this.logger.log(`Worker self check-out: ${worker.id}, hours: ${totalHours}`);
    return updated;
  }

  // ── WORKER OWN ATTENDANCE LIST ────────────────────────────────────
  async findWorkerOwnAttendance(userId: string, filters: AttendanceFilterDto) {
    const worker = await this.getWorkerOrFail(userId);
    const { page = 1, limit = 20, dateFrom, dateTo, siteId } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.AttendanceRecordWhereInput = { workerId: worker.id };
    if (siteId) where.siteId = siteId;
    if (dateFrom || dateTo) {
      where.checkInTime = {};
      if (dateFrom) (where.checkInTime as Prisma.DateTimeFilter).gte = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        (where.checkInTime as Prisma.DateTimeFilter).lte = end;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.attendanceRecord.findMany({
        where, skip, take: limit,
        orderBy: { checkInTime: 'desc' },
        include: {
          site: { select: { id: true, name: true, city: true } },
          job: { select: { id: true, title: true } },
        },
      }),
      this.prisma.attendanceRecord.count({ where }),
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

  // ── MARK CHECK-IN (contractor can mark on behalf) ─────────────────
  async markCheckIn(userId: string, dto: MarkAttendanceDto) {
    const contractor = await this.getContractorOrFail(userId);

    const site = await this.prisma.site.findUnique({ where: { id: dto.siteId, deletedAt: null } });
    if (!site) throw new NotFoundException('Site not found');
    if (site.contractorId !== contractor.id) throw new ForbiddenException('Site does not belong to you');

    // prevent duplicate active check-in
    const existing = await this.prisma.attendanceRecord.findFirst({
      where: { workerId: dto.workerId, jobId: dto.jobId, checkOutTime: null },
    });
    if (existing) throw new BadRequestException('Worker already checked in for this job');

    const record = await this.prisma.attendanceRecord.create({
      data: {
        workerId: dto.workerId,
        jobId: dto.jobId,
        siteId: dto.siteId,
        contractorId: contractor.id,
        checkInTime: new Date(),
        checkInLat: dto.checkInLat ?? null,
        checkInLon: dto.checkInLon ?? null,
        method: dto.method ?? 'MANUAL',
        geoFenceValid: true,
        notes: dto.notes ?? null,
      },
      include: {
        worker: { select: { id: true, user: { select: { firstName: true, lastName: true } } } },
        site: { select: { id: true, name: true } },
        job: { select: { id: true, title: true } },
      },
    });

    this.logger.log(`Check-in marked: worker ${dto.workerId} job ${dto.jobId}`);
    return record;
  }

  // ── MARK CHECK-OUT ────────────────────────────────────────────────
  async markCheckOut(userId: string, recordId: string, dto: CheckOutDto) {
    const contractor = await this.getContractorOrFail(userId);

    const record = await this.prisma.attendanceRecord.findUnique({ where: { id: recordId } });
    if (!record) throw new NotFoundException('Attendance record not found');
    if (record.contractorId !== contractor.id) throw new ForbiddenException('Access denied');
    if (record.checkOutTime) throw new BadRequestException('Already checked out');

    const checkOut = new Date();
    const diffMs = checkOut.getTime() - record.checkInTime.getTime();
    const totalHours = parseFloat((diffMs / 3_600_000).toFixed(2));

    const updated = await this.prisma.attendanceRecord.update({
      where: { id: recordId },
      data: {
        checkOutTime: checkOut,
        checkOutLat: dto.checkOutLat ?? null,
        checkOutLon: dto.checkOutLon ?? null,
        totalHours,
        notes: dto.notes ?? record.notes,
      },
      include: {
        worker: { select: { id: true, user: { select: { firstName: true, lastName: true } } } },
        site: { select: { id: true, name: true } },
        job: { select: { id: true, title: true } },
      },
    });

    return updated;
  }

  // ── LIST CONTRACTOR ATTENDANCE ────────────────────────────────────
  async findContractorAttendance(userId: string, filters: AttendanceFilterDto) {
    const contractor = await this.getContractorOrFail(userId);
    const { page = 1, limit = 20, siteId, jobId, workerId, dateFrom, dateTo, search } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.AttendanceRecordWhereInput = {
      contractorId: contractor.id,
    };

    if (siteId) where.siteId = siteId;
    if (jobId) where.jobId = jobId;
    if (workerId) where.workerId = workerId;

    if (dateFrom || dateTo) {
      where.checkInTime = {};
      if (dateFrom) (where.checkInTime as Prisma.DateTimeFilter).gte = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        (where.checkInTime as Prisma.DateTimeFilter).lte = end;
      }
    }

    if (search) {
      where.worker = {
        user: {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ],
        },
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.attendanceRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: { checkInTime: 'desc' },
        include: {
          worker: {
            select: {
              id: true,
              user: { select: { firstName: true, lastName: true, avatar: true } },
              city: true,
            },
          },
          site: { select: { id: true, name: true, city: true } },
          job: { select: { id: true, title: true } },
        },
      }),
      this.prisma.attendanceRecord.count({ where }),
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

  // ── TODAY SUMMARY ─────────────────────────────────────────────────
  async getTodaySummary(userId: string) {
    const contractor = await this.getContractorOrFail(userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [checkedIn, totalActive, recentCheckIns] = await Promise.all([
      this.prisma.attendanceRecord.count({
        where: { contractorId: contractor.id, checkInTime: { gte: today, lt: tomorrow } },
      }),
      this.prisma.hireRecord.count({ where: { contractorId: contractor.id, isActive: true } }),
      this.prisma.attendanceRecord.findMany({
        where: { contractorId: contractor.id, checkInTime: { gte: today, lt: tomorrow } },
        take: 10,
        orderBy: { checkInTime: 'desc' },
        include: {
          worker: {
            select: {
              id: true,
              user: { select: { firstName: true, lastName: true, avatar: true } },
            },
          },
          site: { select: { id: true, name: true } },
          job: { select: { id: true, title: true } },
        },
      }),
    ]);

    return {
      checkedIn,
      totalActive,
      absentToday: Math.max(0, totalActive - checkedIn),
      attendanceRate: totalActive > 0 ? Math.round((checkedIn / totalActive) * 100) : 0,
      recentCheckIns,
    };
  }

  // ── WEEKLY STATS ──────────────────────────────────────────────────
  async getWeeklyStats(userId: string) {
    const contractor = await this.getContractorOrFail(userId);

    const days: { date: string; count: number; hours: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);

      const agg = await this.prisma.attendanceRecord.aggregate({
        where: { contractorId: contractor.id, checkInTime: { gte: d, lt: next } },
        _count: { id: true },
        _sum: { totalHours: true },
      });

      days.push({
        date: d.toISOString().split('T')[0],
        count: agg._count.id,
        hours: Number(agg._sum.totalHours ?? 0),
      });
    }

    return { days };
  }

  // ── SINGLE RECORD ─────────────────────────────────────────────────
  async findOne(userId: string, recordId: string) {
    const contractor = await this.getContractorOrFail(userId);
    const record = await this.prisma.attendanceRecord.findUnique({
      where: { id: recordId },
      include: {
        worker: {
          select: {
            id: true,
            user: { select: { firstName: true, lastName: true, avatar: true, phone: true } },
            city: true, rating: true,
          },
        },
        site: { select: { id: true, name: true, city: true, address: true } },
        job: { select: { id: true, title: true, dailyWage: true } },
      },
    });
    if (!record) throw new NotFoundException('Attendance record not found');
    if (record.contractorId !== contractor.id) throw new ForbiddenException('Access denied');
    return record;
  }
}
