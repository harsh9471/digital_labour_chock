import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/report.dto';
import { AdminReportType, Prisma } from '@prisma/client';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateReport(dto: CreateReportDto, createdBy: string) {
    const data = await this.collectReportData(dto.type, dto.periodStart, dto.periodEnd);

    const report = await this.prisma.adminReport.create({
      data: {
        title: dto.title,
        type: dto.type,
        data: data as Prisma.InputJsonValue | undefined,
        periodStart: dto.periodStart,
        periodEnd: dto.periodEnd,
        createdBy,
        isScheduled: dto.isScheduled ?? false,
        schedule: dto.schedule,
      },
    });

    this.logger.log(`Report generated: ${report.id} (${dto.type}) by ${createdBy}`);
    return report;
  }

  private async collectReportData(
    type: AdminReportType,
    periodStart?: Date,
    periodEnd?: Date,
  ): Promise<Record<string, unknown>> {
    const dateFilter = periodStart && periodEnd
      ? { gte: periodStart, lte: periodEnd }
      : undefined;

    switch (type) {
      case 'PLATFORM_OVERVIEW':
        return this.getPlatformOverviewData();
      case 'REVENUE_REPORT':
        return this.getRevenueData(dateFilter);
      case 'HIRING_ANALYTICS':
        return this.getHiringData(dateFilter);
      case 'WORKFORCE_ANALYTICS':
        return this.getWorkforceData();
      case 'ATTENDANCE_ANALYTICS':
        return this.getAttendanceData(dateFilter);
      case 'COMPLIANCE_REPORT':
        return this.getComplianceData();
      case 'USER_ACTIVITY':
        return this.getUserActivityData(dateFilter);
      default:
        return {};
    }
  }

  private async getPlatformOverviewData() {
    const [
      totalUsers, workers, contractors, companies,
      totalJobs, applications, hired,
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.worker.count({ where: { deletedAt: null } }),
      this.prisma.contractor.count({ where: { deletedAt: null } }),
      this.prisma.company.count({ where: { deletedAt: null } }),
      this.prisma.job.count({ where: { deletedAt: null } }),
      this.prisma.jobApplication.count(),
      this.prisma.jobApplication.count({ where: { status: 'HIRED' } }),
    ]);
    return { totalUsers, workers, contractors, companies, totalJobs, applications, hired };
  }

  private async getRevenueData(dateFilter?: { gte: Date; lte: Date }) {
    const where = dateFilter ? { processedAt: dateFilter, status: 'COMPLETED' as const } : { status: 'COMPLETED' as const };

    const [total, byMonth] = await Promise.all([
      this.prisma.payrollBatch.aggregate({
        where, _sum: { totalAmount: true },
      }),
      this.prisma.payrollBatch.groupBy({
        by: ['status'],
        where,
        _sum: { totalAmount: true },
        _count: { id: true },
      }),
    ]);

    return {
      totalRevenue: Number(total._sum.totalAmount ?? 0),
      breakdown: byMonth,
    };
  }

  private async getHiringData(dateFilter?: { gte: Date; lte: Date }) {
    const appliedFilter = dateFilter ? { appliedAt: dateFilter } : {};

    const [total, byStatus, byJobType] = await Promise.all([
      this.prisma.jobApplication.count({ where: appliedFilter }),
      this.prisma.jobApplication.groupBy({
        by: ['status'], where: appliedFilter,
        _count: { id: true },
      }),
      this.prisma.job.groupBy({
        by: ['jobType'],
        where: { deletedAt: null },
        _count: { id: true },
      }),
    ]);

    const conversionRate = total > 0
      ? Math.round(
        ((byStatus.find((s) => s.status === 'HIRED')?._count.id ?? 0) / total) * 100,
      )
      : 0;

    return {
      total,
      byStatus: byStatus.map((r) => ({ status: r.status, count: r._count.id })),
      byJobType: byJobType.map((r) => ({ type: r.jobType, count: r._count.id })),
      conversionRate,
    };
  }

  private async getWorkforceData() {
    const [totalActive, topSkills, cityDistribution] = await Promise.all([
      this.prisma.hireRecord.count({ where: { isActive: true } }),
      this.prisma.workerSkill.groupBy({
        by: ['skillId'],
        _count: { workerId: true },
        orderBy: { _count: { workerId: 'desc' } },
        take: 10,
      }),
      this.prisma.worker.groupBy({
        by: ['city'],
        where: { deletedAt: null, city: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
    ]);

    const skillIds = topSkills.map((s) => s.skillId);
    const skills = await this.prisma.skill.findMany({
      where: { id: { in: skillIds } },
      select: { id: true, name: true },
    });

    return {
      activeWorkers: totalActive,
      topSkills: topSkills.map((s) => ({
        skill: skills.find((sk) => sk.id === s.skillId)?.name ?? s.skillId,
        count: s._count.workerId,
      })),
      cityDistribution: cityDistribution.map((c) => ({
        city: c.city,
        count: c._count.id,
      })),
    };
  }

  private async getAttendanceData(dateFilter?: { gte: Date; lte: Date }) {
    const where = dateFilter ? { checkInTime: dateFilter } : {};

    const [total, flagged, avgHours] = await Promise.all([
      this.prisma.attendanceRecord.count({ where }),
      this.prisma.attendanceRecord.count({ where: { ...where, isFlagged: true } }),
      this.prisma.attendanceRecord.aggregate({
        where: { ...where, totalHours: { not: null } },
        _avg: { totalHours: true },
      }),
    ]);

    return {
      total, flagged,
      avgHoursPerDay: Number(avgHours._avg.totalHours ?? 0).toFixed(2),
    };
  }

  private async getComplianceData() {
    const byStatus = await this.prisma.complianceRecord.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { id: true },
    });

    const byType = await this.prisma.complianceRecord.groupBy({
      by: ['type'],
      where: { deletedAt: null },
      _count: { id: true },
    });

    return {
      byStatus: byStatus.map((r) => ({ status: r.status, count: r._count.id })),
      byType: byType.map((r) => ({ type: r.type, count: r._count.id })),
    };
  }

  private async getUserActivityData(dateFilter?: { gte: Date; lte: Date }) {
    const where = dateFilter ? { createdAt: dateFilter } : {};

    const [newUsers, newJobs, newApplications] = await Promise.all([
      this.prisma.user.count({ where: { ...where, deletedAt: null } }),
      this.prisma.job.count({ where: { ...where, deletedAt: null } }),
      this.prisma.jobApplication.count({ where }),
    ]);

    const usersByDay = await this.prisma.user.groupBy({
      by: ['createdAt'],
      where: { deletedAt: null, createdAt: dateFilter ?? undefined },
      _count: { id: true },
    });

    return { newUsers, newJobs, newApplications, usersByDay };
  }

  async findAll(page = 1, limit = 20, type?: AdminReportType) {
    const skip = (page - 1) * limit;
    const where = type ? { type } : {};

    const [reports, total] = await Promise.all([
      this.prisma.adminReport.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.adminReport.count({ where }),
    ]);

    return { reports, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const report = await this.prisma.adminReport.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async deleteReport(id: string) {
    await this.findOne(id);
    await this.prisma.adminReport.delete({ where: { id } });
    return { deleted: true };
  }

  // ── QUICK ANALYTICS ENDPOINTS ──────────────────────────────────────

  async getAdminOverview() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const [
      platformOverview,
      revenueData,
      hiringData,
      workforceData,
    ] = await Promise.all([
      this.getPlatformOverviewData(),
      this.getRevenueData({ gte: thirtyDaysAgo, lte: now }),
      this.getHiringData({ gte: thirtyDaysAgo, lte: now }),
      this.getWorkforceData(),
    ]);

    return {
      platform: platformOverview,
      revenue: revenueData,
      hiring: hiringData,
      workforce: workforceData,
      generatedAt: now,
    };
  }

  async getRevenueAnalytics(months = 6) {
    const result: { month: string; revenue: number; batches: number }[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      d.setHours(0, 0, 0, 0);

      const end = new Date(d);
      end.setMonth(d.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);

      const agg = await this.prisma.payrollBatch.aggregate({
        where: { status: 'COMPLETED', processedAt: { gte: d, lte: end } },
        _sum: { totalAmount: true },
        _count: { id: true },
      });

      result.push({
        month: d.toISOString().slice(0, 7),
        revenue: Number(agg._sum.totalAmount ?? 0),
        batches: agg._count.id,
      });
    }

    return { trend: result };
  }

  async getWorkforceAnalytics() {
    const [
      totalWorkers, availableWorkers,
      avgRating, activeHires,
      skillDistribution,
    ] = await Promise.all([
      this.prisma.worker.count({ where: { deletedAt: null } }),
      this.prisma.worker.count({ where: { availableForWork: true, deletedAt: null } }),
      this.prisma.worker.aggregate({
        where: { deletedAt: null, rating: { not: null } },
        _avg: { rating: true },
      }),
      this.prisma.hireRecord.count({ where: { isActive: true } }),
      this.prisma.workerSkill.groupBy({
        by: ['skillId'],
        _count: { workerId: true },
        orderBy: { _count: { workerId: 'desc' } },
        take: 8,
      }),
    ]);

    const skillIds = skillDistribution.map((s) => s.skillId);
    const skills = await this.prisma.skill.findMany({
      where: { id: { in: skillIds } },
      select: { id: true, name: true, category: true },
    });

    return {
      total: totalWorkers,
      available: availableWorkers,
      utilization: totalWorkers > 0
        ? Math.round((activeHires / totalWorkers) * 100)
        : 0,
      avgRating: Number(avgRating._avg.rating ?? 0).toFixed(2),
      activeHires,
      skillDistribution: skillDistribution.map((s) => ({
        skill: skills.find((sk) => sk.id === s.skillId)?.name ?? s.skillId,
        category: skills.find((sk) => sk.id === s.skillId)?.category,
        count: s._count.workerId,
      })),
    };
  }

  async getHiringAnalytics(days = 30) {
    const result: { date: string; applications: number; hired: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);

      const [applications, hired] = await Promise.all([
        this.prisma.jobApplication.count({
          where: { appliedAt: { gte: d, lt: next } },
        }),
        this.prisma.jobApplication.count({
          where: { status: 'HIRED', hiredAt: { gte: d, lt: next } },
        }),
      ]);

      result.push({ date: d.toISOString().split('T')[0], applications, hired });
    }

    return { trend: result };
  }
}
