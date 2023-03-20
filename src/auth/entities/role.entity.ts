import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ schema: 'auth' })
export class Role {
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
}