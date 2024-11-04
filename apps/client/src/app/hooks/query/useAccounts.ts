import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../../utils/axiosClient';

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await axiosClient.get('/bank-account');
      return res.data;
    },
  });
}
