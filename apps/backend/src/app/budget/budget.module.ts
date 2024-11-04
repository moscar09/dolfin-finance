import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from './entities/bankAccount.entity';
import { BankAccountService } from './services/bankAccount.service';
import { BankAccountController } from './controllers/bankAccount.controller';
import { BudgetAllocation } from './entities/budgetAllocation.entity';
import { BudgetCategory } from './entities/budgetCategory.entity';
import { BudgetCategoryGroup } from './entities/budgetCategoryGroup.entity';
import { MonthlyBudget } from './entities/monthlyBudget.entity';
import { BudgetCategoryService } from './services/budgetCategory.service';
import { BudgetCategoryController } from './controllers/budgetCategory.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BankAccount,
      BudgetAllocation,
      BudgetCategory,
      BudgetCategoryGroup,
      MonthlyBudget,
    ]),
  ],
  providers: [BankAccountService, BudgetCategoryService],
  controllers: [BankAccountController, BudgetCategoryController],
})
export class BudgetModule {}
