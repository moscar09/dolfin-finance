import { Module } from '@nestjs/common';
import { Camt053ParserService } from './services/camt053Parser.service';

@Module({ providers: [Camt053ParserService] })
export class BankStatementParserModule {}
