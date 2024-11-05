import { Select, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';

import {
  CalendarPopover,
  DateRange,
} from '../components/molecules/CalendarPopover';
import { PageTitle } from '../components/molecules/PageTitle';
import { LayoutShell } from './layout';
import { useBudgetCategories } from '../hooks/queries/useBudgetCategories';
import { useTransactions } from '../hooks/queries/useTransactions';

export function TransactionsPage() {
  const [dateRange, setDateRange] = useState<DateRange>([
    dayjs().startOf('d').subtract(3, 'month'),
    dayjs().endOf('d'),
  ]);
  const [startDate, endDate] = dateRange;

  const { isPending: budgetCategoriesLoading, data: budgetCategories } =
    useBudgetCategories();
  const { isPending: transactionsLoading, data: transactions } =
    useTransactions(...dateRange);

  if (budgetCategoriesLoading || transactionsLoading || !budgetCategories)
    return;

  // console.dir(transactions);

  // @TODO: make it so that it shows the year properly
  return (
    <LayoutShell>
      <Stack gap="md">
        <PageTitle
          title="Your transactions between"
          subtitle={`${startDate.format('MMMM D')} - ${endDate.format(
            'MMMM D'
          )}`}
          endButton={
            <CalendarPopover
              startDate={startDate}
              endDate={endDate}
              setDateRange={setDateRange}
            />
          }
        />
        <DataTable
          withTableBorder
          borderRadius="sm"
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
      </Stack>
    </LayoutShell>
  );
}
