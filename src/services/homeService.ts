import api from './api';
import type { HomeQuantData, VisaoPrograma, ScholarshipMetrics, SecondWordItem } from '../types/home';

/**
 * Busca todos os dados quantitativos necessários para a Home em paralelo
 */
export const getHomeQuantitativeData = async (): Promise<HomeQuantData> => {
  const [resVisao, resScholarships] = await Promise.all([
    api.get<VisaoPrograma | VisaoPrograma[]>('/graduate_program_production?graduate_program_id=0&year=1900'),
    api.get<ScholarshipMetrics[]>('/metrics/researcher/scholarship'),
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
export const getSecondWordSuggestions = async (
  term: string,
  signal?: AbortSignal
): Promise<SecondWordItem[]> => {
  const response = await api.get<SecondWordItem[]>('/secondWord', {
    params: { term },
    signal,
  });
  return response.data;
};
