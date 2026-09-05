import { useQuery } from '@tanstack/react-query';
import { getOutstandingResearchers } from '../services/researcherService';

/**
 * Hook para buscar pesquisadores em destaque utilizando React Query e Axios
 * @param {number} maxItems Quantidade máxima de pesquisadores a retornar após embaralhar
 */
export function useFeaturedResearchers(maxItems = 30) {
  return useQuery({
    queryKey: ['featuredResearchers', maxItems],
    queryFn: async () => {
      const data = await getOutstandingResearchers();
      if (!Array.isArray(data)) return [];
      // Embaralha o array e pega os primeiros maxItems
      return [...data].sort(() => 0.5 - Math.random()).slice(0, maxItems);
    },
    staleTime: 1000 * 60 * 15, // 15 minutos em cache
    refetchOnWindowFocus: false,
  });
}

export default useFeaturedResearchers;
