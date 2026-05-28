import {
  Body, Controller, Get, HttpCode, HttpStatus,
  Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PayrollService } from './payroll.service';
import { AddPayrollRecordDto, CreatePayrollBatchDto, PayrollFilterDto } from './dto/payroll.dto';

@ApiTags('Payroll')
@Controller('payroll')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('batches')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Create payroll batch' })
  async createBatch(@CurrentUser() user: JwtPayload, @Body() dto: CreatePayrollBatchDto) {
    const data = await this.payrollService.createBatch(user.sub, dto);
    return { success: true, data, message: 'Payroll batch created' };
  }

  @Post('batches/generate')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Auto-generate payroll from attendance records' })
  async generateFromAttendance(@CurrentUser() user: JwtPayload, @Body() dto: CreatePayrollBatchDto) {
    const data = await this.payrollService.generateFromAttendance(user.sub, dto);
    return { success: true, data, message: 'Payroll batch generated from attendance' };
  }

  @Get('batches')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'List payroll batches' })
  async findBatches(@CurrentUser() user: JwtPayload, @Query() filters: PayrollFilterDto) {
    const result = await this.payrollService.findBatches(user.sub, filters);
    return { success: true, ...result, message: 'Payroll batches retrieved' };
  }

  @Get('summary')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Get payroll summary for dashboard' })
  async getSummary(@CurrentUser() user: JwtPayload) {
    const data = await this.payrollService.getSummary(user.sub);
    return { success: true, data, message: 'Payroll summary retrieved' };
  }

  @Get('batches/:batchId')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Get payroll batch details' })
  @ApiParam({ name: 'batchId' })
  async findBatchById(@CurrentUser() user: JwtPayload, @Param('batchId') batchId: string) {
    const data = await this.payrollService.findBatchById(user.sub, batchId);
    return { success: true, data, message: 'Payroll batch retrieved' };
  }

  @Post('batches/:batchId/records')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Add record to payroll batch' })
  @ApiParam({ name: 'batchId' })
  async addRecord(
    @CurrentUser() user: JwtPayload,
    @Param('batchId') batchId: string,
    @Body() dto: AddPayrollRecordDto,
  ) {
    const data = await this.payrollService.addRecord(user.sub, batchId, dto);
    return { success: true, data, message: 'Payroll record added' };
  }

  @Patch('batches/:batchId/process')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process (approve + mark paid) a payroll batch' })
  @ApiParam({ name: 'batchId' })
  async processBatch(@CurrentUser() user: JwtPayload, @Param('batchId') batchId: string) {
    const data = await this.payrollService.processBatch(user.sub, batchId);
    return { success: true, data, message: 'Payroll batch processed successfully' };
  }
}
