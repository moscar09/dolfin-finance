import { Box, Group, LoadingOverlay, rem, Text } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import {
  Icon,
  IconBomb,
  IconCheck,
  IconFile,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import { useState } from 'react';

function MessageGroup({
  Icon,
  iconColor,
  text,
}: {
  Icon: Icon;
  iconColor: string;
  text: string;
}) {
  return (
    <Group justify="center" h="100px">
      <Icon
        style={{
          width: rem(32),
          height: rem(32),
          color: iconColor,
        }}
        stroke={1.5}
      />
      <Text fw={600} size="lg" c="dimmed">
        {text}
      </Text>
    </Group>
  );
}

export function FileDropzone({
  label,
  queryFn,
  formField,
}: {
  label: string;
  formField: string;
  queryFn: (formData: FormData) => Promise<unknown>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [zoneState, setZoneState] = useState<'error' | 'success' | 'idle'>(
    'idle'
  );
  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: 'md', blur: 2 }}
      />

      <Dropzone
        my="md"
        onDrop={async (files) => {
          const fd = new FormData();
          fd.append(formField, files[0]);
          setZoneState('idle');
          setIsLoading(true);
          const res = await queryFn(fd).catch(() => false);
          setIsLoading(false);
          if (!res) setZoneState('error');
          else setZoneState('success');
        }}
        maxSize={5 * 1024 ** 2}
        accept={[MIME_TYPES['7z'], MIME_TYPES.zip, MIME_TYPES.rar, 'text/xml']}
        styles={{
          root:
            zoneState === 'error'
              ? { borderColor: 'var(--mantine-color-red-3)' }
              : zoneState === 'success'
              ? { borderColor: 'var(--mantine-color-green-6)' }
              : {},
        }}
      >
        <Dropzone.Accept>
          <MessageGroup
            Icon={IconUpload}
            iconColor="var(--mantine-color-green-6)"
            text={label}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <MessageGroup
            Icon={IconX}
            iconColor="var(--mantine-color-red-4)"
            text="Cannot process this file type."
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          {zoneState === 'idle' && (
            <MessageGroup
              Icon={IconFile}
              iconColor="var(--mantine-color-dimmed)"
              text={label}
            />
          )}
          {zoneState === 'error' && (
            <MessageGroup
              Icon={IconBomb}
              iconColor="var(--mantine-color-red-4)"
              text="Something bad happened, please try again."
            />
          )}
          {zoneState === 'success' && (
            <MessageGroup
              Icon={IconCheck}
              iconColor="var(--mantine-color-green-6)"
              text="The upload was successful!"
            />
          )}
        </Dropzone.Idle>
      </Dropzone>
    </Box>
  );
}
