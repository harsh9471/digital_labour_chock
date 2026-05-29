import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdminReportType } from '@prisma/client';

export class CreateReportDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty({ enum: AdminReportType }) @IsEnum(AdminReportType) type: AdminReportType;
  @ApiPropertyOptional() @IsOptional() periodStart?: Date;
  @ApiPropertyOptional() @IsOptional() periodEnd?: Date;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isScheduled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() schedule?: string;
}
