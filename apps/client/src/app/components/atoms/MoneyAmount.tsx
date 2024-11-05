import { MantineStyleProps, NumberFormatter } from '@mantine/core';

export function MoneyAmount({
  amount,
}: {
  amount: number;
  fw?: MantineStyleProps['fw'];
  colored?: boolean;
}) {
  return (
    <NumberFormatter
      prefix="€"
      fixedDecimalScale={true}
      decimalScale={2}
      value={amount / 100}
    />
  );
}
