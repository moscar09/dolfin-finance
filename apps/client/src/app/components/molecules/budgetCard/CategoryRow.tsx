import { BudgetCategoryDto } from '@dolfin-finance/api-types';
import {
  Table,
  TextInput,
  NumberFormatter,
  ThemeIcon,
  Stack,
  Group,
  ActionIcon,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { useDeleteBudgetCategory } from '../../../hooks/mutations/useDeleteBudgetCategory';

export function CategoryRow({
  allocation,
  category,
  onBudgetChange,
}: {
  allocation?: any;
  category: BudgetCategoryDto;
  onBudgetChange: (amount: number) => void;
}) {
  const [isRowHovered, setIsRowHovered] = useState(false);
  const deleteBudgetCategory = useDeleteBudgetCategory();

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
          defaultValue={allocation?.amount || 0}
          leftSection="€"
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              e.currentTarget.blur();
            }
          }}
          onBlur={(e) => {
            onBudgetChange(Number.parseFloat(e.target.value));
          }}
        />
      </Table.Td>
      <Table.Td>
        <NumberFormatter
          prefix="€"
          fixedDecimalScale={true}
          decimalScale={2}
          value={allocation?.spent || 0}
        />
      </Table.Td>
      <Table.Td
        fw={600}
        c={
          (allocation?.remaining || 0) > 0
            ? 'green'
            : allocation?.remaining === 0
            ? 'orange.4'
            : 'red'
        }
      >
        <NumberFormatter
          prefix="€"
          fixedDecimalScale={true}
          decimalScale={2}
          value={allocation?.remaining || 0}
        />
      </Table.Td>
    </Table.Tr>
  );
}
