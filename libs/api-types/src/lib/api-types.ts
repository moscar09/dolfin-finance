import { Expose } from 'class-transformer';

export enum BankAccountType {
  CURRENT = 'current',
  SAVINGS = 'savings',
  EXTERNAL = 'external',
}

export class BankAccountDto {
  @Expose()
  public id: number;
  @Expose()
  public name: string;
  @Expose()
  public prettyName: string;
  @Expose()
  public identifier: string;
  @Expose()
  public type: BankAccountType;
  @Expose()
  public balance?: number;
  @Expose()
  public balanceDate?: Date;
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
  public remainingCents: number;
  constructor(
    public categoryId: number,
    public amountCents: number,
    public spentCents: number
  ) {
    this.remainingCents = this.amountCents - this.spentCents;
  }
}
