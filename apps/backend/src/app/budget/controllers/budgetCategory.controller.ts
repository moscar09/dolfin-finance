import { Controller, Get } from '@nestjs/common';
import { BudgetCategoryService } from '../services/budgetCategory.service';
import {
  BudgetCategoryDto,
  BudgetCategoryGroupDto,
} from '@dolfin-finance/api-types';

@Controller('budget-category')
export class BudgetCategoryController {
  constructor(private budgetCategoryService: BudgetCategoryService) {}
  @Get()
  async findAll(): Promise<BudgetCategoryDto[]> {
    const data = await this.budgetCategoryService.findAllWithGroup();

    return data.map(
      ({ id, name, group }) =>
        new BudgetCategoryDto(
          id,
          name,
          new BudgetCategoryGroupDto(group.id, group.name)
        )
    );
  }
}
