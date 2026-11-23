import api from './api';

/**
 * Busca todos os dados quantitativos necessários para a Home em paralelo
 */
export const getHomeQuantitativeData = async () => {
  const resMetrics = await api.get('/v2/metrics/general');

  return {
    visaoPrograma: resMetrics.data?.data ?? null,
  };
};

/**
 * Busca sugestões de autocompletar na API v2/suggestion
 */
export const getSecondWordSuggestions = async (term, signal) => {
  const response = await api.get('/v2/suggestion', {
    params: {
      q: term,
      source_type: 'article',
      limit: 10,
    },
    signal,
  });
  return response.data?.data ?? [];
};
