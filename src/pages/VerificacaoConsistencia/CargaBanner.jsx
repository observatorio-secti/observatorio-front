// src/pages/VerificacaoConsistencia/CargaBanner.jsx
// Faixa com a execução mais recente registrada pelo ETL

import { Clock, Database, PlayCircle } from 'lucide-react';

import {
  dataExecucao,
  detalhesExecucao,
  formatarDataHora,
  formatarDuracao,
  infoEstado,
  nomeRotina,
} from '../../lib/consistencia';
import { COBERTURAS } from '../../constants/consistencia';

export function CargaBanner({ relatorio }) {
  if (!relatorio) return null;

  const estado = infoEstado(relatorio.estado);
  const detalhes = detalhesExecucao(relatorio);

  return (
    <section className="bg-surface-container-lowest rounded-xl p-4 md:p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PlayCircle className="h-4 w-4" />
          </span>
          <div>
            <span className="block text-label-md text-on-surface-variant uppercase tracking-wide">
              Última carga registrada
            </span>
            <span className="font-title-lg text-navy-deep">{nomeRotina(relatorio.resultado?.tipo)}</span>
          </div>
        </div>

        <div>
          <span className="block text-label-md text-on-surface-variant uppercase tracking-wide">Quando</span>
          <span className="text-body-md">{formatarDataHora(dataExecucao(relatorio))}</span>
        </div>

        <div>
          <span className="block text-label-md text-on-surface-variant uppercase tracking-wide">Situação</span>
          <span className={`inline-block rounded-full px-3 py-0.5 text-label-md font-semibold ${estado.classes}`}>
            {estado.rotulo}
          </span>
        </div>

        <div>
          <span className="block text-label-md text-on-surface-variant uppercase tracking-wide">Duração</span>
          <span className="inline-flex items-center gap-1.5 text-body-md">
            <Clock className="h-3.5 w-3.5 text-on-surface-variant" />
            {formatarDuracao(detalhes.duracao)}
          </span>
        </div>

        {detalhes.cobertura && (
          <div>
            <span className="block text-label-md text-on-surface-variant uppercase tracking-wide">Cobertura</span>
            <span className="text-body-md">{COBERTURAS[detalhes.cobertura] || detalhes.cobertura}</span>
          </div>
        )}

        {detalhes.etlRunId && (
          <div className="hidden xl:block">
            <span className="block text-label-md text-on-surface-variant uppercase tracking-wide">
              Execução do ETL
            </span>
            <code className="inline-flex items-center gap-1.5 font-data-tabular text-data-tabular text-on-surface-variant">
              <Database className="h-3.5 w-3.5" />
              {String(detalhes.etlRunId).slice(0, 8)}
            </code>
          </div>
        )}
      </div>

      {detalhes.erro && (
        <p className="mt-3 rounded-lg bg-error-container/40 px-3 py-2 text-body-md text-on-error-container">
          <strong className="font-semibold">Erro registrado:</strong> {detalhes.erro}
        </p>
      )}
    </section>
  );
}

export default CargaBanner;
