// src/pages/VerificacaoConsistencia/index.jsx
// Página do Módulo de Verificação de Consistência de Dados.
// Fonte: SimCC ETL (`GET /etl/consistencia/export`), que registra o estado
// do banco antes e depois de cada rotina de carga.

import { useMemo, useState } from 'react';
import { FileDown, LogIn, Printer, RefreshCw, ShieldAlert } from 'lucide-react';

import { useHistoricoExecucoes, useUltimasExecucoes } from '../../hooks/useConsistencia';
import { useAuth } from '../../hooks/useAuth';
import { TAMANHO_PAGINA } from '../../constants/consistencia';
import {
  agruparPorTipo,
  exportarCsv,
  resumoExecucoes,
  ultimaExecucaoGeral,
} from '../../lib/consistencia';
import CargaBanner from './CargaBanner';
import CartoesResumo from './CartoesResumo';
import PainelHistorico from './PainelHistorico';
import TabelaCargas from './TabelaCargas';

export function VerificacaoConsistencia() {
  const { isAuthenticated, login } = useAuth();

  const [aba, setAba] = useState('ultimas');
  const [expandidos, setExpandidos] = useState(() => new Set());
  const [pagina, setPagina] = useState(0);
  const [filtrosHistorico, setFiltrosHistorico] = useState({
    tipo: '',
    status: '',
    desdeData: '',
  });

  const {
    data: relatorios = [],
    isFetching,
    error,
    refetch,
  } = useUltimasExecucoes();

  const grupos = useMemo(() => agruparPorTipo(relatorios), [relatorios]);
  const resumo = useMemo(() => resumoExecucoes(grupos.map((g) => g.ultima)), [grupos]);
  const ultimaGeral = useMemo(() => ultimaExecucaoGeral(relatorios), [relatorios]);

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

  const alternar = (tipo) =>
    setExpandidos((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(tipo)) proximo.delete(tipo);
      else proximo.add(tipo);
      return proximo;
    });

  const mensagemErro = error ? String(error.message || error) : '';

  /* ---------- Portão de autenticação ---------- */
  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-4">
        <div className="max-w-md rounded-xl bg-surface-container-lowest p-8 text-center shadow-sm">
          <ShieldAlert className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-3 font-headline-lg text-navy-deep">Acesso restrito</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">
            O acompanhamento das cargas é ferramenta interna da equipe do Observatório.
            Entre com sua conta institucional para ver o histórico.
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

  return (
    <main className="min-h-screen bg-surface px-4 py-8 md:px-16 print:px-0">
      <div className="mx-auto max-w-[1320px]">
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-navy-deep">
              Verificação de Consistência de Dados
            </h1>
            <p className="mt-1 max-w-2xl text-body-md text-on-surface-variant">
              Mostra a diferença de registros antes e depois de cada rotina de carga do
              SimCC e a data da última execução — para saber se um dado já deveria
              aparecer no portal.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 print:hidden">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-label-md font-semibold text-on-primary hover:opacity-90"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Atualizando…' : 'Atualizar'}
            </button>
            <button
              type="button"
              onClick={() => exportarCsv(grupos)}
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
          </div>
        </div>

        {/* Erro de conexão */}
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
                onClick={() => setAba('ultimas')}
                className={`rounded-t-xl border border-b-0 border-outline-variant px-5 py-2.5 text-label-md font-bold uppercase tracking-wide ${
                  aba === 'ultimas'
                    ? 'bg-surface-container-lowest text-navy-deep'
                    : 'bg-surface-container text-on-surface-variant hover:text-primary'
                }`}
              >
                Últimas cargas
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

            {aba === 'ultimas' ? (
              <>
                <div className="mt-4 mb-3 flex flex-wrap items-center gap-4 text-label-md text-on-surface-variant">
                  <span>
                    <span className="mr-1.5 inline-block h-3.5 w-3.5 rounded bg-error-container align-middle" />
                    <strong className="text-on-error-container">atenção</strong> — execução parcial
                    ou com falha
                  </span>
                  <span>Clique em uma rotina para ver todas as medidas e os detalhes.</span>
                </div>

                <TabelaCargas
                  grupos={grupos}
                  expandidos={expandidos}
                  alternar={alternar}
                />
              </>
            ) : (
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
            )}

            <p className="mt-5 flex flex-wrap items-center gap-1.5 text-label-md text-on-surface-variant">
              Fonte: SimCC ETL —
              <code className="font-data-tabular text-data-tabular">
                GET /etl/consistencia/export
              </code>
              . Atualiza automaticamente a cada 2 minutos.
            </p>
          </>
        )}
      </div>
    </main>
  );
}

export default VerificacaoConsistencia;
