import {
  Controller, Get, Post, Delete,
  Param, Body, Query, UseGuards,
  ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { AdminReportType } from '@prisma/client';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@Controller('reports')
export class ReportsController {
  constructor(private readonly svc: ReportsService) {}

  @Get('admin/overview')
  @ApiOperation({ summary: 'Admin overview analytics' })
  getAdminOverview() {
    return this.svc.getAdminOverview();
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Revenue analytics trend' })
  getRevenue(
    @Query('months', new DefaultValuePipe(6), ParseIntPipe) months: number,
  ) {
    return this.svc.getRevenueAnalytics(months);
  }

  @Get('workforce')
  @ApiOperation({ summary: 'Workforce analytics' })
  getWorkforce() {
    return this.svc.getWorkforceAnalytics();
  }

  @Get('hiring')
  @ApiOperation({ summary: 'Hiring trend analytics' })
  getHiring(
    @Query('days', new DefaultValuePipe(30), ParseIntPipe) days: number,
  ) {
    return this.svc.getHiringAnalytics(days);
  }

  @Get()
  @ApiOperation({ summary: 'List all reports' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('type') type?: AdminReportType,
  ) {
    return this.svc.findAll(page, limit, type);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate a new report' })
  generate(@Body() dto: CreateReportDto, @CurrentUser() user: JwtPayload) {
    return this.svc.generateReport(dto, user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report by ID' })
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete report' })
  delete(@Param('id') id: string) {
    return this.svc.deleteReport(id);
  }
}
