// src/services/snapshotsService.js
// Leitura das fotos por instituição publicadas pelo coletor
// (`scripts/coletor-snapshots.mjs`).
//
// Padrão: branch `dados-snapshots` do repositório público, servido pelo
// raw.githubusercontent.com (aceita CORS). Para apontar para outro lugar
// (servidor próprio, pasta local), defina `VITE_SNAPSHOTS_URL`.

import axios from 'axios';

export const BASE_SNAPSHOTS = (
  import.meta.env.VITE_SNAPSHOTS_URL ||
  'https://raw.githubusercontent.com/observatorio-secti/observatorio-front/dados-snapshots'
).replace(/\/$/, '');

const cliente = axios.create({
  baseURL: BASE_SNAPSHOTS,
  timeout: 20000,
});

/** O CDN do GitHub guarda por alguns minutos; o parâmetro evita servir foto velha */
const semCache = () => ({ v: Math.floor(Date.now() / (5 * 60 * 1000)) });

/**
 * Índice com todas as fotos disponíveis.
 * @returns {Promise<{atualizado_em: string, snapshots: Array}>}
 */
export const getIndiceSnapshots = async () => {
  const { data } = await cliente.get('/index.json', { params: semCache() });
  if (!data || !Array.isArray(data.snapshots)) {
    throw new Error('O índice de snapshots está vazio ou em formato inesperado.');
  }
  return data;
};

/**
 * Conteúdo de uma foto.
 * @param {string} arquivo nome do arquivo devolvido pelo índice
 */
export const getSnapshot = async (arquivo) => {
  const { data } = await cliente.get(`/${arquivo}`, { params: semCache() });
  return data;
};

export default {
  getIndiceSnapshots,
  getSnapshot,
};
