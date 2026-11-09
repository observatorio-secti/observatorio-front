// src/services/consistenciaService.js
// Cliente HTTP do módulo de Verificação de Consistência de Dados
// Documentação: `consistencia-dados.md` (endpoints públicos `/data-consistency`)

import api from './api';

/**
 * Último relatório validado.
 * Retorna `null` quando ainda não existe carga validada (404 esperado).
 */
export const getUltimoRelatorio = async () => {
  try {
    const { data } = await api.get('/data-consistency/latest');
    return data;
  } catch (erro) {
    if (erro.response && erro.response.status === 404) return null;
    throw erro;
  }
};

/**
 * Histórico de execuções. Filtros aceitos pelo backend:
 * `load_type`, `status`, `date_from`, `date_to`, `limit`.
 */
export const getHistoricoCargas = async (filtros = {}) => {
  const { data } = await api.get('/data-consistency/history', { params: filtros });
  return Array.isArray(data) ? data : [];
};

/**
 * Última execução por tipo de carga. A forma da resposta (objeto por tipo
 * ou lista) ainda pode variar conforme o backend — normalizada na página.
 */
export const getUltimasCargasPorTipo = async () => {
  const { data } = await api.get('/data-consistency/loads/latest');
  return data;
};

export default {
  getUltimoRelatorio,
  getHistoricoCargas,
  getUltimasCargasPorTipo,
};
