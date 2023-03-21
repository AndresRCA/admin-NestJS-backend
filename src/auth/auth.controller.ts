import { Body, ConflictException, Controller, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { FastifyReply } from 'fastify';
import { Cookies } from 'src/decorators/cookies.decorator';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { createUserDto } from './dto/create-user.dto';
import { PublicUserDto } from './dto/public-user.dto';
import { Session } from './entities/session.entity';
import { User } from './entities/user.entity';
import { ApiKeyAuthGuard } from './guards/api-key-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionAuthGuard } from './guards/session-auth.guard';
import { UserService } from './services/user.service';

@ApiTags('auth')
@ApiSecurity('X-API-Key')
@UseGuards(ApiKeyAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private userService: UserService,
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
  @ApiCreatedResponse({ description: 'User logged in without any issues and User object was returned', type: PublicUserDto })
  @ApiUnauthorizedResponse({ description: 'Login attempt failed' })
  async login(@Req() req: any, @Res({ passthrough: true }) res: FastifyReply): Promise<PublicUserDto> {
    const user = req['user']! as Pick<User, 'id' | 'username' | 'email' | 'modules' | 'session' | 'roles'>; // user comes from LocalAuthGuard strategy
    // if it's user first login, create a session row for them
    if (!user.session) {
      console.log('new session created');
      user.session = new Session();
    }

    const sessionToken = this.authService.generateUserSessionId();
    console.log('new session for user:', sessionToken);
    user.session.sessionToken = sessionToken;
    await this.usersRepository.save(user);

    res.setCookie(
      this.configService.get('SESSION_ID_NAME') as string,
      sessionToken,
      { maxAge: 604800 } // maxAge is in seconds, so 604800s = 1 week
    );

    const { session, ...response } = user;
    return response;
  }

  @UseGuards(SessionAuthGuard) // guard should return a reference to the user
  @Put('logout')
  @ApiCreatedResponse({ description: 'User succesfully logged out and their means of authentication was stripped away' })
  @ApiUnauthorizedResponse({ description: 'Non-current user tried to log out' })
  async logout(@Res({ passthrough: true }) res: FastifyReply, @Cookies() cookies: any) {
    const currentSessionToken: string = cookies[this.configService.get('SESSION_ID_NAME') as string];
    console.log('log out sessionToken:', currentSessionToken);
    await this.sessionsRepository.update({ sessionToken: currentSessionToken }, { sessionToken: null })

    // because res.clearCookie() is not working, let's do it this way
    res.setCookie(
      this.configService.get('SESSION_ID_NAME') as string,
      '',
      { maxAge: 0 } // maxAge=0 should immediately expire the cookie when it arrives to the client
    );
  }

  /**
   * Retrieve data for user related to the session token passed by the client
   * @param req 
   * @returns User data for current session
   */
  @UseGuards(SessionAuthGuard) // check for session id cookie and pass user to request
  @Get('user-session')
  @ApiOkResponse({ description: 'User had a valid session token', type: PublicUserDto })
  @ApiUnauthorizedResponse({ description: "Session token wasn't valid" })
  async userSession(@Req() req: any): Promise<PublicUserDto | null> {
    const userId = req['userId']! as number;
    const user = this.userService.getPublicUserInfo({ id: userId });
    return user;
  }

  // work in progress SessionAuthGuard should probably not pass the user object but just check the cookie value
  /**
   * Check if session id is valid
   * @param req 
   * @returns User data for current session
   */
   //@UseGuards(SessionAuthGuard) // check for session id cookie and pass user to request (SessionAuthGuard does all the work)
   @Get('session/check-session')
   @ApiOkResponse({ description: 'User session is active' })
   @ApiUnauthorizedResponse({ description: "Session is not active or not present" })
   checkSession(): string {
    return 'session is active'
   }
}
