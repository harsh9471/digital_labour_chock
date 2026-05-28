import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SitesService } from './sites.service';
import { CreateSiteDto, SiteFilterDto, UpdateSiteDto } from './dto/site.dto';

@ApiTags('Sites')
@Controller('sites')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CONTRACTOR', 'COMPANY_ADMIN')
@ApiBearerAuth()
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new construction site' })
  @ApiResponse({ status: 201, description: 'Site created successfully' })
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateSiteDto) {
    const data = await this.sitesService.create(user.sub, dto);
    return { success: true, data, message: 'Site created successfully' };
  }

  @Get()
  @ApiOperation({ summary: 'List own construction sites' })
  async findMyAll(@CurrentUser() user: JwtPayload, @Query() filters: SiteFilterDto) {
    const result = await this.sitesService.findMyAll(user.sub, filters);
    return { success: true, ...result, message: 'Sites retrieved' };
  }

  @Get(':siteId')
  @ApiOperation({ summary: 'Get site detail' })
  @ApiParam({ name: 'siteId' })
  async findById(@Param('siteId') siteId: string, @CurrentUser() user: JwtPayload) {
    const data = await this.sitesService.findById(siteId, user.sub);
    return { success: true, data, message: 'Site retrieved' };
  }

  @Patch(':siteId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update site details' })
  @ApiParam({ name: 'siteId' })
  async update(
    @Param('siteId') siteId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateSiteDto,
  ) {
    const data = await this.sitesService.update(siteId, user.sub, dto);
    return { success: true, data, message: 'Site updated' };
  }

  @Delete(':siteId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete (soft) a site' })
  @ApiParam({ name: 'siteId' })
  async remove(@Param('siteId') siteId: string, @CurrentUser() user: JwtPayload) {
    const data = await this.sitesService.remove(siteId, user.sub);
    return { success: true, data, message: data.message };
  }

  @Post(':siteId/qr-code')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate QR code for site attendance' })
  @ApiParam({ name: 'siteId' })
  @ApiQuery({ name: 'expiryHours', required: false, type: Number, description: 'QR expiry in hours (default: 8)' })
  async generateQrCode(
    @Param('siteId') siteId: string,
    @CurrentUser() user: JwtPayload,
    @Query('expiryHours') expiryHours: number = 8,
  ) {
    const data = await this.sitesService.generateQrCode(siteId, user.sub, Number(expiryHours));
    return { success: true, data, message: 'QR code generated' };
  }
}
