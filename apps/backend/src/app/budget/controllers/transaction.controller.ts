import {
  BankAccountType,
  FileUploadReceiptDto,
  PatchTransactionDto,
  PostTransactionDto,
  TransactionResponseDto,
} from '@dolfin-finance/api-types';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { ParsedTransactionDto } from '../../bank-statement-parser/dto/parsedTransaction.dto';
import { Camt053ParserService } from '../../bank-statement-parser/services/camt053Parser.service';
import { BankAccountService } from '../services/bankAccount.service';
import { StatementFileUploadParserService } from '../services/statementFileUploadParser.service';
import { TransactionService } from '../services/transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(
    private transactionService: TransactionService,
    private bankAccountService: BankAccountService,
    private statementFileUploadParserService: StatementFileUploadParserService,
    private camt053ParserService: Camt053ParserService
  ) {}

  @Get()
  async getByDate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ): Promise<TransactionResponseDto[]> {
    const transactions =
      await this.transactionService.getTransactionsBetweenDates(
        new Date(startDate),
        new Date(endDate)
      );

    return plainToInstance(TransactionResponseDto, transactions, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  async patchTransaction(
    @Param('id') id: string,
    @Body() { categoryId }: PatchTransactionDto
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionService.categorizeTransaction(
      Number.parseInt(id),
      Number.parseInt(categoryId as unknown as string)
    );

    return plainToInstance(TransactionResponseDto, transaction, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  async postTransaction(
    @Body() transactionDto: PostTransactionDto
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionService.insertTransaction(
      transactionDto
    );

    return plainToInstance(TransactionResponseDto, transaction);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('transactions'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File
  ): Promise<FileUploadReceiptDto[]> {
    const fileDatas = await this.statementFileUploadParserService.handleFile(
      file
    );

    let transactions: ParsedTransactionDto[] = [];
    const startingBalancePerIban: { [key: string]: FileUploadReceiptDto } = {};

    const bankAccounts = await this.bankAccountService
      .findAll({
        type: [BankAccountType.CURRENT, BankAccountType.SAVINGS],
      })
      .then((res) =>
        res.reduce(
          (acc, account) => ({ ...acc, [account.identifier]: account }),
          {}
        )
      );

    for (const fileData of fileDatas) {
      const {
        transactions: parsedTransactions,
        recipientIban,
        startingBalanceDate,
        startingBalance,
      } = this.camt053ParserService.parse(fileData);

      transactions = transactions.concat(parsedTransactions);

      if (bankAccounts[recipientIban]) {
        if (
          !startingBalancePerIban[recipientIban] ||
          startingBalancePerIban[recipientIban].startingBalanceDate >
            startingBalanceDate
        ) {
          startingBalancePerIban[recipientIban] = {
            bankAccount: bankAccounts[recipientIban],
            startingBalance: startingBalance.intValue,
            startingBalanceDate,
            isFirstUpload: !bankAccounts[recipientIban].balanceDate,
          };
        }
      }
    }

    await this.transactionService.saveBulkTransactions(transactions);

    return Object.values(startingBalancePerIban);
  }
}
