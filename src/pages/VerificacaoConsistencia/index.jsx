// src/pages/VerificacaoConsistencia/index.jsx
// Página do Módulo de Verificação de Consistência de Dados
// Consumo dos endpoints `/data-consistency` do backend (contrato em `consistencia-dados.md`)

import { useMemo, useState } from 'react';
import { AlertTriangle, FileDown, LogIn, Printer, Settings2 } from 'lucide-react';

import { useHistoricoCargas, useUltimasCargas, useUltimoRelatorio } from '../../hooks/useConsistencia';
import { useAuth } from '../../hooks/useAuth';
import {
  METRICAS,
  SITUACOES_COMPARACAO,
  LIMITES_PADRAO,
} from '../../constants/consistencia';
import {
  exportarCsv,
  limitesCarregados,
  limitesDe,
  limitesSalvar,
  limitesValidos,
  statusEfetivo,
} from '../../lib/consistencia';
import CargaBanner from './CargaBanner';
import CartoesResumo from './CartoesResumo';
import PainelHistorico from './PainelHistorico';
import PainelLimites from './PainelLimites';
import TabelaMetricas from './TabelaMetricas';

export function VerificacaoConsistencia() {
  const { isAuthenticated, login } = useAuth();

  // Dados do backend
  const { data: relatorio, isFetching, refetch, error } = useUltimoRelatorio();
  const { data: ultimas } = useUltimasCargas();

  // Filtros de exibição da tabela
  const [filtrosTabela, setFiltrosTabela] = useState({
    escopo: '',
    universidade: '',
    metrica: '',
    soAlertas: false,
    mostrarInalteradas: false,
  });

  // Painel de limites (simulação)
  const [limites, setLimites] = useState(() => {
    const salvos = limitesCarregados();
    return { ...salvos, excecoes: salvos.excecoes || {} };
  });
  const [simular, setSimular] = useState(true);
  const [painelAberto, setPainelAberto] = useState(false);

  // Histórico
  const [aba, setAba] = useState('cargas');
  const [filtrosHistorico, setFiltrosHistorico] = useState({
    load_type: '',
    status: '',
    date_from: '',
    date_to: '',
  });
  const { data: historico, refetch: recarregarHistorico, isFetching: historicoCarregando, error: erroHistorico } =
    useHistoricoCargas(filtrosHistorico);

  const acoesLimites = {
    atualizarPadroes: (queda, alta) =>
      setLimites((atual) => ({ ...atual, queda, alta })),
    adicionarExcecao: (metrica, queda, alta) =>
      setLimites((atual) => {
        const excecoes = { ...(atual.excecoes || {}) };
        excecoes[metrica] = { queda, alta };
        return { ...atual, excecoes };
      }),
    atualizarExcecao: (metrica, queda, alta) =>
      setLimites((atual) => {
        const excecoes = { ...(atual.excecoes || {}), [metrica]: { queda, alta } };
        return { ...atual, excecoes };
      }),
    removerExcecao: (metrica) =>
      setLimites((atual) => {
        const excecoes = { ...(atual.excecoes || {}) };
        delete excecoes[metrica];
        return { ...atual, excecoes };
      }),
    salvar: () => limitesSalvar(limites),
    restaurar: () => setLimites({ ...LIMITES_PADRAO, excecoes: {} }),
  };

  /** Linhas visíveis da tabela, já com o estado aplicado para exportação */
  const linhasVisiveis = useMemo(() => {
    if (!relatorio || !Array.isArray(relatorio.metrics)) return [];
    return relatorio.metrics.filter((linha) => {
      const estado = statusEfetivo(linha, simular, limitesValidos(limites) ? limites : { ...LIMITES_PADRAO, excecoes: {} });
      if (filtrosTabela.escopo && linha.scope !== filtrosTabela.escopo) return false;
      if (
        filtrosTabela.universidade &&
        !String(linha.institution_name || '').toLowerCase().includes(filtrosTabela.universidade.toLowerCase())
      )
        return false;
      if (filtrosTabela.metrica && linha.metric_key !== filtrosTabela.metrica) return false;
      if (filtrosTabela.soAlertas && !(estado.isWarning || estado.status === 'NEW_SCOPE')) return false;
      if (!simular && !filtrosTabela.mostrarInalteradas && linha.status === 'UNCHANGED' && !linha.is_warning) return false;
      linha.statusEfetivo = estado.status;
      return true;
    });
  }, [relatorio, filtrosTabela, simular, limites]);

  /* ---------- Portão de autenticação ---------- */
  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-4">
        <div className="max-w-md rounded-xl bg-surface-container-lowest p-8 text-center shadow-sm">
          <AlertTriangle className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-3 font-headline-lg text-navy-deep">Acesso restrito</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">
            A verificação de consistência de dados é ferramenta interna da equipe do
            Observatório. Entre com sua conta institucional para acompanhar as cargas.
          </p>
          <button
            type="button"
            onClick={() => login()}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-md font-semibold text-on-primary hover:opacity-90"
          >
            <LogIn className="h-4 w-4" /> Entrar
          </button>
        </div>
      </main>
    );
  }

  const carga = relatorio ? relatorio.load : null;
  const resumo = relatorio ? relatorio.summary : null;
  const errosDeCarregamento = error ? String(error.message || error) : '';

  return (
    <main className="min-h-screen bg-surface px-4 py-8 md:px-16">
      <div className="mx-auto max-w-[1280px]">
        {/* Cabeçalho da página */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-navy-deep">Verificação de Consistência de Dados</h1>
            <p className="mt-1 max-w-2xl text-body-md text-on-surface-variant">
              Compara os totais do banco antes e depois de cada carga e sinaliza
              variações precisando de análise (limites padrão: queda −5%, alta +10%).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPainelAberto((aberto) => !aberto)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant px-4 py-2 text-label-md font-semibold text-on-surface hover:border-primary hover:text-primary"
            >
              <Settings2 className="h-4 w-4" /> Limites de variação
            </button>
            <button
              type="button"
              onClick={() => exportarCsv(linhasVisiveis)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant px-4 py-2 text-label-md font-semibold text-on-surface hover:border-primary hover:text-primary"
            >
              <FileDown className="h-4 w-4" /> Exportar CSV
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="hidden items-center gap-1.5 rounded-lg border border-outline-variant px-4 py-2 text-label-md font-semibold text-on-surface hover:border-primary hover:text-primary md:inline-flex print:hidden"
            >
              <Printer className="h-4 w-4" /> Imprimir
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-label-md font-semibold text-on-primary hover:opacity-90"
            >
              {isFetching ? 'Atualizando…' : 'Atualizar'}
            </button>
          </div>
        </div>

        {/* Estado: erro de rede */}
        {error && !relatorio && (
          <p className="mt-6 rounded-xl bg-error-container/40 px-4 py-3 text-body-md text-on-error-container">
            Não foi possível conectar à API ({errosDeCarregamento}). Verifique a
            variável <code className="font-data-tabular text-data-tabular">VITE_API_URL</code> ou aguarde o ambiente retornar.
          </p>
        )}

        {/* Estado: ainda não há relatório validado */}
        {!error && !relatorio && !isFetching && (
          <p className="mt-6 rounded-xl bg-surface-container-lowest px-4 py-4 text-body-md text-on-surface-variant shadow-sm">
            Ainda não há carga validada. Dispare o ciclo no pipeline
            (<code className="font-data-tabular text-data-tabular">POST /internal/data-consistency/loads</code> → carga →{' '}
            <code className="font-data-tabular text-data-tabular">/finish</code>) e clique em <strong>Atualizar</strong>.
          </p>
        )}

        {relatorio && (
          <div className="mt-6 space-y-5">
            <CargaBanner carga={carga} />
            <CartoesResumo resumo={resumo} />

            {/* Filtros */}
            <div className="flex flex-wrap items-end gap-3 rounded-xl bg-surface-container-lowest px-4 py-3 shadow-sm">
              <label className="text-label-md font-semibold text-on-surface-variant">
                Escopo
                <select
                  value={filtrosTabela.escopo}
                  onChange={(e) => setFiltrosTabela({ ...filtrosTabela, escopo: e.target.value })}
                  className="mt-1 block rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 text-body-md focus:border-primary focus:outline-none"
                >
                  <option value="">todos</option>
                  <option value="INSTITUTION">por instituição</option>
                  <option value="GLOBAL">geral</option>
                </select>
              </label>

              <label className="text-label-md font-semibold text-on-surface-variant">
                Universidade
                <input
                  value={filtrosTabela.universidade}
                  onChange={(e) => setFiltrosTabela({ ...filtrosTabela, universidade: e.target.value })}
                  placeholder="digite o nome…"
                  className="mt-1 block w-44 rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 text-body-md focus:border-primary focus:outline-none"
                />
              </label>

              <label className="text-label-md font-semibold text-on-surface-variant">
                Métrica
                <select
                  value={filtrosTabela.metrica}
                  onChange={(e) => setFiltrosTabela({ ...filtrosTabela, metrica: e.target.value })}
                  className="mt-1 block max-w-[280px] rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 text-body-md focus:border-primary focus:outline-none"
                >
                  <option value="">todas</option>
                  {Object.entries(METRICAS).map(([chave, rotulo]) => (
                    <option key={chave} value={chave}>{rotulo}</option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 text-body-md text-on-surface">
                <input
                  type="checkbox"
                  checked={filtrosTabela.soAlertas}
                  onChange={(e) => setFiltrosTabela({ ...filtrosTabela, soAlertas: e.target.checked })}
                  className="h-4 w-4 accent-[#07677e]"
                />
                somente alertas e novos
              </label>

              {!simular && (
                <label className="flex items-center gap-2 text-body-md text-on-surface">
                  <input
                    type="checkbox"
                    checked={filtrosTabela.mostrarInalteradas}
                    onChange={(e) => setFiltrosTabela({ ...filtrosTabela, mostrarInalteradas: e.target.checked })}
                    className="h-4 w-4 accent-[#07677e]"
                  />
                  mostrar inalteradas
                </label>
              )}

              <span className="ml-auto font-label-md text-label-md font-bold text-navy-deep">
                {linhasVisiveis.length} linhas •{' '}
                {linhasVisiveis.filter((linha) => SITUACOES_COMPARACAO[linha.statusEfetivo] === 'Atenção').length} em
                alerta •{' '}
                {linhasVisiveis.filter((linha) => linha.statusEfetivo === 'NEW_SCOPE').length} novas
              </span>
            </div>

            {/* Legenda */}
            <div className="flex flex-wrap items-center gap-5 text-label-md text-on-surface-variant">
              <span>
                <span className="mr-1.5 inline-block h-3.5 w-3.5 rounded bg-error align-middle" />
                destaque de <strong>error</strong> — variação fora dos limites (verificar cargas)
              </span>
              <span>
                <span className="mr-1.5 inline-block h-3.5 w-3.5 rounded bg-secondary-container align-middle" />
                azul — métrica nova (antes valia zero)
              </span>
            </div>

            {/* Painel de limites (expansível) */}
            {painelAberto && (
              <PainelLimites
                limites={limites}
                acoes={acoesLimites}
                simular={simular}
                setSimular={setSimular}
              />
            )}

            <TabelaMetricas
              linhas={linhasVisiveis}
              simular={simular}
              limites={limites}
              limitesDe={limitesDe}
              statusEfetivo={statusEfetivo}
            />

            <PainelHistorico
              aba={aba}
              setAba={setAba}
              ultimas={ultimas}
              historico={historico}
              filtros={filtrosHistorico}
              setFiltros={setFiltrosHistorico}
              refetch={recarregarHistorico}
              respostas={{ loading: historicoCarregando, error: erroHistorico }}
            />
          </div>
        )}

        {!relatorio && (
          <PainelHistorico
            aba={aba}
            setAba={setAba}
            ultimas={ultimas}
            historico={historico}
            filtros={filtrosHistorico}
            setFiltros={setFiltrosHistorico}
            refetch={recarregarHistorico}
            respostas={{ loading: historicoCarregando, error: erroHistorico }}
          />
        )}
      </div>
    </main>
  );
}

export default VerificacaoConsistencia;
