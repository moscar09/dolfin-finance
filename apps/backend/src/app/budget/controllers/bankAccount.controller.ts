import { Controller, Get } from '@nestjs/common';
import { BankAccount } from '../entities/bankAccount.entity';
import { BankAccountService } from '../services/bankAccount.service';

@Controller('bankAccount')
export class BankAccountController {
  constructor(private bankAccountService: BankAccountService) {}
  @Get()
  findAll(): Promise<BankAccount[]> {
    return this.bankAccountService.findAll();
  }
}
