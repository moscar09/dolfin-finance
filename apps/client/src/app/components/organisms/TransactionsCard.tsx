import { DataTable } from 'mantine-datatable';
import { useBudgetCategories } from '../../hooks/queries/useBudgetCategories';
import { useTransactions } from '../../hooks/queries/useTransactions';
import { Select, Text } from '@mantine/core';
import { Dayjs } from 'dayjs';

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
        },
        {
          accessor: 'humanDescription',
          title: 'Description',

          render: ({ description, humanDescription }) => (
            <Text size="sm" style={{ wordWrap: 'break-word' }}>
              {humanDescription || description}
            </Text>
          ),
          width: '25%',
        },
        {
          accessor: 'amount',
          title: 'Amount',
          render: ({ amountCents, isDebit }) => (
            <Text size="sm" c={isDebit ? 'red' : 'green'}>
              {isDebit ? 0 - (amountCents ?? 0) : amountCents}
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
              // onChange={async (newCategoryId) => {
              //   await modifyTransactionDetails(
              //     { budgetSubcategoryId: Number.parseInt(newCategoryId) },
              //     id
              //   );
              // }}
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
