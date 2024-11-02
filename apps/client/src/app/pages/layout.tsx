import {
  AppShell,
  AppShellMain,
  AppShellNavbar,
  NavLink,
  ThemeIcon,
} from '@mantine/core';
import {
  IconCoins,
  IconCreditCardFilled,
  IconFileEuro,
} from '@tabler/icons-react';
import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

export function LayoutShell({ children }: PropsWithChildren) {
  return (
    <AppShell
      layout="alt"
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: false } }}
      padding="md"
    >
      <AppShellNavbar p="md">
        <NavLink
          component={Link}
          to="/budget"
          label="Budget"
          leftSection={
            <ThemeIcon variant="subtle" c="green" size="md" radius="sm">
              <IconFileEuro size="1.2rem" />
            </ThemeIcon>
          }
        />

        <NavLink
          component={Link}
          to="/accounts"
          label="Accounts"
          leftSection={
            <ThemeIcon variant="subtle" size="md" radius="sm">
              <IconCreditCardFilled size="1.2rem" />
            </ThemeIcon>
          }
        />
        <NavLink
          component={Link}
          to="/transactions"
          label="Transactions"
          leftSection={
            <ThemeIcon variant="subtle" c="yellow" size="md" radius="sm">
              <IconCoins size="1.2rem" />
            </ThemeIcon>
          }
        />
      </AppShellNavbar>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
