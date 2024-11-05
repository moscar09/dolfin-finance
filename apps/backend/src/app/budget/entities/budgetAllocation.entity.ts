import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MonthlyBudget } from './monthlyBudget.entity';
import { BudgetCategory } from './budgetCategory.entity';

@Entity()
export class BudgetAllocation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MonthlyBudget, (budget) => budget.allocations)
  monthlyBudget: MonthlyBudget;

  @ManyToOne(() => BudgetCategory, (category) => category.allocations)
  category: BudgetCategory;

  @Column()
  amount: number;

  // @OneToMany(mappedBy = "allocation")
  // List<Transaction> transactionList = new ArrayList<>();
  // BigDecimal amount = BigDecimal.ZERO;

  constructor(
    monthlyBudget: MonthlyBudget,
    category: BudgetCategory,
    amount: number
  ) {
    this.monthlyBudget = monthlyBudget;
    this.category = category;
    this.amount = amount;
  }
}
