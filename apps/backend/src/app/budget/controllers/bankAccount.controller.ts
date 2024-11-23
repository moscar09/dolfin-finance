import { BankAccountDto } from '@dolfin-finance/api-types';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetBankAccountByIdDto, GetBankAccountsQueryDto } from '../dto';
import { BankAccountService } from '../services/bankAccount.service';

@Controller('bank-account')
export class BankAccountController {
  constructor(private bankAccountService: BankAccountService) {}

  @Get()
  findAll(
    @Query() { type }: GetBankAccountsQueryDto
  ): Promise<BankAccountDto[]> {
    return this.bankAccountService.findAll({ type });
  }

  @Get(':id')
  findById(@Param() { id }: GetBankAccountByIdDto): Promise<BankAccountDto> {
    return this.bankAccountService.findById(id);
  }
}
