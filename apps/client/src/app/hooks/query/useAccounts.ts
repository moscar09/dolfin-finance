import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../../utils/axiosClient';
import { BankAccountDto } from '@dolfin-finance/api-types';

export function useAccounts() {
  return useQuery<BankAccountDto[]>({
    queryKey: ['accounts'],
    queryFn: async () => (await axiosClient.get('/bank-account')).data,
  });
}
