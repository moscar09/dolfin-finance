import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../../utils/axiosClient';
import { Dayjs } from 'dayjs';
import { TransactionDto } from '@dolfin-finance/api-types';

export function useTransactions(startDate: Dayjs, endDate: Dayjs) {
  return useQuery<TransactionDto[]>({
    queryKey: ['transactions', startDate, endDate],
    queryFn: async () =>
      await axiosClient
        .get<TransactionDto[]>('/transaction', {
          params: {
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
          },
        })
        .then((res) => res.data),
  });
}
