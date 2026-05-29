import {
  IsString, IsEnum, IsOptional, IsInt, IsUrl, IsBoolean, Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BannerStatus, BannerTarget, CmsPageStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateBannerDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subtitle?: string;
  @ApiProperty() @IsString() imageUrl: string;
  @ApiPropertyOptional() @IsOptional() @IsString() linkUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() linkText?: string;
  @ApiPropertyOptional({ enum: BannerTarget }) @IsOptional() @IsEnum(BannerTarget) target?: BannerTarget;
  @ApiPropertyOptional({ enum: BannerStatus }) @IsOptional() @IsEnum(BannerStatus) status?: BannerStatus;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(0) priority?: number;
  @ApiPropertyOptional() @IsOptional() startsAt?: Date;
  @ApiPropertyOptional() @IsOptional() endsAt?: Date;
}

export class UpdateBannerDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subtitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() imageUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() linkUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() linkText?: string;
  @ApiPropertyOptional({ enum: BannerTarget }) @IsOptional() @IsEnum(BannerTarget) target?: BannerTarget;
  @ApiPropertyOptional({ enum: BannerStatus }) @IsOptional() @IsEnum(BannerStatus) status?: BannerStatus;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(0) priority?: number;
}

export class CreateCmsPageDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() slug: string;
  @ApiProperty() @IsString() content: string;
  @ApiPropertyOptional() @IsOptional() @IsString() excerpt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metaTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metaDesc?: string;
  @ApiPropertyOptional({ enum: CmsPageStatus }) @IsOptional() @IsEnum(CmsPageStatus) status?: CmsPageStatus;
}

export class UpdateCmsPageDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() slug?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() content?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() excerpt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metaTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metaDesc?: string;
  @ApiPropertyOptional({ enum: CmsPageStatus }) @IsOptional() @IsEnum(CmsPageStatus) status?: CmsPageStatus;
}
