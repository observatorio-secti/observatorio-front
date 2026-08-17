import api from './api';
import type { WordResearcherItem } from '../types/simcc';

/**
 * Fetches list of researcher word terms with frequencies (among)
 */
export const getWordResearcherList = async (): Promise<WordResearcherItem[]> => {
  const response = await api.get<WordResearcherItem[]>('/lists_word_researcher');
  return response.data;
};

export default {
  getWordResearcherList,
};
