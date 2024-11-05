import { Card, Stack, Table } from '@mantine/core';

import { BudgetCategoryDto } from '@dolfin-finance/api-types';
import { useBudgetCategories } from '../../hooks/queries/useBudgetCategories';
import { CategoryGroupSection } from '../molecules/budgetCard/CategoryGroupSection';

export function BudgetCard({ month, year }: { month: number; year: number }) {
  const { isPending: categoriesAreLoading, data: budgetCategories } =
    useBudgetCategories();

  if (categoriesAreLoading || !budgetCategories) return;

  const categoriesByGroup = budgetCategories.reduce((acc, category) => {
    const group = category.group;

    acc[group.id] ??= [];
    acc[group.id].push(category);
    return acc;
  }, {} as { [key: number]: BudgetCategoryDto[] });

  // const budgetAllocationsBySubId = budgetAllocations.allocations.reduce(
  //   (acc, item) => ({ ...acc, [item.budgetSubcategory.id]: item }),
  //   {}
  // );

  return (
    <Card radius="lg" withBorder px={0} py="xs">
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
                categories={categories}
                key={categories[0].group.id}
              />
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Card>
  );
}
