import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './strategies/api-key.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { Session } from './entities/session.entity';
import { Module as UserModule } from './entities/module.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session, UserModule]), PassportModule],
  providers: [AuthService, UserService, ApiKeyStrategy, LocalStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
