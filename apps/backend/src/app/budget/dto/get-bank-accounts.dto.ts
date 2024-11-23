import { BankAccountType } from '@dolfin-finance/api-types';
import { ArrayNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class GetBankAccountsQueryDto {
  @IsOptional()
  @ArrayNotEmpty()
  @IsEnum(BankAccountType, { each: true }) // Validates each item in the array
  type: BankAccountType[];
}
