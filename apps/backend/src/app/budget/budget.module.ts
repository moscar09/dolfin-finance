import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankStatementParserModule } from '../bank-statement-parser/bank-statement-parser.module';
import { BankAccountController } from './controllers/bankAccount.controller';
import { BudgetCategoryController } from './controllers/budgetCategory.controller';
import { MonthlyBudgetController } from './controllers/monthlyBudget.controller';
import { TransactionController } from './controllers/transaction.controller';
import { BankAccount } from './entities/bankAccount.entity';
import { BudgetAllocation } from './entities/budgetAllocation.entity';
import { BudgetCategory } from './entities/budgetCategory.entity';
import { BudgetCategoryGroup } from './entities/budgetCategoryGroup.entity';
import { MonthlyBudget } from './entities/monthlyBudget.entity';
import { Transaction } from './entities/transaction.entity';
import { BankAccountService } from './services/bankAccount.service';
import { BudgetCategoryService } from './services/budgetCategory.service';
import { MonthlyBudgetService } from './services/monthlyBudget.service';
import { StatementFileUploadParserService } from './services/statementFileUploadParser.service';
import { TransactionService } from './services/transaction.service';
import { Camt053ParserService } from '../bank-statement-parser/services/camt053Parser.service';
@Module({
  imports: [
    BankStatementParserModule,
    TypeOrmModule.forFeature([
      BankAccount,
      BudgetAllocation,
      BudgetCategory,
      BudgetCategoryGroup,
      MonthlyBudget,
      Transaction,
    ]),
  ],
  providers: [
    BankAccountService,
    BudgetCategoryService,
    Camt053ParserService,
    MonthlyBudgetService,
    TransactionService,
    StatementFileUploadParserService,
  ],
  controllers: [
    BankAccountController,
    BudgetCategoryController,
    MonthlyBudgetController,
    TransactionController,
  ],
})
export class BudgetModule {}
