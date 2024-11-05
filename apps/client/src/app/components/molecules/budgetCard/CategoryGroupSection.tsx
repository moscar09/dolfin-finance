import {
  MonthlyBudgetAllocationState,
  BudgetCategoryDto,
} from '@dolfin-finance/api-types';
import { Button, Group, Popover, Stack, Table, TextInput } from '@mantine/core';
import { IconCirclePlus } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { useCreateBudgetCategory } from '../../../hooks/mutations/useCreateBudgetCategory';
import { CategoryRow } from './CategoryRow';

function CategoryGroupTitleRow({
  name,
  onCategoryAdd,
}: {
  id: number;
  name: string;
  onCategoryAdd: (name: string) => void;
}) {
  const categoryNameInput = useRef<HTMLInputElement>(null);
  const [opened, setOpened] = useState(false);

  return (
    <Group gap="0" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
      {name}

      <Popover
        width={300}
        trapFocus
        position="bottom"
        withArrow
        shadow="md"
        opened={opened}
      >
        <Popover.Target>
          <Button
            size="compact-sm"
            variant="transparent"
            onClick={() => setOpened(true)}
          >
            <IconCirclePlus size="1rem" />
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack>
            <TextInput
              placeholder="New category name"
              ref={categoryNameInput}
            />
            <Group gap="xs" justify="end">
              <Button
                variant="light"
                onClick={() => {
                  setOpened(false);
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={() => {
                  if (categoryNameInput.current) {
                    onCategoryAdd(categoryNameInput.current.value);
                    setOpened(false);
                  }
                }}
              >
                Add
              </Button>
            </Group>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
}

export function CategoryGroupSection({
  categories,
  allocations,
  year,
  month,
}: {
  categories: BudgetCategoryDto[];
  allocations: { [categoryId: number]: MonthlyBudgetAllocationState };
  year: number;
  month: number;
}) {
  const { group } = categories[0];
  const createBudgetCategory = useCreateBudgetCategory();

  return (
    <Fragment key={group.id}>
      <Table.Tr bg="gray.0">
        <Table.Td colSpan={4} pl="md">
          <CategoryGroupTitleRow
            id={group.id}
            name={group.name}
            onCategoryAdd={async (categoryName: string) => {
              createBudgetCategory.mutate({
                name: categoryName,
                groupId: group.id,
              });
            }}
          />
        </Table.Td>
      </Table.Tr>
      {categories.map((category) => (
        <CategoryRow
          key={category.id}
          allocation={allocations[category.id]}
          category={category}
          year={year}
          month={month}
        />
      ))}
    </Fragment>
  );
}
