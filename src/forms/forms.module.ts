import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { FormGroup } from './entities/form-group.entity';
import { Form } from './entities/form.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Form, FormGroup])],
  controllers: [FormsController],
  providers: [FormsService]
})
export class FormsModule {}
