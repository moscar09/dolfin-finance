import { Grid, Skeleton, Text } from '@mantine/core';
import { MoneyAmount } from '../../atoms/MoneyAmount';

function SummaryRow({ label, amount }: { label: string; amount?: number }) {
  return (
    <>
      <Grid.Col span={8}>
        <Text size="sm" c="gray.7">
          {label}:
        </Text>
      </Grid.Col>
      <Grid.Col span={4}>
        {amount === undefined ? (
          <Skeleton width="100%" height="100%" />
        ) : (
          <Text size="sm" fw={500} style={{ textAlign: 'end' }}>
            <MoneyAmount amount={amount} />
          </Text>
        )}
      </Grid.Col>
    </>
  );
}

export type SummaryGridProps = {
  allocatedCents?: number;
  spentCents?: number;
  remainingCents?: number;
};

export function SummaryGrid({
  allocatedCents,
  spentCents,
  remainingCents,
}: SummaryGridProps) {
  return (
    <Grid gutter="xs" pt="xs">
      <SummaryRow label="Total Budgeted" amount={allocatedCents} />
      <SummaryRow label="Total Spent" amount={spentCents} />
      <SummaryRow label="Total Remaining" amount={remainingCents} />
    </Grid>
  );
}
