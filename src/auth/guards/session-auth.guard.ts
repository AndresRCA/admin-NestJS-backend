import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

/**
 * Checks whether session is active or not. Reads the session id value in the client's cookie and checks if the session 
 * exists in the database.
 */
@Injectable()
export class SessionAuthGuard implements CanActivate {

  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    let signedSessionId = request.cookies[this.configService.get('SESSION_ID_NAME')];
    if (!signedSessionId) throw new UnauthorizedException(); // session does not exist

    const sessionId = request.unsignCookie(signedSessionId);
    if (!sessionId.valid || sessionId.value === null) throw new UnauthorizedException(); // session was tampered with

    const userId = await this.authService.validateUserSession(sessionId.value);
    if (!userId) throw new UnauthorizedException(); // session is not active or not present in database
    
    // pass userId to the request and complete validation
    request.userId = userId;
    return true;
  }
}