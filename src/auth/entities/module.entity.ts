import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ContentBlock } from 'src/dynamic-content/entities/content-block.entity';
import { IStyleRules } from 'src/dynamic-content/interfaces/IStyleRules.interface';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity({
  schema: 'auth',
  orderBy: { // returns modules ordered by their column `order`
    order: "ASC"
  }
})
export class Module {
  @IsNotEmpty()
  @Type(() => Number) // for transforming the string value that comes from a request
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column({
    unique: true
  })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Column({
    type: 'int'
  })
  order: number;

  @IsString()
  @Column({
    type: 'varchar',
    nullable: true,
    comment: "route used for building a router in the frontend. Value should be null if module has children and acts as a dropdown menu"
  })
  route: string | null;

  @IsString()
  @Column({
    type: 'varchar',
    nullable: true,
    comment: "API route used in the frontend to access the module's view data. Value should be null if module has children and acts as a dropdown menu"
  })
  contentRoute: string | null;
  
  @Column({
    type: 'json',
    nullable: true,
    comment: 'JSON object with rules that define the styling characteristics of the module (like the icon that accompanies the name in the menu)'
  })
  styleRules: Pick<IStyleRules, 'icon'> | null;

  @IsBoolean()
  @Column({
    default: true
  })
  active: boolean

  /**
   * Blocks of content that compose a module's view, they can be forms, buttons, tables, etc.
   */
  @OneToMany(() => ContentBlock, contentBlock => contentBlock.module)
  contentBlocks: ContentBlock[];

  /*----- SELF REFERENCING RELATIONSHIP -----*/
  @ManyToOne(() => Module, module => module.childrenModules)
  parentModule: Module | null;

  @OneToMany(() => Module, module => module.parentModule, { eager: true })
  childrenModules: Module[];
  /*-----------------------------------------*/
}