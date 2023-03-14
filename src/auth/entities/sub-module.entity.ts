import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IStyleRules } from 'src/forms/interfaces/IStyleRules.interface';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Module } from './module.entity';

@Entity({
  schema: 'auth',
  orderBy: { // returns subModules ordered by their column `order`
    order: "ASC"
  }
})
export class SubModule {
  @IsNotEmpty()
  @Type(() => Number) // for transforming the string value that comes from a request
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Column({
    nullable: false,
    type: 'int'
  })
  order: number;

  @IsNotEmpty()
  @IsString()
  @Column({
    nullable: false,
    comment: "route used in the frontend to access the module's view"
  })
  route: string;

  @Column({
    nullable: true,
    type: 'json',
    comment: 'JSON object with rules that define the styling characteristics of the submodule (like the icon that accompanies the name)'
  })
  styleRules?: Pick<IStyleRules, 'icon'>;

  @ManyToOne(() => Module, (module) => module.subModules, {
    cascade: true,
    onDelete: "CASCADE"
  })
  module: Module;
}