import {
  IsString, IsEnum, IsOptional, IsBoolean, IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

export class UpdateUserStatusDto {
  @ApiProperty({ enum: UserStatus }) @IsEnum(UserStatus) status: UserStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
}

export class VerifyDocumentDto {
  @ApiProperty({ enum: ['VERIFIED', 'REJECTED'] })
  @IsEnum(['VERIFIED', 'REJECTED'])
  status: 'VERIFIED' | 'REJECTED';

  @ApiPropertyOptional() @IsOptional() @IsString() rejectionReason?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class VerifyEntityDto {
  @ApiProperty() @IsBoolean() isVerified: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class CreateRoleDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() displayName: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsArray() @IsString({ each: true })
  permissionIds?: string[];
}

export class UpdateRoleDto {
  @ApiPropertyOptional() @IsOptional() @IsString() displayName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsArray() @IsString({ each: true })
  permissionIds?: string[];
}

export class CreatePermissionDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() resource: string;
  @ApiProperty() @IsString() action: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
}

export class AssignPermissionsDto {
  @ApiProperty({ type: [String] })
  @IsArray() @IsString({ each: true })
  permissionIds: string[];
}
