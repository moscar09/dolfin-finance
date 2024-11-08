import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterLoad,
  AfterUpdate,
} from 'typeorm';
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

  constructor(name: string, identifier: string, type: BankAccountType) {
    this.name = name;
    this.identifier = identifier;
    this.type = type;
  }
}
