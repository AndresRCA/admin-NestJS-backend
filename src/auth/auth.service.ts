import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(private configService: ConfigService) {}
  /**
   * Check if incoming X-API-Key header value is valid
   * @param apiKey incoming X-API-Key header value
   * @returns true if incoming key value is valid
   */
  validateApiKey(apiKey: string): boolean {
    return apiKey === this.configService.get('API_KEY');
  }
}
