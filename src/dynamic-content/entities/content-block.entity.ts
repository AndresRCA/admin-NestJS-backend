import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Module } from 'src/auth/entities/module.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm'
import { ActionButton } from './action-button.entity';
import { FilterForm } from './filter-form.entity';
import { Form } from './form.entity';

export enum ContentBlockType {
  FORM = 'form',
  ACTION_BUTTONS = 'action buttons',
  TABLE = 'table',
  FILTER_FORM = 'filter form'
}

@Entity({
  schema: 'dynamic_content',
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

  @ManyToMany(() => Form, { eager: true })
  @JoinTable({ name: 'content_block_forms' })
  forms: Form[];
  
  @ManyToMany(() => ActionButton, { eager: true })
  @JoinTable({ name: 'content_block_action_buttons' })
  actionButtons: ActionButton[];

  @ManyToMany(() => FilterForm, { eager: true })
  @JoinTable({ name: 'content_block_form_filters' })
  formFilters: FilterForm[];

  @ManyToOne(() => Module, module => module.contentBlocks, {
    cascade: true, // using a single entity (Module), allow operations to related tables like this one
    onDelete: "CASCADE" // when Module is removed, delete all ContentBlock related to it
  })
  module: Module;
}