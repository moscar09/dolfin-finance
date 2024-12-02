import {
  Balance,
  BalanceTypeCode,
  CashManagementEndOfDayReport,
  Entry,
} from 'iso20022.js';
import crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { TransactionPartyDto } from '../dto/transactionParty.dto';
import { ParsedTransactionDto } from '../dto/parsedTransaction.dto';
import currency from 'currency.js';

@Injectable()
export class Camt053ParserService {
  private deriveContraPartyName(domainSubFamilyCode: string) {
    switch (domainSubFamilyCode) {
      case 'CWDL':
      case 'XBCW':
        return 'Cash Withdrawal';
      case 'POSC':
      case 'POSD':
      case 'POSP':
      case 'XBCP':
        return 'Point-of-sale Payment';
      case 'COMM':
        return 'Commission / Bank Payments';
      default:
        return 'Unknown';
    }
  }

  private computeReferenceId(entry: Entry, dayIndex: number) {
    const key = [
      entry.bookingDate,
      entry.additionalInformation,
      entry.amount,
      entry.creditDebitIndicator,
      dayIndex,
    ].join('|');

    return crypto.createHash('md5').update(key).digest('hex');
  }

  private getTransactionData(
    entry: Entry,
    accountOwner: TransactionPartyDto,
    dayIndex: number
  ): ParsedTransactionDto {
    const transactionData = new ParsedTransactionDto();
    transactionData.accountOwner = accountOwner;
    transactionData.date = entry.bookingDate;
    transactionData.amount = currency(entry.amount, { fromCents: true });
    transactionData.isDebit = entry.creditDebitIndicator === 'debit';
    transactionData.description = entry.additionalInformation;

    if (entry.transactions.length === 0) {
      const contraPartyName = this.deriveContraPartyName(
        entry.bankTransactionCode.domainSubFamilyCode
      );
      transactionData.contraParty = new TransactionPartyDto(
        contraPartyName,
        entry.additionalInformation,
        false
      );
      transactionData.referenceId =
        entry.accountServicerReferenceId ||
        this.computeReferenceId(entry, dayIndex);
      return transactionData;
    }

    const [entryTransaction] = entry.transactions;

    if (entryTransaction.remittanceInformation) {
      transactionData.humanDescription = entryTransaction.remittanceInformation;
    }

    transactionData.referenceId = entryTransaction.accountServicerReferenceId;

    const contraPartyData = transactionData.isDebit
      ? entryTransaction.creditor
      : entryTransaction.debtor;

    const contraParty = new TransactionPartyDto(
      contraPartyData.name || '',
      (contraPartyData.account as { iban: string }).iban || '',
      true
    );

    transactionData.contraParty = contraParty;

    return transactionData;
  }

  public parse(input: string): {
    startingBalance: currency;
    startingBalanceDate: Date;
    recipientIban: string;
    transactions: ParsedTransactionDto[];
  } {
    const data = CashManagementEndOfDayReport.fromXML(input);

    const firstBalance = data.statements
      .reduce((prev, stmt) => [...prev, ...stmt.balances], [] as Balance[])
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .filter(
        (balance) => balance.type === BalanceTypeCode.PreviouslyClosedBooked
      )
      .pop();

    const { iban } = data.statements[0].account as { iban?: string };

    let parsedTransactions: ParsedTransactionDto[] = [];
    for (const statement of data.statements) {
      const accountOwner = new TransactionPartyDto(iban, iban, true);
      parsedTransactions = parsedTransactions.concat(
        statement.entries.map((entry, idx) =>
          this.getTransactionData(entry, accountOwner, idx)
        )
      );
    }
    return {
      recipientIban: iban,
      startingBalanceDate: firstBalance?.date,
      startingBalance: currency(firstBalance?.amount, { fromCents: true }),
      transactions: parsedTransactions,
    };
  }
}
