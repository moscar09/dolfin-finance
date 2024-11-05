import { useMutation } from '@tanstack/react-query';
import { axiosClient } from '../../utils/axiosClient';
import { queryClient } from '../../utils/queryClient';
import { BudgetCategoryDto } from '@dolfin-finance/api-types';

export function useDeleteBudgetCategory() {
  return useMutation({
    mutationKey: ['deleteBudgetcategory'],
    mutationFn: (id: number) =>
      axiosClient
        .delete<boolean>(`/budget-category/${id}`)
        .then((res) => res.data),
    onSuccess: (result, id) => {
      if (result) {
        queryClient.setQueryData(
          ['budgetCategories'],
          (old: BudgetCategoryDto[]) => {
            return [...old].filter((category) => category.id !== id);
          }
        );
      }
    },
  });
}
