import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async getContractorOrFail(userId: string) {
    const c = await this.prisma.contractor.findUnique({
      where: { userId, deletedAt: null }, select: { id: true },
    });
    if (!c) throw new NotFoundException('Contractor profile not found');
    return c;
  }

  private async getCompanyOrFail(userId: string) {
    const admin = await this.prisma.companyAdmin.findUnique({
      where: { userId }, select: { companyId: true },
    });
    if (!admin) throw new NotFoundException('Company admin profile not found');
    return admin;
  }

  // ── CONTRACTOR OVERVIEW ───────────────────────────────────────────
  async getContractorOverview(userId: string) {
    const contractor = await this.getContractorOrFail(userId);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

    const [
      totalSites,
      activeSites,
      totalJobs,
      activeJobs,
      totalWorkers,
      todayAttendance,
      pendingApplications,
      monthPayroll,
      lastMonthPayroll,
      totalProjects,
      activeProjects,
      complianceIssues,
    ] = await Promise.all([
      this.prisma.site.count({ where: { contractorId: contractor.id, deletedAt: null } }),
      this.prisma.site.count({ where: { contractorId: contractor.id, isActive: true, deletedAt: null } }),
      this.prisma.job.count({ where: { contractorId: contractor.id, deletedAt: null } }),
      this.prisma.job.count({ where: { contractorId: contractor.id, status: { in: ['PUBLISHED', 'ACTIVE'] }, deletedAt: null } }),
      this.prisma.hireRecord.count({ where: { contractorId: contractor.id, isActive: true } }),
      this.prisma.attendanceRecord.count({
        where: { contractorId: contractor.id, checkInTime: { gte: today, lt: tomorrow } },
      }),
      this.prisma.jobApplication.count({
        where: { job: { contractorId: contractor.id }, status: 'SUBMITTED' },
      }),
      this.prisma.payrollBatch.aggregate({
        where: { contractorId: contractor.id, status: 'COMPLETED', processedAt: { gte: startOfMonth } },
        _sum: { totalAmount: true },
      }),
      this.prisma.payrollBatch.aggregate({
        where: {
          contractorId: contractor.id,
          status: 'COMPLETED',
          processedAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.project.count({ where: { contractorId: contractor.id, deletedAt: null } }),
      this.prisma.project.count({ where: { contractorId: contractor.id, status: 'ACTIVE', deletedAt: null } }),
      this.prisma.complianceRecord.count({
        where: { contractorId: contractor.id, status: { in: ['PENDING', 'OVERDUE'] }, deletedAt: null },
      }),
    ]);

    const monthPayrollTotal = Number(monthPayroll._sum.totalAmount ?? 0);
    const lastMonthPayrollTotal = Number(lastMonthPayroll._sum.totalAmount ?? 0);
    const payrollChange = lastMonthPayrollTotal > 0
      ? Math.round(((monthPayrollTotal - lastMonthPayrollTotal) / lastMonthPayrollTotal) * 100)
      : 0;

    return {
      sites: { total: totalSites, active: activeSites },
      jobs: { total: totalJobs, active: activeJobs },
      workers: { total: totalWorkers, todayPresent: todayAttendance },
      applications: { pending: pendingApplications },
      payroll: {
        thisMonth: monthPayrollTotal,
        lastMonth: lastMonthPayrollTotal,
        changePercent: payrollChange,
      },
      projects: { total: totalProjects, active: activeProjects },
      compliance: { issues: complianceIssues },
    };
  }

  // ── ATTENDANCE TREND (30 days) ────────────────────────────────────
  async getAttendanceTrend(userId: string, days: number = 30) {
    const contractor = await this.getContractorOrFail(userId);
    const result: { date: string; present: number; totalHours: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
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

      result.push({
        date: d.toISOString().split('T')[0],
        present: agg._count.id,
        totalHours: Number(agg._sum.totalHours ?? 0),
      });
    }

    return { trend: result };
  }

  // ── TOP WORKERS ───────────────────────────────────────────────────
  async getTopWorkers(userId: string, limit: number = 10) {
    const contractor = await this.getContractorOrFail(userId);

    const workers = await this.prisma.hireRecord.groupBy({
      by: ['workerId'],
      where: { contractorId: contractor.id },
      _count: { workerId: true },
    });

    const workerIds = workers.slice(0, limit).map((w) => w.workerId);
    const profiles = await this.prisma.worker.findMany({
      where: { id: { in: workerIds } },
      select: {
        id: true,
        user: { select: { firstName: true, lastName: true, avatar: true } },
        rating: true, totalJobsDone: true, city: true,
        skills: { take: 2, include: { skill: { select: { name: true } } } },
      },
    });

    return {
      workers: profiles.map((w) => ({
        ...w,
        jobCount: workers.find((r) => r.workerId === w.id)?._count.workerId ?? 0,
      })),
    };
  }

  // ── HIRING PIPELINE ───────────────────────────────────────────────
  async getHiringPipeline(userId: string) {
    const contractor = await this.getContractorOrFail(userId);

    const [submitted, shortlisted, hired, rejected] = await Promise.all([
      this.prisma.jobApplication.count({
        where: { job: { contractorId: contractor.id }, status: 'SUBMITTED' },
      }),
      this.prisma.jobApplication.count({
        where: { job: { contractorId: contractor.id }, status: 'SHORTLISTED' },
      }),
      this.prisma.jobApplication.count({
        where: { job: { contractorId: contractor.id }, status: 'HIRED' },
      }),
      this.prisma.jobApplication.count({
        where: { job: { contractorId: contractor.id }, status: 'REJECTED' },
      }),
    ]);

    const total = submitted + shortlisted + hired + rejected;
    return {
      pipeline: [
        { stage: 'Applied', count: submitted, color: '#3B82F6' },
        { stage: 'Shortlisted', count: shortlisted, color: '#F59E0B' },
        { stage: 'Hired', count: hired, color: '#22C55E' },
        { stage: 'Rejected', count: rejected, color: '#EF4444' },
      ],
      total,
      conversionRate: total > 0 ? Math.round((hired / total) * 100) : 0,
    };
  }

  // ── SKILL DISTRIBUTION ────────────────────────────────────────────
  async getSkillDistribution(userId: string) {
    const contractor = await this.getContractorOrFail(userId);

    const jobs = await this.prisma.job.groupBy({
      by: ['skillCategory'],
      where: { contractorId: contractor.id, skillCategory: { not: null }, deletedAt: null },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    return {
      distribution: jobs.map((j) => ({
        category: j.skillCategory,
        count: j._count.id,
      })),
    };
  }

  // ── COMPANY OVERVIEW ──────────────────────────────────────────────
  async getCompanyOverview(userId: string) {
    const admin = await this.getCompanyOrFail(userId);
    const { companyId } = admin;

    const [
      totalContractors,
      totalProjects,
      activeProjects,
      complianceIssues,
    ] = await Promise.all([
      this.prisma.contractor.count({ where: { companyId, deletedAt: null } }),
      this.prisma.project.count({ where: { companyId, deletedAt: null } }),
      this.prisma.project.count({ where: { companyId, status: 'ACTIVE', deletedAt: null } }),
      this.prisma.complianceRecord.count({
        where: { companyId, status: { in: ['PENDING', 'OVERDUE'] }, deletedAt: null },
      }),
    ]);

    // total workers across all company projects
    const assignments = await this.prisma.workforceAssignment.count({
      where: { project: { companyId }, isActive: true },
    });

    const projectsByStatus = await this.prisma.project.groupBy({
      by: ['status'],
      where: { companyId, deletedAt: null },
      _count: { id: true },
    });

    return {
      contractors: totalContractors,
      projects: { total: totalProjects, active: activeProjects },
      workers: assignments,
      compliance: { issues: complianceIssues },
      projectsByStatus: projectsByStatus.map((p) => ({
        status: p.status,
        count: p._count.id,
      })),
    };
  }

  // ── COMPANY CONTRACTOR PERFORMANCE ────────────────────────────────
  async getContractorPerformance(userId: string) {
    const admin = await this.getCompanyOrFail(userId);

    const contractors = await this.prisma.contractor.findMany({
      where: { companyId: admin.companyId, deletedAt: null },
      select: {
        id: true,
        rating: true,
        totalProjectsDone: true,
        user: { select: { firstName: true, lastName: true, avatar: true } },
        _count: { select: { projects: true, sites: true, jobs: true } },
      },
    });

    return { contractors };
  }
}
