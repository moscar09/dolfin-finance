import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BudgetModule } from './budget/budget.module';
import { BankStatementParserModule } from './bank-statement-parser/bank-statement-parser.module';

@Module({
  imports: [
    BudgetModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'dolfin',
      password: 'dolfin',
      database: 'dolfin',
      autoLoadEntities: true,
      synchronize: true,
    }),
    BudgetModule,
    BankStatementParserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
