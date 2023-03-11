import { OmitType } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";

export class UserQueryDto extends OmitType(User, ['id', 'password', 'session', 'createdAt', 'updatedAt'] as const) {}