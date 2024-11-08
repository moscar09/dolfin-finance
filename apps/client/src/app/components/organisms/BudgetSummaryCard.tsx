import { Card, Divider, Text } from '@mantine/core';
import { useMonthlyBudget } from '../../hooks/queries/useMonthlyBudget';
import { SummaryGrid } from '../molecules/budgetPage/SummaryGrid';

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

      {isPending ? (
        <SummaryGrid />
      ) : (
        <SummaryGrid {...{ allocatedCents, spentCents, remainingCents }} />
      )}
    </Card>
  );
}
