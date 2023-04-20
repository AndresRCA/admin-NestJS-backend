import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { FormGroup } from './form-group.entity';

@Entity({ schema: 'dynamic_content' })
export class Form {
  @IsNotEmpty()
  @Type(() => Number) // for transforming the string value that comes from a request
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column({
    nullable: false,
    unique: true
  })
  name: string;

  @OneToMany(() => FormGroup, (formGroup) => formGroup.form, { eager: true }) // when fetching forms, always bring along the form groups
  formGroups: FormGroup[]
}