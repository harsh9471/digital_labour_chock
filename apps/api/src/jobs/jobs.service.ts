import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApplicationStatus, JobStatus, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import {
  ApplyToJobDto,
  CreateJobDto,
  JobFilterDto,
  UpdateApplicationDto,
  UpdateJobDto,
} from './dto/job.dto';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ============================================================
  // CREATE JOB
  // ============================================================
  async create(userId: string, dto: CreateJobDto) {
    const contractor = await this.getContractorOrFail(userId);

    if (dto.siteId) {
      const site = await this.prisma.site.findUnique({ where: { id: dto.siteId, deletedAt: null } });
      if (!site) throw new NotFoundException('Site not found');
      if (site.contractorId !== contractor.id) throw new ForbiddenException('Site does not belong to you');
    }

    if (dto.requiredSkillId) {
      const skill = await this.prisma.skill.findUnique({ where: { id: dto.requiredSkillId } });
      if (!skill) throw new NotFoundException('Skill not found');
    }

    const job = await this.prisma.job.create({
      data: {
        contractorId: contractor.id,
        siteId: dto.siteId,
        title: dto.title,
        description: dto.description,
        requiredSkillId: dto.requiredSkillId,
        skillCategory: dto.skillCategory,
        workerCount: dto.workerCount ?? 1,
        dailyWage: dto.dailyWage != null ? dto.dailyWage : undefined,
        weeklyWage: dto.weeklyWage != null ? dto.weeklyWage : undefined,
        jobType: dto.jobType ?? 'DAILY',
        status: 'DRAFT',
        city: dto.city,
        state: dto.state,
        latitude: dto.latitude != null ? dto.latitude : undefined,
        longitude: dto.longitude != null ? dto.longitude : undefined,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        isUrgent: dto.isUrgent ?? false,
      },
      include: {
        site: { select: { id: true, name: true, city: true } },
        requiredSkill: { select: { id: true, name: true, slug: true, icon: true } },
        contractor: {
          select: {
            id: true,
            user: { select: { firstName: true, lastName: true, avatar: true } },
          },
        },
      },
    });

    this.logger.log(`Job created: ${job.id} by contractor ${contractor.id}`);
    return job;
  }

  // ============================================================
  // LIST PUBLIC JOBS (workers discover)
  // ============================================================
  async findAll(filters: JobFilterDto) {
    const {
      page = 1, limit = 20, status, jobType, city, state,
      skillSlug, skillCategory, search, minWage, maxWage,
      isUrgent, sortBy = 'publishedAt', sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.JobWhereInput = {
      deletedAt: null,
      status: status ?? JobStatus.PUBLISHED,
    };

    if (jobType) where.jobType = jobType;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (state) where.state = { contains: state, mode: 'insensitive' };
    if (isUrgent != null) where.isUrgent = isUrgent;

    if (minWage || maxWage) {
      where.dailyWage = {};
      if (minWage) (where.dailyWage as Record<string, unknown>).gte = minWage;
      if (maxWage) (where.dailyWage as Record<string, unknown>).lte = maxWage;
    }

    if (skillSlug) {
      where.requiredSkill = { slug: skillSlug };
    }

    if (skillCategory) {
      where.skillCategory = { contains: skillCategory, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { skillCategory: { contains: search, mode: 'insensitive' } },
      ];
    }

    const validSortFields: Record<string, boolean> = {
      publishedAt: true, createdAt: true, dailyWage: true, startDate: true,
    };

    const orderByField = validSortFields[sortBy] ? sortBy : 'publishedAt';

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isUrgent: 'desc' }, { [orderByField]: sortOrder }],
        include: {
          contractor: {
            select: {
              id: true,
              user: { select: { firstName: true, lastName: true, avatar: true } },
            },
          },
          site: { select: { id: true, name: true, city: true, latitude: true, longitude: true } },
          requiredSkill: { select: { id: true, name: true, slug: true, icon: true } },
          _count: { select: { applications: true } },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      data: jobs,
      meta: {
        total, page, limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  // ============================================================
  // LIST CONTRACTOR'S OWN JOBS
  // ============================================================
  async findMyJobs(userId: string, filters: JobFilterDto) {
    const contractor = await this.getContractorOrFail(userId);
    const { page = 1, limit = 20, status, search } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.JobWhereInput = {
      contractorId: contractor.id,
      deletedAt: null,
    };

    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          site: { select: { id: true, name: true } },
          requiredSkill: { select: { id: true, name: true, icon: true } },
          _count: { select: { applications: true } },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      data: jobs,
      meta: {
        total, page, limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  // ============================================================
  // GET JOB DETAIL
  // ============================================================
  async findById(jobId: string, userId?: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId, deletedAt: null },
      include: {
        contractor: {
          include: {
            user: { select: { firstName: true, lastName: true, avatar: true } },
          },
        },
        site: true,
        requiredSkill: true,
        _count: { select: { applications: true } },
      },
    });

    if (!job) throw new NotFoundException('Job not found');

    // Increment view count asynchronously
    this.prisma.job
      .update({ where: { id: jobId }, data: { viewCount: { increment: 1 } } })
      .catch(() => {});

    // Check if current user (worker) has already applied
    let myApplication = null;
    if (userId) {
      const worker = await this.prisma.worker.findUnique({ where: { userId } });
      if (worker) {
        myApplication = await this.prisma.jobApplication.findUnique({
          where: { jobId_workerId: { jobId, workerId: worker.id } },
          select: { id: true, status: true, appliedAt: true },
        });
      }
    }

    return { ...job, myApplication };
  }

  // ============================================================
  // UPDATE JOB
  // ============================================================
  async update(jobId: string, userId: string, dto: UpdateJobDto) {
    const contractor = await this.getContractorOrFail(userId);
    const job = await this.getJobAndVerifyOwnership(jobId, contractor.id);

    if (job.status !== 'DRAFT') {
      throw new UnprocessableEntityException('Only DRAFT jobs can be edited. Close the job and create a new one.');
    }

    if (dto.siteId && dto.siteId !== job.siteId) {
      const site = await this.prisma.site.findUnique({ where: { id: dto.siteId, deletedAt: null } });
      if (!site) throw new NotFoundException('Site not found');
      if (site.contractorId !== contractor.id) throw new ForbiddenException('Site does not belong to you');
    }

    return this.prisma.job.update({
      where: { id: jobId },
      data: {
        title: dto.title,
        description: dto.description,
        requiredSkillId: dto.requiredSkillId,
        skillCategory: dto.skillCategory,
        workerCount: dto.workerCount,
        dailyWage: dto.dailyWage != null ? dto.dailyWage : undefined,
        weeklyWage: dto.weeklyWage != null ? dto.weeklyWage : undefined,
        jobType: dto.jobType,
        siteId: dto.siteId,
        city: dto.city,
        state: dto.state,
        latitude: dto.latitude != null ? dto.latitude : undefined,
        longitude: dto.longitude != null ? dto.longitude : undefined,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        isUrgent: dto.isUrgent,
      },
      include: {
        site: { select: { id: true, name: true } },
        requiredSkill: { select: { id: true, name: true, icon: true } },
      },
    });
  }

  // ============================================================
  // PUBLISH JOB
  // ============================================================
  async publish(jobId: string, userId: string) {
    const contractor = await this.getContractorOrFail(userId);
    const job = await this.getJobAndVerifyOwnership(jobId, contractor.id);

    if (job.status !== 'DRAFT') {
      throw new UnprocessableEntityException(`Job is already ${job.status}`);
    }

    const updated = await this.prisma.job.update({
      where: { id: jobId },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
    });

    this.logger.log(`Job published: ${jobId}`);
    return updated;
  }

  // ============================================================
  // CLOSE JOB
  // ============================================================
  async close(jobId: string, userId: string) {
    const contractor = await this.getContractorOrFail(userId);
    const job = await this.getJobAndVerifyOwnership(jobId, contractor.id);

    if (job.status === 'CANCELLED' || job.status === 'CLOSED') {
      throw new UnprocessableEntityException(`Job is already ${job.status}`);
    }

    return this.prisma.job.update({
      where: { id: jobId },
      data: { status: 'CLOSED' },
    });
  }

  // ============================================================
  // SOFT DELETE JOB
  // ============================================================
  async remove(jobId: string, userId: string) {
    const contractor = await this.getContractorOrFail(userId);
    await this.getJobAndVerifyOwnership(jobId, contractor.id);

    const activeHires = await this.prisma.hireRecord.count({
      where: { jobId, isActive: true },
    });

    if (activeHires > 0) {
      throw new UnprocessableEntityException('Cannot delete a job with active hires');
    }

    await this.prisma.job.update({
      where: { id: jobId },
      data: { deletedAt: new Date(), status: 'CANCELLED' },
    });

    return { message: 'Job deleted' };
  }

  // ============================================================
  // APPLY TO JOB
  // ============================================================
  async applyToJob(jobId: string, userId: string, dto: ApplyToJobDto) {
    const worker = await this.getWorkerOrFail(userId);

    const job = await this.prisma.job.findUnique({
      where: { id: jobId, deletedAt: null },
    });

    if (!job) throw new NotFoundException('Job not found');
    if (job.status !== 'PUBLISHED' && job.status !== 'ACTIVE') {
      throw new UnprocessableEntityException('This job is not accepting applications');
    }
    if (job.filledCount >= job.workerCount) {
      throw new UnprocessableEntityException('This job has been fully filled');
    }

    const existing = await this.prisma.jobApplication.findUnique({
      where: { jobId_workerId: { jobId, workerId: worker.id } },
    });

    if (existing) {
      throw new ConflictException('You have already applied to this job');
    }

    const application = await this.prisma.jobApplication.create({
      data: {
        jobId,
        workerId: worker.id,
        coverNote: dto.coverNote,
        status: 'SUBMITTED',
      },
      include: {
        job: { select: { id: true, title: true, city: true, dailyWage: true } },
      },
    });

    this.logger.log(`Worker ${worker.id} applied to job ${jobId}`);
    return application;
  }

  // ============================================================
  // GET APPLICATIONS FOR A JOB (contractor view)
  // ============================================================
  async getJobApplications(
    jobId: string,
    userId: string,
    page: number = 1,
    limit: number = 20,
    status?: ApplicationStatus,
  ) {
    const contractor = await this.getContractorOrFail(userId);
    await this.getJobAndVerifyOwnership(jobId, contractor.id);

    const skip = (page - 1) * limit;
    const where: Prisma.JobApplicationWhereInput = { jobId };
    if (status) where.status = status;

    const [applications, total] = await Promise.all([
      this.prisma.jobApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { appliedAt: 'desc' },
        include: {
          worker: {
            include: {
              user: { select: { firstName: true, lastName: true, avatar: true, phone: true } },
              skills: { include: { skill: { select: { name: true, icon: true } } }, take: 3 },
            },
          },
        },
      }),
      this.prisma.jobApplication.count({ where }),
    ]);

    return {
      data: applications,
      meta: {
        total, page, limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  // ============================================================
  // UPDATE APPLICATION STATUS (contractor action)
  // ============================================================
  async updateApplicationStatus(
    jobId: string,
    applicationId: string,
    userId: string,
    dto: UpdateApplicationDto,
  ) {
    const contractor = await this.getContractorOrFail(userId);
    const job = await this.getJobAndVerifyOwnership(jobId, contractor.id);

    const application = await this.prisma.jobApplication.findFirst({
      where: { id: applicationId, jobId },
      include: { worker: true },
    });

    if (!application) throw new NotFoundException('Application not found');

    if (application.status === 'HIRED' || application.status === 'REJECTED' || application.status === 'WITHDRAWN') {
      throw new UnprocessableEntityException(`Application is already ${application.status}`);
    }

    const now = new Date();
    const updateData: Prisma.JobApplicationUpdateInput = {
      status: dto.status,
      contractorNote: dto.contractorNote,
    };

    if (dto.status === 'HIRED') {
      if (job.filledCount >= job.workerCount) {
        throw new UnprocessableEntityException('No more worker slots available for this job');
      }

      updateData.hiredAt = now;

      // Create hire record
      await this.prisma.hireRecord.create({
        data: {
          applicationId: application.id,
          jobId,
          workerId: application.workerId,
          contractorId: contractor.id,
          siteId: job.siteId,
          agreedDailyWage: job.dailyWage ?? 0,
          startDate: job.startDate ?? now,
          endDate: job.endDate,
          isActive: true,
        },
      });

      // Update filled count
      await this.prisma.job.update({
        where: { id: jobId },
        data: {
          filledCount: { increment: 1 },
          status: job.filledCount + 1 >= job.workerCount ? 'FILLED' : 'ACTIVE',
        },
      });

    } else if (dto.status === 'SHORTLISTED') {
      updateData.shortlistedAt = now;
    } else if (dto.status === 'REJECTED') {
      updateData.rejectedAt = now;
    }

    const updated = await this.prisma.jobApplication.update({
      where: { id: applicationId },
      data: updateData,
      include: {
        worker: {
          include: {
            user: { select: { firstName: true, lastName: true, avatar: true } },
          },
        },
      },
    });

    this.logger.log(`Application ${applicationId} updated to ${dto.status} by contractor ${contractor.id}`);
    return updated;
  }

  // ============================================================
  // WORKER'S OWN APPLICATIONS
  // ============================================================
  async getMyApplications(userId: string, page: number = 1, limit: number = 20, status?: ApplicationStatus) {
    const worker = await this.getWorkerOrFail(userId);
    const skip = (page - 1) * limit;

    const where: Prisma.JobApplicationWhereInput = { workerId: worker.id };
    if (status) where.status = status;

    const [applications, total] = await Promise.all([
      this.prisma.jobApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { appliedAt: 'desc' },
        include: {
          job: {
            include: {
              contractor: {
                select: {
                  user: { select: { firstName: true, lastName: true, avatar: true } },
                },
              },
              site: { select: { id: true, name: true, city: true } },
              requiredSkill: { select: { name: true, icon: true } },
            },
          },
        },
      }),
      this.prisma.jobApplication.count({ where }),
    ]);

    return {
      data: applications,
      meta: {
        total, page, limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  // ============================================================
  // WITHDRAW APPLICATION
  // ============================================================
  async withdrawApplication(applicationId: string, userId: string) {
    const worker = await this.getWorkerOrFail(userId);

    const application = await this.prisma.jobApplication.findFirst({
      where: { id: applicationId, workerId: worker.id },
    });

    if (!application) throw new NotFoundException('Application not found');
    if (application.status === 'HIRED') {
      throw new UnprocessableEntityException('Cannot withdraw a hired application. Contact the contractor.');
    }
    if (application.status === 'WITHDRAWN') {
      throw new UnprocessableEntityException('Application already withdrawn');
    }

    return this.prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status: 'WITHDRAWN', withdrawnAt: new Date() },
    });
  }

  // ============================================================
  // HELPERS
  // ============================================================
  private async getContractorOrFail(userId: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { userId, deletedAt: null },
      select: { id: true },
    });

    if (!contractor) throw new NotFoundException('Contractor profile not found');
    return contractor;
  }

  private async getWorkerOrFail(userId: string) {
    const worker = await this.prisma.worker.findUnique({
      where: { userId, deletedAt: null },
      select: { id: true },
    });

    if (!worker) throw new NotFoundException('Worker profile not found');
    return worker;
  }

  private async getJobAndVerifyOwnership(jobId: string, contractorId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId, deletedAt: null },
    });

    if (!job) throw new NotFoundException('Job not found');
    if (job.contractorId !== contractorId) {
      throw new ForbiddenException('You do not have access to this job');
    }

    return job;
  }
}
