import { IsString, IsOptional, IsDateString, IsEnum, IsNumber, IsArray, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PayrollStatus } from '@prisma/client';

export class CreatePayrollBatchDto {
  @ApiProperty()
  @IsDateString()
  periodStart: string;

  @ApiProperty()
  @IsDateString()
  periodEnd: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jobId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AddPayrollRecordDto {
  @ApiProperty()
  @IsString()
  workerId: string;

  @ApiProperty()
  @IsString()
  jobId: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  workingDays: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  dailyWage: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalHours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pfDeduction?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  esiDeduction?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  otherDeductions?: number;
}

export class PayrollFilterDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(1) page?: number = 1;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(1) limit?: number = 20;
  @ApiPropertyOptional({ enum: PayrollStatus }) @IsOptional() @IsEnum(PayrollStatus) status?: PayrollStatus;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dateFrom?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dateTo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() jobId?: string;
}
