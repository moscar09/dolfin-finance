import { BankAccountDto } from '@dolfin-finance/api-types';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../../utils/axiosClient';

export function useAccount(id?: number) {
  return useQuery<BankAccountDto>({
    enabled: !!id,
    queryKey: ['account', id],
    queryFn: async () =>
      (await axiosClient.get(`/bank-account/${id}`, {})).data,
  });
}
