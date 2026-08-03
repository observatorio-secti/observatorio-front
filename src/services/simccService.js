import axios from 'axios';

const simccApi = axios.create({
  baseURL: 'https://simcc.uesc.br/v3/api',
  timeout: 10000,
});

/**
 * Fetches list of researcher word terms with frequencies (among)
 * @returns {Promise<Array<{among: number, term: string}>>}
 */
export const getWordResearcherList = async () => {
  const response = await simccApi.get('/lists_word_researcher');
  return response.data;
};
