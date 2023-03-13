import { CookieStrategy } from 'passport-cookie';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

/**
 * CookieStrategy is a passport strategy for validating login attempts.Throws UnauthorizedException() when user is incorrect
 */
@Injectable()
export class CookiesStrategy extends PassportStrategy(CookieStrategy) {
  constructor(private configService: ConfigService, private authService: AuthService) {
    super({
      cookieName: configService.get('SESSION_ID_NAME'),
      signed: true
    }, async (sessionToken: string, done: Function) => {
      const user = await authService.validateUserSession(sessionToken);
      if (user) done(null, user);
      else done(new UnauthorizedException(), null);
    });
  }
}