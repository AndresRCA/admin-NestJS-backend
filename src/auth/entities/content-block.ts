import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Form } from 'src/forms/entities/form.entity';
import { IStyleRules } from 'src/forms/interfaces/IStyleRules.interface';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm'
import { Module } from './module.entity';

export enum ContentBlockType {
  FORM = 'form',
  ACTION_BUTTONS = 'action buttons',
  TABLE = 'table',
  FILTER = 'filter'
}

@Entity({
  schema: 'auth',
  orderBy: { // returns modules ordered by their column `order`
    order: "ASC"
  }
})
export class ContentBlock {
  @IsNotEmpty()
  @Type(() => Number) // for transforming the string value that comes from a request
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({
    type: 'varchar',
    nullable: true
  })
  title: string | null;

  @IsNotEmpty()
  @IsNumber()
  @Column({
    type: 'int'
  })
  order: number;

  @Column({
    type: 'enum',
    enum: ContentBlockType,
    comment: "defines the format that should be used in the client"
  })
  type: ContentBlockType;

  @Column({
    type: 'varchar',
    nullable: true,
    comment: "route used in the frontend to access the module's view data (if route isn't null, this module shouldn't possess any submodules)"
  })
  action: string | null;
  
  @Column({
    type: 'json',
    nullable: true,
    comment: 'JSON object with rules that define the styling characteristics of the content block (like the icon that accompanies the title)'
  })
  styleRules: Pick<IStyleRules, 'icon'> | null;

  @ManyToOne(() => Form, (form) => form.contentBlocks)
  form: Form;
  
  @ManyToOne(() => Form, (form) => form.contentBlocks)
  actionsButtons: Form;

  @ManyToOne(() => Module, module => module.childrenModules, {
    cascade: true, // using a single entity (Module), allow operations to related tables like this one
    onDelete: "CASCADE" // when Module is removed, delete all ContentBlock related to it
  })
  module: Module;
}