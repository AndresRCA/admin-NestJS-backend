import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { User } from './user.entity';

@Entity({ schema: 'auth' })
export class Session {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ nullable: true })
  sessionToken?: string;

  @OneToOne(() => User, (user) => user.session, { // enable bi-directional relation (we want to access user if we have a session)
    cascade: true, // using a single entity (Form), allow operations to related tables like this one
    onDelete: "CASCADE" // when Form is removed, delete all form groups
  })
  user: User;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}