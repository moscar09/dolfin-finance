import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BudgetCategoryGroup } from './budgetCategoryGroup.entity';

@Entity()
export class BudgetCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => BudgetCategoryGroup, (bcg) => bcg.budgetCategories)
  group: BudgetCategoryGroup[];
}
