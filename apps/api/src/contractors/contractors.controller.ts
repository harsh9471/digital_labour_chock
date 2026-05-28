import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ContractorsService } from './contractors.service';
import { ContractorFilterDto, UpdateContractorProfileDto } from './dto/contractor.dto';

@ApiTags('Contractors')
@Controller('contractors')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ContractorsController {
  constructor(private readonly contractorsService: ContractorsService) {}

  @Get('me/profile')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Get own contractor profile' })
  async getMyProfile(@CurrentUser() user: JwtPayload) {
    const data = await this.contractorsService.getMyProfile(user.sub);
    return { success: true, data, message: 'Contractor profile retrieved' };
  }

  @Patch('me/profile')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update own contractor profile' })
  async updateMyProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateContractorProfileDto) {
    const data = await this.contractorsService.updateMyProfile(user.sub, dto);
    return { success: true, data, message: 'Profile updated successfully' };
  }

  @Get('me/stats')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Get contractor dashboard stats' })
  async getDashboardStats(@CurrentUser() user: JwtPayload) {
    const data = await this.contractorsService.getDashboardStats(user.sub);
    return { success: true, data, message: 'Dashboard stats retrieved' };
  }

  @Get()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'List all contractors (Admin only)' })
  async findAll(@Query() filters: ContractorFilterDto) {
    const result = await this.contractorsService.findAll(filters);
    return { success: true, ...result, message: 'Contractors retrieved' };
  }

  @Get(':contractorId')
  @Roles('SUPER_ADMIN', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Get contractor by ID (Admin only)' })
  @ApiParam({ name: 'contractorId' })
  async findById(@Param('contractorId') contractorId: string) {
    const data = await this.contractorsService.findById(contractorId);
    return { success: true, data, message: 'Contractor retrieved' };
  }
}
