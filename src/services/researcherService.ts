import api from './api';
import type { Researcher } from '../types/researcher';

/**
 * Busca a lista de pesquisadores em destaque no SIMCC
 */
export const getOutstandingResearchers = async (): Promise<Researcher[]> => {
  const response = await api.get<Researcher[]>('/outstanding_researchers');
  return response.data;
};

/**
 * Gera a URL completa para a imagem do pesquisador
 */
export const getResearcherImageUrl = (researcherId: string, customBaseUrl?: string): string => {
  const base = (customBaseUrl || api.defaults.baseURL || 'https://simcc.uesc.br/v3/api').replace(/\/+$/, '');
  return `${base}/ResearcherData/Image?researcher_id=${researcherId}`;
};

export default {
  getOutstandingResearchers,
  getResearcherImageUrl,
};
