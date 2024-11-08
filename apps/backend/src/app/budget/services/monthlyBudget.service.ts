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

  createByMMYY(month: number, year: number): Promise<MonthlyBudget> {
    return this.monthlyBudgetRepository.save(new MonthlyBudget(month, year), {
      reload: true,
    });
  }

  async findOrCreateByMMYY(
    month: number,
    year: number
  ): Promise<MonthlyBudget> {
    const budget = await this.findByMMYY(month, year);
    return budget || this.createByMMYY(month, year);
  }

  getAllocation(
    monthlyBudget: MonthlyBudget,
    categoryId: number
  ): BudgetAllocation | undefined {
    const [allocation] = monthlyBudget.allocations.filter(
      ({ category }) => category.id === categoryId
    );
    return allocation;
  }

  async addAllocation(
    monthlyBudget: MonthlyBudget,
    categoryId: number,
    amountCents: number
  ) {
    let [allocation] = monthlyBudget.allocations.filter(
      ({ category }) => category.id === categoryId
    );

    if (allocation) {
      allocation.amountCents = amountCents;
    } else {
      const category = await this.budgetCategoryService.findById(categoryId);
      allocation = new BudgetAllocation(monthlyBudget, category, amountCents);
    }

    return this.budgetAllocationRepository.save(allocation);
  }
}
