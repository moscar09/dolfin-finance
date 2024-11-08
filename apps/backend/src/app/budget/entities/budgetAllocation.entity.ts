import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MonthlyBudget } from './monthlyBudget.entity';
import { BudgetCategory } from './budgetCategory.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class BudgetAllocation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MonthlyBudget, (budget) => budget.allocations)
  monthlyBudget: MonthlyBudget;

  @ManyToOne(() => BudgetCategory, (category) => category.allocations)
  category: BudgetCategory;

  @Column()
  amountCents: number;

  @OneToMany(() => Transaction, (transaction) => transaction.allocation)
  transactions: Transaction[];

  constructor(
    monthlyBudget: MonthlyBudget,
    category: BudgetCategory,
    amountCents: number
  ) {
    this.monthlyBudget = monthlyBudget;
    this.category = category;
    this.amountCents = amountCents;
  }

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  async nullChecks() {
    if (!this.transactions) {
      this.transactions = [];
    }
  }
}
