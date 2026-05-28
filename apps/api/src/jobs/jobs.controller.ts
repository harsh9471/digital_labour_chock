import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApplicationStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JobsService } from './jobs.service';
import {
  ApplyToJobDto,
  CreateJobDto,
  JobFilterDto,
  UpdateApplicationDto,
  UpdateJobDto,
} from './dto/job.dto';

@ApiTags('Jobs')
@Controller('jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // ─── Public job discovery ──────────────────────────────────────────────────

  @Get()
  @Public()
  @ApiOperation({ summary: 'Browse published jobs (public)' })
  async findAll(@Query() filters: JobFilterDto, @CurrentUser() user?: JwtPayload) {
    const result = await this.jobsService.findAll(filters);
    return { success: true, ...result, message: 'Jobs retrieved' };
  }

  @Get('my')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: "Get contractor's own jobs" })
  async findMyJobs(@CurrentUser() user: JwtPayload, @Query() filters: JobFilterDto) {
    const result = await this.jobsService.findMyJobs(user.sub, filters);
    return { success: true, ...result, message: 'Jobs retrieved' };
  }

  @Get('applications/my')
  @Roles('WORKER')
  @ApiOperation({ summary: "Get worker's own applications" })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ApplicationStatus })
  async getMyApplications(
    @CurrentUser() user: JwtPayload,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: ApplicationStatus,
  ) {
    const result = await this.jobsService.getMyApplications(user.sub, Number(page), Number(limit), status);
    return { success: true, ...result, message: 'Applications retrieved' };
  }

  @Patch('applications/:applicationId/withdraw')
  @Roles('WORKER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Withdraw a job application' })
  @ApiParam({ name: 'applicationId' })
  async withdrawApplication(@Param('applicationId') applicationId: string, @CurrentUser() user: JwtPayload) {
    const data = await this.jobsService.withdrawApplication(applicationId, user.sub);
    return { success: true, data, message: 'Application withdrawn' };
  }

  @Get(':jobId')
  @Public()
  @ApiOperation({ summary: 'Get job detail (public)' })
  @ApiParam({ name: 'jobId' })
  async findById(@Param('jobId') jobId: string, @CurrentUser() user?: JwtPayload) {
    const data = await this.jobsService.findById(jobId, user?.sub);
    return { success: true, data, message: 'Job retrieved' };
  }

  // ─── Contractor job management ─────────────────────────────────────────────

  @Post()
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new job' })
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateJobDto) {
    const data = await this.jobsService.create(user.sub, dto);
    return { success: true, data, message: 'Job created successfully' };
  }

  @Patch(':jobId')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a job (DRAFT only)' })
  @ApiParam({ name: 'jobId' })
  async update(@Param('jobId') jobId: string, @CurrentUser() user: JwtPayload, @Body() dto: UpdateJobDto) {
    const data = await this.jobsService.update(jobId, user.sub, dto);
    return { success: true, data, message: 'Job updated' };
  }

  @Post(':jobId/publish')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish a draft job' })
  @ApiParam({ name: 'jobId' })
  async publish(@Param('jobId') jobId: string, @CurrentUser() user: JwtPayload) {
    const data = await this.jobsService.publish(jobId, user.sub);
    return { success: true, data, message: 'Job published successfully' };
  }

  @Post(':jobId/close')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Close a job' })
  @ApiParam({ name: 'jobId' })
  async close(@Param('jobId') jobId: string, @CurrentUser() user: JwtPayload) {
    const data = await this.jobsService.close(jobId, user.sub);
    return { success: true, data, message: 'Job closed' };
  }

  @Delete(':jobId')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a job' })
  @ApiParam({ name: 'jobId' })
  async remove(@Param('jobId') jobId: string, @CurrentUser() user: JwtPayload) {
    const data = await this.jobsService.remove(jobId, user.sub);
    return { success: true, data, message: 'Job deleted' };
  }

  // ─── Applications ─────────────────────────────────────────────────────────

  @Post(':jobId/apply')
  @Roles('WORKER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Apply to a job (Worker only)' })
  @ApiParam({ name: 'jobId' })
  async applyToJob(
    @Param('jobId') jobId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: ApplyToJobDto,
  ) {
    const data = await this.jobsService.applyToJob(jobId, user.sub, dto);
    return { success: true, data, message: 'Application submitted successfully' };
  }

  @Get(':jobId/applications')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'List applications for a job (Contractor only)' })
  @ApiParam({ name: 'jobId' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ApplicationStatus })
  async getJobApplications(
    @Param('jobId') jobId: string,
    @CurrentUser() user: JwtPayload,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: ApplicationStatus,
  ) {
    const result = await this.jobsService.getJobApplications(
      jobId, user.sub, Number(page), Number(limit), status,
    );
    return { success: true, ...result, message: 'Applications retrieved' };
  }

  @Patch(':jobId/applications/:applicationId')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Shortlist, hire or reject an application (Contractor only)' })
  @ApiParam({ name: 'jobId' })
  @ApiParam({ name: 'applicationId' })
  async updateApplicationStatus(
    @Param('jobId') jobId: string,
    @Param('applicationId') applicationId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateApplicationDto,
  ) {
    const data = await this.jobsService.updateApplicationStatus(jobId, applicationId, user.sub, dto);
    return { success: true, data, message: `Application ${dto.status.toLowerCase()}` };
  }
}
