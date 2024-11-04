import {
  Button,
  Card,
  Group,
  NumberFormatter,
  Popover,
  Stack,
  Table,
  TextInput,
} from '@mantine/core';
import { IconCirclePlus } from '@tabler/icons-react';
import React, { Fragment, useRef, useState } from 'react';

import { BudgetCategoryDto } from '@dolfin-finance/api-types';
import { ApiClient } from '../../../client/ApiClient';
import { components } from '../../../client/schema';
import { useBudgetCategories } from '../../hooks/query/useBudgetCategories';

function BudgetCategoryTitleCell({
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

function SubcategoryRow({
  allocation,
  subcategory,
  onBudgetChange,
}: {
  allocation?: any;
  subcategory: components['schemas']['BudgetSubcategory'];
  onBudgetChange: (amount: number) => void;
}) {
  return (
    <Table.Tr key={subcategory.id}>
      <Table.Td pl="md">{subcategory.name}</Table.Td>
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
  console.dir(categoriesByGroup);

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
            {Object.values(categoriesByGroup).map((categoriesInGroup) => (
              <Fragment key={categoriesInGroup[0].group.id}>
                <Table.Tr bg="gray.0">
                  <Table.Td colSpan={4} pl="md">
                    <BudgetCategoryTitleCell
                      id={categoriesInGroup[0].group.id}
                      name={categoriesInGroup[0].group.name}
                      onCategoryAdd={async (categoryName: string) => {
                        // await addNewSubcategory(id, categoryName);
                        // await mutateBudgetAllocations(budgetAllocations);
                        // await mutateBudgetScaffold(budgetScaffold);
                      }}
                    />
                  </Table.Td>
                </Table.Tr>
                {categoriesInGroup.map((category) => (
                  <SubcategoryRow
                    onBudgetChange={async (amount) => {
                      await ApiClient.PATCH(
                        '/monthly-budget/{month}-{year}/allocation/{subcategoryId}',
                        {
                          params: {
                            path: {
                              month,
                              year,
                              subcategoryId: category.id,
                            },
                          },
                          body: { amount },
                        }
                      );

                      // mutateBudgetAllocations();
                    }}
                    key={category.id}
                    allocation={undefined}
                    // allocation={budgetAllocationsBySubId[category.id]}
                    subcategory={category}
                  />
                ))}
              </Fragment>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Card>
  );
}
