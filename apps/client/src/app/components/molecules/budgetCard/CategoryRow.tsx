import {
  MonthlyBudgetAllocationState,
  BudgetCategoryDto,
} from '@dolfin-finance/api-types';
import { ActionIcon, Group, Table, TextInput } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { useDeleteBudgetCategory } from '../../../hooks/mutations/useDeleteBudgetCategory';
import { MoneyAmount } from '../../atoms/MoneyAmount';
import { useUpdateBudgetAllocation } from '../../../hooks/mutations/useUpdateBudgetAllocation';

export function CategoryRow({
  allocation,
  category,
  year,
  month,
}: {
  allocation?: MonthlyBudgetAllocationState;
  category: BudgetCategoryDto;
  year: number;
  month: number;
}) {
  const [isRowHovered, setIsRowHovered] = useState(false);
  const deleteBudgetCategory = useDeleteBudgetCategory();
  const updateBudgetAllocation = useUpdateBudgetAllocation();

  return (
    <Table.Tr
      key={category.id}
      onMouseEnter={() => setIsRowHovered(true)}
      onMouseLeave={() => setIsRowHovered(false)}
    >
      <Table.Td pl="md">
        <Group gap="sm">
          {category.name}
          {isRowHovered && (
            <ActionIcon
              variant="subtle"
              size="sm"
              color="red.5"
              onClick={() => deleteBudgetCategory.mutate(category.id)}
            >
              <IconTrash size="70%" />
            </ActionIcon>
          )}
        </Group>
      </Table.Td>
      <Table.Td>
        <TextInput
          size="xs"
          w={80}
          defaultValue={(allocation?.amountCents || 0) / 100}
          leftSection="€"
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              e.currentTarget.blur();
            }
          }}
          onBlur={(e) => {
            updateBudgetAllocation.mutate({
              year,
              month,
              categoryId: category.id,
              amount: Number.parseFloat(e.target.value),
            });
          }}
        />
      </Table.Td>
      <Table.Td>
        <MoneyAmount amount={allocation?.spentCents || 0} />
      </Table.Td>
      <Table.Td
        fw={600}
        c={
          (allocation?.remaining || 0) > 0
            ? 'green'
            : (allocation?.remaining || 0) === 0
            ? 'orange.4'
            : 'red'
        }
      >
        <MoneyAmount amount={allocation?.remaining || 0} />
      </Table.Td>
    </Table.Tr>
  );
}
