import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IStyleRules } from 'src/forms/interfaces/IStyleRules.interface';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm'
import { ContentBlock } from './content-block';

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

  @IsNotEmpty()
  @IsString()
  @Column({
    type: 'varchar',
    nullable: true,
    comment: "route used in the frontend to access the module's view data (if route isn't null, this module shouldn't possess any submodules)"
  })
  action: string | null;
  
  @Column({
    type: 'json',
    nullable: true,
    comment: 'JSON object with rules that define the styling characteristics of the module (like the icon that accompanies the name in the menu)'
  })
  styleRules: Pick<IStyleRules, 'icon'> | null;

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
  parentModule: Module;

  @OneToMany(() => Module, module => module.parentModule, { eager: true })
  childrenModules: Module[];
  /*-----------------------------------------*/
}