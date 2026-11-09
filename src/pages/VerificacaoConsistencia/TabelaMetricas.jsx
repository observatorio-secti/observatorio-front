// src/pages/VerificacaoConsistencia/TabelaMetricas.jsx
// Tabela comparativa Antes x Depois das métricas do snapshot
//
// Regra do contrato (consistencia-dados.md): o front NÃO recalcula variação —
// exibe `variation_percent`, `is_warning` e `status` recebidos do backend.
// O destaque respeita `is_warning` (tinta de `error`) e `NEW_SCOPE` (azul).

import { formatarNumero, formatarVariacao, nomeMetrica, rotuloEscopo, rotuloSituacao } from '../../lib/consistencia';

export function TabelaMetricas({ linhas, simular, limites, limitesDe, statusEfetivo }) {
  return (
    <section className="overflow-hidden rounded-xl shadow-sm">
      <div className="max-h-[560px] overflow-auto bg-surface-container-lowest">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-navy-deep text-left text-white">
              <th className="sticky top-0 z-10 bg-navy-deep px-3 py-2.5 text-label-md font-semibold uppercase tracking-wide">Instituição</th>
              <th className="sticky top-0 z-10 bg-navy-deep px-3 py-2.5 text-label-md font-semibold uppercase tracking-wide">Métrica</th>
              <th className="sticky top-0 z-10 bg-navy-deep px-3 py-2.5 text-label-md font-semibold uppercase tracking-wide">Escopo</th>
              <th className="sticky top-0 z-10 bg-navy-deep px-3 py-2.5 text-label-md font-semibold uppercase tracking-wide">Antes</th>
              <th className="sticky top-0 z-10 bg-navy-deep px-3 py-2.5 text-label-md font-semibold uppercase tracking-wide">Depois</th>
              <th className="sticky top-0 z-10 bg-navy-deep px-3 py-2.5 text-label-md font-semibold uppercase tracking-wide">Diferença</th>
              <th className="sticky top-0 z-10 bg-navy-deep px-3 py-2.5 text-label-md font-semibold uppercase tracking-wide">Variação</th>
              <th className="sticky top-0 z-10 bg-navy-deep px-3 py-2.5 text-label-md font-semibold uppercase tracking-wide">Limites</th>
              <th className="sticky top-0 z-10 bg-navy-deep px-3 py-2.5 text-label-md font-semibold uppercase tracking-wide">Situação</th>
            </tr>
          </thead>
          <tbody>
            {linhas.length === 0 && (
              <tr>
                <td colSpan="9" className="px-3 py-6 text-center text-body-md text-on-surface-variant">
                  Nenhuma métrica para os filtros escolhidos.
                </td>
              </tr>
            )}

            {linhas.map((linha) => {
              const estado = statusEfetivo(linha, simular, limites);
              const emAlerta = estado.isWarning;
              const novo = estado.status === 'NEW_SCOPE';
              const inalterada = !simular && linha.status === 'UNCHANGED' && !emAlerta;
              const divergeDaPublicacao = simular && (estado.status !== linha.status || estado.isWarning !== linha.is_warning);
              const limitesLinha = simular
                ? limitesDe(limites, linha.metric_key)
                : { queda: linha.lower_threshold, alta: linha.upper_threshold };
              const chip =
                emAlerta
                  ? 'bg-error text-on-error'
                  : novo
                    ? 'bg-primary text-on-primary'
                    : estado.status === 'NORMAL'
                      ? 'bg-success-emerald/15 text-success-emerald'
                      : 'bg-surface-container-high text-on-surface-variant';

              return (
                <tr
                  key={`${linha.metric_key}-${linha.institution_id || 'global'}`}
                  className={`${emAlerta ? 'bg-error-container/60 font-semibold text-on-error-container' : ''} ${
                    novo ? 'bg-secondary-container/30 font-semibold text-on-secondary-container' : ''
                  } ${!emAlerta && !novo ? 'hover:bg-surface-container-low' : ''} ${inalterada ? 'text-outline opacity-80' : ''}`}
                >
                  <td className="border-b border-outline-variant/30 px-3 py-2.5">
                    {linha.institution_name || '—'}
                  </td>
                  <td className="border-b border-outline-variant/30 px-3 py-2.5">
                    {nomeMetrica(linha.metric_key)}
                    <span className="block font-data-tabular text-[10px] opacity-60">{linha.metric_key}</span>
                  </td>
                  <td className="border-b border-outline-variant/30 px-3 py-2.5">{rotuloEscopo(linha.scope)}</td>
                  <td className="border-b border-outline-variant/30 px-3 py-2.5 font-data-tabular text-data-tabular">{formatarNumero(linha.before_value)}</td>
                  <td className="border-b border-outline-variant/30 px-3 py-2.5 font-data-tabular text-data-tabular">{formatarNumero(linha.after_value)}</td>
                  <td className="border-b border-outline-variant/30 px-3 py-2.5 font-data-tabular text-data-tabular">{formatarNumero(linha.absolute_difference)}</td>
                  <td className="border-b border-outline-variant/30 px-3 py-2.5 font-data-tabular text-data-tabular font-semibold">
                    {formatarVariacao(linha.variation_percent)}
                  </td>
                  <td className="border-b border-outline-variant/30 px-3 py-2.5 font-data-tabular text-data-tabular">
                    −{limitesLinha.queda}% / +{limitesLinha.alta}%
                  </td>
                  <td className="border-b border-outline-variant/30 px-3 py-2.5">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-label-md font-semibold ${chip}`}>
                      {rotuloSituacao(estado.status)}
                    </span>
                    {divergeDaPublicacao && (
                      <span className="ml-1 align-middle text-[10px] font-bold text-on-error-container">simulado</span>
                    )}
                    {!simular && linha.warning_reason && (
                      <span className="block text-[10px] opacity-70">{linha.warning_reason}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TabelaMetricas;
