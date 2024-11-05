import {
  BudgetCategoryDto,
  BudgetCategoryGroupDto,
  CreateBudgetCategoryDto,
} from '@dolfin-finance/api-types';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BudgetCategory } from '../entities/budgetCategory.entity';
import { BudgetCategoryService } from '../services/budgetCategory.service';

@Controller('budget-category')
export class BudgetCategoryController {
  constructor(private budgetCategoryService: BudgetCategoryService) {}

  @Get()
  async findAll(): Promise<BudgetCategoryDto[]> {
    const data = await this.budgetCategoryService.findAllWithGroup();

    return data.map(this.budgetCategoryToDto);
  }

  @Post()
  async createCategory(
    @Body() { name, groupId }: CreateBudgetCategoryDto
  ): Promise<BudgetCategoryDto> {
    const category = await this.budgetCategoryService.create(name, groupId);
    return this.budgetCategoryToDto(category);
  }

  @Delete(':id')
  async deleteCategory(@Param() { id }: { id: string }): Promise<boolean> {
    return await this.budgetCategoryService.delete(Number.parseInt(id));
  }

  private budgetCategoryToDto({
    id,
    name,
    group,
  }: BudgetCategory): BudgetCategoryDto {
    return new BudgetCategoryDto(
      id,
      name,
      new BudgetCategoryGroupDto(group.id, group.name)
    );
  }
}
