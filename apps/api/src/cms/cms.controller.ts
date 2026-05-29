import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards, ParseBoolPipe, DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CmsService } from './cms.service';
import {
  CreateBannerDto, UpdateBannerDto,
  CreateCmsPageDto, UpdateCmsPageDto,
} from './dto/cms.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { BannerTarget } from '@prisma/client';

@ApiTags('CMS')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cms')
export class CmsController {
  constructor(private readonly svc: CmsService) {}

  // ── Public endpoints ─────────────────────────────────────────────

  @Get('banners/active')
  @Public()
  @ApiOperation({ summary: 'Get active banners (public)' })
  getActiveBanners(@Query('target') target?: BannerTarget) {
    return this.svc.findAllBanners(target, true);
  }

  @Get('pages/published')
  @Public()
  @ApiOperation({ summary: 'Get published pages (public)' })
  getPublishedPages() {
    return this.svc.findAllPages(true);
  }

  @Get('pages/slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get page by slug (public)' })
  getPageBySlug(@Param('slug') slug: string) {
    return this.svc.findPageBySlug(slug);
  }

  @Post('banners/:id/click')
  @Public()
  @ApiOperation({ summary: 'Track banner click' })
  trackClick(@Param('id') id: string) {
    return this.svc.trackBannerClick(id);
  }

  @Post('banners/:id/view')
  @Public()
  @ApiOperation({ summary: 'Track banner view' })
  trackView(@Param('id') id: string) {
    return this.svc.trackBannerView(id);
  }

  // ── Admin: Banners ────────────────────────────────────────────────

  @Get('banners')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'List all banners (admin)' })
  listBanners(@Query('target') target?: BannerTarget) {
    return this.svc.findAllBanners(target);
  }

  @Post('banners')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Create banner (admin)' })
  createBanner(@Body() dto: CreateBannerDto, @CurrentUser() user: JwtPayload) {
    return this.svc.createBanner(dto, user.sub);
  }

  @Patch('banners/:id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Update banner (admin)' })
  updateBanner(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.svc.updateBanner(id, dto);
  }

  @Delete('banners/:id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete banner (admin)' })
  deleteBanner(@Param('id') id: string) {
    return this.svc.deleteBanner(id);
  }

  // ── Admin: Pages ──────────────────────────────────────────────────

  @Get('pages')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'List all pages (admin)' })
  listPages() {
    return this.svc.findAllPages();
  }

  @Post('pages')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Create CMS page (admin)' })
  createPage(@Body() dto: CreateCmsPageDto, @CurrentUser() user: JwtPayload) {
    return this.svc.createPage(dto, user.sub);
  }

  @Get('pages/:id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get page by ID (admin)' })
  getPage(@Param('id') id: string) {
    return this.svc.findPageById(id);
  }

  @Patch('pages/:id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Update CMS page (admin)' })
  updatePage(
    @Param('id') id: string,
    @Body() dto: UpdateCmsPageDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.updatePage(id, dto, user.sub);
  }

  @Delete('pages/:id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete CMS page (admin)' })
  deletePage(@Param('id') id: string) {
    return this.svc.deletePage(id);
  }
}
