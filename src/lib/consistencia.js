// src/lib/consistencia.js
// Utilitários do módulo de Verificação de Consistência de Dados

import {
  CHAVE_LIMITES,
  ESCOPOS,
  LIMITES_PADRAO,
  METRICAS,
  SITUACOES_COMPARACAO,
} from '../constants/consistencia';

/* ---------- Formatação ---------- */

export const formatarNumero = (valor) =>
  valor == null ? '—' : Number(valor).toLocaleString('pt-BR');

export const formatarDataHora = (iso) =>
  iso
    ? new Date(iso).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

export const formatarVariacao = (percentual) =>
  percentual == null
    ? '—'
    : `${Number(percentual).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%`;

export const nomeMetrica = (chave) => METRICAS[chave] || chave;

export const rotuloSituacao = (status) => SITUACOES_COMPARACAO[status] || status;

export const rotuloEscopo = (escopo) => ESCOPOS[escopo] || escopo;

/* ---------- Limites de variação (painel de simulação) ---------- */

/**
 * Carrega os limites salvos no navegador; recai para os padrões do contrato.
 * Observação: no protótipo a persistência é local — na produção os limites
 * oficiais ficam no backend (ver seção "Decisões" do relatório de testes).
 */
export const limitesCarregados = () => {
  try {
    const cru = localStorage.getItem(CHAVE_LIMITES);
    if (cru) {
      const l = JSON.parse(cru);
      if (typeof l.queda === 'number' && typeof l.alta === 'number') {
        return { queda: l.queda, alta: l.alta, excecoes: l.excecoes || {} };
      }
    }
  } catch (erro) {
    console.error('Erro ao ler limites de consistência:', erro);
  }
  return { ...LIMITES_PADRAO, excecoes: {} };
};

export const limitesSalvar = (limites) => {
  try {
    localStorage.setItem(CHAVE_LIMITES, JSON.stringify(limites));
  } catch (erro) {
    console.error('Erro ao salvar limites de consistência:', erro);
  }
};

export const limitesValidos = (limites) =>
  limites && typeof limites.queda === 'number' && typeof limites.alta === 'number';

/** Limites aplicáveis a uma métrica (exceção sobrepõe o padrão) */
export const limitesDe = (limites, metrica) => {
  const excecao = limites.excecoes && limites.excecoes[metrica];
  return excecao && typeof excecao.queda === 'number'
    ? excecao
    : { queda: limites.queda, alta: limites.alta };
};

/** Corpo de finalização da carga aceito por POST /internal/.../{id}/finish */
export const limitesParaJson = (limites) => ({
  lower_tolerance: Math.abs(Number(limites.queda)),
  upper_tolerance: Number(limites.alta),
});

/**
 * Estado exibido para uma linha de métrica.
 * Sem simulação: usa exatamente o que o backend calculou (status/is_warning).
 * Com simulação: reavalia os limites contra a variação JÁ calculada pelo
 * backend — a variação nunca é recalculada na frente (ver consistencia-dados.md).
 */
export const statusEfetivo = (linha, simular, limites) => {
  if (!simular) return { status: linha.status, isWarning: linha.is_warning };
  if (linha.before_value === 0 && linha.after_value > 0) {
    return { status: 'NEW_SCOPE', isWarning: false };
  }
  if (linha.variation_percent == null) {
    return { status: linha.status, isWarning: linha.is_warning };
  }
  const l = limitesDe(limites, linha.metric_key);
  const v = linha.variation_percent;
  const fora = v <= l.queda || v >= l.alta;
  return { status: fora ? 'WARNING' : 'NORMAL', isWarning: fora };
};

/* ---------- Exportação CSV ---------- */

/**
 * Exporta as linhas visíveis com o estado aplicado em cada uma.
 * Aceita ';' como separador e vírgula decimal (padrão Excel pt-BR).
 */
export const exportarCsv = (linhasVisiveis) => {
  if (!linhasVisiveis.length) return;
  const cabecalho = [
    'Instituição',
    'metric_key',
    'Métrica',
    'Escopo',
    'Antes',
    'Depois',
    'Diferença',
    'Variação %',
    'Situação publicada pelo backend',
    'Situação em exibição',
  ].join(';');

  const conteudo = [cabecalho]
    .concat(
      linhasVisiveis.map((linha) =>
        [
          linha.institution_name || '',
          linha.metric_key || '',
          nomeMetrica(linha.metric_key),
          rotuloEscopo(linha.scope),
          linha.before_value,
          linha.after_value,
          linha.absolute_difference,
          linha.variation_percent == null
            ? ''
            : String(linha.variation_percent).replace('.', ','),
          SITUACOES_COMPARACAO[linha.status] || linha.status,
          SITUACOES_COMPARACAO[linha.statusEfetivo] || linha.statusEfetivo,
        ]
          .map((campo) => String(campo ?? '').replace(/;/g, ',').replace(/\n/g, ' '))
          .join(';'),
      ),
    )
    .join('\n');

  const blob = new Blob([`\ufeff${conteudo}`], { type: 'text/csv;charset=utf-8' });
  const endereco = URL.createObjectURL(blob);
  const ancora = document.createElement('a');
  const hoje = new Date().toISOString().slice(0, 10);
  ancora.href = endereco;
  ancora.download = `verificacao-consistencia_${hoje}.csv`;
  ancora.click();
  URL.revokeObjectURL(endereco);
};
