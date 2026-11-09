// src/hooks/useConsistencia.js
// Hooks React Query do módulo de Verificação de Consistência de Dados

import { useQuery } from '@tanstack/react-query';
import {
  getHistoricoCargas,
  getUltimasCargasPorTipo,
  getUltimoRelatorio,
} from '../services/consistenciaService';

/** Último relatório validado (método `/data-consistency/latest`) */
export function useUltimoRelatorio() {
  return useQuery({
    queryKey: ['consistencia', 'ultimoRelatorio'],
    queryFn: getUltimoRelatorio,
    staleTime: 1000 * 60 * 2, // comparação muda pouco: 2 minutos
    refetchOnWindowFocus: false,
  });
}

/** Histórico de execuções com filtros do backend */
export function useHistoricoCargas(filtros = {}) {
  return useQuery({
    queryKey: ['consistencia', 'historico', filtros],
    queryFn: () => getHistoricoCargas({ limit: 50, ...filtros }),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}

/** Última execução por tipo de carga (cards de carga) */
export function useUltimasCargas() {
  return useQuery({
    queryKey: ['consistencia', 'ultimasCargas'],
    queryFn: getUltimasCargasPorTipo,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}

export default {
  useUltimoRelatorio,
  useHistoricoCargas,
  useUltimasCargas,
};
