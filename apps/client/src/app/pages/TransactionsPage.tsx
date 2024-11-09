import { Box, Button, Collapse, Group, rem, Stack, Text } from '@mantine/core';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import {
  IconCaretDownFilled,
  IconFile,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import { CalendarPopover } from '../components/molecules/CalendarPopover';
import { PageTitle } from '../components/molecules/PageTitle';
import { TransactionsCard } from '../components/organisms/TransactionsCard';
import { axiosClient } from '../utils/axiosClient';
import { LayoutShell } from './layout';

export function TransactionsPage() {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('d').subtract(3, 'month'),
    dayjs().endOf('d'),
  ]);

  const [dropzoneExpanded, setDropzoneExpanded] = useState(false);
  const [startDate, endDate] = dateRange;

  return (
    <LayoutShell>
      <Stack gap="md">
        <Group justify="space-between" align="end">
          <PageTitle
            title="Your transactions between"
            subtitle={`${startDate.format('MMMM D')} - ${endDate.format(
              'MMMM D'
            )}`}
            endButton={
              <CalendarPopover
                startDate={startDate}
                endDate={endDate}
                setDateRange={(start, end) => setDateRange([start, end])}
              />
            }
          />
          <Button
            size="sm"
            variant="outline"
            onMouseDown={() => setDropzoneExpanded(!dropzoneExpanded)}
            rightSection={
              <IconCaretDownFilled
                style={{
                  transform: `rotate(${dropzoneExpanded ? '180deg' : '0deg'})`,
                  transitionDuration: '0.3s',
                  transitionProperty: 'transform',
                }}
                width="70%"
              />
            }
          >
            Add transactions
          </Button>
        </Group>
        <Box>
          <Collapse in={dropzoneExpanded} transitionDuration={300}>
            <Dropzone
              my="md"
              onDrop={(files) => {
                const fd = new FormData();
                fd.append('transactions', files[0]);
                axiosClient.post('/transaction/upload', fd, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                });
              }}
              onReject={(files) => console.log('rejected files', files)}
              maxSize={5 * 1024 ** 2}
              accept={[
                MIME_TYPES['7z'],
                MIME_TYPES.zip,
                MIME_TYPES.rar,
                'text/xml',
              ]}
            >
              <Group justify="center" h="100px">
                <Dropzone.Accept>
                  <IconUpload
                    style={{
                      width: rem(32),
                      height: rem(32),
                      color: 'var(--mantine-color-green-6)',
                    }}
                    stroke={1.5}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX
                    style={{
                      width: rem(32),
                      height: rem(32),
                      color: 'var(--mantine-color-red-6)',
                    }}
                    stroke={1.5}
                  />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconFile
                    style={{
                      width: rem(32),
                      height: rem(32),
                      color: 'var(--mantine-color-dimmed)',
                    }}
                    stroke={1.5}
                  />
                </Dropzone.Idle>
                <Text fw={600} size="lg" c="dimmed">
                  Drop your CAMT.053 export file here
                </Text>
              </Group>
            </Dropzone>
          </Collapse>

          <TransactionsCard startDate={startDate} endDate={endDate} />
        </Box>
      </Stack>
    </LayoutShell>
  );
}
