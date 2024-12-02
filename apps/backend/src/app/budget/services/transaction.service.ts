import { BankAccountType, PostTransactionDto } from '@dolfin-finance/api-types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { ParsedTransactionDto } from '../../bank-statement-parser/dto/parsedTransaction.dto';
import { BankAccount } from '../entities/bankAccount.entity';
import { Transaction } from '../entities/transaction.entity';
import { MonthlyBudgetService } from './monthlyBudget.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
    private monthlyBudgetService: MonthlyBudgetService
  ) {}

  async getTransactionsBetweenDates(startDate: Date, endDate: Date) {
    return this.transactionRepository.find({
      where: { date: Between(startDate, endDate) },
      relations: [
        'sourceAccount',
        'destAccount',
        'allocation',
        'allocation.category',
      ],
    });
  }

  async categorizeTransaction(transactionId: number, categoryId: number) {
    const transaction = await this.transactionRepository.findOneByOrFail({
      id: transactionId,
    });

    const transactionMonth = transaction.date.getUTCMonth() + 1;
    const transactionYear = transaction.date.getFullYear();

    const budget = await this.monthlyBudgetService.findOrCreateByMMYY(
      transactionMonth,
      transactionYear
    );

    const budgetAllocation =
      this.monthlyBudgetService.getAllocation(budget, categoryId) ||
      (await this.monthlyBudgetService.addAllocation(budget, categoryId, 0));

    transaction.allocation = budgetAllocation;

    return this.transactionRepository.save(transaction);
  }

  private updateAccountBalance(
    date: Date,
    amount: number,
    sourceAccount?: BankAccount,
    destAccount?: BankAccount
  ) {
    const typesWeCalculate = [BankAccountType.CURRENT, BankAccountType.SAVINGS];
    if (sourceAccount && typesWeCalculate.includes(sourceAccount.type)) {
      sourceAccount.balance = sourceAccount.balance - amount;
      if (sourceAccount.balanceDate < date) sourceAccount.balanceDate = date;
    }
    if (destAccount && typesWeCalculate.includes(destAccount.type)) {
      destAccount.balance = destAccount.balance + amount;
      if (destAccount.balanceDate < date) destAccount.balanceDate = date;
    }
  }

  async insertTransaction({
    sourceAccountIBAN,
    destAccountIBAN,
    referenceId,
    date,
    description,
    humanDescription,
    isDebit,
    amountCents,
  }: PostTransactionDto) {
    const identifierList = [sourceAccountIBAN, destAccountIBAN].filter(
      (acct) => !!acct
    );

    let sourceAccount: BankAccount | undefined = undefined;
    let destAccount: BankAccount | undefined = undefined;

    if (identifierList.length) {
      const accounts = await this.bankAccountRepository.findBy({
        identifier: In(identifierList),
      });

      accounts.forEach((account) => {
        if (account.identifier === sourceAccountIBAN) sourceAccount = account;
        else destAccount = account;
      });
    }
    const transaction = new Transaction(
      referenceId,
      date,
      description,
      humanDescription,
      isDebit,
      amountCents,
      sourceAccount,
      destAccount
    );

    this.updateAccountBalance(date, amountCents, sourceAccount, destAccount);
    const accountsToUpdate = [];
    if (sourceAccount) accountsToUpdate.push(sourceAccount);
    if (destAccount) accountsToUpdate.push(destAccount);

    if (accountsToUpdate.length) {
      await this.bankAccountRepository.save(accountsToUpdate);
    }

    return this.transactionRepository.save(transaction);
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
          if (idx === 0)
            throw new Error(
              "You cannot add a bank account which doesn't exist"
            );

          const newAccount = new BankAccount(
            name,
            accountNumber,
            BankAccountType.EXTERNAL
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

      this.updateAccountBalance(
        date,
        amount.intValue,
        sourceAccount,
        destAccount
      );

      transactions.push(
        new Transaction(
          referenceId || '',
          date,
          description,
          humanDescription,
          isDebit,
          amount.intValue,
          sourceAccount,
          destAccount
        )
      );
    }

    await this.transactionRepository.upsert(transactions, {
      upsertType: 'on-duplicate-key-update',
      conflictPaths: {},
    });

    await this.bankAccountRepository.save(Object.values(bankAccountByIBAN));
  }
}
