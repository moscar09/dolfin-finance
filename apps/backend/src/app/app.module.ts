import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BudgetModule } from './budget/budget.module';
import { BankAccountController } from './budget/controllers/bankAccount.controller';
import { BankAccount } from './budget/entities/bankAccount.entity';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
