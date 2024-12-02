import { Expose, Type, Transform } from 'class-transformer';
import { BankAccountDto } from '../../lib/api-types';
import { WritableTransactionProps } from './WritableTransactionProps';

export class TransactionResponseDto implements WritableTransactionProps {
  @Expose()
  public id: number;
  @Expose()
  public referenceId?: string;
  @Expose()
  public date: Date;
  @Expose()
  public description: string;
  @Expose()
  public humanDescription?: string;
  @Expose()
  public isDebit: boolean;
  @Expose()
  public amountCents: number;

  @Expose()
  @Transform(({ obj }) => obj?.allocation?.category?.id)
  public budgetCategoryId?: number;

  @Expose()
  @Type(() => BankAccountDto)
  public sourceAccount?: BankAccountDto;

  @Expose()
  @Type(() => BankAccountDto)
  public destAccount?: BankAccountDto;
}
