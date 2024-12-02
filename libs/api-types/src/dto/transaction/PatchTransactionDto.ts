import { IsNumber } from 'class-validator';

export class PatchTransactionDto {
  @IsNumber()
  public categoryId: number;
}
