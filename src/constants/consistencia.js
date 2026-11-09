// src/constants/consistencia.js
// Metadados e traduções (pt-BR) do módulo de Verificação de Consistência de Dados
// Referência: `consistencia-dados.md` (contrato do backend `/data-consistency`)

/**
 * Chave -> nome amigável das métricas acompanhadas no snapshot.
 * A chave é exibida relevante em tamanho menor para conferência com a API.
 */
export const METRICAS = {
  researchers_total: 'Pesquisadores ativos',
  teachers_total: 'Docentes',
  research_groups_total: 'Grupos de pesquisa',
  graduate_programs_total: 'Programas de pós-graduação',
  cnpq_fellows_total: 'Bolsistas CNPq (produtividade)',
  articles_total: 'Artigos',
  books_total: 'Livros',
  book_chapters_total: 'Capítulos de livro',
  patents_total: 'Patentes',
  softwares_total: 'Softwares',
  brands_total: 'Marcas',
  technical_reports_total: 'Relatórios técnicos',
  guidance_total: 'Orientações',
  event_participation_total: 'Participações em eventos',
  research_projects_total: 'Projetos de pesquisa',
  publishing_total: 'Textos em revistas/jornais',
  works_in_events_total: 'Trabalhos em eventos',
  periodicals_total: 'Revistas do catálogo',
  jcr_records_total: 'JCR — registros',
  jcr_articles_total: 'JCR — artigos com fator',
  jcr_citations_total: 'JCR — citações',
  jcr_journal_articles_total: 'JCR — artigos declarados',
  openalex_profiles_total: 'OpenAlex — perfis',
  openalex_works_total: 'OpenAlex — trabalhos',
  openalex_articles_total: 'OpenAlex — artigos',
  openalex_researcher_citations_total: 'OpenAlex — citações de perfis',
  openalex_article_citations_total: 'OpenAlex — citações de artigos',
  openalex_i10_total: 'OpenAlex — índice i10',
};

/** Tipos de carga conhecidos pelo pipeline */
export const TIPOS_CARGA = {
  LATTES_D1: 'Lattes (D-1)',
  RESEARCH_GROUPS: 'Grupos de pesquisa',
  GRADUATE_PROGRAMS: 'Pós-graduação',
  CNPQ_FELLOWS: 'Bolsistas CNPq',
  OPENALEX: 'OpenAlex',
  JCR: 'JCR',
  HOP_FULL: 'Carga completa (Hop)',
};

/** Situação de execução da carga */
export const SITUACOES_CARGA = {
  RUNNING: 'Em execução',
  VALIDATED: 'Validada',
  FAILED: 'Falhou',
};

/** Origem que disparou a carga */
export const ORIGENS_CARGA = {
  MANUAL: 'Manual',
  HOP: 'Rotina Hop',
  SCHEDULED: 'Agendada',
};

/** Estado do resultado da comparação calculado pelo backend */
export const SITUACOES_COMPARACAO = {
  NORMAL: 'Dentro',
  WARNING: 'Atenção',
  NEW_SCOPE: 'Novo',
  UNCHANGED: 'Inalterado',
};

/** Escopo de cálculo da métrica */
export const ESCOPOS = {
  GLOBAL: 'Geral',
  INSTITUTION: 'Instituição',
};

/** Limites padrão de variação do contrato (queda -5%, alta +10%) */
export const LIMITES_PADRAO = { queda: -5, alta: 10 };

/** Chave de armazenamento local das preferências de limites (simulação) */
export const CHAVE_LIMITES = '@observatorio:consistencia-limites:v1';
