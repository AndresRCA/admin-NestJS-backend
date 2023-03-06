import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
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

  @ApiProperty({ type: () => [FormGroup] })
  @OneToMany(() => FormGroup, (formGroup) => formGroup.form)
  formGroups: FormGroup[]
}