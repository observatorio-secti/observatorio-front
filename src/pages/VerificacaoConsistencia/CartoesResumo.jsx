// src/pages/VerificacaoConsistencia/CartoesResumo.jsx
// Cartões do `summary` do relatório (total_metrics, warnings, normal, new_scopes)

import { AlertTriangle, CircleCheck, ListChecks, Sparkles } from 'lucide-react';

const CARTOES = [
  { chave: 'total_metrics', rotulo: 'Métricas comparadas', icone: ListChecks, classesIcone: 'bg-primary/10 text-primary' },
  { chave: 'warnings', rotulo: 'Alertas (fora dos limites)', icone: AlertTriangle, classesIcone: 'bg-error/10 text-error' },
  { chave: 'normal', rotulo: 'Dentro dos limites', icone: CircleCheck, classesIcone: 'bg-success-emerald/10 text-success-emerald' },
  { chave: 'new_scopes', rotulo: 'Novos (antes zerados)', icone: Sparkles, classesIcone: 'bg-secondary-container/40 text-on-secondary-container' },
];

export function CartoesResumo({ resumo }) {
  if (!resumo) return null;

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {CARTOES.map(({ chave, rotulo, icone: Icone, classesIcone }) => {
        const valor = resumo[chave];
        return (
          <article key={chave} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full ${classesIcone}`}>
                <Icone className="h-4 w-4" />
              </span>
              <small className="text-label-md font-semibold text-on-surface-variant">{rotulo}</small>
            </div>
            <p className="mt-2 font-display text-3xl text-navy-deep">
              {valor == null ? '—' : Number(valor).toLocaleString('pt-BR')}
            </p>
          </article>
        );
      })}
    </section>
  );
}

export default CartoesResumo;
