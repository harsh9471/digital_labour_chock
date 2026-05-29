import { IsString, IsOptional, IsDateString, IsEnum, IsNumber, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AttendanceMethod } from '@prisma/client';

export class MarkAttendanceDto {
  @ApiProperty()
  @IsString()
  workerId: string;

  @ApiProperty()
  @IsString()
  jobId: string;

  @ApiProperty()
  @IsString()
  siteId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  checkInLat?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  checkInLon?: number;

  @ApiPropertyOptional({ enum: AttendanceMethod })
  @IsOptional()
  @IsEnum(AttendanceMethod)
  method?: AttendanceMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

// Worker self-check-in — jobId/siteId/contractorId resolved from active hire record
export class WorkerSelfCheckInDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  checkInLat?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  checkInLon?: number;

  @ApiPropertyOptional({ enum: AttendanceMethod })
  @IsOptional()
  @IsEnum(AttendanceMethod)
  method?: AttendanceMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CheckOutDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  checkOutLat?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  checkOutLon?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AttendanceFilterDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(1) page?: number = 1;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(1) limit?: number = 20;
  @ApiPropertyOptional() @IsOptional() @IsString() siteId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() jobId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dateFrom?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dateTo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
}
