import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OtpPurpose } from '@prisma/client';

export class SendOtpDto {
  @ApiProperty({ example: '+919876543210' })
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\+91[6-9]\d{9}$/, { message: 'Invalid Indian phone number format (+91XXXXXXXXXX)' })
  phone: string;

  @ApiProperty({ enum: OtpPurpose, example: OtpPurpose.LOGIN })
  @IsNotEmpty()
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+919876543210' })
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\+91[6-9]\d{9}$/, { message: 'Invalid Indian phone number' })
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'OTP code is required' })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  code: string;

  @ApiProperty({ enum: OtpPurpose, example: OtpPurpose.LOGIN })
  @IsNotEmpty()
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceInfo?: string;
}

export class OtpSentResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  expiresInMinutes: number;

  @ApiProperty()
  phone: string;

  @ApiPropertyOptional({ description: 'OTP code — only present in development mode' })
  devOtp?: string;
}
