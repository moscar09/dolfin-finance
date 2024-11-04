import { Stack } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { PageTitle, PageTitleButton } from '../components/molecules/PageTitle';
import { BudgetCard } from '../components/organisms/BudgetCard';
import { LayoutShell } from './layout';

export function BudgetPage() {
  const [monthYear, setMonthYear] = useState(dayjs());

  // const {
  //   data: budgetScaffold,
  //   isLoading: scaffoldIsLoading,
  //   mutate: mutateBudgetScaffold,
  // } = useSWR('/budget-category', (args) =>
  //   ApiClient.GET(args).then((response) => response.data)
  // );

  return (
    <LayoutShell>
      <Stack>
        <PageTitle
          title="Your budget for"
          subtitle={monthYear.format('MMMM YYYY')}
          startButton={
            <PageTitleButton
              Icon={IconChevronLeft}
              onClick={() =>
                setMonthYear(dayjs(monthYear).subtract(1, 'month'))
              }
            />
          }
          endButton={
            <PageTitleButton
              Icon={IconChevronRight}
              onClick={() => setMonthYear(dayjs(monthYear).add(1, 'month'))}
            />
          }
        />
        <BudgetCard month={monthYear.month() + 1} year={monthYear.year()} />
      </Stack>
    </LayoutShell>
  );
}
