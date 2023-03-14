import { Body, ConflictException, Controller, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiConflictResponse, ApiCreatedResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse, PickType } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { FastifyReply } from 'fastify';
import { Cookies } from 'src/decorators/cookies.decorator';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { createUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Session } from './entities/session.entity';
import { User } from './entities/user.entity';
import { ApiKeyAuthGuard } from './guards/api-key-auth.guard';
import { CookiesAuthGuard } from './guards/cookies-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@ApiSecurity('X-API-Key')
@UseGuards(ApiKeyAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Session) private sessionsRepository: Repository<Session>
  ) { }
  
  /**
   * User registration
   */
  @Post('signup')
  @ApiCreatedResponse({ description: 'User could sign up without any issues and a new user was made' })
  @ApiConflictResponse({ description: 'User already exists' })
  async createUser(@Body() newUser: createUserDto) {
    let user = this.usersRepository.create(newUser);
    user.password = this.authService.generateUserPassword(newUser.password);

    try {
      await this.usersRepository.save(user);
    } catch (error) { // user already exists or something went wrong with the database
      let errorDescription = 'Unknown error';
      if (error.detail.includes('username')) {
        errorDescription = 'That username is already taken';
      }
      if (error.detail.includes('email')) {
        errorDescription = 'That email is already taken';
      }
      // http code 409
      throw new ConflictException('This user already exists', { cause: error, description: errorDescription })
    }
  }

  /**
   * Return data associated with user and send cookie with session token
   */
  @UseGuards(LocalAuthGuard) // checks for username and password in body of request
  @Post('login')
  @ApiCreatedResponse({ description: 'User logged in without any issues and User object was returned', type: LoginDto })
  @ApiUnauthorizedResponse({ description: 'Login attempt failed' })
  async login(@Req() req: any, @Res({ passthrough: true }) res: FastifyReply): Promise<LoginDto> {
    const user = req['user']! as User; // user comes from LocalAuthGuard strategy (should be of type Pick<User, 'id' | 'username' | 'email' | 'modules'>)
    
    // if it's user first login, create a session row for them
    if (!user.session) {
      console.log('new session created');
      user.session = new Session();
    }

    const sessionToken = this.authService.generateUserSessionId();
    user.session.sessionToken = sessionToken;
    await this.usersRepository.save(user);

    res.setCookie(
      this.configService.get('SESSION_ID_NAME') as string,
      sessionToken,
      { maxAge: 60 } // expires in 20 seconds
    );

    const { session, updatedAt, ...response } = user;
    return response;
  }

  // guard should return a reference to the user)
  // @UseGuards(CookiesAuthGuard) make sure the correct user is logging out
  @Put('logout')
  @ApiCreatedResponse({ description: 'User succesfully logged out and their means of authentication was stripped away' })
  @ApiUnauthorizedResponse({ description: 'Non-current user tried to log out' })
  async logout(@Req() req: any, @Res({ passthrough: true }) res: FastifyReply, @Cookies() cookies: any) {
    const currentSessionToken: string = cookies[this.configService.get('SESSION_ID_NAME') as string];
    console.log('log out sessionToken:', currentSessionToken);
    await this.sessionsRepository.update({ sessionToken: currentSessionToken }, { sessionToken: undefined })
    res.clearCookie(this.configService.get('SESSION_ID_NAME') as string);
  }

  @UseGuards(CookiesAuthGuard)
  @Get('cookie-guarded')
  forbiddenResource(@Req() req: any) {
    console.log('user?', req['user'])
    console.log('req', req)
  }
}
