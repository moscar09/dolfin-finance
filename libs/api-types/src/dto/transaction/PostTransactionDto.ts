import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsIBAN,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { WritableTransactionProps } from './WritableTransactionProps';

export class PostTransactionDto implements WritableTransactionProps {
  @IsString()
  @IsOptional()
  referenceId?: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  humanDescription?: string;

  @IsBoolean()
  isDebit: boolean;

  @IsInt()
  @Min(1)
  amountCents: number;

  @IsInt()
  @IsOptional()
  budgetCategoryId?: number;

  @IsIBAN()
  @IsOptional()
  sourceAccountIBAN?: string;

  @IsIBAN()
  @IsOptional()
  destAccountIBAN?: string;
}
