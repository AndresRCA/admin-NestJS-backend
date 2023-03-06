import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Return description regarding the current version of the API.
   */
  @Get('version')
  @ApiOkResponse({ description: 'Message regarding the current API version.', type: String })
  getVersion(): string {
    return 'API Version ' + this.appService.getVersion();
  }
}
