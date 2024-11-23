import { BankAccountDto, BankAccountType } from '@dolfin-finance/api-types';
import {
  AppShellNavbar,
  Button,
  Divider,
  Group,
  NavLink,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconCreditCard,
  IconDashboard,
  IconFileEuro,
  IconFish,
  IconPigMoney,
  IconPlus,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useAccounts } from '../../hooks/queries/useAccounts';

function NavbarAccountList({ accounts }: { accounts: BankAccountDto[] }) {
  return (
    <>
      {accounts.map(({ id, prettyName, name, type }) => (
        <NavLink
          component={Link}
          to={`/accounts/${id}`}
          leftSection={
            type === BankAccountType.CURRENT ? (
              <ThemeIcon variant="subtle" c="orange" size="md" radius="sm">
                <IconCreditCard size="1.2rem" />
              </ThemeIcon>
            ) : (
              <ThemeIcon variant="subtle" c="green" size="md" radius="sm">
                <IconPigMoney size="1.2rem" />
              </ThemeIcon>
            )
          }
          label={prettyName || name}
          description={
            type === BankAccountType.CURRENT
              ? 'Current Account'
              : 'Savings Account'
          }
        />
      ))}
      <Button
        mt="xs"
        variant="subtle"
        size="compact-sm"
        leftSection={<IconPlus size={'16px'} />}
        fullWidth={false}
      >
        Add account
      </Button>
    </>
  );
}

export function MainNavbar() {
  const { data: accounts, isPending } = useAccounts([
    BankAccountType.CURRENT,
    BankAccountType.SAVINGS,
  ]);
  return (
    <AppShellNavbar pt="md">
      <Group ml="md" mb="xs" gap="xs" align="center">
        <ThemeIcon variant="subtle" c="blue" size="md" radius="sm">
          <IconFish stroke={1.5} size="100%" />
        </ThemeIcon>
        <Text size="xl" fw={500}>
          Dol
          <Text span c="blue" fw={600} size="xl">
            finance
          </Text>
        </Text>
      </Group>
      <NavLink
        component={Link}
        to="/"
        label="Dashboard"
        leftSection={
          <ThemeIcon variant="subtle" c="blue" size="md" radius="sm">
            <IconDashboard size="1.2rem" />
          </ThemeIcon>
        }
      />
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

      <Divider label="Accounts" mx="xs" labelPosition="left" />
      {!isPending && <NavbarAccountList accounts={accounts || []} />}
    </AppShellNavbar>
  );
}
