import { Type } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { FormGroup } from './form-group.entity';

@Entity({ schema: 'forms' })
export class Form {
  @Type(() => Number) // for transforming the string value that comes from a request
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({
    nullable: false,
    unique: true
  })
  name: string;

  @OneToMany(() => FormGroup, (formGroup) => formGroup.form)
  formGroups: FormGroup[]
}