import api from './api';

/**
 * Busca todos os dados quantitativos necessários para a Home em paralelo
 */
export const getHomeQuantitativeData = async () => {
  const [resVisao, resScholarships] = await Promise.all([
    api.get('/graduate_program_production?graduate_program_id=0&year=1900'),
    api.get('/metrics/researcher/scholarship'),
  ]);

  const rawVisao = resVisao.data;
  const parsedVisao = Array.isArray(rawVisao) ? (rawVisao[0] ?? null) : rawVisao;

  return {
    visaoPrograma: parsedVisao,
    scholarships: resScholarships.data ?? null,
  };
};

/**
 * Busca sugestões de autocompletar na API secondWord
 */
export const getSecondWordSuggestions = async (term, signal) => {
  const response = await api.get('/secondWord', {
    params: { term },
    signal,
  });
  return response.data;
};
