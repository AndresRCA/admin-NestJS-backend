import { IsUUID } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { User } from './user.entity';

@Entity({ schema: 'auth' })
export class Session {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  
  @IsUUID()
  @Column({
    nullable: true,
    type: 'uuid'
  })
  sessionToken?: string | null;

  @OneToOne(() => User, (user) => user.session)
  user: User;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}