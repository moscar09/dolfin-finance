import { BudgetCategoryDto } from '@dolfin-finance/api-types';
import { Button, Group, Popover, Stack, Table, TextInput } from '@mantine/core';
import { Fragment } from 'react/jsx-runtime';
import { useCreateBudgetCategory } from '../../../hooks/mutations/useCreateBudgetCategory';
import { CategoryRow } from './CategoryRow';
import { IconCirclePlus } from '@tabler/icons-react';
import { useRef, useState } from 'react';

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
}: {
  categories: BudgetCategoryDto[];
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
          onBudgetChange={async (amount) => {
            // await ApiClient.PATCH(
            //   '/monthly-budget/{month}-{year}/allocation/{subcategoryId}',
            //   {
            //     params: {
            //       path: {
            //         month,
            //         year,
            //         subcategoryId: category.id,
            //       },
            //     },
            //     body: { amount },
            //   }
            // );
            // mutateBudgetAllocations();
          }}
          key={category.id}
          allocation={undefined}
          // allocation={budgetAllocationsBySubId[category.id]}
          category={category}
        />
      ))}
    </Fragment>
  );
}
