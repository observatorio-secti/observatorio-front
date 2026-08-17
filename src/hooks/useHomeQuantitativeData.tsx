import { useQuery } from '@tanstack/react-query';
import { getHomeQuantitativeData } from '../services/homeService';
import type { HomeQuantData } from '../types/home';

// Re-exporta as tipagens para retrocompatibilidade
export type * from '../types/home';

/**
 * Hook para buscar dados quantitativos da Home utilizando React Query
 */
export function useHomeQuantitativeData() {
  return useQuery<HomeQuantData>({
    queryKey: ['homeQuantitativeData'],
    queryFn: getHomeQuantitativeData,
    staleTime: 1000 * 60 * 15, // 15 minutos em cache
    refetchOnWindowFocus: false,
  });
}

export default useHomeQuantitativeData;