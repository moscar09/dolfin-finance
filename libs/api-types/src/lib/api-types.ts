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
    public amount: number,
    public spent: number
  ) {
    this.remaining = this.amount - this.spent;
  }
}
