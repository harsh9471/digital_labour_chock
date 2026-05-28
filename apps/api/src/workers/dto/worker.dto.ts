import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEnum,
  IsArray,
  IsDateString,
  Min,
  Max,
  MaxLength,
  IsPositive,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { Gender, SkillLevel } from '@prisma/client';

export class UpdateWorkerProfileDto {
  @ApiPropertyOptional({ description: 'Worker bio / about me' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @ApiPropertyOptional({ description: 'Date of birth (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ type: [String], description: 'Languages spoken' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  availableForWork?: boolean;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  hourlyRate?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  dailyRate?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  weeklyRate?: number;

  @ApiPropertyOptional({ type: Number, minimum: 0, maximum: 50 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50)
  @Type(() => Number)
  experienceYears?: number;

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
  @IsString()
  @MaxLength(10)
  pincode?: string;

  @ApiPropertyOptional({ description: 'UPI ID for payment' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  upiId?: string;

  @ApiPropertyOptional({ description: 'Bank account number' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  bankAccountNumber?: string;

  @ApiPropertyOptional({ description: 'IFSC code' })
  @IsOptional()
  @IsString()
  @MaxLength(11)
  bankIfsc?: string;

  @ApiPropertyOptional({ description: 'FCM token for push notifications' })
  @IsOptional()
  @IsString()
  fcmToken?: string;
}

export class AddWorkerSkillDto {
  @ApiProperty({ description: 'Skill ID' })
  @IsString()
  skillId: string;

  @ApiProperty({ enum: SkillLevel, default: SkillLevel.BEGINNER })
  @IsEnum(SkillLevel)
  level: SkillLevel;

  @ApiPropertyOptional({ type: Number, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  yearsOfExperience?: number;
}

// ─── Experience DTOs ──────────────────────────────────────────────────────────
export class AddWorkerExperienceDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() company: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsDateString() startDate: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isCurrent?: boolean;
}

export class UpdateWorkerExperienceDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() company?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() startDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isCurrent?: boolean;
}

// ─── Rating DTO ───────────────────────────────────────────────────────────────
export class RateWorkerDto {
  @ApiProperty() @IsString() workerId: string;
  @ApiProperty() @IsString() jobId: string;
  @ApiProperty() @IsNumber() @Min(1) @Max(5) @Type(() => Number) rating: number;
  @ApiPropertyOptional() @IsOptional() @IsString() review?: string;
}

export class WorkerFilterDto {
  @ApiPropertyOptional({ description: 'City to filter by' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State to filter by' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Skill slug to filter by' })
  @IsOptional()
  @IsString()
  skillSlug?: string;

  @ApiPropertyOptional({ description: 'Skill category to filter by' })
  @IsOptional()
  @IsString()
  skillCategory?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  available?: boolean;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minExperience?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  maxDailyRate?: number;

  @ApiPropertyOptional({ description: 'Search by name' })
  @IsOptional()
  @IsString()
  search?: string;

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
