// import useSWR from 'swr';
import { Card, Title } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { LayoutShell } from './layout';
import { useAccounts } from '../hooks/queries/useAccounts';

export function AccountsPage() {
  const { isPending, data } = useAccounts();

  return (
    <LayoutShell>
      <Card radius="lg">
        <Title order={2}>Your accounts</Title>
        <DataTable
          withTableBorder
          borderRadius="sm"
          withColumnBorders
          striped
          fetching={isPending}
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
