import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('contractor/overview')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Contractor dashboard overview stats' })
  async contractorOverview(@CurrentUser() user: JwtPayload) {
    const data = await this.analyticsService.getContractorOverview(user.sub);
    return { success: true, data, message: 'Overview retrieved' };
  }

  @Get('contractor/attendance-trend')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Attendance trend for last N days' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async attendanceTrend(@CurrentUser() user: JwtPayload, @Query('days') days?: string) {
    const data = await this.analyticsService.getAttendanceTrend(user.sub, days ? parseInt(days, 10) : 30);
    return { success: true, data, message: 'Attendance trend retrieved' };
  }

  @Get('contractor/top-workers')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Top workers by hire count' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async topWorkers(@CurrentUser() user: JwtPayload, @Query('limit') limit?: string) {
    const data = await this.analyticsService.getTopWorkers(user.sub, limit ? parseInt(limit, 10) : 10);
    return { success: true, data, message: 'Top workers retrieved' };
  }

  @Get('contractor/hiring-pipeline')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Hiring pipeline funnel data' })
  async hiringPipeline(@CurrentUser() user: JwtPayload) {
    const data = await this.analyticsService.getHiringPipeline(user.sub);
    return { success: true, data, message: 'Hiring pipeline retrieved' };
  }

  @Get('contractor/skill-distribution')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Job postings by skill category' })
  async skillDistribution(@CurrentUser() user: JwtPayload) {
    const data = await this.analyticsService.getSkillDistribution(user.sub);
    return { success: true, data, message: 'Skill distribution retrieved' };
  }

  @Get('company/overview')
  @Roles('COMPANY_ADMIN')
  @ApiOperation({ summary: 'Company-level overview stats' })
  async companyOverview(@CurrentUser() user: JwtPayload) {
    const data = await this.analyticsService.getCompanyOverview(user.sub);
    return { success: true, data, message: 'Company overview retrieved' };
  }

  @Get('company/contractor-performance')
  @Roles('COMPANY_ADMIN')
  @ApiOperation({ summary: 'Company contractor performance metrics' })
  async contractorPerformance(@CurrentUser() user: JwtPayload) {
    const data = await this.analyticsService.getContractorPerformance(user.sub);
    return { success: true, data, message: 'Contractor performance retrieved' };
  }
}
