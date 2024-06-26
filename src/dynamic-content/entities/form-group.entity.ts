import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'
import { IStyleRules } from '../interfaces/IStyleRules.interface';
import { FormControl } from './form-control.entity';
import { Form } from './form.entity';

@Entity({
  schema: 'dynamic_content',
  orderBy: { // returns form groups ordered by their column `order`
    order: "ASC"
  }
})
export class FormGroup {
  @IsNotEmpty()
  @Type(() => Number) // for transforming the string value that comes from a request
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Column({
    type: 'int'
  })
  order: number;

  @Column({
    type: 'json',
    default: { "width": 12 },
    comment: 'JSON object with rules that define the styling characteristics of this form'
  })
  styleRules: IStyleRules;

  @ManyToOne(() => Form, (form) => form.formGroups, {
    cascade: true, // using a single entity (Form), allow operations to related tables like this one
    onDelete: "CASCADE" // when Form is removed, delete all form groups
  })
  form: Form;

  @OneToMany(() => FormControl, (formControl) => formControl.formGroup, { eager: true }) // when fetching formgroups, always bring along the form controls
  formControls: FormControl[]
}