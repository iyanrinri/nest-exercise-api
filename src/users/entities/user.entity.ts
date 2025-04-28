import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Merchant } from 'src/merchants/entities/merchant.entity';
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

  @Column({ nullable: true, type: 'varchar' })
  reset_token: string | null;

  @Column({ type: 'timestamp', nullable: true })
  reset_token_expires: Date | null;

  @OneToMany(() => Merchant, (merchant) => merchant.user)
  merchants: Merchant[];
}
