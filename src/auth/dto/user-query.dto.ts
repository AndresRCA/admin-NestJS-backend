import { OmitType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class UserQueryDto extends OmitType(User, ['id', 'password', 'session', 'createdAt', 'updatedAt'] as const) {}