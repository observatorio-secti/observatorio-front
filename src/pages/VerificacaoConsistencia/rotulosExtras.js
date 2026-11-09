// src/pages/VerificacaoConsistencia/rotulosExtras.js
// Traduções reutilizáveis entre os componentes da página

import { ORIGENS_CARGA, SITUACOES_CARGA, TIPOS_CARGA } from '../../constants/consistencia';

export const nomeCarga = (carga) => {
  if (!carga) return '—';
  return TIPOS_CARGA[carga.load_type] || carga.load_type || '—';
};

export const nomePorTipoCarga = (tipo) => TIPOS_CARGA[tipo] || tipo || '—';

export const rotuloSituacaoCarga = (carga) =>
  carga ? SITUACOES_CARGA[carga.status] || carga.status || '—' : '—';

export const situacaoCargaPorTexto = (status) => SITUACOES_CARGA[status] || status || '—';

export const rotuloOrigem = (carga) =>
  carga ? ORIGENS_CARGA[carga.trigger_source] || carga.trigger_source || '—' : '—';

export const classeSituacaoCarga = (status) => {
  if (status === 'VALIDATED') return 'bg-success-emerald/15 text-success-emerald';
  if (status === 'RUNNING') return 'bg-primary/10 text-primary';
  if (status === 'FAILED') return 'bg-error-container text-on-error-container';
  return 'bg-surface-container-high text-on-surface-variant';
};
