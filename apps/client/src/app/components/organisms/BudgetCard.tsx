import { Card, Stack, Table } from '@mantine/core';

import {
  MonthlyBudgetAllocationState,
  BudgetCategoryDto,
} from '@dolfin-finance/api-types';
import { useBudgetCategories } from '../../hooks/queries/useBudgetCategories';
import { CategoryGroupSection } from '../molecules/budgetPage/CategoryGroupSection';
import { useMonthlyBudget } from '../../hooks/queries/useMonthlyBudget';

export function BudgetCard({ month, year }: { month: number; year: number }) {
  const { isPending: categoriesAreLoading, data: budgetCategories } =
    useBudgetCategories();

  const { data: monthlyBudget, isPending: budgetIsPending } = useMonthlyBudget(
    month,
    year
  );

  if (categoriesAreLoading || !budgetCategories) return null;

  const categoriesByGroup = budgetCategories.reduce((acc, category) => {
    acc[category.group.id] ??= [];
    acc[category.group.id].push(category);
    return acc;
  }, {} as { [key: number]: BudgetCategoryDto[] });

  const allocationsByCategory:
    | { [key: number]: MonthlyBudgetAllocationState }
    | undefined = monthlyBudget?.allocations.reduce(
    (acc, allocation) => ({ ...acc, [allocation.categoryId]: allocation }),
    {}
  );

  return (
    <Card radius="lg" withBorder px={0} py={0}>
      <Stack gap="md">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th pl="md">Category</Table.Th>
              <Table.Th>Budgeted</Table.Th>
              <Table.Th>Spent</Table.Th>
              <Table.Th>Remaining</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {Object.values(categoriesByGroup).map((categories) => (
              <CategoryGroupSection
                isPending={budgetIsPending}
                categories={categories}
                allocations={allocationsByCategory}
                key={categories[0].group.id}
                year={year}
                month={month}
              />
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Card>
  );
}
