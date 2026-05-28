import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginWithEmailDto {
  @ApiProperty({ example: 'rajesh.kumar@example.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({ example: 'SecurePass@123' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: 'Mozilla/5.0...' })
  @IsOptional()
  @IsString()
  deviceInfo?: string;
}

export class LoginWithPhoneDto {
  @ApiProperty({ example: '+919876543210' })
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\+91[6-9]\d{9}$/, { message: 'Invalid Indian phone number format (+91XXXXXXXXXX)' })
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceInfo?: string;
}

export class AuthTokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: number;

  @ApiProperty()
  tokenType: string;
}

export class LoginResponseDto {
  @ApiProperty()
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    role: string;
    status: string;
    avatar?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  };

  @ApiProperty()
  tokens: AuthTokensDto;
}
