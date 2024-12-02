import { BankAccountDto } from '@dolfin-finance/api-types';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetBankAccountByIdDto, GetBankAccountsQueryDto } from '../dto';
import { BankAccountService } from '../services/bankAccount.service';
import { plainToInstance } from 'class-transformer';

@Controller('bank-account')
export class BankAccountController {
  constructor(private bankAccountService: BankAccountService) {}

  @Get()
  async findAll(
    @Query() { type }: GetBankAccountsQueryDto
  ): Promise<BankAccountDto[]> {
    const bankAccounts = await this.bankAccountService.findAll({ type });
    return plainToInstance(BankAccountDto, bankAccounts);
  }

  @Get(':id')
  async findById(
    @Param() { id }: GetBankAccountByIdDto
  ): Promise<BankAccountDto> {
    return plainToInstance(
      BankAccountDto,
      this.bankAccountService.findById(id)
    );
  }
}
