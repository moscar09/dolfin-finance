import { useMutation } from '@tanstack/react-query';
import { axiosClient } from '../../utils/axiosClient';
import { queryClient } from '../../utils/queryClient';
import {
  MonthlyBudgetAllocationState,
  MonthlyBudgetDto,
} from '@dolfin-finance/api-types';

export function useUpdateBudgetAllocation() {
  return useMutation({
    mutationKey: ['createBudgetcategory'],
    mutationFn: ({
      month,
      year,
      categoryId,
      amount,
    }: {
      month: number;
      year: number;
      categoryId: number;
      amount: number;
    }) => {
      const amountCents = amount * 100;
      return axiosClient
        .put<MonthlyBudgetAllocationState>(
          `/monthly-budget/${year}/${month}/${categoryId}`,
          { amountCents }
        )
        .then((res) => res.data);
    },
    onSuccess: (result, { year, month, categoryId }) => {
      queryClient.setQueryData(
        ['monthlyBudget', year, month],
        (old: MonthlyBudgetDto) => {
          const newBudget = { ...old };
          newBudget.allocations = old.allocations.map((allocation) => ({
            ...allocation,
          }));

          const existingAllocation = newBudget.allocations.find(
            (allocation) => allocation.categoryId === categoryId
          );

          if (existingAllocation) {
            Object.assign(existingAllocation, result);
          } else {
            newBudget.allocations.push(result);
          }
          console.dir(newBudget);
          return newBudget;
        }
      );
    },
  });
}
