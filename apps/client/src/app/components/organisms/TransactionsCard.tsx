import { DataTable } from 'mantine-datatable';
import { useBudgetCategories } from '../../hooks/queries/useBudgetCategories';
import { useTransactions } from '../../hooks/queries/useTransactions';
import { Select, Text } from '@mantine/core';
import { Dayjs } from 'dayjs';
import currency from 'currency.js';
import { usePatchTransaction } from '../../hooks/mutations/usePatchTransaction';

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
    return;

  return (
    <DataTable
      withTableBorder
      borderRadius="lg"
      withColumnBorders
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

          render: ({ description, humanDescription }) => (
            <Text size="sm" style={{ wordWrap: 'break-word' }}>
              {humanDescription || description}
            </Text>
          ),
        },
        {
          accessor: 'amount',
          title: 'Amount',
          render: ({ amountCents, isDebit }) => (
            <Text size="sm" c={isDebit ? 'red' : 'green'}>
              {currency(isDebit ? 0 - amountCents : amountCents, {
                fromCents: true,
              }).toString()}
            </Text>
          ),
        },
        {
          accessor: 'budgetSubcategoryId',
          title: 'Category',
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
          title: 'From',
          render: ({ sourceAccount }) => (
            <Text size="xs">
              {sourceAccount?.prettyName || sourceAccount?.name || '-'}
            </Text>
          ),
        },
        {
          accessor: 'destAccount',
          title: 'To',
          render: ({ destAccount }) => (
            <Text size="xs">
              {destAccount?.prettyName || destAccount?.name || '-'}
            </Text>
          ),
        },
      ]}
    />
  );
}
