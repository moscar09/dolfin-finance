export interface WritableTransactionProps {
  /**
   * A reference ID used to connect the transaction to a third party source
   */
  referenceId?: string;
  /**
   * The date of the transaction
   */
  date: Date;
  /**
   * The description of the transaction, as shown in the bank statement
   */
  description: string;

  /**
   * A human-friendly description of the transaction
   */
  humanDescription?: string;

  /**
   * Is this a debit or credit transaction
   */
  isDebit: boolean;

  /**
   * The absolute value of the transaction, in cents. Note that it's always a positive number.
   */
  amountCents: number;

  /**
   * The budget Category ID this transaction belongs to, via the allocation
   */
  budgetCategoryId?: number;
}
