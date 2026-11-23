// src/hooks/useSnapshots.js
// Hooks React Query das fotos por instituição

import { useMemo } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';

import { INTERVALO_SNAPSHOTS, METRICAS_INSTITUICAO } from '../constants/consistencia';
import { getIndiceSnapshots, getSnapshot } from '../services/snapshotsService';
import { compararInstituicoes, execucaoDeReferencia, localizarPar, ultimasDuasFotos } from '../lib/snapshots';

/** Índice das fotos já coletadas */
export function useIndiceSnapshots() {
  return useQuery({
    queryKey: ['snapshots', 'indice'],
    queryFn: getIndiceSnapshots,
    staleTime: INTERVALO_SNAPSHOTS,
    refetchInterval: INTERVALO_SNAPSHOTS,
    refetchOnWindowFocus: false,
    retry: 0,
  });
}

/**
 * Monta a comparação por instituição.
 *
 * Para cada métrica procura a última carga da rotina responsável, localiza o
 * par de fotos (antes/depois) e calcula a diferença por instituição.
 * As fotos são buscadas sob demanda e ficam em cache — normalmente são as
 * mesmas duas para várias métricas.
 */
export function useComparacaoInstituicoes(grupos) {
  const indice = useIndiceSnapshots();
  const entradas = useMemo(() => indice.data?.snapshots || [], [indice.data]);

  const planos = useMemo(() => {
    const porRotina = new Map((grupos || []).map((grupo) => [grupo.tipo, grupo]));

    return Object.entries(METRICAS_INSTITUICAO).map(([metrica, meta]) => {
      const grupo = porRotina.get(meta.rotina) || null;
      const execucao = execucaoDeReferencia(grupo);

      // Preferência: janela da carga real (antes ≤ início, depois ≥ fim).
      const daCarga = localizarPar(entradas, execucao);
      if (execucao && daCarga.antes && daCarga.depois) {
        return { metrica, meta, execucao, origem: 'carga', ...daCarga };
      }

      // Sem carga registrada para a rotina: compara as duas últimas fotos.
      // É o caso de `hop_index` e `foment_scholars`, que não entram no export.
      if (!execucao) {
        const dasFotos = ultimasDuasFotos(entradas);
        return { metrica, meta, execucao: null, origem: 'fotos', ...dasFotos };
      }

      // Há carga, mas falta foto de um dos lados: aguardando a próxima coleta.
      return { metrica, meta, execucao, origem: 'carga', ...daCarga };
    });
  }, [grupos, entradas]);

  const arquivos = useMemo(() => {
    const conjunto = new Set();
    planos.forEach((plano) => {
      if (plano.antes) conjunto.add(plano.antes.arquivo);
      if (plano.depois) conjunto.add(plano.depois.arquivo);
    });
    return [...conjunto];
  }, [planos]);

  const consultas = useQueries({
    queries: arquivos.map((arquivo) => ({
      queryKey: ['snapshots', 'foto', arquivo],
      queryFn: () => getSnapshot(arquivo),
      staleTime: Infinity,
      gcTime: 1000 * 60 * 60,
      retry: 0,
    })),
  });

  const fotos = new Map();
  consultas.forEach((consulta, indiceConsulta) => {
    if (consulta.data) fotos.set(arquivos[indiceConsulta], consulta.data);
  });

  const linhas = [];
  planos.forEach(({ metrica, meta, execucao, origem, antes, depois }) => {
    if (!antes || !depois) return;

    const fotoAntes = fotos.get(antes.arquivo);
    const fotoDepois = fotos.get(depois.arquivo);
    if (!fotoAntes || !fotoDepois) return;

    compararInstituicoes(fotoAntes, fotoDepois, metrica).forEach((linha) => {
      linhas.push({
        ...linha,
        rotina: meta.rotina,
        origem,
        iniciadoEm: execucao?.iniciado_em || null,
        finalizadoEm: execucao?.finalizado_em || null,
        coletadoAntesEm: fotoAntes.coletado_em,
        coletadoDepoisEm: fotoDepois.coletado_em,
      });
    });
  });

  const carregando = indice.isLoading || consultas.some((consulta) => consulta.isLoading);
  const erro = indice.error || consultas.find((consulta) => consulta.error)?.error || null;

  return {
    linhas,
    planos,
    entradas,
    indice,
    carregando,
    erro,
    disponivel: entradas.length > 0,
  };
}

export default {
  useIndiceSnapshots,
  useComparacaoInstituicoes,
};
