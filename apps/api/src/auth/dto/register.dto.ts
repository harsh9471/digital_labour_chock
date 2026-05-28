import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'Rajesh' })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Kumar' })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  @MaxLength(50)
  lastName: string;

  @ApiPropertyOptional({ example: 'rajesh.kumar@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @Matches(/^\+91[6-9]\d{9}$/, { message: 'Invalid Indian phone number format (+91XXXXXXXXXX)' })
  phone?: string;

  @ApiPropertyOptional({ example: 'SecurePass@123' })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(50)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password?: string;

  @ApiProperty({ enum: UserRole, example: UserRole.WORKER })
  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(UserRole, { message: 'Invalid role' })
  role: UserRole;
}

export class RegisterResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  status: string;
}
