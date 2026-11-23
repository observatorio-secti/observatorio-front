import api from './api';

/**
 * Busca todos os dados quantitativos necessários para a Home em paralelo
 */
export const getHomeQuantitativeData = async () => {
  const resVisao = await api.get('/graduate_program_production?graduate_program_id=0&year=1900');

  const rawVisao = resVisao.data;
  const parsedVisao = Array.isArray(rawVisao) ? (rawVisao[0] ?? null) : rawVisao;

  return {
    visaoPrograma: parsedVisao,
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
