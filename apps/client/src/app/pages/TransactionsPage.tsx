import { Select, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import useSWR from 'swr';
import { CalendarPopover, DateRange } from '../molecules/CalendarPopover';
import { PageTitle } from '../molecules/PageTitle';
import { LayoutShell } from './layout';
import { ApiClient, modifyTransactionDetails } from '../../client/ApiClient';

export function TransactionsPage() {
  const [dateRange, setDateRange] = useState<DateRange>([
    dayjs().startOf('d').subtract(3, 'month'),
    dayjs().endOf('d'),
  ]);
  const [startDate, endDate] = dateRange;
  const { data: transactions, isLoading } = useSWR(
    `/transaction?${startDate.format('YYYY-MM-DD')}&${endDate.format(
      'YYYY-MM-DD'
    )}`,
    () =>
      ApiClient.GET('/transaction', {
        params: {
          query: {
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
          },
        },
      }).then((r) => r.data)
  );
  const { data: budgetCategoryData, isLoading: budgetCategoryIsLoading } =
    useSWR('/api/budget-category', (...args) =>
      fetch(...args).then((res) => res.json())
    );

  if (isLoading || budgetCategoryIsLoading) return;

  console.dir(transactions);
  const subcategories = budgetCategoryData.map((category) => ({
    group: category.name,
    items: category.subcategories.map((sub) => ({
      label: sub.name,
      value: `${sub.id}`,
    })),
  }));

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
          fetching={isLoading}
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
              //@ts-expect-error
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
              render: ({ amount, isDebit }) => (
                <Text size="sm" c={isDebit ? 'red' : 'green'}>
                  {isDebit ? 0 - amount : amount}
                </Text>
              ),
            },
            {
              accessor: 'budgetSubcategoryId',
              title: 'Category',
              render: ({ id, budgetSubcategoryId }) => (
                <Select
                  size="sm"
                  placeholder="Pick value"
                  data={subcategories}
                  defaultValue={`${budgetSubcategoryId}`}
                  comboboxProps={{ width: 180, position: 'bottom-end' }}
                  onChange={async (newCategoryId) => {
                    await modifyTransactionDetails(
                      { budgetSubcategoryId: Number.parseInt(newCategoryId) },
                      id
                    );
                  }}
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
