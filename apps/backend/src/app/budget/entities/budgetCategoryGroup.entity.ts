import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BudgetCategory } from './budgetCategory.entity';

@Entity()
export class BudgetCategoryGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => BudgetCategory, (budgetCategory) => budgetCategory.group)
  budgetCategories: BudgetCategory[];
}
