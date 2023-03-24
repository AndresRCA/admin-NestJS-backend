import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserQueryDto } from 'src/auth/dto/user-query.dto';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { PublicUserDto } from '../dto/public-user.dto';
import { IFindUserOptions } from '../interfaces/IFindUserOptions.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) { }

  /**
   * Get user id given a set of arguments that relate to user
   * @param query user search filters
   * @returns id of user with the provided arguments
   */
  public async findUserId(options: Partial<IFindUserOptions>): Promise<number | null> {
    let user;
    
    // find by column values
    if (options.where) {
      user = await this.usersRepository.findOne({ where: options.where, select: { id: true }});
    }

    // find by relation
    if (options.relations?.session) {
      user = await this.usersRepository.findOne({ where: { session: options.relations.session.where }, select: { id: true } });
    }

    return user?.id || null;
  }

  /**
   * User object that holds everything that should be sent to the client (admin dashboard) upon login.
   * @param query user search parameters (column values)
   * @returns user object
   */
  public async getPublicUserInfo(query: UserQueryDto): Promise<PublicUserDto | null> {
    return await this.usersRepository.findOne({
      select: ['id', 'username', 'email'],
      where: query,
      relations: { // bring anything related to the user that might be relevant to the client
        modules: true, // dashboard modules (submodules are set to eager, so they will also come
        roles: true
      },
      order: { // order by the `order` column of `modules` and `sub_modules`
        modules: {
          order: 'ASC'
        }
      }
    });
  }

  /**
   * Get list of ids of controls the user should not have access to.
   * @param userId id to identify user
   * @returns array of ids (FK) that belong to form controls
   */
  public async getUserBlackListControlIds(userId: number): Promise<Array<number>> {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: { controlsBlackList: true } });
    if (!user) throw new InternalServerErrorException();
    
    let controlIds: Array<number> = [];
    if (user!.controlsBlackList.length > 0) {
      // get only an array of ids for the where clause
      controlIds = user!.controlsBlackList.map((control) => control.id);
    }

    return controlIds;
  }
}
