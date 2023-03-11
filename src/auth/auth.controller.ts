import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ApiKeyAuthGuard } from './guards/api-key-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@ApiSecurity('X-API-Key')
@UseGuards(ApiKeyAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }
  
  /**
   * User registration
   */
  @Post('signup')
  @ApiCreatedResponse()
  async createUser(@Body() newUser: createUserDto) {
    await this.usersRepository.save(newUser);
  }

  /**
   * User login
   */
  @UseGuards(LocalAuthGuard) // checks for username and password in body of request
  @Post('login')
  @ApiCreatedResponse()
  login(@Body('username') username: string) {
    // return data for this username
    return username;
  }
}
