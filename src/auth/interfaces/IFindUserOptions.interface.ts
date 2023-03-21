import { FindOptionsWhere } from 'typeorm';
import { Session } from '../entities/session.entity';
import { User } from '../entities/user.entity';

export interface IFindUserOptions {
  where: FindOptionsWhere<User> | FindOptionsWhere<User>[] | undefined; // user columns
  // where clauses related to the user (for example session)
  relations: {
    session: {
      where: FindOptionsWhere<Session> | FindOptionsWhere<Session>[] | undefined; // session columns
    };
  };
}