import { InjectRepository } from '@nestjs/typeorm';
import { BudgetCategory } from '../entities/budgetCategory.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BudgetCategoryGroup } from '../entities/budgetCategoryGroup.entity';

@Injectable()
export class BudgetCategoryService {
  constructor(
    @InjectRepository(BudgetCategory)
    private budgetCategoryRepository: Repository<BudgetCategory>,

    @InjectRepository(BudgetCategoryGroup)
    private budgetCategoryGroupRepository: Repository<BudgetCategoryGroup>
  ) {}

  findAllWithGroup(): Promise<BudgetCategory[]> {
    return this.budgetCategoryRepository.find({ relations: ['group'] });
  }

  async create(name: string, groupId: number): Promise<BudgetCategory> {
    const group = await this.budgetCategoryGroupRepository.findOneByOrFail({
      id: groupId,
    });

    const category = new BudgetCategory(name, group);
    const { identifiers } = await this.budgetCategoryRepository.insert(
      category
    );

    category.id = identifiers[0].id;
    console.dir(category);

    return category;
  }

  async findById(id: number): Promise<BudgetCategory | null> {
    return this.budgetCategoryRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<boolean> {
    const res = await this.budgetCategoryRepository.delete({ id });
    return res.affected > 0;
  }
}
