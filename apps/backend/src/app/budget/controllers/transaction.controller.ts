import { Controller, Get, Query } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { TransactionDto } from '@dolfin-finance/api-types';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  getByDate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ): TransactionDto[] {
    return [];
  }
}
