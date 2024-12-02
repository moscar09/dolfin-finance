import currency from 'currency.js';
import { ParsedTransactionDto } from '../dto/parsedTransaction.dto';
import { Camt053ParserService } from '../services/camt053Parser.service';
import fs from 'node:fs';
import { TransactionPartyDto } from '../dto/transactionParty.dto';

describe('Camt053ParserService', () => {
  describe('with an ABN AMRO file', () => {
    const accountOwner = new TransactionPartyDto(
      'NL77ABNA0574908765',
      'NL77ABNA0574908765',
      true
    );
    let data: string;
    let transactions: ParsedTransactionDto[];
    let startingBalance: currency;
    let startingBalanceDate: Date;
    let recipientIban: string;
    beforeAll(() => {
      const parserService = new Camt053ParserService();

      data = fs
        .readFileSync(__dirname + '/assets/abn_amro.camt053.xml')
        .toString('utf8');
      const parsedData = parserService.parse(data);
      transactions = parsedData.transactions;
      startingBalance = parsedData.startingBalance;
      startingBalanceDate = parsedData.startingBalanceDate;
      recipientIban = parsedData.recipientIban;
    });

    it('gets the correct number of transactions', () => {
      expect(transactions.length).toBe(13);
    });

    it('correctly parses a transaction with no details', () => {
      expect(transactions[0]).toMatchObject({
        referenceId: '2102830989503100038',
        description: '11.11.111.111 Naam Adres 7 2960 Dorp',
        date: new Date('2013-04-02'),
        isDebit: false,
        accountOwner,
        contraParty: new TransactionPartyDto(
          'Unknown',
          '11.11.111.111 Naam Adres 7 2960 Dorp',
          false
        ),
        amount: currency(100, { fromCents: true }),
      });
    });

    it('correctly parses a transaction a real contraparty and description', () => {
      expect(transactions[1]).toMatchObject({
        referenceId: '3095D4322561459S0PS',
        description:
          '/TRTP/SEPA\n          OVERBOEKING/IBAN/NL46ABNA0499998748/BIC/ABNANL2A/NAME/NAAM/REMI/OMSCHRIJVING/EREF/NOTPROVIDED',
        date: new Date('2013-04-02'),
        isDebit: false,
        accountOwner,
        humanDescription: 'OMSCHRIJVING',
        contraParty: new TransactionPartyDto(
          'NAAM',
          'NL46ABNA0499998748',
          true
        ),
        amount: currency(100, { fromCents: true }),
      });
    });

    it('correctly parses a transaction a real contraparty and description', () => {
      expect(transactions[5]).toMatchObject({
        referenceId: '3088J0537755115S0EC',
        description:
          '/TRTP/SEPA\n          OVERBOEKING/IBAN/NL87SNSB0941352955/BIC/SNSBNL2A/NAME/Naam/REMI/2013-33/EREF/NOTPROVIDED',
        date: new Date('2013-04-02'),
        isDebit: true,
        accountOwner,
        humanDescription: '2013-33',
        contraParty: new TransactionPartyDto(
          'Naam',
          'NL87SNSB0941352955',
          true
        ),
        amount: currency(100, { fromCents: true }),
      });
    });

    it('gets the correct startingBalanceDate from the report', () => {
      expect(startingBalanceDate.toISOString().split('T').shift()).toBe(
        '2013-03-28'
      );
    });

    it('gets the correct startingBalance from the report', () => {
      expect(startingBalance.intValue).toBe(100001);
    });

    it('get the correct recipient IBAN', () => {
      expect(recipientIban).toBe('NL77ABNA0574908765');
    });
  });
});
