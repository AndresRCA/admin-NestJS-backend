import { PickType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class createUserDto extends PickType(User, ['username', 'password', 'email'] as const) {}