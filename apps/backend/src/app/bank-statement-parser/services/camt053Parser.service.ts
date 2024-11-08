import { CashManagementEndOfDayReport, Entry } from 'iso20022.js';

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

  private getTransactionData(
    entry: Entry,
    accountOwner: TransactionPartyDto
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
      transactionData.referenceId = entry.accountServicerReferenceId;
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

  parse(input: string): ParsedTransactionDto[] {
    const data = CashManagementEndOfDayReport.fromXML(input);

    const { iban } = data.statements[0].account as { iban?: string };

    let parsedTransactions: ParsedTransactionDto[] = [];
    for (const statement of data.statements) {
      const accountOwner = new TransactionPartyDto(iban, iban, true);

      parsedTransactions = parsedTransactions.concat(
        statement.entries.map((entry) =>
          this.getTransactionData(entry, accountOwner)
        )
      );
    }
    return parsedTransactions;
  }
}
