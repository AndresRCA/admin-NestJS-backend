import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * This entity is used to hold the different kinds of form filters that can be seen in "busqueda avanzada", "reportes".
 * It refers to a category that holds search filters.
 */
@Entity({ schema: 'dynamic_content' })
export class FormFilter {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
    comment: "Name of function that retrieves the data for this form filter"
  })
  dataSource: string | null;
}