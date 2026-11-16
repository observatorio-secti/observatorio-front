// src/pages/VerificacaoConsistencia/PainelInstituicoes.jsx
// Aba "Por instituição": compara as fotos mensais de `GET /institution`
// usando a janela de cada carga registrada pelo ETL.
//
// A filtragem e o cálculo da situação ficam em `index.jsx` para que a
// exportação CSV use exatamente as mesmas linhas que estão na tela.

import { AlertCircle, Camera, RefreshCw } from 'lucide-react';

import { METRICAS_INSTITUICAO } from '../../constants/consistencia';
import { formatarDataHora, nomeRotina } from '../../lib/consistencia';
import { resumoFotos } from '../../lib/snapshots';
import PainelLimites from './PainelLimites';
import TabelaMetricas from './TabelaMetricas';

export function PainelInstituicoes({
  linhas,
  contadores,
  planos,
  entradas,
  carregando,
  erro,
  disponivel,
  filtros,
  setFiltros,
  painelAberto,
  limites,
  acoesLimites,
  simular,
  setSimular,
  onAtualizar,
}) {
  const resumo = resumoFotos(entradas);
  const coletaIndisponivel = !disponivel && !carregando;

  const pendentes = planos.filter((plano) => !plano.antes || !plano.depois);

  const semCarga = planos.filter(
    (plano) => plano.origem === 'fotos' && plano.antes && plano.depois,
  );

  return (
    <div className="space-y-4">
      {/* Situação da coleta */}
      <section className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl bg-surface-container-lowest px-4 py-3 shadow-sm">
        <span className="flex items-center gap-2 text-body-md text-on-surface">
          <Camera className="h-4 w-4 text-primary" />
          {disponivel ? (
            <>
              <strong className="font-semibold">Última foto:</strong>{' '}
              {formatarDataHora(resumo.ultima)}
              <span className="text-on-surface-variant">
                · {resumo.total} foto{resumo.total === 1 ? '' : 's'} guardada
                {resumo.total === 1 ? '' : 's'} · {resumo.instituicoes} instituições
              </span>
            </>
          ) : (
            <span className="text-on-surface-variant">
              Nenhuma foto publicada ainda — o coletor precisa rodar ao menos uma vez.
            </span>
          )}
        </span>

        <span className="text-label-md text-on-surface-variant">
          Coleta automática uma vez por mês. A comparação usa a foto anterior ao início da carga e
          a primeira posterior ao fim.
        </span>

        <button
          type="button"
          onClick={onAtualizar}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-outline-variant px-3 py-1.5 text-label-md font-semibold text-on-surface hover:border-primary hover:text-primary"
        >
          <RefreshCw className={`h-4 w-4 ${carregando ? 'animate-spin' : ''}`} /> Atualizar fotos
        </button>
      </section>

      {coletaIndisponivel && erro && (
        <p className="rounded-xl bg-error-container/40 px-4 py-3 text-body-md text-on-error-container">
          Não foi possível ler as fotos por instituição ({String(erro.message || erro)}). Confira
          se o coletor já publicou em <code className="font-data-tabular">VITE_SNAPSHOTS_URL</code>.
        </p>
      )}

      {pendentes.length > 0 && (
        <section className="rounded-xl bg-surface-container-low px-4 py-3 text-label-md text-on-surface-variant">
          <p className="flex items-center gap-1.5 font-semibold text-on-surface">
            <AlertCircle className="h-4 w-4 text-primary" />
            Aguardando par de fotos
          </p>
          <ul className="mt-1.5 space-y-0.5">
            {pendentes.map((plano) => {
              const motivo =
                plano.origem === 'fotos'
                  ? 'são necessárias pelo menos duas fotos coletadas'
                  : !plano.antes
                    ? 'falta foto anterior ao início da carga'
                    : 'falta foto posterior ao fim da carga';
              return (
                <li key={plano.metrica}>
                  <strong className="text-on-surface">{plano.meta.rotulo}</strong> —{' '}
                  {nomeRotina(plano.meta.rotina)}
                  {plano.execucao ? ` (${formatarDataHora(plano.execucao.iniciado_em)})` : ''}:{' '}
                  {motivo}.
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {semCarga.length > 0 && (
        <p className="rounded-xl bg-surface-container-lowest px-4 py-2.5 text-label-md text-on-surface-variant shadow-sm">
          <strong className="text-on-surface">Sem carga registrada no ETL:</strong>{' '}
          {semCarga.map((plano) => plano.meta.rotulo).join(', ')} — para essas métricas a
          comparação usa as duas últimas fotos.
        </p>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl bg-surface-container-lowest px-4 py-3 shadow-sm">
        <label className="text-label-md font-semibold text-on-surface-variant">
          Instituição
          <input
            value={filtros.instituicao}
            onChange={(e) => setFiltros({ ...filtros, instituicao: e.target.value })}
            placeholder="sigla ou nome…"
            className="mt-1 block w-52 rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 text-body-md focus:border-primary focus:outline-none"
          />
        </label>

        <label className="text-label-md font-semibold text-on-surface-variant">
          Métrica
          <select
            value={filtros.metrica}
            onChange={(e) => setFiltros({ ...filtros, metrica: e.target.value })}
            className="mt-1 block max-w-[280px] rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 text-body-md focus:border-primary focus:outline-none"
          >
            <option value="">todas</option>
            {Object.entries(METRICAS_INSTITUICAO).map(([chave, meta]) => (
              <option key={chave} value={chave}>
                {meta.rotulo}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-body-md text-on-surface">
          <input
            type="checkbox"
            checked={filtros.soAlertas}
            onChange={(e) => setFiltros({ ...filtros, soAlertas: e.target.checked })}
            className="h-4 w-4 accent-[#07677e]"
          />
          somente alertas e novos
        </label>

        <span className="ml-auto font-label-md text-label-md font-bold text-navy-deep">
          {contadores.total} linhas • {contadores.emAtencao} em atenção • {contadores.novas} novas
        </span>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap items-center gap-5 text-label-md text-on-surface-variant">
        <span>
          <span className="mr-1.5 inline-block h-3.5 w-3.5 rounded bg-error align-middle" />
          destaque de <strong>error</strong> — variação fora dos limites
        </span>
        <span>
          <span className="mr-1.5 inline-block h-3.5 w-3.5 rounded bg-secondary-container align-middle" />
          azul — métrica nova (antes valia zero)
        </span>
        <span>
          <span className="mr-1.5 inline-block h-3.5 w-3.5 rounded bg-surface-container-high align-middle" />
          cinza — sem variação na janela da carga
        </span>
      </div>

      {painelAberto && (
        <PainelLimites
          limites={limites}
          acoes={acoesLimites}
          simular={simular}
          setSimular={setSimular}
        />
      )}

      <TabelaMetricas
        linhas={linhas}
        carregando={carregando && linhas.length === 0}
        mensagemVazia={
          coletaIndisponivel
            ? 'Ainda não há fotos coletadas — a comparação por instituição aparece depois da primeira coleta.'
            : 'Nenhuma comparação disponível para os filtros escolhidos.'
        }
      />

      <p className="text-label-md text-on-surface-variant">
        A comparação usa a foto anterior ao início da carga e a primeira posterior ao fim. Passe o
        mouse sobre a coluna “Carga” para ver as fotos usadas. Como a coleta é mensal, o par pode
        ficar distante da carga — nesse caso a linha marca “fotos mensais” e a diferença inclui
        outras mudanças do período.
      </p>
    </div>
  );
}

export default PainelInstituicoes;
