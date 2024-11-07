import { Button, Popover, Stack } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

import { IconCalendarFilled } from '@tabler/icons-react';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

export function CalendarPopover({
  startDate,
  endDate,
  setDateRange,
}: {
  startDate: Dayjs;
  endDate: Dayjs;
  setDateRange: (startDate: Dayjs, endDate: Dayjs) => void;
}) {
  const [opened, setOpened] = useState(false);
  return (
    <Popover
      width={300}
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      onClose={() => setOpened(false)}
    >
      <Popover.Target>
        <Button
          variant="transparent"
          size="compact-lg"
          onClick={() => setOpened(true)}
        >
          <IconCalendarFilled size="1.2rem" />
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <DatePicker
            type="range"
            allowSingleDateInRange
            defaultValue={[startDate.toDate(), endDate.toDate()]}
            onChange={([startDate, endDate]) => {
              if (startDate && endDate) {
                setDateRange(dayjs(startDate), dayjs(endDate));
                setOpened(false);
              }
            }}
          />
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
