import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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
}
