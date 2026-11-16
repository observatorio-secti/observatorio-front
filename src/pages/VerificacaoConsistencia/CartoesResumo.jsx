// src/pages/VerificacaoConsistencia/CartoesResumo.jsx
// Cartões com a contagem de rotinas por situação

import { AlertTriangle, CircleCheck, ListChecks, XCircle } from 'lucide-react';

export function CartoesResumo({ resumo }) {
  if (!resumo) return null;

  const cartoes = [
    {
      chave: 'total',
      rotulo: 'Rotinas acompanhadas',
      valor: resumo.total,
      icone: ListChecks,
      classesIcone: 'bg-primary/10 text-primary',
      detalhe: resumo.emAndamento ? `${resumo.emAndamento} em andamento` : null,
    },
    {
      chave: 'concluidos',
      rotulo: 'Concluídas',
      valor: resumo.concluidos,
      icone: CircleCheck,
      classesIcone: 'bg-success-emerald/10 text-success-emerald',
      detalhe: null,
    },
    {
      chave: 'parciais',
      rotulo: 'Concluídas parciais',
      valor: resumo.parciais,
      icone: AlertTriangle,
      classesIcone: 'bg-error/10 text-error',
      detalhe: resumo.comFalhasDeRegistro
        ? `${resumo.comFalhasDeRegistro} com registros falhando`
        : null,
    },
    {
      chave: 'falhas',
      rotulo: 'Falhas',
      valor: resumo.falhas,
      icone: XCircle,
      classesIcone: 'bg-error/10 text-error',
      detalhe: null,
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cartoes.map(({ chave, rotulo, valor, icone: Icone, classesIcone, detalhe }) => (
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
          {detalhe && <p className="mt-0.5 text-label-md text-on-surface-variant">{detalhe}</p>}
        </article>
      ))}
    </section>
  );
}

export default CartoesResumo;
