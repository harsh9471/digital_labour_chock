import {
  Controller,
  Get,
  Param,
  Query,
  Patch,
  Delete,
  Body,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';

import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me/avatar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update own avatar URL' })
  async updateMyAvatar(
    @CurrentUser() user: JwtPayload,
    @Body('avatar') avatar: string,
  ) {
    const data = await this.usersService.updateAvatar(user.sub, avatar ?? '');
    return { success: true, data, message: 'Avatar updated' };
  }

  @Get('admin/stats')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get platform-wide stats (Admin only)' })
  async getAdminStats() {
    const data = await this.usersService.getAdminStats();
    return { success: true, data, message: 'Stats retrieved' };
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'status', required: false, enum: UserStatus })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('role') role?: UserRole,
    @Query('status') status?: UserStatus,
    @Query('search') search?: string,
  ) {
    const result = await this.usersService.findAll(
      { page, limit: Math.min(limit, 100) },
      { role, status, search },
    );
    return { success: true, ...result };
  }

  @Get('workers')
  @ApiOperation({ summary: 'Get all workers with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'skill', required: false, type: String })
  @ApiQuery({ name: 'available', required: false, type: Boolean })
  async getWorkers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('city') city?: string,
    @Query('skill') skillSlug?: string,
    @Query('available') available?: string,
  ) {
    const availableBool = available === 'true' ? true : available === 'false' ? false : undefined;
    const result = await this.usersService.getWorkers(
      { page, limit: Math.min(limit, 100) },
      { city, skillSlug, available: availableBool },
    );
    return { success: true, ...result };
  }

  @Get('contractors')
  @ApiOperation({ summary: 'Get all contractors with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'companyId', required: false, type: String })
  async getContractors(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('city') city?: string,
    @Query('companyId') companyId?: string,
  ) {
    const result = await this.usersService.getContractors(
      { page, limit: Math.min(limit, 100) },
      { city, companyId },
    );
    return { success: true, ...result };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const data = await this.usersService.findById(id, currentUser.sub, currentUser.role);
    return { success: true, data };
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user status (Admin only)' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: UserStatus,
    @CurrentUser() admin: JwtPayload,
  ) {
    const data = await this.usersService.updateStatus(id, status, admin.sub);
    return { success: true, data, message: 'User status updated' };
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete user (Admin only)' })
  async remove(@Param('id') id: string) {
    const data = await this.usersService.softDelete(id);
    return { success: true, data, message: 'User deleted successfully' };
  }
}
