import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { FormControl } from 'src/forms/entities/form-control.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToMany, JoinTable } from 'typeorm'
import { Module } from './module.entity';
import { Role } from './role.entity';
import { Session } from './session.entity';

@Entity({ schema: 'auth' })
export class User {
  @IsNotEmpty()
  @Type(() => Number) // for transforming the string value that comes from a request
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column({ unique: true })
  username: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  active: boolean;

  /*---------- ONE TO ONE RELATIONSHIPS -------------*/
  @OneToOne(() => Session, (session) => session.user, { // enable bi-directional relation (we want to access user if we have a session)
    nullable: true,
    cascade: true, // using a single entity (Session), allow operations to related tables like this one
    onDelete: "CASCADE" // when User is removed, delete session
  })
  @JoinColumn() // required decorator for OneToOne
  session?: Session | null;
  /*-------------------------------------------------*/
  /*---------- MANY TO MANY RELATIONSHIPS -------------*/
  /**
   * User modules that are displayed in the dashboard
   */
  @ManyToMany(() => Module, {
    nullable: true
  })
  @JoinTable({ name: 'user_modules' })
  modules?: Module[] | null;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  /**
   * List of form controls that a user is not allowed to see/use
   */
  @ManyToMany(() => FormControl, {
    nullable: true
  })
  @JoinTable({ name: 'user_controls_black_list' })
  controlsBlackList?: FormControl[] | null;
  /*---------------------------------------------------*/

  @IsDate()
  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @IsDate()
  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}