import { IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetBankAccountByIdDto {
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}
