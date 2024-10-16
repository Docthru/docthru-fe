import { useQuery } from '@tanstack/react-query';
import { getChallengeList } from '@/service/api/challenge';

export function useGetChallenges(queryParams) {
  return useQuery({
    queryKey: ['challenges'],
    queryFn: () => getChallengeList(queryParams),
  });
}
