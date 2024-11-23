import {
  AppShell,
  AppShellMain,
  AppShellNavbar,
  Button,
  NavLink,
  rem,
  ThemeIcon,
} from '@mantine/core';
import {
  IconCreditCardFilled,
  IconFileEuro,
  IconPlus,
} from '@tabler/icons-react';
import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { MainNavbar } from '../components/organisms/MainNavbar';

export function LayoutShell({ children }: PropsWithChildren) {
  return (
    <AppShell
      layout="alt"
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: false } }}
      padding="md"
    >
      <MainNavbar />
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
