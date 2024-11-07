export class TransactionPartyDto {
  constructor(
    public name: string,
    public accountNumber: string,
    public isRealAccount: boolean
  ) {}
}
