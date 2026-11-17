// src/hooks/useConsistencia.js
// Hooks React Query do módulo de Consistência de Dados

import { useQuery } from '@tanstack/react-query';

import { getRelatoriosConsistencia } from '../services/consistenciaService';
import { INTERVALO_ATUALIZACAO } from '../constants/consistencia';

/**
 * Última execução de cada rotina.
 * `apenas_ultimos=true` evita mascarar uma falha recente com um sucesso antigo.
 */
export function useUltimasExecucoes() {
  return useQuery({
    queryKey: ['consistencia', 'ultimas'],
    queryFn: () => getRelatoriosConsistencia({ apenas_ultimos: true, limit: 500 }),
    staleTime: INTERVALO_ATUALIZACAO,
    refetchInterval: INTERVALO_ATUALIZACAO,
    refetchOnWindowFocus: false,
  });
}

/** Histórico paginado, com filtros aplicados no backend */
export function useHistoricoExecucoes(filtros = {}, opcoes = {}) {
  return useQuery({
    queryKey: ['consistencia', 'historico', filtros],
    queryFn: () => getRelatoriosConsistencia(filtros),
    staleTime: INTERVALO_ATUALIZACAO,
    refetchOnWindowFocus: false,
    placeholderData: (anterior) => anterior,
    ...opcoes,
  });
}

export default {
  useUltimasExecucoes,
  useHistoricoExecucoes,
};
