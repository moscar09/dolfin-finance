import {
  PostTransactionDto,
  TransactionResponseDto,
} from '@dolfin-finance/api-types';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { axiosClient } from '../../utils/axiosClient';

export function useCreateTransaction() {
  return useMutation({
    mutationKey: ['createTransaction'],
    mutationFn: (transactionData: PostTransactionDto) =>
      axiosClient
        .post<
          unknown,
          AxiosResponse<TransactionResponseDto>,
          PostTransactionDto
        >(`/transaction`, transactionData)
        .then((res) => res.data),
  });
}
