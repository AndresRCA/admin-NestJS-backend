import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { IFormControl } from '../interfaces/IFormControl.interface';
import { FormGroup } from './form-group.entity';

@Entity({
  schema: 'forms',
  orderBy: { // returns form controls ordered by their column `order`
    order: "ASC"
  }
})
export class FormControl {
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
  @Column({ type: 'int' })
  order: number;

  @Column({
    type: 'json',
    comment: "Json object that defines the structure of a control (or controls that compose a FormArray's fields)"
  })
  control: IFormControl;

  @ManyToOne(() => FormGroup, (formGroup) => formGroup.controls, {
    cascade: true, // using a single entity (FormGroup), allow operations to related tables like this one
    onDelete: "CASCADE" // when FormGroup is removed, delete all form controls
  })
  formGroup: FormGroup;
}