import { useQuery } from '@tanstack/react-query';
import { getWordResearcherList } from '../services/simccService';

/**
 * Custom hook to fetch SIMCC word cloud researcher data using TanStack Query.
 */
export function useSimccWordCloud() {
  return useQuery({
    queryKey: ['simccWordCloud'],
    queryFn: getWordResearcherList,
    staleTime: 1000 * 60 * 15, // 15 minutes cache
    refetchOnWindowFocus: false,
  });
}

export default useSimccWordCloud;
