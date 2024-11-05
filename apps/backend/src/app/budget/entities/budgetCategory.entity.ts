import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BudgetCategoryGroup } from './budgetCategoryGroup.entity';
import { BudgetAllocation } from './budgetAllocation.entity';

@Entity()
export class BudgetCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => BudgetCategoryGroup, (bcg) => bcg.budgetCategories)
  group: BudgetCategoryGroup;

  @OneToMany(() => BudgetAllocation, (allocation) => allocation.category)
  allocations: BudgetAllocation[];

  constructor(name: string, group: BudgetCategoryGroup) {
    this.name = name;
    this.group = group;
  }
}
