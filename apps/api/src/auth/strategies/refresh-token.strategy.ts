import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { JwtPayload } from '../../common/decorators/current-user.decorator';

export interface RefreshTokenPayload extends JwtPayload {
  refreshToken: string;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshSecret') || 'default-refresh-secret',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): RefreshTokenPayload {
    const refreshToken = req.body?.refreshToken as string;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    return { ...payload, refreshToken };
  }
}
