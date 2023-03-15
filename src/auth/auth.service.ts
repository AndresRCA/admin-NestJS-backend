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
   * IMPORTANT: the user returned in this function is the one the client will have access to, so make sure to avoid sending sensitive data like
   * password or session info, and on the other hand make sure to send data that might be relevant to the like such as dashboard modules
   * @param username 
   * @param password 
   * @returns returns user if it exists, null otherwise
   */
  public async validateUser(username: string, password: string): Promise<Pick<User, 'id' | 'username' | 'email' | 'modules' | 'session'> | null> {
    const user = await this.usersRepository.findOne({
      select: ['id', 'username', 'password', 'email'],
      where: {
        username,
        // modules: { // bring only modules which are active
        //   active: true,
        //   subModules: {
        //     active: true
        //   }
        // }
      },
      relations: { // bring anything related to the user that might be relevant to the client
        modules: true, // dashboard modules (submodules are set to eager, so they will also come)
        session: true
      },
      order: {
        modules: {
          subModules: {
            order: "ASC"
          }
        }
      }
    });

    const encryptedPassword = this.generateUserPassword(password);
    if (user && user.password === encryptedPassword) {
      const { password, ...result } = user; // result is the user object but without the password
      return result as Pick<User, 'id' | 'username' | 'email' | 'modules'>; // return user with only these properties
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
    let session = await this.sessionsRepository.findOne({
      where: { sessionToken },
      relations: { user: true }
    });

    console.log('found session:', session);
    if (session) {
      const { password, ...result } = session.user;
      return result; // return user
    }

    return null;
  }

  /**
   * Generate an encrypted password to store into the database
   * @param password 
   * @returns encrypted password
   */
  public generateUserPassword(password: string): string {
    return password; // add proper hashing and cryptography later
  }

  /**
   * Generates an uuid that identifies a user session
   * @returns uuid string
   */
  public generateUserSessionId(): string {
    return uuidv4();
  }
}
