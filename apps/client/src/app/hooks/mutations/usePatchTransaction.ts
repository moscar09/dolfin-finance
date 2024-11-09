import { PatchTransactionDto, TransactionDto } from '@dolfin-finance/api-types';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { axiosClient } from '../../utils/axiosClient';
import { queryClient } from '../../utils/queryClient';

export function usePatchTransaction() {
  return useMutation({
    mutationKey: ['patchTransaction'],
    mutationFn: ({
      transactionId,
      categoryId,
    }: {
      transactionId: number;
      categoryId: number;
    }) =>
      axiosClient
        .patch<unknown, AxiosResponse<TransactionDto>, PatchTransactionDto>(
          `/transaction/${transactionId}`,
          {
            categoryId,
          }
        )
        .then((res) => res.data),
    onSuccess: (result) => {
      queryClient.setQueryData(['transactions'], (old: TransactionDto[]) => {
        const oldCopy = [...old];

        return oldCopy.map((trans) =>
          trans.id === result.id ? result : trans
        );
      });
    },
  });
}
