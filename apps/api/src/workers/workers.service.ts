import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma, SkillLevel } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import {
  AddWorkerSkillDto,
  UpdateWorkerProfileDto,
  WorkerFilterDto,
  AddWorkerExperienceDto,
  UpdateWorkerExperienceDto,
  RateWorkerDto,
} from './dto/worker.dto';

@Injectable()
export class WorkersService {
  private readonly logger = new Logger(WorkersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  // ============================================================
  // GET OWN PROFILE
  // ============================================================
  async getMyProfile(userId: string) {
    const worker = await this.prisma.worker.findUnique({
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
        location: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!worker) {
      throw new NotFoundException('Worker profile not found');
    }

    return worker;
  }

  // ============================================================
  // UPDATE OWN PROFILE
  // ============================================================
  async updateMyProfile(userId: string, dto: UpdateWorkerProfileDto) {
    const worker = await this.prisma.worker.findUnique({
      where: { userId, deletedAt: null },
    });

    if (!worker) {
      throw new NotFoundException('Worker profile not found');
    }

    const isProfileComplete = this.checkProfileComplete(worker, dto);

    const updated = await this.prisma.worker.update({
      where: { id: worker.id },
      data: {
        bio: dto.bio,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        gender: dto.gender,
        languages: dto.languages ?? undefined,
        availableForWork: dto.availableForWork,
        hourlyRate: dto.hourlyRate != null ? dto.hourlyRate : undefined,
        dailyRate: dto.dailyRate != null ? dto.dailyRate : undefined,
        weeklyRate: dto.weeklyRate != null ? dto.weeklyRate : undefined,
        experienceYears: dto.experienceYears,
        city: dto.city,
        state: dto.state,
        pincode: dto.pincode,
        upiId: dto.upiId,
        bankAccountNumber: dto.bankAccountNumber,
        bankIfsc: dto.bankIfsc,
        fcmToken: dto.fcmToken,
        isProfileComplete,
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
        location: true,
        skills: { include: { skill: true } },
      },
    });

    this.logger.log(`Worker profile updated: ${worker.id}`);
    return updated;
  }

  // ============================================================
  // ADD SKILL
  // ============================================================
  async addSkill(userId: string, dto: AddWorkerSkillDto) {
    const worker = await this.prisma.worker.findUnique({
      where: { userId, deletedAt: null },
    });

    if (!worker) throw new NotFoundException('Worker profile not found');

    const skill = await this.prisma.skill.findUnique({ where: { id: dto.skillId } });
    if (!skill) throw new NotFoundException('Skill not found');

    const existing = await this.prisma.workerSkill.findUnique({
      where: { workerId_skillId: { workerId: worker.id, skillId: dto.skillId } },
    });

    if (existing) {
      throw new ConflictException('This skill is already added to your profile');
    }

    return this.prisma.workerSkill.create({
      data: {
        workerId: worker.id,
        skillId: dto.skillId,
        level: dto.level,
        yearsOfExperience: dto.yearsOfExperience ?? 0,
      },
      include: { skill: true },
    });
  }

  // ============================================================
  // UPDATE SKILL
  // ============================================================
  async updateSkill(userId: string, skillId: string, level: SkillLevel, yearsOfExperience?: number) {
    const worker = await this.prisma.worker.findUnique({ where: { userId, deletedAt: null } });
    if (!worker) throw new NotFoundException('Worker profile not found');

    const workerSkill = await this.prisma.workerSkill.findUnique({
      where: { workerId_skillId: { workerId: worker.id, skillId } },
    });

    if (!workerSkill) throw new NotFoundException('Skill not found in profile');

    return this.prisma.workerSkill.update({
      where: { id: workerSkill.id },
      data: { level, yearsOfExperience },
      include: { skill: true },
    });
  }

  // ============================================================
  // REMOVE SKILL
  // ============================================================
  async removeSkill(userId: string, skillId: string) {
    const worker = await this.prisma.worker.findUnique({ where: { userId, deletedAt: null } });
    if (!worker) throw new NotFoundException('Worker profile not found');

    const workerSkill = await this.prisma.workerSkill.findUnique({
      where: { workerId_skillId: { workerId: worker.id, skillId } },
    });

    if (!workerSkill) throw new NotFoundException('Skill not found in profile');

    await this.prisma.workerSkill.delete({ where: { id: workerSkill.id } });
    return { message: 'Skill removed from profile' };
  }

  // ============================================================
  // DISCOVERY - LIST WORKERS (for contractors)
  // ============================================================
  async findAll(filters: WorkerFilterDto) {
    const {
      page = 1, limit = 20, city, state, skillSlug, skillCategory,
      available, minRating, minExperience, maxDailyRate, search,
      sortBy = 'createdAt', sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.WorkerWhereInput = { deletedAt: null };

    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (state) where.state = { contains: state, mode: 'insensitive' };
    if (typeof available === 'boolean') where.availableForWork = available;
    if (minRating) where.rating = { gte: minRating };
    if (minExperience) where.experienceYears = { gte: minExperience };
    if (maxDailyRate) where.dailyRate = { lte: maxDailyRate };
    if (skillSlug) where.skills = { some: { skill: { slug: skillSlug } } };
    if (skillCategory) where.skills = { some: { skill: { category: skillCategory } } };

    if (search) {
      where.user = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const validSortFields: Record<string, boolean> = {
      createdAt: true, rating: true, experienceYears: true, totalJobsDone: true,
    };

    const orderByField = validSortFields[sortBy] ? sortBy : 'createdAt';

    const [workers, total] = await Promise.all([
      this.prisma.worker.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderByField]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              status: true,
            },
          },
          skills: {
            include: { skill: { select: { id: true, name: true, slug: true, icon: true, category: true } } },
            take: 5,
          },
        },
      }),
      this.prisma.worker.count({ where }),
    ]);

    // Mask phone in list — expose only profile data
    const sanitized = workers.map((w) => ({
      ...w,
      bankAccountNumber: undefined,
      bankIfsc: undefined,
      aadhaarLastFour: undefined,
      upiId: undefined,
      fcmToken: undefined,
    }));

    return {
      data: sanitized,
      meta: {
        total, page, limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  // ============================================================
  // GET SINGLE WORKER (public profile)
  // ============================================================
  async findById(workerId: string) {
    const worker = await this.prisma.worker.findUnique({
      where: { id: workerId, deletedAt: null },
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
        location: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!worker) throw new NotFoundException('Worker not found');

    // Increment profile views
    this.prisma.worker
      .update({ where: { id: workerId }, data: { profileViews: { increment: 1 } } })
      .catch(() => {});

    // Mask sensitive fields
    return {
      ...worker,
      bankAccountNumber: undefined,
      bankIfsc: undefined,
      aadhaarLastFour: undefined,
      upiId: undefined,
      fcmToken: undefined,
    };
  }

  // ============================================================
  // GET ALL SKILLS
  // ============================================================
  async getSkills(category?: string) {
    const where: Prisma.SkillWhereInput = { isActive: true };
    if (category) where.category = category;

    return this.prisma.skill.findMany({
      where,
      orderBy: { category: 'asc' },
    });
  }

  // ============================================================
  // AVAILABILITY TOGGLE
  // ============================================================
  async toggleAvailability(userId: string) {
    const worker = await this.prisma.worker.findUnique({ where: { userId, deletedAt: null } });
    if (!worker) throw new NotFoundException('Worker profile not found');

    return this.prisma.worker.update({
      where: { id: worker.id },
      data: { availableForWork: !worker.availableForWork },
      select: { id: true, availableForWork: true, updatedAt: true },
    });
  }

  // ============================================================
  // EXPERIENCE – CRUD
  // ============================================================
  async addExperience(userId: string, dto: AddWorkerExperienceDto) {
    const worker = await this.prisma.worker.findUnique({ where: { userId, deletedAt: null } });
    if (!worker) throw new NotFoundException('Worker profile not found');

    return this.prisma.workerExperience.create({
      data: {
        workerId: worker.id,
        title: dto.title,
        company: dto.company,
        city: dto.city,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        isCurrent: dto.isCurrent ?? false,
      },
    });
  }

  async updateExperience(userId: string, experienceId: string, dto: UpdateWorkerExperienceDto) {
    const worker = await this.prisma.worker.findUnique({ where: { userId, deletedAt: null } });
    if (!worker) throw new NotFoundException('Worker profile not found');

    const exp = await this.prisma.workerExperience.findFirst({
      where: { id: experienceId, workerId: worker.id },
    });
    if (!exp) throw new NotFoundException('Experience not found');

    return this.prisma.workerExperience.update({
      where: { id: experienceId },
      data: {
        title: dto.title,
        company: dto.company,
        city: dto.city,
        description: dto.description,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        isCurrent: dto.isCurrent,
      },
    });
  }

  async deleteExperience(userId: string, experienceId: string) {
    const worker = await this.prisma.worker.findUnique({ where: { userId, deletedAt: null } });
    if (!worker) throw new NotFoundException('Worker profile not found');

    const exp = await this.prisma.workerExperience.findFirst({
      where: { id: experienceId, workerId: worker.id },
    });
    if (!exp) throw new NotFoundException('Experience not found');

    await this.prisma.workerExperience.delete({ where: { id: experienceId } });
    return { message: 'Experience deleted' };
  }

  // ============================================================
  // RATINGS
  // ============================================================
  async rateWorker(contractorUserId: string, dto: RateWorkerDto) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { userId: contractorUserId, deletedAt: null },
    });
    if (!contractor) throw new NotFoundException('Contractor profile not found');

    const worker = await this.prisma.worker.findUnique({
      where: { id: dto.workerId, deletedAt: null },
    });
    if (!worker) throw new NotFoundException('Worker not found');

    const hireRecord = await this.prisma.hireRecord.findFirst({
      where: { workerId: dto.workerId, contractorId: contractor.id, jobId: dto.jobId },
    });
    if (!hireRecord) {
      throw new UnprocessableEntityException('You can only rate workers you have hired for a job');
    }

    const existing = await this.prisma.workerRating.findUnique({
      where: { workerId_jobId: { workerId: dto.workerId, jobId: dto.jobId } },
    });
    if (existing) throw new ConflictException('You have already rated this worker for this job');

    const rating = await this.prisma.workerRating.create({
      data: {
        workerId: dto.workerId,
        contractorId: contractor.id,
        jobId: dto.jobId,
        rating: dto.rating,
        review: dto.review,
      },
    });

    // Update worker aggregate rating
    const agg = await this.prisma.workerRating.aggregate({
      where: { workerId: dto.workerId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await this.prisma.worker.update({
      where: { id: dto.workerId },
      data: {
        rating: agg._avg.rating ?? dto.rating,
        totalRatings: agg._count.rating,
      },
    });

    return rating;
  }

  async getWorkerRatings(workerId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [ratings, total] = await Promise.all([
      this.prisma.workerRating.findMany({
        where: { workerId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          contractor: {
            select: { user: { select: { firstName: true, lastName: true, avatar: true } } },
          },
        },
      }),
      this.prisma.workerRating.count({ where: { workerId } }),
    ]);
    return {
      data: ratings,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ============================================================
  // SAVED JOBS
  // ============================================================
  async saveJob(userId: string, jobId: string) {
    const worker = await this.prisma.worker.findUnique({ where: { userId, deletedAt: null } });
    if (!worker) throw new NotFoundException('Worker profile not found');

    const job = await this.prisma.job.findUnique({ where: { id: jobId, deletedAt: null } });
    if (!job) throw new NotFoundException('Job not found');

    const existing = await this.prisma.savedJob.findUnique({
      where: { workerId_jobId: { workerId: worker.id, jobId } },
    });
    if (existing) throw new ConflictException('Job already saved');

    await this.prisma.savedJob.create({ data: { workerId: worker.id, jobId } });
    return { message: 'Job saved' };
  }

  async unsaveJob(userId: string, jobId: string) {
    const worker = await this.prisma.worker.findUnique({ where: { userId, deletedAt: null } });
    if (!worker) throw new NotFoundException('Worker profile not found');

    await this.prisma.savedJob.deleteMany({ where: { workerId: worker.id, jobId } });
    return { message: 'Job removed from saved' };
  }

  async getSavedJobs(userId: string, page = 1, limit = 20) {
    const worker = await this.prisma.worker.findUnique({ where: { userId, deletedAt: null } });
    if (!worker) throw new NotFoundException('Worker profile not found');

    const skip = (page - 1) * limit;
    const [saved, total] = await Promise.all([
      this.prisma.savedJob.findMany({
        where: { workerId: worker.id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          job: {
            include: {
              contractor: {
                select: { user: { select: { firstName: true, lastName: true, avatar: true } } },
              },
              site: { select: { id: true, name: true, city: true } },
              requiredSkill: { select: { id: true, name: true, icon: true } },
              _count: { select: { applications: true } },
            },
          },
        },
      }),
      this.prisma.savedJob.count({ where: { workerId: worker.id } }),
    ]);
    return {
      data: saved,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ============================================================
  // WORKER STATS (dashboard summary)
  // ============================================================
  async getWorkerStats(userId: string) {
    const cacheKey = `worker_stats:${userId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const worker = await this.prisma.worker.findUnique({ where: { userId, deletedAt: null } });
    if (!worker) throw new NotFoundException('Worker profile not found');

    const [
      totalApplications,
      activeApplications,
      hiredCount,
      savedCount,
      totalEarnings,
    ] = await Promise.all([
      this.prisma.jobApplication.count({ where: { workerId: worker.id } }),
      this.prisma.jobApplication.count({ where: { workerId: worker.id, status: { in: ['SUBMITTED', 'VIEWED', 'SHORTLISTED'] } } }),
      this.prisma.jobApplication.count({ where: { workerId: worker.id, status: 'HIRED' } }),
      this.prisma.savedJob.count({ where: { workerId: worker.id } }),
      this.prisma.payrollRecord.aggregate({
        where: { workerId: worker.id, paymentStatus: 'PAID' },
        _sum: { netAmount: true },
      }),
    ]);

    const stats = {
      totalApplications,
      activeApplications,
      hiredCount,
      savedCount,
      totalEarnings: totalEarnings._sum.netAmount ?? 0,
      rating: worker.rating,
      totalRatings: worker.totalRatings,
      totalJobsDone: worker.totalJobsDone,
      profileViews: worker.profileViews,
      isProfileComplete: worker.isProfileComplete,
    };

    await this.redis.set(cacheKey, JSON.stringify(stats), 300); // 5 min TTL
    return stats;
  }

  // ============================================================
  // HELPERS
  // ============================================================
  private checkProfileComplete(
    worker: { city?: string | null; dailyRate?: unknown; experienceYears?: number; bio?: string | null },
    dto: UpdateWorkerProfileDto,
  ): boolean {
    const city = dto.city ?? worker.city;
    const dailyRate = dto.dailyRate ?? worker.dailyRate;
    const experienceYears = dto.experienceYears ?? worker.experienceYears;
    const bio = dto.bio ?? worker.bio;

    return !!(city && dailyRate && experienceYears != null && bio);
  }

  async updateKycStatus(workerId: string, kycStatus: string) {
    const worker = await this.prisma.worker.findUnique({ where: { id: workerId } });
    if (!worker) throw new NotFoundException('Worker not found');
    return this.prisma.worker.update({
      where: { id: workerId },
      data: { kycStatus },
      select: { id: true, kycStatus: true, updatedAt: true },
    });
  }
}
