import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionAuthGuard implements CanActivate {

  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.cookies[this.configService.get('SESSION_ID_NAME')];
    let user = await this.authService.validateUserSession(sessionId);
    
    if (user !== null) {
      request.user = user;
      return true
    }
    
    return false;
  }
}