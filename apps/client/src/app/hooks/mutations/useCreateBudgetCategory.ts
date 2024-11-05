import { useMutation } from '@tanstack/react-query';
import { axiosClient } from '../../utils/axiosClient';
import { queryClient } from '../../utils/queryClient';
import { BudgetCategoryDto } from '@dolfin-finance/api-types';

export function useCreateBudgetCategory() {
  return useMutation({
    mutationKey: ['createBudgetcategory'],
    mutationFn: (data: { name: string; groupId: number }) =>
      axiosClient
        .post<BudgetCategoryDto>('/budget-category', data)
        .then((res) => res.data),
    onSuccess: (result) => {
      queryClient.setQueryData(
        ['budgetCategories'],
        (old: BudgetCategoryDto[]) => [...old, result]
      );
    },
  });
}
