import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { type BankAccountType } from '@dolfin-finance/api-types';

@Entity()
export class BankAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  prettyName: string;

  @Column()
  identifier: string;

  @Column({ type: 'varchar', length: '10' })
  type: BankAccountType;
}
