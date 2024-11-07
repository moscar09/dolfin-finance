import currency from 'currency.js';
import { TransactionPartyDto } from './transactionParty.dto';
export class ParsedTransactionDto {
  referenceId: string;
  description: string;
  humanDescription: string;
  date: Date;
  isDebit: boolean;
  accountOwner: TransactionPartyDto;
  contraParty: TransactionPartyDto;
  amount: currency;
}
