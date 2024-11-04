import { InjectRepository } from '@nestjs/typeorm';
import { BudgetCategory } from '../entities/budgetCategory.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BudgetCategoryService {
  constructor(
    @InjectRepository(BudgetCategory)
    private budgetCategoryRepository: Repository<BudgetCategory>
  ) {}

  findAllWithGroup(): Promise<BudgetCategory[]> {
    return this.budgetCategoryRepository.find({ relations: ['group'] });
  }
}
