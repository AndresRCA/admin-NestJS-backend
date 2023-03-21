import { PickType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class PublicUserDto extends PickType(User, ['id', 'username', 'email', 'modules', 'roles'] as const) {}