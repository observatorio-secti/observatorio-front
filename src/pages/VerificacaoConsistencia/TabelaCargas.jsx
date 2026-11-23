// src/pages/VerificacaoConsistencia/TabelaCargas.jsx
// Tabela principal: uma linha por rotina acompanhada pelo ETL

import { Fragment } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

import {
  afetaRotina,
  categoriaRotina,
  dataExecucao,
  detalhesExecucao,
  formatarDataHora,
  formatarDuracao,
  formatarNumero,
  formatarVariacao,
  infoEstado,
  medicaoDaExecucao,
  nomeRotina,
  semMedicao,
} from '../../lib/consistencia';
import { COBERTURAS } from '../../constants/consistencia';

const TH = ({ children, className = '' }) => (
  <th
    className={`sticky top-0 z-10 bg-navy-deep px-3 py-2.5 text-left text-label-md font-semibold uppercase tracking-wide text-white ${className}`}
  >
    {children}
  </th>
);

function CelulaMedida({ medida }) {
  return (
    <div className="flex items-baseline gap-1.5 font-data-tabular text-data-tabular">
      <span className="text-on-surface-variant">{formatarNumero(medida.antes)}</span>
      <span className="text-on-surface-variant/60">→</span>
      <span className="font-semibold">{formatarNumero(medida.depois)}</span>
      {medida.delta != null && medida.delta !== 0 && (
        <span
          className={`ml-1 text-label-md font-semibold ${
            medida.delta > 0 ? 'text-success-emerald' : 'text-error'
          }`}
        >
          {medida.delta > 0 ? '+' : ''}
          {formatarNumero(medida.delta)}
        </span>
      )}
    </div>
  );
}

