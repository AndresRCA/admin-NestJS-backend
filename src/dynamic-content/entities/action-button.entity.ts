import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Module } from 'src/auth/entities/module.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { IStyleRules } from '../interfaces/IStyleRules.interface';
import { ContentBlock } from './content-block.entity';

@Entity({
  schema: 'dynamic_content',
  orderBy: { // returns modules ordered by their column `order`
    order: "ASC"
  }
})
export class ActionButton {
  @IsNotEmpty()
  @Type(() => Number) // for transforming the string value that comes from a request
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({
    type: 'varchar',
    nullable: true
  })
  description: string | null;

  @IsNotEmpty()
  @IsNumber()
  @Column({
    type: 'int'
  })
  order: number;

  @Column({
    type: 'varchar',
    nullable: true,
    comment: "function that should be called in the client"
  })
  action: string | null;
  
  @Column({
    type: 'json',
    nullable: true,
    comment: 'JSON object with rules that define the styling characteristics of the content block (like the icon that accompanies the title)'
  })
  styleRules: Pick<IStyleRules, 'icon'> | null;

  @Column({
    type: 'json',
    comment: "Json object that defines the structure of an element"
  })
  element: Object;

  @ManyToOne(() => ContentBlock, contentBlock => contentBlock.actionsButtons, {
    cascade: true, // using a single entity (Module), allow operations to related tables like this one
    onDelete: "CASCADE" // when Module is removed, delete all ContentBlock related to it
  })
  contentBlock: Module;
}