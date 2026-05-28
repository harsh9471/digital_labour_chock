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
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SkillLevel } from '@prisma/client';

import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { WorkersService } from './workers.service';
import {
  AddWorkerSkillDto,
  UpdateWorkerProfileDto,
  WorkerFilterDto,
  AddWorkerExperienceDto,
  UpdateWorkerExperienceDto,
  RateWorkerDto,
} from './dto/worker.dto';

@ApiTags('Workers')
@Controller('workers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  // ─── Discovery ────────────────────────────────────────────────────────────

  @Get()
  @Roles('CONTRACTOR', 'COMPANY_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Discover workers with filters' })
  async findAll(@Query() filters: WorkerFilterDto) {
    const result = await this.workersService.findAll(filters);
    return { success: true, ...result, message: 'Workers retrieved successfully' };
  }

  @Get('skills')
  @Public()
  @ApiOperation({ summary: 'Get all available skills (public)' })
  @ApiQuery({ name: 'category', required: false })
  async getSkills(@Query('category') category?: string) {
    const data = await this.workersService.getSkills(category);
    return { success: true, data, message: 'Skills retrieved' };
  }

  // ─── Worker Own Profile ───────────────────────────────────────────────────

  @Get('me/profile')
  @Roles('WORKER')
  @ApiOperation({ summary: 'Get own worker profile' })
  async getMyProfile(@CurrentUser() user: JwtPayload) {
    const data = await this.workersService.getMyProfile(user.sub);
    return { success: true, data, message: 'Profile retrieved' };
  }

  @Patch('me/profile')
  @Roles('WORKER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update own worker profile' })
  async updateMyProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateWorkerProfileDto) {
    const data = await this.workersService.updateMyProfile(user.sub, dto);
    return { success: true, data, message: 'Profile updated successfully' };
  }

  @Patch('me/availability')
  @Roles('WORKER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle availability for work' })
  async toggleAvailability(@CurrentUser() user: JwtPayload) {
    const data = await this.workersService.toggleAvailability(user.sub);
    return { success: true, data, message: `Availability updated` };
  }

  @Get('me/stats')
  @Roles('WORKER')
  @ApiOperation({ summary: 'Get worker dashboard stats' })
  async getStats(@CurrentUser() user: JwtPayload) {
    const data = await this.workersService.getWorkerStats(user.sub);
    return { success: true, data, message: 'Stats retrieved' };
  }

  // ─── Skills ───────────────────────────────────────────────────────────────

  @Post('me/skills')
  @Roles('WORKER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a skill to worker profile' })
  async addSkill(@CurrentUser() user: JwtPayload, @Body() dto: AddWorkerSkillDto) {
    const data = await this.workersService.addSkill(user.sub, dto);
    return { success: true, data, message: 'Skill added to profile' };
  }

  @Patch('me/skills/:skillId')
  @Roles('WORKER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update skill level or experience' })
  @ApiParam({ name: 'skillId' })
  async updateSkill(
    @CurrentUser() user: JwtPayload,
    @Param('skillId') skillId: string,
    @Body() body: { level: SkillLevel; yearsOfExperience?: number },
  ) {
    const data = await this.workersService.updateSkill(user.sub, skillId, body.level, body.yearsOfExperience);
    return { success: true, data, message: 'Skill updated' };
  }

  @Delete('me/skills/:skillId')
  @Roles('WORKER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a skill from worker profile' })
  @ApiParam({ name: 'skillId' })
  async removeSkill(@CurrentUser() user: JwtPayload, @Param('skillId') skillId: string) {
    const data = await this.workersService.removeSkill(user.sub, skillId);
    return { success: true, data, message: 'Skill removed' };
  }

  // ─── Experience ───────────────────────────────────────────────────────────

  @Post('me/experience')
  @Roles('WORKER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add work experience' })
  async addExperience(@CurrentUser() user: JwtPayload, @Body() dto: AddWorkerExperienceDto) {
    const data = await this.workersService.addExperience(user.sub, dto);
    return { success: true, data, message: 'Experience added' };
  }

  @Patch('me/experience/:experienceId')
  @Roles('WORKER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update work experience' })
  @ApiParam({ name: 'experienceId' })
  async updateExperience(
    @CurrentUser() user: JwtPayload,
    @Param('experienceId') experienceId: string,
    @Body() dto: UpdateWorkerExperienceDto,
  ) {
    const data = await this.workersService.updateExperience(user.sub, experienceId, dto);
    return { success: true, data, message: 'Experience updated' };
  }

  @Delete('me/experience/:experienceId')
  @Roles('WORKER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete work experience' })
  @ApiParam({ name: 'experienceId' })
  async deleteExperience(
    @CurrentUser() user: JwtPayload,
    @Param('experienceId') experienceId: string,
  ) {
    const data = await this.workersService.deleteExperience(user.sub, experienceId);
    return { success: true, data, message: 'Experience deleted' };
  }

  // ─── Saved Jobs ───────────────────────────────────────────────────────────

  @Post('me/saved-jobs/:jobId')
  @Roles('WORKER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save a job' })
  async saveJob(@CurrentUser() user: JwtPayload, @Param('jobId') jobId: string) {
    const data = await this.workersService.saveJob(user.sub, jobId);
    return { success: true, data, message: 'Job saved' };
  }

  @Delete('me/saved-jobs/:jobId')
  @Roles('WORKER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove saved job' })
  async unsaveJob(@CurrentUser() user: JwtPayload, @Param('jobId') jobId: string) {
    const data = await this.workersService.unsaveJob(user.sub, jobId);
    return { success: true, data, message: 'Job unsaved' };
  }

  @Get('me/saved-jobs')
  @Roles('WORKER')
  @ApiOperation({ summary: 'Get saved jobs' })
  async getSavedJobs(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.workersService.getSavedJobs(user.sub, page, limit);
    return { success: true, ...result, message: 'Saved jobs retrieved' };
  }

  // ─── Ratings ──────────────────────────────────────────────────────────────

  @Post('rate')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Rate a worker after job completion' })
  async rateWorker(@CurrentUser() user: JwtPayload, @Body() dto: RateWorkerDto) {
    const data = await this.workersService.rateWorker(user.sub, dto);
    return { success: true, data, message: 'Worker rated' };
  }

  @Get(':workerId/ratings')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN', 'SUPER_ADMIN', 'WORKER')
  @ApiOperation({ summary: 'Get worker ratings' })
  @ApiParam({ name: 'workerId' })
  async getWorkerRatings(
    @Param('workerId') workerId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.workersService.getWorkerRatings(workerId, page, limit);
    return { success: true, ...result, message: 'Ratings retrieved' };
  }

  // ─── Public Profile ───────────────────────────────────────────────────────

  @Get(':workerId')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN', 'SUPER_ADMIN', 'WORKER')
  @ApiOperation({ summary: 'Get public worker profile by ID' })
  @ApiParam({ name: 'workerId' })
  async findById(@Param('workerId') workerId: string) {
    const data = await this.workersService.findById(workerId);
    return { success: true, data, message: 'Worker profile retrieved' };
  }
}
