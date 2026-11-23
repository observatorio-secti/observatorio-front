// src/pages/VerificacaoConsistencia/index.jsx
// Página do Módulo de Consistência de Dados.
//
// Duas leituras, uma do lado da outra:
//  1. Cargas por rotina — o que o SimCC ETL registrou antes/depois de cada
//     rotina, em totais globais (`GET /etl/consistencia/export`).
//  2. Por instituição — comparação das fotos de `GET /institution`,
//     amarrada à janela de cada carga. É o que responde "a UESC estava com
//     1.100 pesquisadores e ficou com 1.124 depois da carga".

import { useEffect, useMemo, useState } from 'react';
import { FileDown, LogIn, Printer, RefreshCw, Settings2, ShieldAlert } from 'lucide-react';

import { useHistoricoExecucoes, useUltimasExecucoes } from '../../hooks/useConsistencia';
import { useComparacaoInstituicoes } from '../../hooks/useSnapshots';
import { useAuth } from '../../hooks/useAuth';
import { Footer } from '../../components/layout/Footer';
import { Header } from '../../components/layout/Header';
import { LIMITES_PADRAO, TAMANHO_PAGINA } from '../../constants/consistencia';
import {
  agruparPorTipo,
  exportarCsv,
  exportarCsvMetricas,
  limitesCarregados,
  limitesSalvar,
  resumoExecucoes,
  statusEfetivo,
  ultimaExecucaoGeral,
} from '../../lib/consistencia';
import CargaBanner from './CargaBanner';
import CartoesResumo from './CartoesResumo';
import PainelHistorico from './PainelHistorico';
import PainelInstituicoes from './PainelInstituicoes';
import TabelaCargas from './TabelaCargas';

