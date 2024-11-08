import { BankAccountDto, TransactionDto } from '@dolfin-finance/api-types';
import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Camt053ParserService } from '../../bank-statement-parser/services/camt053Parser.service';
import { StatementFileUploadParserService } from '../services/statementFileUploadParser.service';
import { TransactionService } from '../services/transaction.service';
import { ParsedTransactionDto } from '../../bank-statement-parser/dto/parsedTransaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(
    private transactionService: TransactionService,
    private statementFileUploadParserService: StatementFileUploadParserService,
    private camt053ParserService: Camt053ParserService
  ) {}

  @Get()
  async getByDate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ): Promise<TransactionDto[]> {
    const transactions =
      await this.transactionService.getTransactionsBetweenDates(
        new Date(startDate),
        new Date(endDate)
      );

    return transactions.map(
      (transaction) =>
        new TransactionDto(
          transaction.id,
          transaction.referenceId,
          transaction.date.toISOString().split('T')[0],
          transaction.description,
          transaction.humanDescription,
          transaction.isDebit,
          transaction.amountCents,
          undefined,
          transaction.sourceAccount
            ? new BankAccountDto(
                transaction.sourceAccount.id,
                transaction.sourceAccount.name,
                transaction.sourceAccount.prettyName,
                transaction.sourceAccount.identifier,
                transaction.sourceAccount.type
              )
            : undefined,

          transaction.destAccount
            ? new BankAccountDto(
                transaction.destAccount.id,
                transaction.destAccount.name,
                transaction.destAccount.prettyName,
                transaction.destAccount.identifier,
                transaction.destAccount.type
              )
            : undefined
        )
    );
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('transactions'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileDatas = await this.statementFileUploadParserService.handleFile(
      file
    );

    let transactions: ParsedTransactionDto[] = [];
    for (const fileData of fileDatas) {
      transactions = transactions.concat(
        this.camt053ParserService.parse(fileData)
      );
    }

    this.transactionService.saveBulkTransactions(transactions);
  }
}
