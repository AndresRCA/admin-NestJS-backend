import { PickType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class LoginDto extends PickType(User, ['id', 'username', 'email', 'modules'] as const) {}