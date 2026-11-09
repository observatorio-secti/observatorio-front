// src/pages/VerificacaoConsistencia/PainelHistorico.jsx
// Abas com "Última carga por tipo" (cards) e "Histórico de execuções" (tabela)

import { ExternalLink, Search } from 'lucide-react';

import {
  classeSituacaoCarga,
  situacaoCargaPorTexto,
  nomePorTipoCarga,
} from './rotulosExtras';
import { formatarDataHora } from '../../lib/consistencia';

/** Normaliza GET /loads/latest : objeto por tipo ou lista */
const normalizarUltimas = (ultimas) => {
  if (Array.isArray(ultimas)) return ultimas;
  if (ultimas && typeof ultimas === 'object') {
    return Object.entries(ultimas).map(([tipo, carga]) => ({ load_type: tipo, ...carga }));
  }
  return [];
};

export function PainelHistorico({ aba, setAba, ultimas, historico, filtros, setFiltros, refetch, respostas }) {
  const cargasPorTipo = normalizarUltimas(ultimas);

  return (
    <div>
      <div className="mt-8 flex gap-1.5">
        <button
          type="button"
          onClick={() => setAba('cargas')}
          className={`rounded-t-xl border border-b-0 border-outline-variant px-5 py-2.5 text-label-md font-bold uppercase tracking-wide ${
            aba === 'cargas'
              ? 'bg-surface-container-lowest text-navy-deep'
              : 'bg-surface-container text-on-surface-variant hover:text-primary'
          }`}
        >
          Última carga por tipo
        </button>
        <button
          type="button"
          onClick={() => setAba('historico')}
          className={`rounded-t-xl border border-b-0 border-outline-variant px-5 py-2.5 text-label-md font-bold uppercase tracking-wide ${
            aba === 'historico'
              ? 'bg-surface-container-lowest text-navy-deep'
              : 'bg-surface-container text-on-surface-variant hover:text-primary'
          }`}
        >
          Histórico de cargas
        </button>
      </div>

      <section className="rounded-b-xl rounded-tr-xl bg-surface-container-lowest p-4 md:p-5 shadow-sm">
        {aba === 'cargas' && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {cargasPorTipo.length === 0 && (
              <p className="col-span-full text-body-md text-on-surface-variant">Ainda não há registros de carga.</p>
            )}
            {cargasPorTipo.map((carga) => (
              <article key={carga.load_type} className="bg-surface-container-low rounded-lg p-3">
                <small className="text-label-md font-semibold text-on-surface-variant">{nomePorTipoCarga(carga.load_type)}</small>
                <p className="mt-1 text-body-md font-semibold text-navy-deep">
                  {formatarDataHora(carga.finished_at || carga.started_at)}
                </p>
                <span
                  className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-label-md font-semibold ${classeSituacaoCarga(carga.status)}`}
                >
                  {situacaoCargaPorTexto(carga.status)}
                </span>
                {carga.error_detail && (
                  <p className="mt-1 text-[11px] leading-4 text-on-error-container">{carga.error_detail}</p>
                )}
              </article>
            ))}
          </div>
        )}

        {aba === 'historico' && (
        <div>
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-label-md font-semibold text-on-surface-variant">
              Tipo
              <select
                value={filtros.load_type}
                onChange={(e) => setFiltros({ ...filtros, load_type: e.target.value })}
                className="mt-1 block rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 text-body-md focus:border-primary focus:outline-none"
              >
                <option value="">todos</option>
                {[...new Set((historico || []).map((carga) => carga.load_type))].map((tipo) => (
                  <option key={tipo} value={tipo}>{nomePorTipoCarga(tipo)}</option>
                ))}
              </select>
            </label>

            <label className="text-label-md font-semibold text-on-surface-variant">
              Situação
              <select
                value={filtros.status}
                onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                className="mt-1 block rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 text-body-md focus:border-primary focus:outline-none"
              >
                <option value="">todas</option>
                <option value="RUNNING">Em execução</option>
                <option value="VALIDATED">Validada</option>
                <option value="FAILED">Falhou</option>
              </select>
            </label>

            <label className="text-label-md font-semibold text-on-surface-variant">
              De
              <input
                type="date"
                value={filtros.date_from}
                onChange={(e) => setFiltros({ ...filtros, date_from: e.target.value })}
                className="mt-1 block rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 focus:border-primary focus:outline-none"
              />
            </label>

            <label className="text-label-md font-semibold text-on-surface-variant">
              Até
              <input
                type="date"
                value={filtros.date_to}
                onChange={(e) => setFiltros({ ...filtros, date_to: e.target.value })}
                className="mt-1 block rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 focus:border-primary focus:outline-none"
              />
            </label>

            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-label-md font-semibold text-on-primary hover:opacity-90"
            >
              <Search className="h-4 w-4" /> Buscar
            </button>
          </div>

          <div className="mt-4 max-h-[420px] overflow-auto rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-label-sm uppercase tracking-wide text-on-surface-variant">
                  <th className="border-b border-outline-variant/40 py-2 px-2">
                    Carga (id)
                  </th>
                  <th className="border-b border-outline-variant/40 py-2 px-2">Tipo</th>
                  <th className="border-b border-outline-variant/40 py-2 px-2">Situação</th>
                  <th className="border-b border-outline-variant/40 py-2 px-2">Origem</th>
                  <th className="border-b border-outline-variant/40 py-2 px-2">Início</th>
                  <th className="border-b border-outline-variant/40 py-2 px-2">Término</th>
                  <th className="border-b border-outline-variant/40 py-2 px-2">Falha</th>
                </tr>
              </thead>
              <tbody>
                {respostas.loading && (
                  <tr>
                    <td colSpan="7" className="py-5 text-center text-body-md text-on-surface-variant">
                      Buscando histórico…
                    </td>
                  </tr>
                )}

                {respostas.error && !respostas.loading && (
                  <tr>
                    <td colSpan="7" className="py-5 text-center text-body-md text-error">
                      Não foi possível buscar o histórico: {String(respostas.error.message || respostas.error)}
                    </td>
                  </tr>
                )}

                {!respostas.loading && (historico || []).length === 0 && !respostas.error && (
                  <tr>
                    <td colSpan="7" className="py-5 text-center text-body-md text-on-surface-variant">
                      Nenhum registro para o filtro escolhido.
                    </td>
                  </tr>
                )}

                {!respostas.loading &&
                  (historico || []).map((carga) => (
                    <tr key={carga.id} className="hover:bg-surface-container-low">
                      <td className="border-b border-outline-variant/20 py-2 px-2">
                        <code className="font-data-tabular text-data-tabular">{carga.id}</code>
                      </td>
                      <td className="border-b border-outline-variant/20 py-2 px-2">{nomePorTipoCarga(carga.load_type)}</td>
                      <td className="border-b border-outline-variant/20 py-2 px-2">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-label-md font-semibold ${classeSituacaoCarga(carga.status)}`}>
                          {situacaoCargaPorTexto(carga.status)}
                        </span>
                      </td>
                      <td className="border-b border-outline-variant/20 py-2 px-2">{carga.trigger_source || '—'}</td>
                      <td className="border-b border-outline-variant/20 py-2 px-2 font-data-tabular text-data-tabular">{formatarDataHora(carga.started_at)}</td>
                      <td className="border-b border-outline-variant/20 py-2 px-2 font-data-tabular text-data-tabular">{formatarDataHora(carga.finished_at)}</td>
                      <td className="border-b border-outline-variant/20 py-2 px-2 max-w-[280px] break-words">
                        {carga.error_detail || ''}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        <p className="mt-3 flex items-center gap-1.5 text-label-md text-on-surface-variant">
          <ExternalLink className="h-3.5 w-3.5" />
          Fonte: <code className="font-data-tabular text-data-tabular">GET /data-consistency/history</code> e{' '}
          <code className="font-data-tabular text-data-tabular">GET /data-consistency/loads/latest</code>
        </p>
      </section>
    </div>
  );
}

export default PainelHistorico;
