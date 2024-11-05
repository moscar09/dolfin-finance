import { MonthlyBudgetDto } from '@dolfin-finance/api-types';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../../utils/axiosClient';

export function useMonthlyBudget(month: number, year: number) {
  return useQuery<MonthlyBudgetDto>({
    queryKey: ['monthlyBudget', year, month],
    queryFn: async () =>
      (await axiosClient.get(`/monthly-budget/${year}/${month}`)).data,
  });
}
