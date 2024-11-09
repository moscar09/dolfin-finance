// import useSWR from 'swr';
import { Stack } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { PageTitle } from '../components/molecules/PageTitle';
import { useAccounts } from '../hooks/queries/useAccounts';
import { LayoutShell } from './layout';

export function AccountsPage() {
  const { isPending, data } = useAccounts();

  return (
    <LayoutShell>
      <Stack gap="md">
        <PageTitle title="Your accounts" />
        <DataTable
          withTableBorder
          borderRadius="lg"
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
      </Stack>
    </LayoutShell>
  );
}
