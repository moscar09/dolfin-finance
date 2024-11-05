import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BudgetAllocation } from './budgetAllocation.entity';

@Entity()
export class MonthlyBudget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  month: number;

  @Column()
  year: number;

  @OneToMany(() => BudgetAllocation, (allocation) => allocation.monthlyBudget)
  allocations: BudgetAllocation[];

  constructor(month: number, year: number) {
    this.month = month;
    this.year = year;
  }

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  async nullChecks() {
    if (!this.allocations) {
      this.allocations = [];
    }
  }
}
