import { Grid, Stack } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { PageTitle, PageTitleButton } from '../components/molecules/PageTitle';
import { BudgetCard } from '../components/organisms/BudgetCard';
import { LayoutShell } from './layout';
import { BudgetSummaryCard } from '../components/organisms/BudgetSummaryCard';

export function BudgetPage() {
  const [monthYear, setMonthYear] = useState(dayjs());

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
        <Grid>
          <Grid.Col span={8}>
            <BudgetCard month={monthYear.month() + 1} year={monthYear.year()} />
          </Grid.Col>
          <Grid.Col span={4}>
            <Stack>
              <BudgetSummaryCard
                month={monthYear.month() + 1}
                year={monthYear.year()}
              />
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </LayoutShell>
  );
}
