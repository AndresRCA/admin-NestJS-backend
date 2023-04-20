import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { IStyleRules } from '../interfaces/IStyleRules.interface';

@Entity({
  schema: 'dynamic_content',
  orderBy: {
    order: "ASC"
  }
})
export class ActionButton {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({
    comment: 'text that goes inside the button'
  })
  content: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  description: string | null;

  @Column({
    type: 'int'
  })
  order: number;

  @Column({
    type: 'varchar',
    nullable: true,
    comment: "function name that should be called in the client"
  })
  action: string | null;
  
  @Column({
    type: 'json',
    nullable: true,
    comment: 'JSON object with rules that define the styling characteristics of the content block (like the icon that accompanies the title)'
  })
  styleRules: Pick<IStyleRules, 'icon' | 'color'> | null;
}