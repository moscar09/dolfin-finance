import { BankAccountDto } from './api-types';

export class FileUploadReceiptDto {
  constructor(
    public bankAccount: BankAccountDto,
    public startingBalance: number,
    public startingBalanceDate: Date,
    public isFirstUpload: boolean
  ) {}
}
