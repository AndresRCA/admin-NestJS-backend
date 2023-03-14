import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { IFormControl } from '../interfaces/IFormControl.interface';
import { IStyleRules } from '../interfaces/IStyleRules.interface';
import { Form } from './form.entity';

@Entity({
  schema: 'forms',
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
    nullable: false,
    type: 'int'
  })
  order: number;

  @Column({
    nullable: false,
    type: 'json',
    comment: 'Json array of controls for form group'
  })
  controls: IFormControl[];

  @Column({
    nullable: true,
    type: 'json',
    comment: 'JSON object with rules that define the styling characteristics of this form'
  })
  styleRules?: IStyleRules;

  @ManyToOne(() => Form, (form) => form.formGroups, {
    cascade: true, // using a single entity (Form), allow operations to related tables like this one
    onDelete: "CASCADE" // when Form is removed, delete all form groups
  })
  form: Form;
}