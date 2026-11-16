// src/lib/consistencia.js
// Utilitários do módulo de Verificação de Consistência de Dados
// (contrato do SimCC ETL: `/etl/consistencia/export`)

import { ESTADOS, MEDIDAS, ROTINAS } from '../constants/consistencia';

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
        timeZone: 'America/Bahia',
      })
    : '—';

export const formatarData = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'America/Bahia',
      })
    : '—';

/** Duração em milissegundos -> texto curto (ex.: "1 h 23 min") */
export const formatarDuracao = (ms) => {
  if (ms == null || Number.isNaN(Number(ms))) return '—';
  const total = Number(ms);
  if (total < 1000) return `${total} ms`;
  const segundos = Math.round(total / 1000);
  if (segundos < 60) return `${segundos} s`;
  const minutos = Math.floor(segundos / 60);
  const resto = segundos % 60;
  if (minutos < 60) return resto ? `${minutos} min ${resto} s` : `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;
  return minutosRestantes ? `${horas} h ${minutosRestantes} min` : `${horas} h`;
};

export const formatarVariacao = (percentual) =>
  percentual == null
    ? '—'
    : `${percentual > 0 ? '+' : ''}${Number(percentual).toLocaleString('pt-BR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}%`;

/* ---------- Leitura do relatório ---------- */

export const nomeRotina = (tipo) => ROTINAS[tipo]?.rotulo || tipo || '—';

export const categoriaRotina = (tipo) => ROTINAS[tipo]?.categoria || '—';

export const afetaRotina = (tipo) => ROTINAS[tipo]?.afeta || '—';

export const infoEstado = (estado) =>
  ESTADOS[estado] || {
    rotulo: estado || '—',
    descricao: '',
    destaque: false,
    classes: 'bg-surface-container-high text-on-surface-variant',
  };

export const nomeMedida = (chave) => MEDIDAS[chave] || chave;

/** Data usada para ordenar e exibir a execução */
export const dataExecucao = (relatorio) =>
  relatorio?.iniciado_em || relatorio?.finalizado_em || null;

/** Verifica se a execução registrou alguma medição numérica */
export const temMedicao = (relatorio) =>
  medicaoDaExecucao(relatorio).length > 0;

/**
 * Extrai as medidas de uma execução, comparando `antes` e `depois`.
 * Ignora `probe_unavailable` (é um sinalizador, não uma contagem).
 */
export const medicaoDaExecucao = (relatorio) => {
  if (!relatorio) return [];
  const antes = relatorio.antes || {};
  const depois = relatorio.depois || {};
  const chaves = new Set([...Object.keys(antes), ...Object.keys(depois)]);
  const medidas = [];

  chaves.forEach((chave) => {
    if (chave === 'probe_unavailable') return;
    const valorAntes = antes[chave];
    const valorDepois = depois[chave];
    if (typeof valorAntes === 'boolean' || typeof valorDepois === 'boolean') return;
    if (typeof valorAntes !== 'number' && typeof valorDepois !== 'number') return;

    const delta =
      relatorio.resultado?.[`delta_${chave}`] ??
      (typeof valorAntes === 'number' && typeof valorDepois === 'number'
        ? valorDepois - valorAntes
        : null);

    medidas.push({
      chave,
      rotulo: nomeMedida(chave),
      antes: valorAntes ?? null,
      depois: valorDepois ?? null,
      delta,
      variacao:
        typeof valorAntes === 'number' && valorAntes !== 0 && typeof valorDepois === 'number'
          ? ((valorDepois - valorAntes) / valorAntes) * 100
          : null,
    });
  });

  return medidas;
};

/** `true` quando a rotina não conseguiu medir o estado do banco */
export const semMedicao = (relatorio) => relatorio?.antes?.probe_unavailable === true;

/** Detalhes de uma execução (stats, cobertura, duração, origem) */
export const detalhesExecucao = (relatorio) => ({
  stats: relatorio?.resultado?.stats || null,
  cobertura: relatorio?.resultado?.cobertura || null,
  duracao: relatorio?.resultado?.duration_ms ?? null,
  origem: relatorio?.resultado?.origem || null,
  etlRunId: relatorio?.resultado?.etl_run_id || null,
  erro: relatorio?.erro || null,
});

/* ---------- Agrupamentos ---------- */

/**
 * Agrupa as execuções por tipo de rotina.
 * Com `apenas_ultimos=true` o endpoint devolve a última tentativa e, quando
 * diferente, a última conclusão íntegra — guardamos as duas.
 */
export const agruparPorTipo = (relatorios) => {
  const mapa = new Map();
  (relatorios || []).forEach((relatorio) => {
    const tipo = relatorio?.resultado?.tipo || relatorio?.tipo || 'desconhecido';
    const atual = mapa.get(tipo) || { tipo, ultima: null, ultimaIntegra: null };
    const momento = new Date(dataExecucao(relatorio) || 0).getTime();

    if (!atual.ultima || momento > new Date(dataExecucao(atual.ultima) || 0).getTime()) {
      atual.ultima = relatorio;
    }
    if (relatorio.estado === 'CONCLUIDO') {
      const momentoIntegra = new Date(dataExecucao(relatorio) || 0).getTime();
      if (
        !atual.ultimaIntegra ||
        momentoIntegra > new Date(dataExecucao(atual.ultimaIntegra) || 0).getTime()
      ) {
        atual.ultimaIntegra = relatorio;
      }
    }
    mapa.set(tipo, atual);
  });

  return [...mapa.values()].sort((a, b) => {
    const ta = new Date(dataExecucao(a.ultima) || 0).getTime();
    const tb = new Date(dataExecucao(b.ultima) || 0).getTime();
    return tb - ta;
  });
};

/** Execução mais recente de toda a lista */
export const ultimaExecucaoGeral = (relatorios) =>
  (relatorios || []).reduce((maisRecente, relatorio) => {
    if (!maisRecente) return relatorio;
    const a = new Date(dataExecucao(relatorio) || 0).getTime();
    const b = new Date(dataExecucao(maisRecente) || 0).getTime();
    return a > b ? relatorio : maisRecente;
  }, null);

/** Contagem por estado para os cartões de resumo */
export const resumoExecucoes = (relatorios) => {
  const resumo = {
    total: (relatorios || []).length,
    concluidos: 0,
    parciais: 0,
    falhas: 0,
    emAndamento: 0,
    comFalhasDeRegistro: 0,
  };

  (relatorios || []).forEach((relatorio) => {
    if (relatorio.estado === 'CONCLUIDO') resumo.concluidos += 1;
    if (relatorio.estado === 'CONCLUIDO_PARCIAL') resumo.parciais += 1;
    if (relatorio.estado === 'FALHA') resumo.falhas += 1;
    if (relatorio.estado === 'EM_ANDAMENTO') resumo.emAndamento += 1;
    if ((relatorio.resultado?.stats?.failed || 0) > 0) resumo.comFalhasDeRegistro += 1;
  });

  return resumo;
};

/* ---------- Exportação CSV ---------- */

const escapar = (valor) =>
  String(valor ?? '')
    .replace(/;/g, ',')
    .replace(/\r?\n/g, ' ')
    .trim();

/**
 * Exporta uma linha por rotina (visão principal da tela).
 * Separador `;` e vírgula decimal, padrão do Excel em pt-BR.
 */
export const exportarCsv = (grupos) => {
  if (!grupos || grupos.length === 0) return;

  const cabecalho = [
    'Rotina',
    'Categoria',
    'O que atualiza',
    'Última execução',
    'Estado',
    'Cobertura',
    'Duração',
    'Medida',
    'Antes',
    'Depois',
    'Diferença',
    'Variação %',
    'Encontrados',
    'Falharam',
    'Erro',
  ].join(';');

  const linhas = [];

  grupos.forEach(({ tipo, ultima }) => {
    const estado = infoEstado(ultima?.estado);
    const detalhes = detalhesExecucao(ultima);
    const medidas = medicaoDaExecucao(ultima);

    if (medidas.length === 0) {
      linhas.push(
        [
          nomeRotina(tipo),
          categoriaRotina(tipo),
          afetaRotina(tipo),
          formatarDataHora(dataExecucao(ultima)),
          estado.rotulo,
          detalhes.cobertura || '',
          formatarDuracao(detalhes.duracao),
          '—',
          '',
          '',
          '',
          '',
          detalhes.stats?.found ?? '',
          detalhes.stats?.failed ?? '',
          detalhes.erro || '',
        ]
          .map(escapar)
          .join(';'),
      );
      return;
    }

    medidas.forEach((medida) => {
      linhas.push(
        [
          nomeRotina(tipo),
          categoriaRotina(tipo),
          afetaRotina(tipo),
          formatarDataHora(dataExecucao(ultima)),
          estado.rotulo,
          detalhes.cobertura || '',
          formatarDuracao(detalhes.duracao),
          medida.rotulo,
          medida.antes ?? '',
          medida.depois ?? '',
          medida.delta ?? '',
          medida.variacao == null ? '' : String(medida.variacao.toFixed(1)).replace('.', ','),
          detalhes.stats?.found ?? '',
          detalhes.stats?.failed ?? '',
          detalhes.erro || '',
        ]
          .map(escapar)
          .join(';'),
      );
    });
  });

  const conteudo = [cabecalho, ...linhas].join('\n');
  const blob = new Blob([`\ufeff${conteudo}`], { type: 'text/csv;charset=utf-8' });
  const endereco = URL.createObjectURL(blob);
  const ancora = document.createElement('a');
  const hoje = new Date().toISOString().slice(0, 10);
  ancora.href = endereco;
  ancora.download = `cargas-etl_${hoje}.csv`;
  ancora.click();
  URL.revokeObjectURL(endereco);
};
