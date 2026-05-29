import {
  Injectable, NotFoundException, ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBannerDto, UpdateBannerDto,
  CreateCmsPageDto, UpdateCmsPageDto,
} from './dto/cms.dto';
import { BannerTarget } from '@prisma/client';

@Injectable()
export class CmsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── BANNERS ────────────────────────────────────────────────────────

  async createBanner(dto: CreateBannerDto, createdBy: string) {
    return this.prisma.banner.create({
      data: { ...dto, createdBy },
    });
  }

  async findAllBanners(target?: BannerTarget, activeOnly = false) {
    return this.prisma.banner.findMany({
      where: {
        deletedAt: null,
        ...(target ? { target: { in: [target, 'ALL'] } } : {}),
        ...(activeOnly ? { status: 'ACTIVE' } : {}),
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findBannerById(id: string) {
    const banner = await this.prisma.banner.findFirst({
      where: { id, deletedAt: null },
    });
    if (!banner) throw new NotFoundException('Banner not found');
    return banner;
  }

  async updateBanner(id: string, dto: UpdateBannerDto) {
    await this.findBannerById(id);
    return this.prisma.banner.update({ where: { id }, data: dto });
  }

  async deleteBanner(id: string) {
    await this.findBannerById(id);
    await this.prisma.banner.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { deleted: true };
  }

  async trackBannerClick(id: string) {
    await this.prisma.banner.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
    });
    return { tracked: true };
  }

  async trackBannerView(id: string) {
    await this.prisma.banner.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
    return { tracked: true };
  }

  // ── CMS PAGES ──────────────────────────────────────────────────────

  async createPage(dto: CreateCmsPageDto, createdBy: string) {
    const existing = await this.prisma.cmsPage.findUnique({
      where: { slug: dto.slug },
    });
    if (existing && !existing.deletedAt) {
      throw new ConflictException(`Page with slug '${dto.slug}' already exists`);
    }
    return this.prisma.cmsPage.create({
      data: {
        ...dto,
        createdBy,
        publishedAt: dto.status === 'PUBLISHED' ? new Date() : null,
      },
    });
  }

  async findAllPages(publishedOnly = false) {
    return this.prisma.cmsPage.findMany({
      where: {
        deletedAt: null,
        ...(publishedOnly ? { status: 'PUBLISHED' } : {}),
      },
      select: {
        id: true, title: true, slug: true, excerpt: true,
        status: true, publishedAt: true, createdAt: true, updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findPageBySlug(slug: string) {
    const page = await this.prisma.cmsPage.findFirst({
      where: { slug, deletedAt: null },
    });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async findPageById(id: string) {
    const page = await this.prisma.cmsPage.findFirst({
      where: { id, deletedAt: null },
    });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async updatePage(id: string, dto: UpdateCmsPageDto, updatedBy: string) {
    await this.findPageById(id);
    const data: Record<string, unknown> = { ...dto, updatedBy };
    if (dto.status === 'PUBLISHED') {
      data.publishedAt = new Date();
    }
    return this.prisma.cmsPage.update({ where: { id }, data });
  }

  async deletePage(id: string) {
    await this.findPageById(id);
    await this.prisma.cmsPage.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { deleted: true };
  }
}
