// src/pages/VerificacaoConsistencia/CargaBanner.jsx
// Faixa de destaque com a carga do último relatório validado

import { formatarDataHora } from '../../lib/consistencia';
import {
  classeSituacaoCarga,
  nomeCarga,
  rotuloOrigem,
  rotuloSituacaoCarga,
} from './rotulosExtras';

export function CargaBanner({ carga }) {
  if (!carga) return null;
  const estilo = classeSituacaoCarga(carga.status);

  return (
    <section className="bg-surface-container-lowest rounded-xl p-4 md:p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        <div>
          <span className="block text-label-md text-on-surface-variant uppercase tracking-wide">
            Tipo de carga
          </span>
          <span className="font-title-lg text-navy-deep">{nomeCarga(carga)}</span>
        </div>

        <div>
          <span className="block text-label-md text-on-surface-variant uppercase tracking-wide">Situação</span>
          <span className={`inline-block rounded-full px-3 py-0.5 text-label-md font-semibold ${estilo}`}>
            {rotuloSituacaoCarga(carga)}
          </span>
        </div>

        <div>
          <span className="block text-label-md text-on-surface-variant uppercase tracking-wide">Origem</span>
          <span className="text-body-md">{rotuloOrigem(carga)}</span>
        </div>

        <div>
          <span className="block text-label-md text-on-surface-variant uppercase tracking-wide">Início</span>
          <span className="text-body-md">{formatarDataHora(carga.started_at)}</span>
        </div>

        <div>
          <span className="block text-label-md text-on-surface-variant uppercase tracking-wide">Término</span>
          <span className="text-body-md">{formatarDataHora(carga.finished_at)}</span>
        </div>

        {carga.id && (
          <div className="hidden lg:block">
            <span className="block text-label-md text-on-surface-variant uppercase tracking-wide">Carga (id)</span>
            <code className="font-data-tabular text-data-tabular text-on-surface-variant">{carga.id}</code>
          </div>
        )}
      </div>

      {carga.error_detail && (
        <p className="mt-3 rounded-lg bg-error-container/40 px-3 py-2 text-body-md text-on-error-container">
          <strong className="font-semibold">Falha registrada:</strong> {carga.error_detail}
        </p>
      )}
    </section>
  );
}

export default CargaBanner;
