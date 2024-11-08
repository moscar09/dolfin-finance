import {
  MonthlyBudgetAllocationState,
  BudgetCategoryDto,
} from '@dolfin-finance/api-types';
import {
  ActionIcon,
  Checkbox,
  Group,
  rem,
  Skeleton,
  Table,
  TextInput,
} from '@mantine/core';
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
  isPending,
}: {
  allocation?: MonthlyBudgetAllocationState;
  category: BudgetCategoryDto;
  year: number;
  month: number;
  isPending: boolean;
}) {
  const [isRowHovered, setIsRowHovered] = useState(false);
  const deleteBudgetCategory = useDeleteBudgetCategory();
  const updateBudgetAllocation = useUpdateBudgetAllocation();
  const skeleton = <Skeleton height="1.2rem" width="3.5rem" />;

  return (
    <Table.Tr
      key={category.id}
      onMouseEnter={() => setIsRowHovered(true)}
      onMouseLeave={() => setIsRowHovered(false)}
    >
      <Table.Td>
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
      <Table.Td width="20%">
        {isPending ? (
          <Skeleton width="5rem" height={rem(30)} />
        ) : (
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
        )}
      </Table.Td>
      <Table.Td width="20%">
        {isPending ? (
          skeleton
        ) : (
          <MoneyAmount amount={allocation?.spentCents || 0} />
        )}
      </Table.Td>
      <Table.Td
        width="20%"
        fw={600}
        c={
          (allocation?.remainingCents || 0) > 0
            ? 'green'
            : (allocation?.remainingCents || 0) === 0
            ? 'orange.4'
            : 'red'
        }
      >
        {isPending ? (
          skeleton
        ) : (
          <MoneyAmount amount={allocation?.remainingCents || 0} />
        )}
      </Table.Td>
    </Table.Tr>
  );
}