export function TabelaCargas({ grupos, expandidos, alternar }) {
  return (
    <section className="overflow-hidden rounded-xl shadow-sm">
      <div className="max-h-[640px] overflow-auto bg-surface-container-lowest">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <TH className="w-8" />
              <TH>Rotina</TH>
              <TH>O que atualiza no portal</TH>
              <TH>Última execução</TH>
              <TH>Estado</TH>
              <TH>Antes → Depois</TH>
              <TH>Registros</TH>
              <TH>Duração</TH>
            </tr>
          </thead>
          <tbody>
            {grupos.length === 0 && (
              <tr>
                <td colSpan="8" className="px-3 py-8 text-center text-body-md text-on-surface-variant">
                  Nenhuma rotina encontrada para os filtros escolhidos.
                </td>
              </tr>
            )}

            {grupos.map(({ tipo, ultima, ultimaIntegra }) => {
              const estado = infoEstado(ultima?.estado);
              const detalhes = detalhesExecucao(ultima);
              const medidas = medicaoDaExecucao(ultima);
              const aberto = expandidos.has(tipo);
              const temDetalhe = medidas.length > 0 || detalhes.erro || ultimaIntegra;

              return (
                <Fragment key={tipo}>
                  <tr
                    className={`cursor-pointer align-top ${
                      estado.destaque ? 'bg-error-container/40' : 'hover:bg-surface-container-low'
                    }`}
                    onClick={() => temDetalhe && alternar(tipo)}
                  >
                    <td className="border-b border-outline-variant/30 px-3 py-2.5 text-on-surface-variant">
                      {temDetalhe ? (
                        aberto ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )
                      ) : null}
                    </td>

                    <td className="border-b border-outline-variant/30 px-3 py-2.5">
                      <span className="block font-semibold text-navy-deep">{nomeRotina(tipo)}</span>
                      <span className="block text-label-md text-on-surface-variant">
                        {categoriaRotina(tipo)}
                      </span>
                    </td>

                    <td className="border-b border-outline-variant/30 px-3 py-2.5 text-body-md text-on-surface-variant">
                      {afetaRotina(tipo)}
                    </td>

                    <td className="border-b border-outline-variant/30 px-3 py-2.5 font-data-tabular text-data-tabular">
                      {formatarDataHora(dataExecucao(ultima))}
                    </td>

                    <td className="border-b border-outline-variant/30 px-3 py-2.5">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-label-md font-semibold ${estado.classes}`}
                      >
                        {estado.rotulo}
                      </span>
                    </td>

                    <td className="border-b border-outline-variant/30 px-3 py-2.5">
                      {medidas.length === 0 ? (
                        <span className="text-body-md text-on-surface-variant">
                          {semMedicao(ultima) ? 'sem medição' : 'não mede'}
                        </span>
                      ) : (
                        <div>
                          <CelulaMedida medida={medidas[0]} />
                          <span className="mt-0.5 block text-[11px] text-on-surface-variant">
                            {medidas[0].rotulo}
                            {medidas.length > 1 && ` · +${medidas.length - 1} medida(s)`}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="border-b border-outline-variant/30 px-3 py-2.5 font-data-tabular text-data-tabular">
                      {detalhes.stats ? (
                        <span>
                          {formatarNumero(detalhes.stats.succeeded)}
                          {detalhes.stats.failed > 0 && (
                            <span className="ml-1 font-semibold text-error">
                              / {formatarNumero(detalhes.stats.failed)} falhas
                            </span>
                          )}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td className="border-b border-outline-variant/30 px-3 py-2.5 font-data-tabular text-data-tabular">
                      {formatarDuracao(detalhes.duracao)}
                    </td>
                  </tr>

                  {aberto && (
                    <tr key={`${tipo}-detalhe`} className="bg-surface-container-low">
                      <td colSpan="8" className="border-b border-outline-variant/30 px-6 py-4">
                        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                          <div>
                            {medidas.length > 0 ? (
                              <table className="w-full max-w-2xl border-collapse">
                                <thead>
                                  <tr className="text-left text-label-md uppercase tracking-wide text-on-surface-variant">
                                    <th className="border-b border-outline-variant/40 py-1.5">Medida</th>
                                    <th className="border-b border-outline-variant/40 py-1.5">Antes</th>
                                    <th className="border-b border-outline-variant/40 py-1.5">Depois</th>
                                    <th className="border-b border-outline-variant/40 py-1.5">Diferença</th>
                                    <th className="border-b border-outline-variant/40 py-1.5">Variação</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {medidas.map((medida) => (
                                    <tr key={medida.chave}>
                                      <td className="border-b border-outline-variant/20 py-1.5 pr-3">
                                        {medida.rotulo}
                                        <span className="block font-data-tabular text-[10px] opacity-60">
                                          {medida.chave}
                                        </span>
                                      </td>
                                      <td className="border-b border-outline-variant/20 py-1.5 font-data-tabular text-data-tabular">
                                        {formatarNumero(medida.antes)}
                                      </td>
                                      <td className="border-b border-outline-variant/20 py-1.5 font-data-tabular text-data-tabular">
                                        {formatarNumero(medida.depois)}
                                      </td>
                                      <td className="border-b border-outline-variant/20 py-1.5 font-data-tabular text-data-tabular">
                                        {medida.delta == null
                                          ? '—'
                                          : `${medida.delta > 0 ? '+' : ''}${formatarNumero(medida.delta)}`}
                                      </td>
                                      <td className="border-b border-outline-variant/20 py-1.5 font-data-tabular text-data-tabular">
                                        {formatarVariacao(medida.variacao)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p className="text-body-md text-on-surface-variant">
                                {semMedicao(ultima)
                                  ? 'A rotina não conseguiu medir o estado do banco nesta execução.'
                                  : 'Esta rotina não registra contagens antes/depois.'}
                              </p>
                            )}

                            {detalhes.erro && (
                              <p className="mt-3 rounded-lg bg-error-container/50 px-3 py-2 text-body-md text-on-error-container">
                                <strong className="font-semibold">Erro:</strong> {detalhes.erro}
                              </p>
                            )}
                          </div>

                          <aside className="space-y-1 text-label-md text-on-surface-variant">
                            <p>
                              <strong className="text-on-surface">Cobertura:</strong>{' '}
                              {COBERTURAS[detalhes.cobertura] || detalhes.cobertura || '—'}
                            </p>
                            <p>
                              <strong className="text-on-surface">Origem:</strong>{' '}
                              {detalhes.origem || '—'}
                            </p>
                            {detalhes.stats && (
                              <p>
                                <strong className="text-on-surface">Registros:</strong>{' '}
                                {formatarNumero(detalhes.stats.found)} encontrados,{' '}
                                {formatarNumero(detalhes.stats.failed)} falharam
                              </p>
                            )}
                            {ultimaIntegra && ultimaIntegra.id !== ultima?.id && (
                              <p>
                                <strong className="text-on-surface">Última conclusão íntegra:</strong>{' '}
                                {formatarDataHora(dataExecucao(ultimaIntegra))}
                              </p>
                            )}
                          </aside>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TabelaCargas;
