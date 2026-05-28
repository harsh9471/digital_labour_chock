import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEnum,
  IsInt,
  IsDateString,
  IsPositive,
  Min,
  Max,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { ApplicationStatus, JobStatus, JobType } from '@prisma/client';

export class CreateJobDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ description: 'Skill ID required for this job' })
  @IsOptional()
  @IsString()
  requiredSkillId?: string;

  @ApiPropertyOptional({ description: 'Skill category (fallback if no specific skill)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  skillCategory?: string;

  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  @Type(() => Number)
  workerCount?: number = 1;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  dailyWage?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  weeklyWage?: number;

  @ApiPropertyOptional({ enum: JobType, default: JobType.DAILY })
  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType = JobType.DAILY;

  @ApiPropertyOptional({ description: 'Site ID for the job' })
  @IsOptional()
  @IsString()
  siteId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  state: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  longitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean = false;
}

export class UpdateJobDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requiredSkillId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  skillCategory?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  @Type(() => Number)
  workerCount?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  dailyWage?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  weeklyWage?: number;

  @ApiPropertyOptional({ enum: JobType })
  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  siteId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;
}

export class JobFilterDto {
  @ApiPropertyOptional({ enum: JobStatus })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @ApiPropertyOptional({ enum: JobType })
  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  skillSlug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  skillCategory?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  minWage?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  maxWage?: number;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isUrgent?: boolean;

  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ type: Number, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class ApplyToJobDto {
  @ApiPropertyOptional({ description: 'Cover note from worker' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverNote?: string;
}

export class UpdateApplicationDto {
  @ApiProperty({ enum: ['SHORTLISTED', 'HIRED', 'REJECTED'] })
  @IsEnum(['SHORTLISTED', 'HIRED', 'REJECTED'])
  status: 'SHORTLISTED' | 'HIRED' | 'REJECTED';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  contractorNote?: string;
}
