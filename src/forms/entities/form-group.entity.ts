import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { IFormControl } from '../interfaces/IFormControl.interface';
import { IStyleRules } from '../interfaces/IStyleRules.interface';
import { Form } from './form.entity';

@Entity({ schema: 'forms' })
export class FormGroup {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column()
  name: string;

  @Column({
    nullable: false,
    type: 'int'
  })
  order: number;

  @Column({
    nullable: false,
    type: 'json',
    comment: 'Json array of controls for form group'
  })
  controls: IFormControl[];

  @Column({
    nullable: true,
    type: 'json',
    comment: 'JSON object with rules that define the styling characteristics of this form'
  })
  style_rules?: IStyleRules;

  @ManyToOne(() => Form, (form) => form.formGroups, {
    cascade: ["remove"]
  })
  form: Form;
}