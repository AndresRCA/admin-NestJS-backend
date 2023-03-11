import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private usersRepository: Repository<User>
  ) { }
  
  /**
   * Check if incoming X-API-Key header value is valid
   * @param apiKey incoming X-API-Key header value
   * @returns true if incoming key value is valid
   */
  validateApiKey(apiKey: string): boolean {
    return apiKey === this.configService.get('API_KEY');
  }

  async validateUser(username: string, password: string): Promise<Partial<User> | null> {
    const user = await this.usersRepository.findOne({
      where: { username }
    });

    if (user && user.password === password) {
      const { password, ...result } = user; // result is the user object but without the password
      return result;
    }

    return null;
  }

  generateUserSessionId(): string {
    return uuidv4();
  }
}
