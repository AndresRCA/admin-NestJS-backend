import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ schema: 'dynamic_content' })
export class Table {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({
    unique: true,
    comment: 'value used to identify the field used in fullDB api call'
  })
  tableOrigin: string;
}