import {
  Body, Controller, Get, HttpCode, HttpStatus,
  Patch, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CompanyService } from './company.service';
import { CompanyFilterDto, UpdateCompanyDto } from './dto/company.dto';

@ApiTags('Company')
@Controller('company')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('me')
  @Roles('COMPANY_ADMIN')
  @ApiOperation({ summary: 'Get my company details' })
  async getMyCompany(@CurrentUser() user: JwtPayload) {
    const data = await this.companyService.getMyCompany(user.sub);
    return { success: true, data, message: 'Company retrieved' };
  }

  @Patch('me')
  @Roles('COMPANY_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update company details' })
  async updateCompany(@CurrentUser() user: JwtPayload, @Body() dto: UpdateCompanyDto) {
    const data = await this.companyService.updateCompany(user.sub, dto);
    return { success: true, data, message: 'Company updated successfully' };
  }

  @Get('me/dashboard')
  @Roles('COMPANY_ADMIN')
  @ApiOperation({ summary: 'Company admin dashboard stats' })
  async getDashboard(@CurrentUser() user: JwtPayload) {
    const data = await this.companyService.getDashboard(user.sub);
    return { success: true, data, message: 'Dashboard data retrieved' };
  }

  @Get('me/contractors')
  @Roles('COMPANY_ADMIN')
  @ApiOperation({ summary: 'List company contractors' })
  async getContractors(@CurrentUser() user: JwtPayload, @Query() filters: CompanyFilterDto) {
    const result = await this.companyService.getContractors(user.sub, filters);
    return { success: true, ...result, message: 'Contractors retrieved' };
  }

  @Get('me/workforce')
  @Roles('COMPANY_ADMIN')
  @ApiOperation({ summary: 'Company workforce summary' })
  async getWorkforce(@CurrentUser() user: JwtPayload) {
    const data = await this.companyService.getWorkforceSummary(user.sub);
    return { success: true, data, message: 'Workforce summary retrieved' };
  }

  @Get()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'List all companies (Super Admin only)' })
  async findAll(@Query() filters: CompanyFilterDto) {
    const result = await this.companyService.findAll(filters);
    return { success: true, ...result, message: 'Companies retrieved' };
  }
}
