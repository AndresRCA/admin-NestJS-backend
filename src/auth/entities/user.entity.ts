import { IsEmail, IsInt } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm'
import { Session } from './session.entity';

@Entity({ schema: 'auth' })
export class User {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({
    nullable: false,
    unique: true
  })
  username: string;

  @Column({
    nullable: false
  })
  password: string;

  @Column({
    nullable: false
  })
  @IsEmail()
  email: string;

  @OneToOne(() => Session, (session) => session.user, { nullable: true }) // enable bi-directional relation (we want to access user if we have a session)
  @JoinColumn() // required decorator for OneToOne
  session?: Session;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}