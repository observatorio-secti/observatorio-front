// src/services/consistenciaService.js
// Cliente HTTP do módulo de Verificação de Consistência de Dados.
// Fonte: SimCC ETL (`GET /etl/consistencia/export`).
//
// Autenticação: header `X-ETL-API-Key`. A chave vem de `VITE_ETL_API_KEY`
// e fica embutida no bundle do site — o ETL liberou CORS para o domínio do
// portal e o endpoint é somente leitura. Risco conhecido, documentado no PR:
// o ideal no futuro é intermediar por um proxy no backend.

import axios from 'axios';

const etl = axios.create({
  baseURL: import.meta.env.VITE_ETL_URL || 'https://simcc.uesc.br/etl',
  timeout: 25000,
  headers: {
    'X-ETL-API-Key': import.meta.env.VITE_ETL_API_KEY || '',
  },
});

/**
 * Lista os relatórios de consistência.
 *
 * @param {object} filtros
 * @param {boolean} [filtros.apenas_ultimos] última tentativa por tipo
 *   (e a última conclusão íntegra, quando diferente)
 * @param {string}  [filtros.tipo] rotina específica
 * @param {string}  [filtros.desde] data inicial em ISO-8601
 * @param {number}  [filtros.limit] 1..500 (padrão do backend: 100)
 * @param {number}  [filtros.offset] deslocamento da paginação
 */
export const getRelatoriosConsistencia = async (filtros = {}) => {
  const params = Object.fromEntries(
    Object.entries(filtros).filter(([, valor]) => valor !== '' && valor != null),
  );

  const { data } = await etl.get('/consistencia/export', { params });
  return Array.isArray(data) ? data : [];
};

export default {
  getRelatoriosConsistencia,
};
