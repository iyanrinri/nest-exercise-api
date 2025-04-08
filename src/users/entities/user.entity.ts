// src/user/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ length: 30 })
  role: string;

  @Column({ type: 'timestamp', nullable: true })
  email_verified_at: Date;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
