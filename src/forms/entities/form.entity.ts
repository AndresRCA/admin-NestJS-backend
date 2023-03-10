import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { IStyleRules } from '../interfaces/IStyleRules.interface';
import { FormGroup } from './form-group.entity';

@Entity({ schema: 'forms' })
export class Form {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @ApiProperty()
  @Column({
    nullable: false,
    unique: true
  })
  name: string;

  @Column({
    nullable: true,
    type: 'json',
    comment: 'JSON object with rules that define the styling characteristics of this form'
  })
  style_rules?: IStyleRules;

  @ApiProperty({ type: () => [FormGroup] })
  @OneToMany(() => FormGroup, (formGroup) => formGroup.form)
  formGroups: FormGroup[]
}