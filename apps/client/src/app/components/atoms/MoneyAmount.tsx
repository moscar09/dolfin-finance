import { MantineStyleProps } from '@mantine/core';
import currency from 'currency.js';

export function MoneyAmount({
  amount,
}: {
  amount: number;
  fw?: MantineStyleProps['fw'];
  colored?: boolean;
}) {
  return currency(amount, { fromCents: true }).format({ symbol: '€' });
}
