import { Module } from '@nestjs/common';
import { DynamicContentService } from './dynamic-content.service';
import { DynamicContentController } from './dynamic-content.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { FormGroup } from './entities/form-group.entity';
import { Form } from './entities/form.entity';
import { Session } from 'src/auth/entities/session.entity';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/auth/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Form, FormGroup, Session, User])],
  controllers: [DynamicContentController],
  providers: [DynamicContentService, ConfigService, UserService]
})
export class DynamicContentModule {}
