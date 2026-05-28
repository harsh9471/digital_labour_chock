import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginWithEmailDto, LoginResponseDto, AuthTokensDto } from './dto/login.dto';
import { OtpSentResponseDto, SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RefreshTokenPayload } from './strategies/refresh-token.strategy';

@ApiTags('Authentication')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user (Worker, Contractor, Company Admin)' })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: RegisterResponseDto })
  @ApiResponse({ status: 409, description: 'Email or phone already exists' })
  async register(@Body() dto: RegisterDto): Promise<{ success: boolean; data: RegisterResponseDto; message: string }> {
    const data = await this.authService.register(dto);
    return { success: true, data, message: 'Registration successful. Please verify your account.' };
  }

  @Post('login/email')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async loginWithEmail(
    @Body() dto: LoginWithEmailDto,
    @Ip() ip: string,
    @Req() req: Request,
  ): Promise<{ success: boolean; data: LoginResponseDto; message: string }> {
    const userAgent = req.get('user-agent');
    const data = await this.authService.loginWithEmail(dto, ip, userAgent);
    return { success: true, data, message: 'Login successful' };
  }

  @Post('otp/send')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP to phone number for login/registration' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully', type: OtpSentResponseDto })
  @ApiResponse({ status: 404, description: 'Phone not found (for login)' })
  @ApiResponse({ status: 429, description: 'Too many OTP requests' })
  async sendOtp(@Body() dto: SendOtpDto): Promise<{ success: boolean; data: OtpSentResponseDto; message: string }> {
    const data = await this.authService.sendOtp(dto);
    return { success: true, data, message: data.message };
  }

  @Post('otp/verify')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and get authentication tokens' })
  @ApiResponse({ status: 200, description: 'OTP verified, tokens issued', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Ip() ip: string,
    @Req() req: Request,
  ): Promise<{ success: boolean; data: LoginResponseDto; message: string }> {
    const userAgent = req.get('user-agent');
    const data = await this.authService.verifyOtp(dto, ip, userAgent);
    return { success: true, data, message: 'OTP verified successfully' };
  }

  @Post('refresh')
  @Public()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed', type: AuthTokensDto })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshTokens(
    @CurrentUser() payload: RefreshTokenPayload,
    @Body() _dto: RefreshTokenDto,
  ): Promise<{ success: boolean; data: AuthTokensDto; message: string }> {
    const data = await this.authService.refreshTokens(payload);
    return { success: true, data, message: 'Tokens refreshed' };
  }

  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout current session' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(
    @CurrentUser() user: JwtPayload,
  ): Promise<{ success: boolean; message: string }> {
    await this.authService.logout(user.sessionId, user.sub);
    return { success: true, message: 'Logged out successfully' };
  }

  @Post('logout/all')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout from all devices' })
  @ApiResponse({ status: 200, description: 'Logged out from all devices' })
  async logoutAll(
    @CurrentUser() user: JwtPayload,
  ): Promise<{ success: boolean; message: string }> {
    await this.authService.logoutAll(user.sub);
    return { success: true, message: 'Logged out from all devices' };
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  async getMe(@CurrentUser() user: JwtPayload) {
    const data = await this.authService.getProfile(user.sub);
    return { success: true, data, message: 'Profile retrieved' };
  }
}
