import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonthlyBudget } from '../entities/monthlyBudget.entity';
import { BudgetAllocation } from '../entities/budgetAllocation.entity';
import { BudgetCategoryService } from './budgetCategory.service';

@Injectable()
export class MonthlyBudgetService {
  constructor(
    @InjectRepository(MonthlyBudget)
    private monthlyBudgetRepository: Repository<MonthlyBudget>,
    @InjectRepository(BudgetAllocation)
    private budgetAllocationRepository: Repository<BudgetAllocation>,
    private budgetCategoryService: BudgetCategoryService
  ) {}

  findByMMYY(month: number, year: number): Promise<MonthlyBudget> {
    return this.monthlyBudgetRepository.findOne({
      where: { month, year },
      relations: ['allocations', 'allocations.category'],
    });
  }

  async addAllocationToBudget(
    month: number,
    year: number,
    categoryId: number,
    amount: number
  ) {
    let monthlyBudget = await this.findByMMYY(month, year);

    if (!monthlyBudget) {
      monthlyBudget = await this.monthlyBudgetRepository.save(
        new MonthlyBudget(month, year)
      );
    }

    let [allocation] = monthlyBudget.allocations.filter(
      ({ category }) => category.id === categoryId
    );

    if (allocation) {
      allocation.amount = amount;
    } else {
      const category = await this.budgetCategoryService.findById(categoryId);
      allocation = new BudgetAllocation(monthlyBudget, category, amount);
    }

    return this.budgetAllocationRepository.save(allocation);
  }
}
