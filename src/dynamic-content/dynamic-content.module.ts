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
import { ContentBlock } from './entities/content-block.entity';
import { AuthService } from 'src/auth/auth.service';
import { FormFilterService } from './services/form-filter/form-filter.service';

@Module({
  imports: [TypeOrmModule.forFeature([Form, FormGroup, Session, User, ContentBlock])],
  controllers: [DynamicContentController],
  providers: [DynamicContentService, ConfigService, UserService, AuthService, FormFilterService]
})
export class DynamicContentModule {}
