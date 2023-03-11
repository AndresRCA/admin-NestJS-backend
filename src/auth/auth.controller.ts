import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from './guards/api-key-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@ApiSecurity('X-API-Key')
@UseGuards(ApiKeyAuthGuard)
@Controller('auth')
export class AuthController {
  /**
   * User login
   */
  @UseGuards(LocalAuthGuard) // checks for username and password in body of request
  @Post('login')
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  login(@Body('username') username: string) {
    // return data for this username
    return username;
  }
}
