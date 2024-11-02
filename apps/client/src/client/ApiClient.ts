import createClient from 'openapi-fetch';
import { paths } from './schema';

export const ApiClient = createClient<paths>({
  baseUrl: 'http://localhost:8080',
});

export async function addNewSubcategory(budgetCategory: number, name: string) {
  return fetch(
    `http://localhost:8080/budget-category/${budgetCategory}/subcategory`,
    {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function modifyTransactionDetails(
  {
    budgetSubcategoryId,
    humanDescription,
  }: {
    budgetSubcategoryId?: number;
    humanDescription?: string;
  },
  transactionId: number
) {
  return fetch(`localhost:8080/transaction/${transactionId}`, {
    method: 'PATCH',
    body: JSON.stringify({ budgetSubcategoryId, humanDescription }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
