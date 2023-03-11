import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm'
import { Session } from './session.entity';

@Entity({ schema: 'auth' })
export class User {
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
  username: string;

  @IsNotEmpty()
  @IsString()
  @Column({
    nullable: false
  })
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @Column({
    nullable: false,
    unique: true
  })
  email: string;

  @OneToOne(() => Session, (session) => session.user, { nullable: true }) // enable bi-directional relation (we want to access user if we have a session)
  @JoinColumn() // required decorator for OneToOne
  session?: Session;

  @IsDate()
  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @IsDate()
  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}