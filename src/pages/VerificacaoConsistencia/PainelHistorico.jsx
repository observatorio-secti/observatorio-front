// src/pages/VerificacaoConsistencia/PainelHistorico.jsx
// Histórico paginado das execuções registradas pelo ETL

import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

import {
  dataExecucao,
  detalhesExecucao,
  formatarDataHora,
  formatarDuracao,
  formatarNumero,
  infoEstado,
  nomeRotina,
} from '../../lib/consistencia';
import { COBERTURAS, ESTADOS, ROTINAS } from '../../constants/consistencia';

export function PainelHistorico({
  relatorios,
  carregando,
  erro,
  filtros,
  setFiltros,
  pagina,
  setPagina,
  tamanhoPagina,
  refetch,
}) {
  const podeVoltar = pagina > 0;
  const podeAvancar = (relatorios || []).length >= tamanhoPagina;

  return (
    <section className="rounded-xl bg-surface-container-lowest p-4 md:p-5 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-label-md font-semibold text-on-surface-variant">
          Rotina
          <select
            value={filtros.tipo}
            onChange={(e) => {
              setPagina(0);
              setFiltros({ ...filtros, tipo: e.target.value });
            }}
            className="mt-1 block max-w-[260px] rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 text-body-md focus:border-primary focus:outline-none"
          >
            <option value="">todas</option>
            {Object.entries(ROTINAS).map(([chave, meta]) => (
              <option key={chave} value={chave}>
                {meta.rotulo}
              </option>
            ))}
          </select>
        </label>

        <label className="text-label-md font-semibold text-on-surface-variant">
          Situação
          <select
            value={filtros.status}
            onChange={(e) => {
              setPagina(0);
              setFiltros({ ...filtros, status: e.target.value });
            }}
            className="mt-1 block rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 text-body-md focus:border-primary focus:outline-none"
          >
            <option value="">todas</option>
            {Object.entries(ESTADOS).map(([chave, meta]) => (
              <option key={chave} value={chave}>
                {meta.rotulo}
              </option>
            ))}
          </select>
        </label>

        <label className="text-label-md font-semibold text-on-surface-variant">
          A partir de
          <input
            type="date"
            value={filtros.desdeData}
            onChange={(e) => {
              setPagina(0);
              setFiltros({ ...filtros, desdeData: e.target.value });
            }}
            className="mt-1 block rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 focus:border-primary focus:outline-none"
          />
        </label>

        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-label-md font-semibold text-on-primary hover:opacity-90"
        >
          <Search className="h-4 w-4" /> Atualizar
        </button>
      </div>

      <div className="mt-4 max-h-[460px] overflow-auto rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-label-md uppercase tracking-wide text-on-surface-variant">
              <th className="border-b border-outline-variant/40 px-2 py-2">Rotina</th>
              <th className="border-b border-outline-variant/40 px-2 py-2">Início</th>
              <th className="border-b border-outline-variant/40 px-2 py-2">Fim</th>
              <th className="border-b border-outline-variant/40 px-2 py-2">Situação</th>
              <th className="border-b border-outline-variant/40 px-2 py-2">Cobertura</th>
              <th className="border-b border-outline-variant/40 px-2 py-2">Registros</th>
              <th className="border-b border-outline-variant/40 px-2 py-2">Duração</th>
              <th className="border-b border-outline-variant/40 px-2 py-2">Erro</th>
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr>
                <td colSpan="8" className="py-6 text-center text-body-md text-on-surface-variant">
                  Buscando execuções…
                </td>
              </tr>
            )}

            {!carregando && erro && (
              <tr>
                <td colSpan="8" className="py-6 text-center text-body-md text-error">
                  Não foi possível consultar o ETL: {String(erro.message || erro)}
                </td>
              </tr>
            )}

            {!carregando && !erro && (relatorios || []).length === 0 && (
              <tr>
                <td colSpan="8" className="py-6 text-center text-body-md text-on-surface-variant">
                  Nenhuma execução registrada para o filtro escolhido.
                </td>
              </tr>
            )}

            {!carregando &&
              !erro &&
              (relatorios || []).map((relatorio) => {
                const estado = infoEstado(relatorio.estado);
                const detalhes = detalhesExecucao(relatorio);
                return (
                  <tr key={relatorio.id} className="align-top hover:bg-surface-container-low">
                    <td className="border-b border-outline-variant/20 px-2 py-2">
                      <span className="block font-semibold text-on-surface">
                        {nomeRotina(relatorio.resultado?.tipo)}
                      </span>
                      <span className="block font-data-tabular text-[10px] text-on-surface-variant">
                        {relatorio.resultado?.tipo}
                      </span>
                    </td>
                    <td className="border-b border-outline-variant/20 px-2 py-2 font-data-tabular text-data-tabular">
                      {formatarDataHora(dataExecucao(relatorio))}
                    </td>
                    <td className="border-b border-outline-variant/20 px-2 py-2 font-data-tabular text-data-tabular">
                      {formatarDataHora(relatorio.finalizado_em)}
                    </td>
                    <td className="border-b border-outline-variant/20 px-2 py-2">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-label-md font-semibold ${estado.classes}`}
                      >
                        {estado.rotulo}
                      </span>
                    </td>
                    <td className="border-b border-outline-variant/20 px-2 py-2">
                      {COBERTURAS[detalhes.cobertura] || detalhes.cobertura || '—'}
                    </td>
                    <td className="border-b border-outline-variant/20 px-2 py-2 font-data-tabular text-data-tabular">
                      {detalhes.stats
                        ? `${formatarNumero(detalhes.stats.succeeded)}${
                            detalhes.stats.failed > 0 ? ` / ${formatarNumero(detalhes.stats.failed)}` : ''
                          }`
                        : '—'}
                    </td>
                    <td className="border-b border-outline-variant/20 px-2 py-2 font-data-tabular text-data-tabular">
                      {formatarDuracao(detalhes.duracao)}
                    </td>
                    <td className="max-w-[260px] break-words border-b border-outline-variant/20 px-2 py-2 text-label-md text-on-error-container">
                      {detalhes.erro || ''}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-label-md text-on-surface-variant">
        <span>Página {pagina + 1}</span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!podeVoltar}
            onClick={() => setPagina((atual) => Math.max(0, atual - 1))}
            className="inline-flex items-center gap-1 rounded-lg border border-outline-variant px-3 py-1.5 font-semibold disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </button>
          <button
            type="button"
            disabled={!podeAvancar}
            onClick={() => setPagina((atual) => atual + 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-outline-variant px-3 py-1.5 font-semibold disabled:opacity-40"
          >
            Próxima <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default PainelHistorico;
