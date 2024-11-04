import useSWR from 'swr';
import { LayoutShell } from './layout';
import { ApiClient } from '../../client/ApiClient';
import { Card, Title } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

export function AccountsPage() {
  const { data, isLoading } = useSWR('/bank-account', (args) =>
    ApiClient.GET(args).then((res) => res.data)
  );

  return (
    <LayoutShell>
      <Card radius="lg">
        <Title order={2}>Your accounts</Title>
        <DataTable
          withTableBorder
          borderRadius="sm"
          withColumnBorders
          striped
          fetching={isLoading}
          highlightOnHover
          records={data}
          columns={[
            {
              accessor: 'name',
              title: 'Name',
              render: ({ name }) => name,
            },
            {
              accessor: 'identifier',
              title: 'IBAN',
            },

            {
              accessor: 'type',
              title: 'Type',
            },
          ]}
        />
      </Card>
    </LayoutShell>
  );
}
