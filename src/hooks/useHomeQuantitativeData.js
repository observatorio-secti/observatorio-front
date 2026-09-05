import { useQuery } from '@tanstack/react-query';
import { getHomeQuantitativeData } from '../services/homeService';

// Tempo de cache: 1 semana (7 dias) em milissegundos
const UMA_SEMANA = 7 * 24 * 60 * 60 * 1000;
const CACHE_KEY = '@simcc:quantData';

/**
 * 1. FUNÇÃO SÍNCRONA: Lê o localStorage imediatamente (Tira o delay da tela)
 */
const getCachedData = () => {
  try {
    const cachedStr = localStorage.getItem(CACHE_KEY);
    
    if (cachedStr) {
      const { data, timestamp } = JSON.parse(cachedStr);
      const isExpired = Date.now() - timestamp > UMA_SEMANA;
      
      // Se NÃO expirou, devolve os dados imediatamente para a renderização inicial
      if (!isExpired) {
        return data;
      }
    }
  } catch (error) {
    console.error("Erro ao ler cache do localStorage:", error);
  }
  
  // Retorna undefined se não tiver cache válido, forçando a API
  return undefined;
};

/**
 * 2. FUNÇÃO ASSÍNCRONA: Só roda se o cache acima falhar ou estiver vencido
 */
const fetchWithLocalStorageCache = async () => {
  const newData = await getHomeQuantitativeData();

  try {
    // Salva a nova resposta no localStorage com a hora exata
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
  return useQuery({
    queryKey: ['homeQuantitativeData'],
    queryFn: fetchWithLocalStorageCache, 
    initialData: getCachedData, // <-- Carrega instantaneamente da memória do navegador
    staleTime: UMA_SEMANA,
    refetchOnWindowFocus: false,
  });
}

export default useHomeQuantitativeData;