import { Button, Group, Stack, Title } from '@mantine/core';
import { ReactNode } from 'react';

type PageTitleButtonProps = {
  Icon: React.ElementType;
  onClick: () => void;
};

export function PageTitleButton({ Icon, onClick }: PageTitleButtonProps) {
  return (
    <Button variant="transparent" size="compact-lg" onClick={onClick}>
      <Icon size="1.2rem" />
    </Button>
  );
}

export function PageTitle({
  title,
  subtitle,
  startButton: StartButton,
  endButton: EndButton,
}: {
  title: string;
  subtitle?: string;
  startButton?: ReactNode;
  endButton?: ReactNode;
}) {
  return (
    <Stack gap={2}>
      <Title order={1} c="dark" pb={0}>
        {title}
      </Title>
      <Group gap={0}>
        {StartButton}
        {subtitle && (
          <Title order={2} c="green.7">
            {subtitle}
          </Title>
        )}
        {EndButton}
      </Group>
    </Stack>
  );
}
