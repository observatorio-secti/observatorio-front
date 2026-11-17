// src/lib/snapshots.js
// Regras de comparação das fotos por instituição.
//
// O coletor grava uma foto de `GET /simcc/api/institution` sempre que os números
// mudam ou quando uma carga do ETL termina — na prática, uma foto por carga.
// Para cada métrica, a janela de comparação vem da execução do ETL que a
// atualiza:
//   antes  = última foto anterior ao `iniciado_em` da carga
//   depois = primeira foto posterior ao `finalizado_em` da carga
// Como só existe foto quando algo mudou, a foto "antes" é exatamente o estado
// anterior à carga e a "depois" o estado posterior — mesmo que elas estejam a
// um mês de distância. Assim a comparação fica amarrada na carga real, sem
// depender de alguém estar com a página aberta.

import { METRICAS_INSTITUICAO } from '../constants/consistencia';

const ESTADOS_COM_MEDICAO = ['CONCLUIDO', 'CONCLUIDO_PARCIAL'];

/**
 * Execução que serve de referência para uma rotina.
 * Prefere a última carga que chegou ao fim (mesmo parcial); se só houver
 * falha ou execução em andamento, usa o que existir.
 */
export const execucaoDeReferencia = (grupo) => {
  if (!grupo) return null;
  const { ultima, ultimaIntegra } = grupo;
  if (ultima && ESTADOS_COM_MEDICAO.includes(ultima.estado) && ultima.finalizado_em) return ultima;
  if (ultimaIntegra && ultimaIntegra.finalizado_em) return ultimaIntegra;
  return ultima || null;
};

const instante = (valor) => {
  const data = valor ? new Date(valor).getTime() : Number.NaN;
  return Number.isNaN(data) ? null : data;
};

/**
 * Encontra, no índice, o par de fotos que envolve a janela da execução.
 * Aceita tanto as entradas do índice (`coletado_em`) quanto as fotos completas.
 */
export const localizarPar = (entradas, execucao) => {
  if (!Array.isArray(entradas) || entradas.length === 0 || !execucao) {
    return { antes: null, depois: null };
  }

  const inicio = instante(execucao.iniciado_em);
  const fim = instante(execucao.finalizado_em || execucao.iniciado_em);
  if (inicio == null || fim == null) return { antes: null, depois: null };

  const ordenadas = [...entradas]
    .filter((entrada) => instante(entrada.coletado_em) != null)
    .sort((a, b) => instante(a.coletado_em) - instante(b.coletado_em));

  const antes = [...ordenadas].reverse().find((entrada) => instante(entrada.coletado_em) <= inicio);
  const depois = ordenadas.find((entrada) => instante(entrada.coletado_em) >= fim);

  return { antes: antes || null, depois: depois || null };
};

/**
 * Par formado pelas duas fotos mais recentes.
 *
 * Usado quando a rotina responsável pela métrica nunca aparece no export do ETL
 * (caso de `hop_index` e `foment_scholars`). Nesse caso não existe janela de
 * carga para amarrar: comparamos simplesmente a penúltima foto com a última,
 * que é o "caminho sem acesso" original — guardar fotos e comparar fotos.
 */
export const ultimasDuasFotos = (entradas) => {
  if (!Array.isArray(entradas) || entradas.length < 2) {
    return { antes: null, depois: null };
  }

  const ordenadas = [...entradas]
    .filter((entrada) => instante(entrada.coletado_em) != null)
    .sort((a, b) => instante(a.coletado_em) - instante(b.coletado_em));

  if (ordenadas.length < 2) return { antes: null, depois: null };

  return {
    antes: ordenadas[ordenadas.length - 2],
    depois: ordenadas[ordenadas.length - 1],
  };
};

/**
 * Compara duas fotos para uma métrica e devolve uma linha por instituição.
 * Instituições que só aparecem em uma das fotos ficam de fora (não há como
 * dizer o que mudou).
 */
export const compararInstituicoes = (fotoAntes, fotoDepois, metrica) => {
  if (!fotoAntes || !fotoDepois) return [];

  const anteriores = new Map();
  (fotoAntes.instituicoes || []).forEach((instituicao) => {
    anteriores.set(instituicao.id, instituicao);
  });

  const linhas = [];
  (fotoDepois.instituicoes || []).forEach((instituicao) => {
    const anterior = anteriores.get(instituicao.id);
    if (!anterior) return;

    const antes = Number(anterior[metrica] ?? 0);
    const depois = Number(instituicao[metrica] ?? 0);

    linhas.push({
      instituicaoId: instituicao.id,
      sigla: instituicao.sigla,
      instituicaoNome: instituicao.nome,
      metrica,
      antes,
      depois,
      diferenca: depois - antes,
      variacao: antes === 0 ? null : ((depois - antes) / antes) * 100,
    });
  });

  return linhas.sort((a, b) => b.depois - a.depois || a.sigla.localeCompare(b.sigla));
};

/**
 * Resumo do que o índice cobre, para o cabeçalho da aba.
 * `primeira` e `ultima` são as extremidades do período já fotografado.
 */
export const resumoFotos = (entradas) => {
  if (!Array.isArray(entradas) || entradas.length === 0) {
    return { total: 0, primeira: null, ultima: null, instituicoes: 0, comCargaEmAndamento: 0 };
  }

  const ordenadas = [...entradas].sort((a, b) => instante(a.coletado_em) - instante(b.coletado_em));
  const ultima = ordenadas[ordenadas.length - 1];

  return {
    total: ordenadas.length,
    primeira: ordenadas[0].coletado_em,
    ultima: ultima.coletado_em,
    instituicoes: ultima.instituicoes || 0,
    comCargaEmAndamento: ordenadas.filter(
      (entrada) => Array.isArray(entrada.em_andamento) && entrada.em_andamento.length > 0,
    ).length,
  };
};

/** Métricas acompanhadas, na ordem em que aparecem na tela */
export const METRICAS_COMPARADAS = Object.keys(METRICAS_INSTITUICAO);
