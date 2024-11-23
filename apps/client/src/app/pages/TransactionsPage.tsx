import {
  Box,
  Button,
  Collapse,
  Group,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

import { IconCaretDownFilled } from '@tabler/icons-react';
import currency from 'currency.js';
import { useParams } from 'react-router-dom';
import { FileDropzone } from '../components/molecules/FileDropzone';
import { PageTitle } from '../components/molecules/PageTitle';
import { TransactionsCard } from '../components/organisms/TransactionsCard';
import { useAccount } from '../hooks/queries/useAccount';
import { useTransactions } from '../hooks/queries/useTransactions';
import { axiosClient } from '../utils/axiosClient';
import { LayoutShell } from './layout';

export function TransactionsPage() {
  const { accountId } = useParams();
  const { data: account, isPending: accountLoading } = useAccount(
    accountId ? Number.parseInt(accountId) : undefined
  );
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('d').subtract(3, 'month'),
    dayjs().endOf('d'),
  ]);

  const [startDate, endDate] = dateRange;

  const [dropzoneExpanded, setDropzoneExpanded] = useState(false);
  const {
    isPending: transactionsLoading,
    data: transactions,
    refetch: refetchTransactions,
  } = useTransactions(startDate, endDate);

  const subtitle = account?.balance && account?.balanceDate && (
    <>
      {currency(account?.balance || 0, { fromCents: true }).format({
        symbol: '€',
      })}
      {', as of '}
      {dayjs(account?.balanceDate).format('MMMM DD')}
    </>
  );

  return (
    <LayoutShell>
      <Stack gap="md">
        <Group justify="space-between" align="end">
          <PageTitle
            title={
              accountLoading ? (
                <Skeleton w="100%" h="44px" />
              ) : (
                `Account overview: ${account?.name}`
              )
            }
            subtitle={subtitle}
            // subtitle={`${startDate.format('MMMM D')} - ${endDate.format(
            //   'MMMM D'
            // )}`}
            // endButton={
            //   <CalendarPopover
            //     startDate={startDate}
            //     endDate={endDate}
            //     setDateRange={(start, end) => setDateRange([start, end])}
            //   />
            // }
          />
          <Button
            size="sm"
            variant="outline"
            onMouseDown={() => setDropzoneExpanded(!dropzoneExpanded)}
            rightSection={
              <IconCaretDownFilled
                style={{
                  transform: `rotate(${dropzoneExpanded ? '180deg' : '0deg'})`,
                  transitionDuration: '0.3s',
                  transitionProperty: 'transform',
                }}
                width="70%"
              />
            }
          >
            Add transactions
          </Button>
        </Group>
        <Box>
          <Collapse in={dropzoneExpanded} transitionDuration={300}>
            <FileDropzone
              label="Drop your CAMT.053 export file here"
              formField="transactions"
              queryFn={async (formData) => {
                const { data: success } = await axiosClient.post<boolean>(
                  '/transaction/upload',
                  formData,
                  {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  }
                );

                if (success) await refetchTransactions();
                return success;
              }}
            />
          </Collapse>

          <TransactionsCard
            transactions={transactions}
            isLoading={transactionsLoading}
          />
        </Box>
      </Stack>
    </LayoutShell>
  );
}
