// src/pages/VerificacaoConsistencia/TabelaMetricas.jsx
// Tabela comparativa Antes x Depois por instituição.
//
// Cada linha é uma instituição em uma métrica, já com a situação calculada
// pelos limites de variação (ver `statusEfetivo` em `lib/consistencia.js`).

import {
  formatarDataHora,
  formatarNumero,
  formatarVariacao,
  nomeMetricaInstituicao,
  nomeRotina,
  rotuloSituacao,
} from '../../lib/consistencia';

const TH = ({ children, className = '' }) => (
  <th
    className={`sticky top-0 z-10 bg-navy-deep px-3 py-2.5 text-left text-label-md font-semibold uppercase tracking-wide text-white ${className}`}
  >
    {children}
  </th>
);

export function TabelaMetricas({ linhas, carregando, mensagemVazia }) {
  return (
    <section className="overflow-hidden rounded-xl shadow-sm">
      <div className="max-h-[560px] overflow-auto bg-surface-container-lowest">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <TH>Instituição</TH>
              <TH>Métrica</TH>
              <TH>Carga</TH>
              <TH className="text-right">Antes</TH>
              <TH className="text-right">Depois</TH>
              <TH className="text-right">Diferença</TH>
              <TH className="text-right">Variação</TH>
              <TH>Limites</TH>
              <TH>Situação</TH>
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr>
                <td colSpan="9" className="px-3 py-6 text-center text-body-md text-on-surface-variant">
                  Buscando as fotos por instituição…
                </td>
              </tr>
            )}

            {!carregando && linhas.length === 0 && (
              <tr>
                <td colSpan="9" className="px-3 py-8 text-center text-body-md text-on-surface-variant">
                  {mensagemVazia || 'Nenhuma comparação disponível para os filtros escolhidos.'}
                </td>
              </tr>
            )}

            {!carregando &&
              linhas.map((linha) => {
                const emAlerta = linha.isWarning;
                const novo = linha.statusEfetivo === 'NEW_SCOPE';

                const chip = emAlerta
                  ? 'bg-error text-on-error'
                  : novo
                    ? 'bg-primary text-on-primary'
                    : linha.statusEfetivo === 'NORMAL'
                      ? 'bg-success-emerald/15 text-success-emerald'
                      : 'bg-surface-container-high text-on-surface-variant';

                return (
                  <tr
                    key={`${linha.metrica}-${linha.instituicaoId}`}
                    className={`${
                      emAlerta ? 'bg-error-container/60 font-semibold text-on-error-container' : ''
                    } ${novo ? 'bg-secondary-container/30 font-semibold text-on-secondary-container' : ''} ${
                      !emAlerta && !novo ? 'hover:bg-surface-container-low' : ''
                    }`}
                  >
                    <td className="border-b border-outline-variant/30 px-3 py-2.5">
                      <span className="block font-semibold">{linha.sigla}</span>
                      <span className="block text-[11px] font-normal opacity-70">
                        {linha.instituicaoNome}
                      </span>
                    </td>

                    <td className="border-b border-outline-variant/30 px-3 py-2.5">
                      {nomeMetricaInstituicao(linha.metrica)}
                      <span className="block font-data-tabular text-[10px] opacity-60">
                        {linha.metrica}
                      </span>
                    </td>

                    <td
                      className="border-b border-outline-variant/30 px-3 py-2.5 text-body-md"
                      title={`Fotos: ${formatarDataHora(linha.coletadoAntesEm)} → ${formatarDataHora(
                        linha.coletadoDepoisEm,
                      )}`}
                    >
                      {linha.origem === 'fotos' ? (
                        <>
                          <span className="block">Comparação entre fotos</span>
                          <span className="block font-data-tabular text-[10px] opacity-60">
                            sem carga registrada para a rotina
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="block">{nomeRotina(linha.rotina)}</span>
                          <span className="block font-data-tabular text-[10px] opacity-60">
                            {formatarDataHora(linha.finalizadoEm || linha.iniciadoEm)}
                          </span>
                        </>
                      )}
                    </td>

                    <td className="border-b border-outline-variant/30 px-3 py-2.5 text-right font-data-tabular text-data-tabular">
                      {formatarNumero(linha.antes)}
                    </td>

                    <td className="border-b border-outline-variant/30 px-3 py-2.5 text-right font-data-tabular text-data-tabular">
                      {formatarNumero(linha.depois)}
                    </td>

                    <td
                      className={`border-b border-outline-variant/30 px-3 py-2.5 text-right font-data-tabular text-data-tabular ${
                        linha.diferenca > 0
                          ? 'text-success-emerald'
                          : linha.diferenca < 0
                            ? 'text-error'
                            : ''
                      }`}
                    >
                      {linha.diferenca > 0 ? '+' : ''}
                      {formatarNumero(linha.diferenca)}
                    </td>

                    <td className="border-b border-outline-variant/30 px-3 py-2.5 text-right font-data-tabular text-data-tabular font-semibold">
                      {formatarVariacao(linha.variacao)}
                    </td>

                    <td className="border-b border-outline-variant/30 px-3 py-2.5 font-data-tabular text-data-tabular">
                      −{Math.abs(linha.limites.queda)}% / +{linha.limites.alta}%
                    </td>

                    <td className="border-b border-outline-variant/30 px-3 py-2.5">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-label-md font-semibold ${chip}`}
                      >
                        {rotuloSituacao(linha.statusEfetivo)}
                      </span>
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
