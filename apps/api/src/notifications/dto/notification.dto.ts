import {
  IsString, IsEnum, IsOptional, IsBoolean, IsArray, IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  NotificationType, NotificationChannel,
} from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty() @IsString() userId: string;
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() body: string;
  @ApiPropertyOptional({ enum: NotificationType }) @IsOptional() @IsEnum(NotificationType) type?: NotificationType;
  @ApiPropertyOptional({ enum: NotificationChannel }) @IsOptional() @IsEnum(NotificationChannel) channel?: NotificationChannel;
  @ApiPropertyOptional() @IsOptional() @IsObject() data?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() imageUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() actionUrl?: string;
}

export class BulkNotificationDto {
  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true }) userIds: string[];
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() body: string;
  @ApiPropertyOptional({ enum: NotificationType }) @IsOptional() @IsEnum(NotificationType) type?: NotificationType;
  @ApiPropertyOptional({ enum: NotificationChannel }) @IsOptional() @IsEnum(NotificationChannel) channel?: NotificationChannel;
  @ApiPropertyOptional() @IsOptional() @IsObject() data?: Record<string, unknown>;
}

export class CreateTemplateDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ enum: NotificationType }) @IsEnum(NotificationType) type: NotificationType;
  @ApiProperty({ enum: NotificationChannel }) @IsEnum(NotificationChannel) channel: NotificationChannel;
  @ApiProperty() @IsString() titleTemplate: string;
  @ApiProperty() @IsString() bodyTemplate: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) variables?: string[];
}

export class UpdateTemplateDto {
  @ApiPropertyOptional() @IsOptional() @IsString() titleTemplate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bodyTemplate?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}

export class MarkReadDto {
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) ids?: string[];
}
