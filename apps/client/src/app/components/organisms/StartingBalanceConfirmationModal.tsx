import { Button, Group, List, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { MoneyAmount } from '../atoms/MoneyAmount';
import dayjs from 'dayjs';
import { FileUploadReceiptDto } from '@dolfin-finance/api-types';

export function StartingBalanceConfirmationModal({
  startingBalance,
  startingBalanceDate,
  onConfirm,
}: Pick<FileUploadReceiptDto, 'startingBalance' | 'startingBalanceDate'> & {
  onConfirm: () => void;
}) {
  return (
    <Stack>
      <Text>
        In order for your balance to be shown correctly, we need to also add the
        amount of money before the first transaction.
      </Text>
      <List>
        <List.Item>
          Balance:{' '}
          <strong>
            <MoneyAmount amount={startingBalance} />
          </strong>
        </List.Item>
        <List.Item>
          Balance Date:{' '}
          <strong>{dayjs(startingBalanceDate).format('MMMM D, YYYY')}</strong>
        </List.Item>
      </List>

      <Text>
        Does this data look correct? If it's not correct, you can also adjust it
        manually later.
      </Text>

      <Group justify="end">
        <Button variant="outline" onClick={() => modals.closeAll()}>
          No
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            modals.closeAll();
          }}
        >
          Submit
        </Button>
      </Group>
    </Stack>
  );
}
