import api from './api';

/**
 * Busca a lista de pesquisadores em destaque no SIMCC
 */
export const getOutstandingResearchers = async () => {
  const response = await api.get('/outstanding_researchers');
  return response.data;
};

/**
 * Gera a URL completa para a imagem do pesquisador
 */
export const getResearcherImageUrl = (researcherId, customBaseUrl) => {
  const base = (customBaseUrl || api.defaults.baseURL || 'https://simcc.uesc.br/v3/api').replace(/\/+$/, '');
  return `${base}/v2/researcher/${researcherId}/image`;
};

export default {
  getOutstandingResearchers,
  getResearcherImageUrl,
};
