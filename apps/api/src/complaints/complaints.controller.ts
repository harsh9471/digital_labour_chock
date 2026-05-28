import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto, UpdateComplaintDto, ComplaintFilterDto } from './dto/complaint.dto';

@ApiTags('Complaints')
@Controller('complaints')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @Roles('WORKER', 'CONTRACTOR', 'COMPANY_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'File a complaint' })
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateComplaintDto) {
    const data = await this.complaintsService.create(user.sub, dto);
    return { success: true, data, message: 'Complaint filed successfully' };
  }

  @Get()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'List all complaints (Admin only)' })
  async findAll(@Query() filters: ComplaintFilterDto) {
    const result = await this.complaintsService.findAll(filters);
    return { success: true, ...result, message: 'Complaints retrieved' };
  }

  @Get('mine')
  @Roles('WORKER', 'CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Get own complaints' })
  async findMine(@CurrentUser() user: JwtPayload, @Query() filters: ComplaintFilterDto) {
    const result = await this.complaintsService.findMine(user.sub, filters);
    return { success: true, ...result, message: 'Complaints retrieved' };
  }

  @Get('summary')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Complaints summary (Admin only)' })
  async getSummary() {
    const data = await this.complaintsService.getSummary();
    return { success: true, data, message: 'Summary retrieved' };
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'WORKER', 'CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Get complaint by ID' })
  async findById(@Param('id') id: string) {
    const data = await this.complaintsService.findById(id);
    return { success: true, data, message: 'Complaint retrieved' };
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update complaint status/resolution (Admin only)' })
  async update(@Param('id') id: string, @CurrentUser() admin: JwtPayload, @Body() dto: UpdateComplaintDto) {
    const data = await this.complaintsService.update(id, admin.sub, dto);
    return { success: true, data, message: 'Complaint updated' };
  }
}
