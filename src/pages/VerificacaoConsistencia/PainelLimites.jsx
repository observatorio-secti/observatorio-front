// src/pages/VerificacaoConsistencia/PainelLimites.jsx
// Painel de limites de variação: par padrão (−5% / +10%), exceções por métrica
// e aplicação em tempo real na tabela.
//
// A persistência é local (navegador) porque a comparação por instituição é
// feita no próprio portal, a partir das fotos por instituição — não existe um
// endpoint de limites no backend.

import { useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';

import { METRICAS_INSTITUICAO } from '../../constants/consistencia';
import { nomeMetricaInstituicao } from '../../lib/consistencia';

export function PainelLimites({ limites, acoes, simular, setSimular }) {
  const [novaMetrica, setNovaMetrica] = useState('');
  const [novaQueda, setNovaQueda] = useState('-15');
  const [novaAlta, setNovaAlta] = useState('25');
  const [feedback, setFeedback] = useState('');

  const excecoes = Object.entries(limites.excecoes || {});

  const avisar = (mensagem) => {
    setFeedback(mensagem);
    setTimeout(() => setFeedback(''), 2600);
  };

  const adicionarExcecao = () => {
    if (!novaMetrica) {
      avisar('Escolha uma métrica antes de adicionar.');
      return;
    }
    acoes.adicionarExcecao(novaMetrica, Number(novaQueda), Number(novaAlta));
    setNovaMetrica('');
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl p-4 md:p-5 shadow-sm">
      <h3 className="font-headline-md text-navy-deep">Limites de variação</h3>
      <p className="mt-1 max-w-3xl text-body-md text-on-surface-variant">
        Cada instituição é comparada entre a foto anterior e a posterior de uma carga.
        A variação é confrontada com estes limites: abaixo de <strong>−5%</strong> ou acima
        de <strong>+10%</strong> a linha entra em <strong>atenção</strong>. As exceções por
        métrica servem para métricas naturalmente mais voláteis.
      </p>
      <p className="mt-2 max-w-3xl rounded-lg bg-surface-container-low px-3 py-2 text-label-md text-on-surface-variant">
        Os limites oficiais são fixos (<strong>−5% / +10%</strong>). Os campos abaixo são uma
        simulação para testar o funcionamento — desmarque “aplicar na tabela” para voltar ao par
        oficial.
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <label className="text-label-md font-semibold text-on-surface-variant">
          Limite de queda (padrão) − %
          <input
            type="number"
            value={limites.queda}
            onChange={(e) => acoes.atualizarPadroes(Number(e.target.value), limites.alta)}
            className="mt-1 block w-24 rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 font-data-tabular text-data-tabular text-on-surface focus:border-primary focus:outline-none"
          />
        </label>

        <label className="text-label-md font-semibold text-on-surface-variant">
          Limite de alta (padrão) + %
          <input
            type="number"
            value={limites.alta}
            onChange={(e) => acoes.atualizarPadroes(limites.queda, Number(e.target.value))}
            className="mt-1 block w-24 rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 font-data-tabular text-data-tabular text-on-surface focus:border-primary focus:outline-none"
          />
        </label>

        <label className="flex items-center gap-2 text-body-md text-on-surface">
          <input
            type="checkbox"
            checked={simular}
            onChange={(e) => setSimular(e.target.checked)}
            className="h-4 w-4 accent-[#07677e]"
          />
          aplicar na tabela em tempo real
        </label>
      </div>

      <table className="mt-4 w-full max-w-2xl border-collapse">
        <thead>
          <tr className="text-left text-label-sm uppercase tracking-wide text-on-surface-variant">
            <th className="border-b border-outline-variant/40 py-2">Métrica</th>
            <th className="border-b border-outline-variant/40 py-2">Queda %</th>
            <th className="border-b border-outline-variant/40 py-2">Alta %</th>
            <th className="border-b border-outline-variant/40 py-2">
              <span className="sr-only">Ação</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {excecoes.length === 0 && (
            <tr>
              <td colSpan="4" className="py-3 text-body-md text-on-surface-variant">
                Nenhuma exceção por métrica — todas usam os limites padrão.
              </td>
            </tr>
          )}

          {excecoes.map(([metrica, valores]) => (
            <tr key={metrica}>
              <td className="border-b border-outline-variant/30 py-2 pr-3">
                {nomeMetricaInstituicao(metrica)}
                <span className="block font-data-tabular text-[10px] opacity-60">{metrica}</span>
              </td>
              <td className="border-b border-outline-variant/30 py-2">
                <input
                  type="number"
                  value={valores.queda}
                  onChange={(e) =>
                    acoes.atualizarExcecao(metrica, Number(e.target.value), valores.alta)
                  }
                  className="w-20 rounded-md border border-outline-variant bg-surface px-2 py-1 font-data-tabular text-data-tabular focus:border-primary focus:outline-none"
                />
              </td>
              <td className="border-b border-outline-variant/30 py-2">
                <input
                  type="number"
                  value={valores.alta}
                  onChange={(e) =>
                    acoes.atualizarExcecao(metrica, valores.queda, Number(e.target.value))
                  }
                  className="w-20 rounded-md border border-outline-variant bg-surface px-2 py-1 font-data-tabular text-data-tabular focus:border-primary focus:outline-none"
                />
              </td>
              <td className="border-b border-outline-variant/30 py-2">
                <button
                  type="button"
                  onClick={() => acoes.removerExcecao(metrica)}
                  className="rounded-md bg-error-container px-2.5 py-1 text-label-md font-semibold text-on-error-container hover:opacity-90"
                >
                  remover
                </button>
              </td>
            </tr>
          ))}

          <tr>
            <td className="py-2 pr-3">
              <select
                value={novaMetrica}
                onChange={(e) => setNovaMetrica(e.target.value)}
                className="w-full rounded-md border border-outline-variant bg-surface px-2 py-1.5 text-body-md focus:border-primary focus:outline-none"
              >
                <option value="">— escolher métrica —</option>
                {Object.entries(METRICAS_INSTITUICAO).map(([chave, meta]) => (
                  <option
                    key={chave}
                    value={chave}
                    disabled={excecoes.some(([usada]) => usada === chave)}
                  >
                    {meta.rotulo}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-2">
              <input
                type="number"
                value={novaQueda}
                onChange={(e) => setNovaQueda(e.target.value)}
                className="w-20 rounded-md border border-outline-variant bg-surface px-2 py-1.5 font-data-tabular text-data-tabular focus:border-primary focus:outline-none"
              />
            </td>
            <td className="py-2">
              <input
                type="number"
                value={novaAlta}
                onChange={(e) => setNovaAlta(e.target.value)}
                className="w-20 rounded-md border border-outline-variant bg-surface px-2 py-1.5 font-data-tabular text-data-tabular focus:border-primary focus:outline-none"
              />
            </td>
            <td className="py-2">
              <button
                type="button"
                onClick={adicionarExcecao}
                className="rounded-md bg-primary px-3 py-1.5 text-label-md font-semibold text-on-primary hover:opacity-90"
              >
                adicionar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            acoes.salvar();
            avisar('Limites salvos neste navegador.');
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-label-md font-semibold text-on-primary hover:opacity-90"
        >
          <Save className="h-4 w-4" /> Salvar neste navegador
        </button>
        <button
          type="button"
          onClick={() => {
            acoes.restaurar();
            avisar('Padrões restaurados (−5% / +10%).');
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant px-4 py-2 text-label-md font-semibold text-on-surface hover:border-primary hover:text-primary"
        >
          <RotateCcw className="h-4 w-4" /> Restaurar padrões
        </button>
        {feedback && (
          <span className="text-label-md font-semibold text-success-emerald">{feedback}</span>
        )}
      </div>
    </section>
  );
}

export default PainelLimites;
