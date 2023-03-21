import { PartialType, PickType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class UserQueryDto extends PartialType(PickType(User, ['id', 'username', 'email'] as const)) {}