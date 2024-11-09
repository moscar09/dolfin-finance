import { DataTable } from 'mantine-datatable';
import { useBudgetCategories } from '../../hooks/queries/useBudgetCategories';
import { useTransactions } from '../../hooks/queries/useTransactions';
import { rem, Select, Text } from '@mantine/core';
import { Dayjs } from 'dayjs';
import currency from 'currency.js';
import { usePatchTransaction } from '../../hooks/mutations/usePatchTransaction';
import { MoneyAmount } from '../atoms/MoneyAmount';

export function TransactionsCard({
  startDate,
  endDate,
}: {
  startDate: Dayjs;
  endDate: Dayjs;
}) {
  const { isPending: budgetCategoriesLoading, data: budgetCategories } =
    useBudgetCategories();
  const { isPending: transactionsLoading, data: transactions } =
    useTransactions(startDate, endDate);

  const patchTransaction = usePatchTransaction();

  if (budgetCategoriesLoading || transactionsLoading || !budgetCategories)
    return <>LOADING</>;

  return (
    <DataTable
      withTableBorder
      borderRadius="lg"
      withColumnBorders
      styles={{ table: { tableLayout: 'fixed' } }}
      striped
      fetching={transactionsLoading}
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
              data={budgetCategories.map((category) => ({
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