export function VerificacaoConsistencia() {
  const { isAuthenticated, login } = useAuth();

  // A aba do navegador passa a identificar o módulo (todas as rotas herdam o
  // título genérico do index.html).
  useEffect(() => {
    const anterior = document.title;
    document.title = 'Módulo de Consistência de Dados — Observatório de CT&I da Bahia';
    return () => {
      document.title = anterior;
    };
  }, []);

  const [aba, setAba] = useState('cargas');
  const [expandidos, setExpandidos] = useState(() => new Set());
  const [pagina, setPagina] = useState(0);
  const [filtrosHistorico, setFiltrosHistorico] = useState({
    tipo: '',
    status: '',
    desdeData: '',
  });
  const [filtrosInstituicoes, setFiltrosInstituicoes] = useState({
    instituicao: '',
    metrica: '',
    soAlertas: false,
  });

  // Limites de variação (preferências locais)
  const [limites, setLimites] = useState(() => {
    const salvos = limitesCarregados();
    return { ...salvos, excecoes: salvos.excecoes || {} };
  });
  const [simular, setSimular] = useState(true);
  const [painelAberto, setPainelAberto] = useState(false);

  const {
    data: relatorios = [],
    isFetching,
    error,
    refetch,
  } = useUltimasExecucoes();

  const grupos = useMemo(() => agruparPorTipo(relatorios), [relatorios]);
  const resumo = useMemo(() => resumoExecucoes(grupos.map((g) => g.ultima)), [grupos]);
  const ultimaGeral = useMemo(() => ultimaExecucaoGeral(relatorios), [relatorios]);

  const comparacao = useComparacaoInstituicoes(grupos);

  const historico = useHistoricoExecucoes(
    {
      tipo: filtrosHistorico.tipo,
      desde: filtrosHistorico.desdeData ? `${filtrosHistorico.desdeData}T00:00:00Z` : '',
      limit: TAMANHO_PAGINA,
      offset: pagina * TAMANHO_PAGINA,
    },
    { enabled: aba === 'historico' },
  );

  const historicoVisivel = useMemo(() => {
    const lista = historico.data || [];
    if (!filtrosHistorico.status) return lista;
    return lista.filter((relatorio) => relatorio.estado === filtrosHistorico.status);
  }, [historico.data, filtrosHistorico.status]);

  /* ---------- Comparação por instituição ---------- */

  const linhasInstituicoes = useMemo(() => {
    return comparacao.linhas
      .map((linha) => {
        const estado = statusEfetivo(linha, simular, limites);
        return {
          ...linha,
          statusEfetivo: estado.status,
          isWarning: estado.isWarning,
          limites: estado.limites,
        };
      })
      .filter((linha) => {
        if (
          filtrosInstituicoes.instituicao &&
          !`${linha.sigla} ${linha.instituicaoNome}`
            .toLowerCase()
            .includes(filtrosInstituicoes.instituicao.toLowerCase())
        ) {
          return false;
        }
        if (filtrosInstituicoes.metrica && linha.metrica !== filtrosInstituicoes.metrica) {
          return false;
        }
        if (
          filtrosInstituicoes.soAlertas &&
          !(linha.isWarning || linha.statusEfetivo === 'NEW_SCOPE')
        ) {
          return false;
        }
        return true;
      });
  }, [comparacao.linhas, simular, limites, filtrosInstituicoes]);

  const contadoresInstituicoes = useMemo(
    () => ({
      total: linhasInstituicoes.length,
      emAtencao: linhasInstituicoes.filter((linha) => linha.isWarning).length,
      novas: linhasInstituicoes.filter((linha) => linha.statusEfetivo === 'NEW_SCOPE').length,
    }),
    [linhasInstituicoes],
  );

  const acoesLimites = {
    atualizarPadroes: (queda, alta) => setLimites((atual) => ({ ...atual, queda, alta })),
    adicionarExcecao: (metrica, queda, alta) =>
      setLimites((atual) => ({
        ...atual,
        excecoes: { ...(atual.excecoes || {}), [metrica]: { queda, alta } },
      })),
    atualizarExcecao: (metrica, queda, alta) =>
      setLimites((atual) => ({
        ...atual,
        excecoes: { ...(atual.excecoes || {}), [metrica]: { queda, alta } },
      })),
    removerExcecao: (metrica) =>
      setLimites((atual) => {
        const excecoes = { ...(atual.excecoes || {}) };
        delete excecoes[metrica];
        return { ...atual, excecoes };
      }),
    salvar: () => limitesSalvar(limites),
    restaurar: () => setLimites({ ...LIMITES_PADRAO, excecoes: {} }),
  };

  const alternar = (tipo) =>
    setExpandidos((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(tipo)) proximo.delete(tipo);
      else proximo.add(tipo);
      return proximo;
    });

  const atualizarTudo = () => {
    refetch();
    comparacao.indice.refetch();
  };

  const exportarAtual = () => {
    if (aba === 'instituicoes') exportarCsvMetricas(linhasInstituicoes);
    else exportarCsv(grupos);
  };

  const mensagemErro = error ? String(error.message || error) : '';

  /* ---------- Portão de autenticação ---------- */
  // Atalho local para inspecionar a página sem o IdP no ar (VITE_AUTH_DESLIGADA).
  // Só vale no servidor de desenvolvimento: em build de produção `DEV` é false.
  const autenticacaoDesligada =
    import.meta.env.DEV && import.meta.env.VITE_AUTH_DESLIGADA === 'true';

  if (!autenticacaoDesligada && !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <Header />
        <main className="flex flex-grow items-center justify-center px-4 py-16">
          <div className="max-w-md rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-8 text-center shadow-sm">
            <ShieldAlert className="mx-auto h-10 w-10 text-primary" />
            <h1 className="mt-3 font-display text-2xl font-bold text-navy-deep">Acesso restrito</h1>
            <p className="mt-2 text-body-md text-on-surface-variant">
              O acompanhamento das cargas é ferramenta interna da equipe do Observatório.
              Entre com sua conta institucional para ver o histórico.
            </p>
            <button
              type="button"
              onClick={() => login()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-label-md font-semibold text-on-primary transition-colors hover:bg-navy-deep"
            >
              <LogIn className="h-4 w-4" /> Entrar
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <div className="print:hidden">
        <Header />
      </div>

      <main className="flex-grow px-4 py-8 md:px-16 print:px-0">
        <div className="mx-auto w-full max-w-[1280px]">
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-1 h-9 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-primary via-secondary to-error"
            />
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-navy-deep md:text-3xl">
                Módulo de Consistência de Dados
              </h1>
              <p className="mt-1 max-w-2xl text-body-md text-on-surface-variant">
                Mostra a diferença de registros antes e depois de cada rotina de carga — no total e
                por instituição — e a data da última execução, para saber se um dado já deveria
                aparecer no portal.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 print:hidden">
            <button
              type="button"
              onClick={() => {
                setAba('instituicoes');
                setPainelAberto((aberto) => !aberto);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant px-4 py-2 text-label-md font-semibold text-on-surface hover:border-primary hover:text-primary"
            >
              <Settings2 className="h-4 w-4" /> Limites de variação
            </button>
            <button
              type="button"
              onClick={exportarAtual}
              className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant px-4 py-2 text-label-md font-semibold text-on-surface hover:border-primary hover:text-primary"
            >
              <FileDown className="h-4 w-4" /> Exportar CSV
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant px-4 py-2 text-label-md font-semibold text-on-surface hover:border-primary hover:text-primary"
            >
              <Printer className="h-4 w-4" /> Imprimir
            </button>
            <button
              type="button"
              onClick={atualizarTudo}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-label-md font-semibold text-on-primary hover:opacity-90"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Atualizando…' : 'Atualizar'}
            </button>
          </div>
        </div>

        {/* Erro de conexão com o ETL */}
        {error && !isFetching && (
          <p className="mt-6 rounded-xl bg-error-container/40 px-4 py-3 text-body-md text-on-error-container">
            Não foi possível consultar o ETL ({mensagemErro}). Verifique se o endereço em{' '}
            <code className="font-data-tabular text-data-tabular">VITE_ETL_URL</code> está
            correto e se a chave em{' '}
            <code className="font-data-tabular text-data-tabular">VITE_ETL_API_KEY</code> está
            configurada.
          </p>
        )}

        {/* Carregando pela primeira vez */}
        {!error && isFetching && relatorios.length === 0 && (
          <p className="mt-6 rounded-xl bg-surface-container-lowest px-4 py-4 text-body-md text-on-surface-variant shadow-sm">
            Consultando as execuções do ETL…
          </p>
        )}

        {relatorios.length > 0 && (
          <>
            <div className="mt-6 space-y-5">
              <CargaBanner relatorio={ultimaGeral} />
              <CartoesResumo resumo={resumo} />
            </div>

            {/* Abas */}
            <div className="mt-8 flex gap-1.5 border-b border-outline-variant print:hidden">
              <button
                type="button"
                onClick={() => setAba('cargas')}
                className={`rounded-t-xl border border-b-0 border-outline-variant px-5 py-2.5 text-label-md font-bold uppercase tracking-wide ${
                  aba === 'cargas'
                    ? 'bg-surface-container-lowest text-navy-deep'
                    : 'bg-surface-container text-on-surface-variant hover:text-primary'
                }`}
              >
                Cargas por rotina
              </button>
              <button
                type="button"
                onClick={() => setAba('instituicoes')}
                className={`rounded-t-xl border border-b-0 border-outline-variant px-5 py-2.5 text-label-md font-bold uppercase tracking-wide ${
                  aba === 'instituicoes'
                    ? 'bg-surface-container-lowest text-navy-deep'
                    : 'bg-surface-container text-on-surface-variant hover:text-primary'
                }`}
              >
                Por instituição
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
                Histórico de execuções
              </button>
            </div>

            {aba === 'cargas' && (
              <>
                <div className="mt-4 mb-3 flex flex-wrap items-center gap-4 text-label-md text-on-surface-variant">
                  <span>
                    <span className="mr-1.5 inline-block h-3.5 w-3.5 rounded bg-error-container align-middle" />
                    <strong className="text-on-error-container">atenção</strong> — execução parcial
                    ou com falha
                  </span>
                  <span>Clique em uma rotina para ver todas as medidas e os detalhes.</span>
                </div>

                <TabelaCargas grupos={grupos} expandidos={expandidos} alternar={alternar} />
              </>
            )}

            {aba === 'instituicoes' && (
              <div className="pt-4">
                <PainelInstituicoes
                  linhas={linhasInstituicoes}
                  contadores={contadoresInstituicoes}
                  planos={comparacao.planos}
                  entradas={comparacao.entradas}
                  carregando={comparacao.carregando}
                  erro={comparacao.erro}
                  disponivel={comparacao.disponivel}
                  filtros={filtrosInstituicoes}
                  setFiltros={setFiltrosInstituicoes}
                  painelAberto={painelAberto}
                  limites={limites}
                  acoesLimites={acoesLimites}
                  simular={simular}
                  setSimular={setSimular}
                  onAtualizar={() => comparacao.indice.refetch()}
                />
              </div>
            )}

            {aba === 'historico' && (
              <div className="pt-4">
                <PainelHistorico
                  relatorios={historicoVisivel}
                  carregando={historico.isFetching}
                  erro={historico.error}
                  filtros={filtrosHistorico}
                  setFiltros={setFiltrosHistorico}
                  pagina={pagina}
                  setPagina={setPagina}
                  tamanhoPagina={TAMANHO_PAGINA}
                  refetch={() => {
                    setPagina(0);
                    historico.refetch();
                  }}
                />
              </div>
            )}

            <p className="mt-5 flex flex-wrap items-center gap-1.5 text-label-md text-on-surface-variant">
              Fonte: SimCC ETL —{' '}
              <code className="font-data-tabular text-data-tabular">
                GET /etl/consistencia/export
              </code>{' '}
              · fotos por instituição de{' '}
              <code className="font-data-tabular text-data-tabular">
                GET /simcc/api/institution
              </code>
              . Atualiza automaticamente a cada 2 minutos.
            </p>
          </>
        )}
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}

export default VerificacaoConsistencia;
