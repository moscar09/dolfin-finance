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

export class BudgetCategoryGroupDto {
  constructor(public id: number, public name: string) {}
}
