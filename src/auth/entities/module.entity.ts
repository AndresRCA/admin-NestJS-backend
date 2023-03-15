import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { IStyleRules } from 'src/forms/interfaces/IStyleRules.interface';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { SubModule } from './sub-module.entity';

@Entity({ schema: 'auth' })
export class Module {
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
  
  @Column({
    nullable: true,
    type: 'json',
    comment: 'JSON object with rules that define the styling characteristics of the module (like the icon that accompanies the name)'
  })
  styleRules?: Pick<IStyleRules, 'icon'>;

  @Column({
    nullable: false,
    default: true
  })
  active: boolean

  @OneToMany(() => SubModule, (subModule) => subModule.module, { eager: true }) // when fetching modules, always bring along the sub-modules
  subModules: SubModule[]
}