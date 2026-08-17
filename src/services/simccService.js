import api from './api';

/**
 * Fetches list of researcher word terms with frequencies (among)
 * @returns {Promise<Array<{among: number, term: string}>>}
 */
export const getWordResearcherList = async () => {
  const response = await api.get('/lists_word_researcher');
  return response.data;
};
