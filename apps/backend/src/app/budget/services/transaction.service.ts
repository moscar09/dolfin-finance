import { BankAccountType } from '@dolfin-finance/api-types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ParsedTransactionDto } from '../../bank-statement-parser/dto/parsedTransaction.dto';
import { BankAccount } from '../entities/bankAccount.entity';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>
  ) {}

  async getTransactionsBetweenDates(startDate: Date, endDate: Date) {
    return this.transactionRepository.find({
      where: { date: Between(startDate, endDate) },
    });
  }

  async saveBulkTransactions(transactionsDto: ParsedTransactionDto[]) {
    const bankAccountByIBAN = await this.bankAccountRepository
      .find()
      .then((accounts) =>
        accounts.reduce(
          (acc, account) => ({ ...acc, [account.identifier]: account }),
          {}
        )
      );

    const accountsToAdd: BankAccount[] = [];

    for (const { accountOwner, contraParty } of transactionsDto) {
      for (const [idx, { name, accountNumber, isRealAccount }] of [
        accountOwner,
        contraParty,
      ].entries()) {
        if (isRealAccount && !bankAccountByIBAN[accountNumber]) {
          const newAccount = new BankAccount(
            name,
            accountNumber,
            idx === 0 ? BankAccountType.ASSET : BankAccountType.EXTERNAL
          );
          bankAccountByIBAN[accountNumber] = newAccount;
          accountsToAdd.push(newAccount);
        }
      }
    }

    await this.bankAccountRepository.save(accountsToAdd, { reload: true });

    const transactions: Transaction[] = [];
    for (const {
      referenceId,
      date,
      description,
      humanDescription,
      isDebit,
      amount,
      accountOwner,
      contraParty,
    } of transactionsDto) {
      let sourceAccount: BankAccount | undefined,
        destAccount: BankAccount | undefined;

      if (isDebit) {
        sourceAccount = bankAccountByIBAN[accountOwner.accountNumber];
        destAccount = bankAccountByIBAN[contraParty.accountNumber];
      } else {
        destAccount = bankAccountByIBAN[accountOwner.accountNumber];
        sourceAccount = bankAccountByIBAN[contraParty.accountNumber];
      }

      transactions.push(
        new Transaction(
          referenceId || '',
          date,
          description,
          humanDescription,
          isDebit,
          amount.cents(),
          sourceAccount,
          destAccount
        )
      );
    }

    await this.transactionRepository.save(transactions);
  }
}
