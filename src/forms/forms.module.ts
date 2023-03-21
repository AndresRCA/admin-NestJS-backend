import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { FormGroup } from './entities/form-group.entity';
import { Form } from './entities/form.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from 'src/auth/entities/session.entity';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/auth/entities/user.entity';
import { UserService } from 'src/auth/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Form, FormGroup, Session, User])],
  controllers: [FormsController],
  providers: [FormsService, ConfigService, UserService]
})
export class FormsModule {}
