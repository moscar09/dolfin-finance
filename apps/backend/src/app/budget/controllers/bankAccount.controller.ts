import { BankAccountDto } from '@dolfin-finance/api-types';
import { Controller, Get } from '@nestjs/common';
import { BankAccountService } from '../services/bankAccount.service';

@Controller('bank-account')
export class BankAccountController {
  constructor(private bankAccountService: BankAccountService) {}
  @Get()
  findAll(): Promise<BankAccountDto[]> {
    return this.bankAccountService.findAll();
  }
}
