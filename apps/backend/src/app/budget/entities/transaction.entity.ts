import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BankAccount } from './bankAccount.entity';
import { BudgetAllocation } from './budgetAllocation.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  referenceId: string;

  @Column()
  date: Date;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  humanDescription?: string;

  @Column()
  isDebit: boolean;

  @Column({ type: 'int' })
  amountCents: number;

  @ManyToOne(() => BankAccount, { nullable: true })
  sourceAccount?: BankAccount;

  @ManyToOne(() => BankAccount, { nullable: true })
  destAccount?: BankAccount;

  @ManyToOne(() => BudgetAllocation, { nullable: true })
  allocation?: BudgetAllocation;

  constructor(
    referenceId: string,
    date: Date,
    description: string,
    humanDescription: string,
    isDebit: boolean,
    amountCents: number,
    sourceAccount?: BankAccount,
    destAccount?: BankAccount
  ) {
    this.referenceId = referenceId;
    this.date = date;
    this.description = description;
    this.humanDescription = humanDescription;
    this.isDebit = isDebit;
    this.amountCents = amountCents;
    this.sourceAccount = sourceAccount;
    this.destAccount = destAccount;
  }
}
