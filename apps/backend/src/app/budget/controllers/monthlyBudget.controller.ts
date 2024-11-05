import {
  MonthlyBudgetAllocationState,
  MonthlyBudgetDto,
} from '@dolfin-finance/api-types';
import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { MonthlyBudgetService } from '../services/monthlyBudget.service';

@Controller('monthly-budget')
export class MonthlyBudgetController {
  constructor(private monthlyBudgetService: MonthlyBudgetService) {}

  @Get(':year/:month')
  async getByYYMM(
    @Param('year') year: string,
    @Param('month') month: string
  ): Promise<MonthlyBudgetDto> {
    const budget = await this.monthlyBudgetService.findByMMYY(
      Number.parseInt(month),
      Number.parseInt(year)
    );

    if (budget) {
      const { month, year, allocations } = budget;

      return new MonthlyBudgetDto(
        month,
        year,
        allocations.map(
          (allocation) =>
            new MonthlyBudgetAllocationState(
              allocation.category.id,
              allocation.amount,
              0
            )
        )
      );
    }
    return new MonthlyBudgetDto(
      Number.parseInt(month),
      Number.parseInt(year),
      []
    );
  }

  @Put(':year/:month/:categoryId')
  async updateAllocation(
    @Param('year') year: string,
    @Param('month') month: string,
    @Param('categoryId') categoryId: string,
    @Body() { amount }: { amount: string }
  ): Promise<MonthlyBudgetAllocationState> {
    const allocation = await this.monthlyBudgetService.addAllocationToBudget(
      Number.parseInt(month),
      Number.parseInt(year),
      Number.parseInt(categoryId),
      Number.parseFloat(amount)
    );

    return new MonthlyBudgetAllocationState(
      allocation.category.id,
      allocation.amount,
      0
    );
  }
}
