import { type BankAccountType } from '@dolfin-finance/api-types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ default: 0 })
  balance: number;

  @Column({ type: 'date', nullable: true })
  balanceDate: Date;

  constructor(name: string, identifier: string, type: BankAccountType) {
    this.name = name;
    this.identifier = identifier;
    this.type = type;
  }
}
