import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { Session } from './entities/session.entity';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Session) private sessionsRepository: Repository<Session>
  ) { }
  
  /**
   * Check if incoming X-API-Key header value is valid
   * @param apiKey incoming X-API-Key header value
   * @returns true if incoming key value is valid
   */
  public validateApiKey(apiKey: string): boolean {
    return apiKey === this.configService.get('API_KEY');
  }

  /**
   * Checks wether a user exists and returns it when it does
   * @param username 
   * @param password 
   * @returns returns user if it exists, null otherwise
   */
  public async validateUser(username: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersRepository.findOne({
      where: { username }
    });

    if (user && user.password === password) {
      const { password, ...result } = user; // result is the user object but without the password
      return result;
    }

    return null;
  }

  /**
   * Check if user with the given sessionToken exists and returns user
   * @param sessionToken 
   * @returns User
   */
  public async validateUserSession(sessionToken: string | undefined): Promise<Omit<User, 'password'> | null> {
    if (!sessionToken) return null; // user doesn't even have the session id cookie (either it expired or they never had it in the first place)

    // find a session with sessionToken
    let session = await this.sessionsRepository.findOne({ where: { sessionToken }, relations: { user: true } });
    console.log('found session:', session);
    if (session) {
      const { password, ...result } = session.user;
      return result; // return user
    }

    return null;
  }

  public generateUserPassword(password: string): string {
    return password; // add proper hashing and cryptography later
  }

  public generateUserSessionId(): string {
    return uuidv4();
  }
}
