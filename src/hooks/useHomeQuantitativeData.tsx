import { useQuery } from '@tanstack/react-query';
import { getHomeQuantitativeData } from '../services/homeService';
import type { HomeQuantData } from '../types/home';

// Re-exporta as tipagens para retrocompatibilidade
export type * from '../types/home';

// Tempo de cache: 1 semana (7 dias) em milissegundos
const UMA_SEMANA = 7 * 24 * 60 * 60 * 1000;
const CACHE_KEY = '@simcc:quantData';

/**
 * Interceptador que verifica o localStorage antes de acionar a API
 */
const fetchWithLocalStorageCache = async (): Promise<HomeQuantData> => {
  try {
    const cachedStr = localStorage.getItem(CACHE_KEY);
    
    if (cachedStr) {
      const { data, timestamp } = JSON.parse(cachedStr);
      const isExpired = Date.now() - timestamp > UMA_SEMANA;
      
      // Se NÃO expirou, devolve os dados do localStorage imediatamente
      if (!isExpired) {
        return data as HomeQuantData;
      }
    }
  } catch (error) {
    console.error("Erro ao ler cache do localStorage:", error);
  }

  // Se não existe cache ou expirou, busca os dados da API original
  const newData = await getHomeQuantitativeData();

  try {
    // Salva a nova resposta no localStorage com a hora exata da requisição
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: newData,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error("Erro ao salvar cache no localStorage:", error);
  }

  return newData;
};

/**
 * Hook para buscar dados quantitativos da Home utilizando React Query
 */
export function useHomeQuantitativeData() {
  return useQuery<HomeQuantData>({
    queryKey: ['homeQuantitativeData'],
    queryFn: fetchWithLocalStorageCache, 
    staleTime: UMA_SEMANA, // Garante que a memória do React Query acompanhe os 7 dias
    refetchOnWindowFocus: false,
  });
}

export default useHomeQuantitativeData;