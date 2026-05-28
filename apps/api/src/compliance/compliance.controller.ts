import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ComplianceService } from './compliance.service';
import { ComplianceFilterDto, CreateComplianceDto, UpdateComplianceDto } from './dto/compliance.dto';

@ApiTags('Compliance')
@Controller('compliance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post()
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Create compliance record' })
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateComplianceDto) {
    const data = await this.complianceService.create(user.sub, dto);
    return { success: true, data, message: 'Compliance record created' };
  }

  @Get()
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'List compliance records' })
  async findAll(@CurrentUser() user: JwtPayload, @Query() filters: ComplianceFilterDto) {
    const result = await this.complianceService.findAll(user.sub, filters);
    return { success: true, ...result, message: 'Compliance records retrieved' };
  }

  @Get('summary')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Compliance summary with upcoming deadlines' })
  async getSummary(@CurrentUser() user: JwtPayload) {
    const data = await this.complianceService.getSummary(user.sub);
    return { success: true, data, message: 'Compliance summary retrieved' };
  }

  @Get(':recordId')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Get compliance record by ID' })
  @ApiParam({ name: 'recordId' })
  async findById(@CurrentUser() user: JwtPayload, @Param('recordId') recordId: string) {
    const data = await this.complianceService.findById(user.sub, recordId);
    return { success: true, data, message: 'Compliance record retrieved' };
  }

  @Patch(':recordId')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update compliance record' })
  @ApiParam({ name: 'recordId' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('recordId') recordId: string,
    @Body() dto: UpdateComplianceDto,
  ) {
    const data = await this.complianceService.update(user.sub, recordId, dto);
    return { success: true, data, message: 'Compliance record updated' };
  }

  @Delete(':recordId')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete compliance record' })
  @ApiParam({ name: 'recordId' })
  async remove(@CurrentUser() user: JwtPayload, @Param('recordId') recordId: string) {
    const data = await this.complianceService.remove(user.sub, recordId);
    return { success: true, data, message: data.message };
  }
}
