import { Card, Divider, Grid, Skeleton, Text } from '@mantine/core';
import { useMonthlyBudget } from '../../hooks/queries/useMonthlyBudget';
import { MoneyAmount } from '../atoms/MoneyAmount';

function SummaryRow({
  label,
  amount,
  isPending,
}: {
  label: string;
  amount: number;
  isPending: boolean;
}) {
  return (
    <>
      <Grid.Col span={8}>
        <Text size="sm" c="gray.7">
          {label}:
        </Text>
      </Grid.Col>
      <Grid.Col span={4}>
        {isPending ? (
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

export function BudgetSummaryCard({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const { isPending, data } = useMonthlyBudget(month, year);
  let allocatedCents = 0;
  let spentCents = 0;
  let remainingCents = 0;

  if (data) {
    for (const allocation of data.allocations) {
      allocatedCents += allocation.amountCents;
      spentCents += allocation.spentCents;
      remainingCents += allocation.remainingCents;
    }
  }

  return (
    <Card radius="lg" withBorder pt="xs">
      <Text size="sm" fw={700} mb="xs">
        Monthly Summary
      </Text>
      <Divider />

      <Grid gutter="xs" pt="xs">
        <SummaryRow
          label="Total Budgeted"
          amount={allocatedCents}
          isPending={isPending}
        />
        <SummaryRow
          label="Total Spent"
          amount={spentCents}
          isPending={isPending}
        />
        <SummaryRow
          label="Total Remaining"
          amount={remainingCents}
          isPending={isPending}
        />
      </Grid>
    </Card>
  );
}
