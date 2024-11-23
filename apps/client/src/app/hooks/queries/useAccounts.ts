import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../../utils/axiosClient';
import { BankAccountDto, BankAccountType } from '@dolfin-finance/api-types';

export function useAccounts(type: BankAccountType[] = []) {
  return useQuery<BankAccountDto[]>({
    queryKey: ['accounts', ...type.sort()],
    queryFn: async () =>
      (
        await axiosClient.get('/bank-account', {
          params: {
            type: type,
          },
        })
      ).data,
  });
}
