import { BudgetCategoryDto } from '@dolfin-finance/api-types';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../../utils/axiosClient';

export function useBudgetCategories() {
  return useQuery<BudgetCategoryDto[]>({
    queryKey: ['budgetCategories'],
    queryFn: async () => (await axiosClient.get('/budget-category')).data,
  });
}
