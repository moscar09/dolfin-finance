import { TransactionDto } from '@dolfin-finance/api-types';
import { rem, Select, Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { usePatchTransaction } from '../../hooks/mutations/usePatchTransaction';
import { useBudgetCategories } from '../../hooks/queries/useBudgetCategories';
import { MoneyAmount } from '../atoms/MoneyAmount';
import { useEffect, useState } from 'react';

const PAGE_SIZE = 25;
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

  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(
    transactions?.slice(0, PAGE_SIZE) || []
  );

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(transactions?.slice(from, to) || []);
  }, [page, transactions]);

  useEffect(() => {
    if (page !== 1) setPage(1);
  }, [transactions]);

  if (!budgetCategoriesLoading && !budgetCategories)
    throw Error('Could not find budget categories');

  const budgetSelectorData = (budgetCategories || []).map((category) => ({
    value: `${category.id}`,
    label: category.name,
  }));

  return (
    <DataTable
      withTableBorder
      borderRadius="lg"
      withColumnBorders
      styles={{ table: { tableLayout: 'fixed' } }}
      striped
      fetching={isLoading || budgetCategoriesLoading}
      highlightOnHover
      totalRecords={transactions?.length || 0}
      records={records}
      recordsPerPage={PAGE_SIZE}
      page={page}
      onPageChange={(p) => setPage(p)}
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
              data={budgetSelectorData}
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
