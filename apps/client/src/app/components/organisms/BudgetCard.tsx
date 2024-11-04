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

import { addNewSubcategory, ApiClient } from '../../../client/ApiClient';
import { components } from '../../../client/schema';

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
  allocation: components['schemas']['Budget Subcategory Allocation'];
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
          (allocation.remaining || 0) > 0
            ? 'green'
            : allocation.remaining === 0
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
  const useSWR: any = () => {
    return '';
  };
  const {
    data: budgetAllocations,
    isLoading: allocationsAreLoading,
    mutate: mutateBudgetAllocations,
  } = useSWR(`/monthly-budget/${month}-${year}`, () =>
    ApiClient.GET('/monthly-budget/{month}-{year}', {
      params: { path: { month, year } },
    }).then((r) => r.data)
  );

  if (
    scaffoldIsLoading ||
    allocationsAreLoading ||
    !budgetAllocations?.allocations
  )
    return;

  const budgetAllocationsBySubId = budgetAllocations.allocations.reduce(
    (acc, item) => ({ ...acc, [item.budgetSubcategory.id]: item }),
    {}
  );

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
            {budgetScaffold.map(({ id, name, subcategories }) => (
              <Fragment key={id}>
                <Table.Tr bg="gray.0">
                  <Table.Td colSpan={4} pl="md">
                    <BudgetCategoryTitleCell
                      id={id}
                      name={name}
                      onCategoryAdd={async (categoryName: string) => {
                        await addNewSubcategory(id, categoryName);
                        await mutateBudgetAllocations(budgetAllocations);
                        await mutateBudgetScaffold(budgetScaffold);
                      }}
                    />
                  </Table.Td>
                </Table.Tr>
                {subcategories.map((subcat) => (
                  <SubcategoryRow
                    onBudgetChange={async (amount) => {
                      await ApiClient.PATCH(
                        '/monthly-budget/{month}-{year}/allocation/{subcategoryId}',
                        {
                          params: {
                            path: {
                              month,
                              year,
                              subcategoryId: subcat.id,
                            },
                          },
                          body: { amount },
                        }
                      );

                      mutateBudgetAllocations();
                    }}
                    key={subcat.id}
                    allocation={budgetAllocationsBySubId[subcat.id]}
                    subcategory={subcat}
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
