import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OtpPurpose, Prisma, User, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { JwtPayload } from '../common/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { LoginWithEmailDto, LoginWithPhoneDto, AuthTokensDto, LoginResponseDto } from './dto/login.dto';
import { OtpSentResponseDto, SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { RefreshTokenPayload } from './strategies/refresh-token.strategy';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
  ) {}

  // ============================================================
  // REGISTRATION
  // ============================================================
  async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Either email or phone number is required');
    }

    if (dto.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot register as Super Admin');
    }

    if (dto.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (existing) throw new ConflictException('Email address already registered');
    }

    if (dto.phone) {
      const existing = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
      if (existing) throw new ConflictException('Phone number already registered');
    }

    let passwordHash: string | undefined;
    if (dto.password) {
      passwordHash = await bcrypt.hash(dto.password, 12);
    }

    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        role: dto.role,
        status: UserStatus.PENDING_VERIFICATION,
      },
    });

    // Create role-specific profile
    await this.createRoleProfile(user.id, dto.role);

    this.logger.log(`New user registered: ${user.id} (${dto.role})`);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email ?? undefined,
      phone: user.phone ?? undefined,
      role: user.role,
      status: user.status,
    };
  }

  private async createRoleProfile(userId: string, role: UserRole): Promise<void> {
    switch (role) {
      case UserRole.WORKER:
        await this.prisma.worker.create({ data: { userId } });
        break;
      case UserRole.CONTRACTOR:
        await this.prisma.contractor.create({ data: { userId } });
        break;
      default:
        break;
    }
  }

  // ============================================================
  // EMAIL LOGIN
  // ============================================================
  async loginWithEmail(dto: LoginWithEmailDto, ipAddress?: string, userAgent?: string): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email, deletedAt: null },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.validateUserStatus(user);

    const session = await this.createSession(user.id, dto.deviceInfo, ipAddress, userAgent);
    const tokens = await this.generateTokens(user, session.id);
    await this.updateLastLogin(user.id);

    return this.buildLoginResponse(user, tokens);
  }

  // ============================================================
  // OTP SEND
  // ============================================================
  async sendOtp(dto: SendOtpDto): Promise<OtpSentResponseDto> {
    const rateLimitKey = `otp:ratelimit:${dto.phone}`;
    const attempts = await this.redis.incr(rateLimitKey);

    if (attempts === 1) {
      await this.redis.expire(rateLimitKey, 60 * 60); // 1 hour window
    }

    if (attempts > 5) {
      throw new BadRequestException('Too many OTP requests. Please try again after 1 hour.');
    }

    if (dto.purpose === OtpPurpose.LOGIN) {
      const user = await this.prisma.user.findUnique({
        where: { phone: dto.phone, deletedAt: null },
      });
      if (!user) {
        throw new NotFoundException('Phone number not registered. Please sign up first.');
      }
      await this.validateUserStatus(user);
    }

    // Invalidate previous OTPs
    await this.prisma.otpCode.updateMany({
      where: { identifier: dto.phone, purpose: dto.purpose, isUsed: false },
      data: { isUsed: true },
    });

    const expiryMinutes = this.configService.get<number>('otp.expiryMinutes', 10);
    const otpLength = this.configService.get<number>('otp.length', 6);
    const code = this.generateOtpCode(otpLength);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    await this.prisma.otpCode.create({
      data: {
        identifier: dto.phone,
        code,
        purpose: dto.purpose,
        expiresAt,
      },
    });

    // Cache OTP in Redis for fast retrieval
    await this.redis.setJson(`otp:${dto.phone}:${dto.purpose}`, { code, expiresAt }, expiryMinutes * 60);

    // In production, send via SMS provider (MSG91, Twilio)
    const isDev = this.configService.get<string>('nodeEnv') === 'development';
    if (isDev) {
      this.logger.debug(`[DEV] OTP for ${dto.phone}: ${code} (expires in ${expiryMinutes} min)`);
    } else {
      await this.sendSmsOtp(dto.phone, code);
    }

    return {
      message: `OTP sent to ${dto.phone.slice(0, -4)}****`,
      expiresInMinutes: expiryMinutes,
      phone: dto.phone,
      // Return OTP only in dev so frontend can auto-fill it
      ...(isDev && { devOtp: code }),
    };
  }

  // ============================================================
  // OTP VERIFY
  // ============================================================
  async verifyOtp(dto: VerifyOtpDto, ipAddress?: string, userAgent?: string): Promise<LoginResponseDto> {
    const maxAttempts = this.configService.get<number>('otp.maxAttempts', 3);
    const attemptsKey = `otp:attempts:${dto.phone}:${dto.purpose}`;
    const currentAttempts = parseInt((await this.redis.get(attemptsKey)) || '0', 10);

    if (currentAttempts >= maxAttempts) {
      throw new BadRequestException('Maximum OTP attempts exceeded. Please request a new OTP.');
    }

    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        identifier: dto.phone,
        purpose: dto.purpose,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      await this.redis.incr(attemptsKey);
      await this.redis.expire(attemptsKey, 300);
      throw new BadRequestException('Invalid or expired OTP. Please request a new one.');
    }

    if (otpRecord.code !== dto.code) {
      await this.prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } },
      });
      await this.redis.incr(attemptsKey);
      await this.redis.expire(attemptsKey, 300);
      throw new BadRequestException('Incorrect OTP. Please check and try again.');
    }

    // Mark OTP as used
    await this.prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });

    // Clear attempts
    await this.redis.del(attemptsKey);
    await this.redis.del(`otp:${dto.phone}:${dto.purpose}`);

    // Get or create user
    let user = await this.prisma.user.findUnique({
      where: { phone: dto.phone, deletedAt: null },
    });

    if (!user && dto.purpose === OtpPurpose.REGISTER) {
      user = await this.prisma.user.create({
        data: {
          phone: dto.phone,
          firstName: 'User',
          lastName: dto.phone.slice(-4),
          role: UserRole.WORKER,
          status: UserStatus.ACTIVE,
          phoneVerified: true,
        },
      });
      await this.createRoleProfile(user.id, UserRole.WORKER);
    } else if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update phone verification
    if (!user.phoneVerified) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: true, status: UserStatus.ACTIVE },
      });
      user = { ...user, phoneVerified: true, status: UserStatus.ACTIVE };
    }

    const session = await this.createSession(user.id, dto.deviceInfo, ipAddress, userAgent);
    const tokens = await this.generateTokens(user, session.id);
    await this.updateLastLogin(user.id);

    return this.buildLoginResponse(user, tokens);
  }

  // ============================================================
  // REFRESH TOKENS
  // ============================================================
  async refreshTokens(payload: RefreshTokenPayload): Promise<AuthTokensDto> {
    const session = await this.prisma.userSession.findFirst({
      where: {
        id: payload.sessionId,
        refreshToken: payload.refreshToken,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid or expired refresh token. Please login again.');
    }

    await this.validateUserStatus(session.user);

    // Rotate refresh token
    const newTokens = await this.generateTokens(session.user, session.id);

    await this.prisma.userSession.update({
      where: { id: session.id },
      data: {
        refreshToken: newTokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    });

    return {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
      expiresIn: newTokens.expiresIn,
      tokenType: 'Bearer',
    };
  }

  // ============================================================
  // LOGOUT
  // ============================================================
  async logout(sessionId: string, userId: string): Promise<void> {
    await this.prisma.userSession.updateMany({
      where: { id: sessionId, userId },
      data: { isActive: false },
    });

    // Blacklist access token in Redis
    await this.redis.set(`blacklist:session:${sessionId}`, '1', 60 * 60 * 24); // 24h TTL
  }

  async logoutAll(userId: string): Promise<void> {
    await this.prisma.userSession.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });
  }

  // ============================================================
  // HELPERS
  // ============================================================
  private async createSession(
    userId: string,
    deviceInfo?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const refreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn', '7d');
    const days = parseInt(refreshExpiresIn, 10);
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    return this.prisma.userSession.create({
      data: {
        userId,
        refreshToken: uuidv4(),
        deviceInfo,
        ipAddress,
        userAgent,
        expiresAt,
        isActive: true,
      },
    });
  }

  private async generateTokens(user: User, sessionId: string): Promise<TokenPair> {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: user.id,
      email: user.email ?? undefined,
      phone: user.phone ?? undefined,
      role: user.role,
      sessionId,
    };

    const accessExpiresIn = this.configService.get<string>('jwt.accessExpiresIn', '15m');
    const refreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn', '7d');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: accessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: refreshExpiresIn,
      }),
    ]);

    await this.prisma.userSession.update({
      where: { id: sessionId },
      data: { refreshToken },
    });

    const expiresInSeconds = this.parseExpiry(accessExpiresIn);

    return { accessToken, refreshToken, expiresIn: expiresInSeconds };
  }

  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 900;
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
    return value * (multipliers[unit] || 1);
  }

  private buildLoginResponse(user: User, tokens: TokenPair): LoginResponseDto {
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email ?? undefined,
        phone: user.phone ?? undefined,
        role: user.role,
        status: user.status,
        avatar: user.avatar ?? undefined,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
        tokenType: 'Bearer',
      },
    };
  }

  private async validateUserStatus(user: User): Promise<void> {
    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenException('Your account has been suspended. Please contact support.');
    }
    if (user.status === UserStatus.BANNED) {
      throw new ForbiddenException('Your account has been banned.');
    }
    if (user.status === UserStatus.INACTIVE) {
      throw new ForbiddenException('Your account is inactive. Please verify your account.');
    }
  }

  private async updateLastLogin(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date(), loginCount: { increment: 1 } },
    });
  }

  private generateOtpCode(length: number): string {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += digits[Math.floor(Math.random() * digits.length)];
    }
    return code;
  }

  private async sendSmsOtp(phone: string, code: string): Promise<void> {
    // Placeholder for SMS provider integration (MSG91, Twilio)
    // This would be implemented with actual SMS provider SDK
    this.logger.log(`SMS OTP sent to ${phone}: [REDACTED]`);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      include: {
        worker: { include: { location: true, skills: { include: { skill: true } } } },
        contractor: { include: { location: true, company: true } },
        companyAdmin: { include: { company: true } },
        admin: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const { passwordHash: _pw, ...safeUser } = user;
    return safeUser;
  }
}
