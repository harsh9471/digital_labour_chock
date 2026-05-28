import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ComplaintType, ComplaintStatus } from '@prisma/client';

export class CreateComplaintDto {
  @IsEnum(ComplaintType)
  type: ComplaintType;

  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  reportedAgainst?: string;
}

export class UpdateComplaintDto {
  @IsOptional()
  @IsEnum(ComplaintStatus)
  status?: ComplaintStatus;

  @IsOptional()
  @IsString()
  resolution?: string;
}

export class ComplaintFilterDto {
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsEnum(ComplaintType)
  type?: ComplaintType;

  @IsOptional()
  @IsEnum(ComplaintStatus)
  status?: ComplaintStatus;
}
