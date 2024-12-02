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

import { FileUploadReceiptDto } from '@dolfin-finance/api-types';
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
import { modals } from '@mantine/modals';
import { StartingBalanceConfirmationModal } from '../components/organisms/StartingBalanceConfirmationModal';
import { useCreateTransaction } from '../hooks/mutations/useCreateTransaction';

export function TransactionsPage() {
  const { accountId } = useParams();
  const {
    data: account,
    isPending: accountLoading,
    refetch: refetchAccount,
  } = useAccount(accountId ? Number.parseInt(accountId) : undefined);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('d').subtract(3, 'month'),
    dayjs().endOf('d'),
  ]);

  const [startDate, endDate] = dateRange;

  const [dropzoneExpanded, setDropzoneExpanded] = useState(false);
  const createTransaction = useCreateTransaction();

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
                const { data: success } = await axiosClient.post<
                  FileUploadReceiptDto[]
                >('/transaction/upload', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                });

                if (success) {
                  const [ourAccount] = success.filter(
                    (acct) => acct.bankAccount.id === account?.id
                  );

                  if (ourAccount && ourAccount.isFirstUpload) {
                    modals.open({
                      size: 'md',
                      title: (
                        <Text fw="600">
                          Congrats on uploading your first statement!
                        </Text>
                      ),
                      children: (
                        <StartingBalanceConfirmationModal
                          startingBalance={ourAccount.startingBalance}
                          startingBalanceDate={ourAccount.startingBalanceDate}
                          onConfirm={async () => {
                            await createTransaction.mutateAsync({
                              date: ourAccount.startingBalanceDate,
                              description: 'Account Reconcilliation',
                              isDebit: ourAccount.startingBalance < 0,
                              amountCents: ourAccount.startingBalance,
                              ...(ourAccount.startingBalance < 0
                                ? {
                                    sourceAccountIBAN:
                                      ourAccount.bankAccount.identifier,
                                  }
                                : {
                                    destAccountIBAN:
                                      ourAccount.bankAccount.identifier,
                                  }),
                            });

                            await Promise.all([
                              refetchAccount(),
                              refetchTransactions(),
                            ]);
                          }}
                        />
                      ),
                    });
                  }
                  await Promise.all([refetchAccount(), refetchTransactions()]);
                }

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
