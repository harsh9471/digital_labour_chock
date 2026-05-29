import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
  ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import {
  UpdateUserStatusDto, VerifyDocumentDto, VerifyEntityDto,
  CreateRoleDto, UpdateRoleDto, CreatePermissionDto, AssignPermissionsDto,
} from './dto/admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { UserRole, UserStatus } from '@prisma/client';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly svc: AdminService) {}

  // ── Platform Stats ────────────────────────────────────────────────

  @Get('stats')
  @ApiOperation({ summary: 'Get platform KPI stats' })
  getStats() {
    return this.svc.getPlatformStats();
  }

  // ── User Management ───────────────────────────────────────────────

  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('role') role?: UserRole,
    @Query('status') status?: UserStatus,
    @Query('search') search?: string,
  ) {
    return this.svc.getUsers(page, limit, role, status, search);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user details' })
  getUser(@Param('id') id: string) {
    return this.svc.getUserById(id);
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Update user status' })
  updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.updateUserStatus(id, dto, user.sub);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Soft-delete user' })
  deleteUser(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.svc.deleteUser(id, user.sub);
  }

  // ── Document Verification ─────────────────────────────────────────

  @Get('documents/pending')
  @ApiOperation({ summary: 'Get pending KYC documents' })
  getPendingDocs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.svc.getPendingDocuments(page, limit);
  }

  @Patch('documents/:id/verify')
  @ApiOperation({ summary: 'Verify or reject a document' })
  verifyDocument(
    @Param('id') id: string,
    @Body() dto: VerifyDocumentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.verifyDocument(id, dto, user.sub);
  }

  // ── Contractor / Company Verification ─────────────────────────────

  @Patch('contractors/:id/verify')
  @ApiOperation({ summary: 'Verify or reject contractor' })
  verifyContractor(
    @Param('id') id: string,
    @Body() dto: VerifyEntityDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.verifyContractor(id, dto, user.sub);
  }

  @Patch('companies/:id/verify')
  @ApiOperation({ summary: 'Verify or reject company' })
  verifyCompany(
    @Param('id') id: string,
    @Body() dto: VerifyEntityDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.verifyCompany(id, dto, user.sub);
  }

  @Patch('workers/:id/kyc')
  @ApiOperation({ summary: 'Update worker KYC status' })
  updateWorkerKyc(
    @Param('id') id: string,
    @Body('status') status: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.updateWorkerKyc(id, status, user.sub);
  }

  // ── Roles & Permissions ───────────────────────────────────────────

  @Get('roles')
  @ApiOperation({ summary: 'List all roles' })
  getRoles() {
    return this.svc.getRoles();
  }

  @Post('roles')
  @ApiOperation({ summary: 'Create role' })
  createRole(@Body() dto: CreateRoleDto) {
    return this.svc.createRole(dto);
  }

  @Patch('roles/:id')
  @ApiOperation({ summary: 'Update role' })
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.svc.updateRole(id, dto);
  }

  @Delete('roles/:id')
  @ApiOperation({ summary: 'Delete role' })
  deleteRole(@Param('id') id: string) {
    return this.svc.deleteRole(id);
  }

  @Patch('roles/:id/permissions')
  @ApiOperation({ summary: 'Assign permissions to role' })
  assignPermissions(@Param('id') id: string, @Body() dto: AssignPermissionsDto) {
    return this.svc.assignPermissionsToRole(id, dto);
  }

  @Get('permissions')
  @ApiOperation({ summary: 'List all permissions' })
  getPermissions(@Query('resource') resource?: string) {
    return this.svc.getPermissions(resource);
  }

  @Post('permissions')
  @ApiOperation({ summary: 'Create permission' })
  createPermission(@Body() dto: CreatePermissionDto) {
    return this.svc.createPermission(dto);
  }

  // ── Audit Logs ────────────────────────────────────────────────────

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs' })
  getAuditLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('userId') userId?: string,
    @Query('resourceType') resourceType?: string,
  ) {
    return this.svc.getAuditLogs(page, limit, userId, resourceType);
  }
}
