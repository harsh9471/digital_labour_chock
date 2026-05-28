import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth, ApiOperation, ApiParam, ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, ProjectFilterDto, UpdateProjectDto } from './dto/project.dto';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Create a new project' })
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateProjectDto) {
    const data = await this.projectsService.create(user.sub, dto);
    return { success: true, data, message: 'Project created successfully' };
  }

  @Get()
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'List my projects' })
  async findAll(@CurrentUser() user: JwtPayload, @Query() filters: ProjectFilterDto) {
    const result = await this.projectsService.findAll(user.sub, filters);
    return { success: true, ...result, message: 'Projects retrieved' };
  }

  @Get(':projectId')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiParam({ name: 'projectId' })
  async findById(@CurrentUser() user: JwtPayload, @Param('projectId') projectId: string) {
    const data = await this.projectsService.findById(projectId);
    return { success: true, data, message: 'Project retrieved' };
  }

  @Patch(':projectId')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update project' })
  @ApiParam({ name: 'projectId' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('projectId') projectId: string,
    @Body() dto: UpdateProjectDto,
  ) {
    const data = await this.projectsService.update(user.sub, projectId, dto);
    return { success: true, data, message: 'Project updated successfully' };
  }

  @Delete(':projectId')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete project' })
  @ApiParam({ name: 'projectId' })
  async remove(@CurrentUser() user: JwtPayload, @Param('projectId') projectId: string) {
    const data = await this.projectsService.remove(user.sub, projectId);
    return { success: true, data, message: 'Project deleted' };
  }

  @Post(':projectId/assign-worker')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Assign worker to project' })
  @ApiParam({ name: 'projectId' })
  async assignWorker(
    @CurrentUser() user: JwtPayload,
    @Param('projectId') projectId: string,
    @Body() dto: {
      workerId: string;
      role?: string;
      startDate: string;
      endDate?: string;
      dailyRate?: number;
      siteId?: string;
      notes?: string;
    },
  ) {
    const data = await this.projectsService.assignWorker(user.sub, projectId, dto);
    return { success: true, data, message: 'Worker assigned to project' };
  }

  @Delete(':projectId/assignments/:assignmentId')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove worker from project' })
  async unassignWorker(
    @CurrentUser() user: JwtPayload,
    @Param('projectId') projectId: string,
    @Param('assignmentId') assignmentId: string,
  ) {
    const data = await this.projectsService.unassignWorker(user.sub, projectId, assignmentId);
    return { success: true, data, message: 'Worker removed from project' };
  }

  @Get(':projectId/stats')
  @Roles('CONTRACTOR', 'COMPANY_ADMIN')
  @ApiOperation({ summary: 'Get project statistics' })
  @ApiParam({ name: 'projectId' })
  async getStats(@CurrentUser() user: JwtPayload, @Param('projectId') projectId: string) {
    const data = await this.projectsService.getProjectStats(user.sub, projectId);
    return { success: true, data, message: 'Project stats retrieved' };
  }
}
