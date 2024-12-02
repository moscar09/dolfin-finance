import { TransactionResponseDto } from '@dolfin-finance/api-types';
import {
  ComboboxItem,
  ComboboxItemGroup,
  rem,
  Select,
  Text,
} from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useUpdateTransaction } from '../../hooks/mutations/useUpdateTransaction';
import { useBudgetCategories } from '../../hooks/queries/useBudgetCategories';
import { MoneyAmount } from '../atoms/MoneyAmount';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const PAGE_SIZE = 25;
export function TransactionsCard({
  isLoading,
  transactions,
}: {
  transactions?: TransactionResponseDto[];
  isLoading: boolean;
}) {
  const { isPending: budgetCategoriesLoading, data: budgetCategories } =
    useBudgetCategories();
  const patchTransaction = useUpdateTransaction();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  if (!budgetCategoriesLoading && !budgetCategories)
    throw Error('Could not find budget categories');

  const budgetSelectorData: {
    [key: number]: ComboboxItemGroup<ComboboxItem>;
  } = {};

  for (const { group, name, id } of (budgetCategories || []).sort((a, b) =>
    a.name.localeCompare(b.name)
  )) {
    budgetSelectorData[group.id] ??= { group: group.name, items: [] };
    budgetSelectorData[group.id].items.push({ label: name, value: `${id}` });
  }

  // const budgetSelectorData = (budgetCategories || []).map((category) => ({
  //   value: `${category.id}`,
  //   label: category.name,
  // }));

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
          render: ({ date }) => (
            <Text size="sm">{dayjs(date).format('DD.MM.YYYY')}</Text>
          ),
        },
        {
          accessor: 'sourceAccount',
          title: 'Payee',
          render: ({ sourceAccount, destAccount, isDebit }) => {
            const account = isDebit ? destAccount : sourceAccount;
            return (
              <Text size="sm">
                {account?.prettyName || account?.name || '-'}
              </Text>
            );
          },
        },
        {
          accessor: 'humanDescription',
          title: 'Description',

          width: '40%',
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
          width: rem(100),
          render: ({ amountCents, isDebit }) => (
            <Text size="sm" c={isDebit ? 'red' : 'green'}>
              <MoneyAmount amount={isDebit ? 0 - amountCents : amountCents} />
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
              data={Object.values(budgetSelectorData)}
              defaultValue={`${budgetCategoryId}`}
              clearable
              allowDeselect
              comboboxProps={{ position: 'bottom-end' }}
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
      ]}
    />
  );
}
