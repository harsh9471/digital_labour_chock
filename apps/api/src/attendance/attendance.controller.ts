import {
  Body, Controller, Get, HttpCode, HttpStatus,
  Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AttendanceService } from './attendance.service';
import { AttendanceFilterDto, CheckOutDto, MarkAttendanceDto } from './dto/attendance.dto';

@ApiTags('Attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Mark worker check-in' })
  async markCheckIn(@CurrentUser() user: JwtPayload, @Body() dto: MarkAttendanceDto) {
    const data = await this.attendanceService.markCheckIn(user.sub, dto);
    return { success: true, data, message: 'Check-in recorded' };
  }

  @Patch(':recordId/check-out')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark worker check-out' })
  @ApiParam({ name: 'recordId' })
  async markCheckOut(
    @CurrentUser() user: JwtPayload,
    @Param('recordId') recordId: string,
    @Body() dto: CheckOutDto,
  ) {
    const data = await this.attendanceService.markCheckOut(user.sub, recordId, dto);
    return { success: true, data, message: 'Check-out recorded' };
  }

  @Get()
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'List attendance records with filters' })
  async findAll(@CurrentUser() user: JwtPayload, @Query() filters: AttendanceFilterDto) {
    const result = await this.attendanceService.findContractorAttendance(user.sub, filters);
    return { success: true, ...result, message: 'Attendance records retrieved' };
  }

  @Get('today')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: "Today's attendance summary" })
  async getTodaySummary(@CurrentUser() user: JwtPayload) {
    const data = await this.attendanceService.getTodaySummary(user.sub);
    return { success: true, data, message: "Today's summary retrieved" };
  }

  @Get('weekly-stats')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Weekly attendance stats (last 7 days)' })
  async getWeeklyStats(@CurrentUser() user: JwtPayload) {
    const data = await this.attendanceService.getWeeklyStats(user.sub);
    return { success: true, data, message: 'Weekly stats retrieved' };
  }

  @Get(':recordId')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Get single attendance record' })
  @ApiParam({ name: 'recordId' })
  async findOne(@CurrentUser() user: JwtPayload, @Param('recordId') recordId: string) {
    const data = await this.attendanceService.findOne(user.sub, recordId);
    return { success: true, data, message: 'Attendance record retrieved' };
  }
}
