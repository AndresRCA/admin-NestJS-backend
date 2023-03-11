import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserQueryDto } from './dto/user-query.dto';
import { User } from './entities/user.entity';

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

  findUser(user: UserQueryDto): Promise<User | null> {
    return this.usersRepository.findOne({
      where: user
    });
  }
}
