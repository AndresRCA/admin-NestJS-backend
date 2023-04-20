import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { IFormControl } from '../interfaces/IFormControl.interface';
import { IStyleRules } from '../interfaces/IStyleRules.interface';
import { FormGroup } from './form-group.entity';

@Entity({
  schema: 'dynamic_content',
  orderBy: { // returns form controls ordered by their column `order`
    order: "ASC"
  }
})
export class FormControl {
  @IsNotEmpty()
  @Type(() => Number) // for transforming the string value that comes from a request
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @IsString()
  @Column({ nullable: true, type: 'text' })
  description: string | null;

  @IsNotEmpty()
  @IsNumber()
  @Column({ type: 'int' })
  order: number;

  @Column({
    type: 'json',
    comment: "Json object that defines the structure of a control (or controls that compose a FormArray's fields)"
  })
  control: IFormControl;

  @IsString()
  @Column({
    type: 'varchar',
    nullable: true,
    comment: "name of function to call in order to fetch the data used in this control"
  })
  dataSource: string | null;

  @Column({
    type: 'json',
    default: { "width": 12 },
    comment: 'JSON object with rules that define the styling characteristics of this control (width, icon, etc)'
  })
  styleRules: IStyleRules;

  @ManyToOne(() => FormGroup, (formGroup) => formGroup.formControls, {
    cascade: true, // using a single entity (FormGroup), allow operations to related tables like this one
    onDelete: "CASCADE" // when FormGroup is removed, delete all form controls
  })
  formGroup: FormGroup;
}