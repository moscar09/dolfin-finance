export enum BankAccountType {
  ASSET = 'asset',
  EXTERNAL = 'external',
}

export class BankAccountDto {
  id: number;
  name: string;
  prettyName: string;
  identifier: string;
  type: BankAccountType;
}

export class BudgetCategoryDto {
  constructor(
    public id: number,
    public name: string,
    public group: BudgetCategoryGroupDto
  ) {}
}

export class CreateBudgetCategoryDto {
  constructor(public name: string, public groupId: number) {}
}

export class BudgetCategoryGroupDto {
  constructor(public id: number, public name: string) {}
}

export class MonthlyBudgetDto {
  constructor(
    public month: number,
    public year: number,
    public allocations: MonthlyBudgetAllocationState[]
  ) {}
}

export class MonthlyBudgetAllocationState {
  public remaining: number;
  constructor(
    public categoryId: number,
    public amountCents: number,
    public spentCents: number
  ) {
    this.remaining = this.amountCents - this.spentCents;
  }
}

export class TransactionDto {
  constructor(
    public id: number,
    public referenceId: string,
    public date: Date,
    public description: string,
    public humanDescription: string,
    public isDebit: boolean,
    public amountCents: number,
    public budgetCategoryId: number,
    public sourceAccount: BankAccountDto,
    public destAccount: BankAccountDto
  ) {}
}
