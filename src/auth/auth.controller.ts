import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCreatedResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { FastifyReply } from 'fastify';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { createUserDto } from './dto/create-user.dto';
import { Session } from './entities/session.entity';
import { User } from './entities/user.entity';
import { ApiKeyAuthGuard } from './guards/api-key-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@ApiSecurity('X-API-Key')
@UseGuards(ApiKeyAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    @InjectRepository(User) private usersRepository: Repository<User>
  ) { }
  
  /**
   * User registration
   */
  @Post('signup')
  @ApiCreatedResponse()
  async createUser(@Body() newUser: createUserDto) {
    let user = this.usersRepository.create(newUser);
    user.password = this.authService.generateUserPassword(newUser.password);
    await this.usersRepository.save(user);
  }

  /**
   * Return data associated with user and send cookie with session token
   */
  @UseGuards(LocalAuthGuard) // checks for username and password in body of request
  @Post('login')
  @ApiCreatedResponse()
  async login(@Req() req: any, @Res({ passthrough: true }) res: FastifyReply) {
    const user = req['user']! as User; // user comes from LocalAuthGuard strategy
    
     // if it's user first login, create a session row for them
    if (!user.session) user.session = new Session();
    
    const sessionToken = this.authService.generateUserSessionId();
    user.session.sessionToken = sessionToken;
    await this.usersRepository.save(user);

    res.setCookie(
      this.configService.get('SESSION_ID_NAME') as string,
      sessionToken,
      { maxAge: 20 } // expires in 20 seconds
    );
  }
}
