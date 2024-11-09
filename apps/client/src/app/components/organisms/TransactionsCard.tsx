import { TransactionDto } from '@dolfin-finance/api-types';
import { rem, Select, Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { usePatchTransaction } from '../../hooks/mutations/usePatchTransaction';
import { useBudgetCategories } from '../../hooks/queries/useBudgetCategories';
import { MoneyAmount } from '../atoms/MoneyAmount';

export function TransactionsCard({
  isLoading,
  transactions,
}: {
  transactions?: TransactionDto[];
  isLoading: boolean;
}) {
  const { isPending: budgetCategoriesLoading, data: budgetCategories } =
    useBudgetCategories();

  const patchTransaction = usePatchTransaction();

  if (!budgetCategoriesLoading && !budgetCategories)
    throw Error('Could not find budget categories');

  return (
    <DataTable
      withTableBorder
      borderRadius="lg"
      withColumnBorders
      styles={{ table: { tableLayout: 'fixed' } }}
      striped
      fetching={isLoading || budgetCategoriesLoading}
      highlightOnHover
      records={transactions}
      columns={[
        {
          accessor: 'date',
          title: 'Date',
          width: '7rem',
        },
        {
          accessor: 'humanDescription',
          title: 'Description',

          width: '30%',
          render: ({ description, humanDescription }) => (
            <Text size="sm" style={{ wordWrap: 'break-word' }}>
              {humanDescription || description}
            </Text>
          ),
        },
        {
          accessor: 'amount',
          title: 'Amount',
          textAlign: 'right',
          render: ({ amountCents, isDebit }) => (
            <Text size="sm" c={isDebit ? 'red' : 'green'}>
              <MoneyAmount amount={isDebit ? 0 - amountCents : amountCents} />
            </Text>
          ),
        },
        {
          accessor: 'budgetSubcategoryId',
          title: 'Category',
          width: rem(200),
          render: ({ id, budgetCategoryId }) => (
            <Select
              size="sm"
              placeholder="Pick value"
              data={(budgetCategories || []).map((category) => ({
                value: `${category.id}`,
                label: category.name,
              }))}
              defaultValue={`${budgetCategoryId}`}
              comboboxProps={{ width: 180, position: 'bottom-end' }}
              onChange={(v) =>
                v
                  ? patchTransaction.mutate({
                      transactionId: id,
                      categoryId: Number.parseInt(v),
                    })
                  : null
              }
            />
          ),
        },
        {
          accessor: 'sourceAccount',
          title: 'Payee',
          render: ({ sourceAccount, destAccount, isDebit }) => {
            const account = isDebit ? destAccount : sourceAccount;
            return (
              <Text size="xs">
                {account?.prettyName || account?.name || '-'}
              </Text>
            );
          },
        },
      ]}
    />
  );
}
