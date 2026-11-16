// src/constants/consistencia.js
// Catálogo das rotinas do SimCC ETL e traduções (pt-BR) do módulo de
// Verificação de Consistência de Dados.
// Referência: `simcc-etl/simcc_etl/core/consistency.py` (CONSISTENCY_CATALOG)

/**
 * Rotinas acompanhadas pelo ETL.
 * - `rotulo`: nome amigável exibido na tela
 * - `categoria`: agrupamento funcional da rotina
 * - `afeta`: o que essa rotina muda nos dados que aparecem no portal
 *   (é o texto que ajuda alguém a concluir "meu dado ainda não entrou")
 */
export const ROTINAS = {
  soap_lattes: {
    rotulo: 'Coleta SOAP Lattes',
    categoria: 'Coleta',
    afeta: 'Currículos Lattes (coleta bruta)',
  },
  hop_seed: {
    rotulo: 'Carga Inicial (Apache Hop)',
    categoria: 'Carga inicial',
    afeta: 'Países, estados e periódicos',
  },
  hop_index: {
    rotulo: 'Extração Estruturada (Apache Hop)',
    categoria: 'Extração',
    afeta: 'Pesquisadores, produções e fomento',
  },
  qualis: {
    rotulo: 'Tabela Qualis',
    categoria: 'Referência',
    afeta: 'Qualis dos artigos',
  },
  foment_scholars: {
    rotulo: 'Bolsistas de Produtividade',
    categoria: 'Referência',
    afeta: 'Bolsas de produtividade (CNPq)',
  },
  capes_scraping: {
    rotulo: 'Raspagem Pós-Graduação (CAPES)',
    categoria: 'Pós-graduação',
    afeta: 'Programas de pós-graduação',
  },
  capes_programs: {
    rotulo: 'Importação de Programas CAPES',
    categoria: 'Pós-graduação',
    afeta: 'Programas de pós-graduação',
  },
  capes_ratings: {
    rotulo: 'Importação de Conceitos CAPES',
    categoria: 'Pós-graduação',
    afeta: 'Conceitos dos programas',
  },
  capes_researchers: {
    rotulo: 'Importação de Docentes CAPES',
    categoria: 'Pós-graduação',
    afeta: 'Docentes vinculados aos programas',
  },
  capes_research_lines: {
    rotulo: 'Linhas de Pesquisa dos Programas',
    categoria: 'Pós-graduação',
    afeta: 'Linhas de pesquisa dos programas',
  },
  sanitize_lattes: {
    rotulo: 'Higienização dos Dados Lattes',
    categoria: 'Higienização',
    afeta: 'Qualidade dos currículos Lattes',
  },
  enrich_researcher_institution: {
    rotulo: 'Vínculos Institucionais e Território',
    categoria: 'Enriquecimento',
    afeta: 'Instituição e território de cada pesquisador',
  },
  aggregate_production: {
    rotulo: 'Consolidação da Produção',
    categoria: 'Consolidação',
    afeta: 'Produção científica consolidada',
  },
  oda_research_groups: {
    rotulo: 'Grupos de Pesquisa (ODA)',
    categoria: 'Consolidação',
    afeta: 'Grupos de pesquisa',
  },
  indprod_researchers: {
    rotulo: 'Índice de Produção — Pesquisadores',
    categoria: 'Indicadores',
    afeta: 'Indicadores dos pesquisadores',
  },
  indprod_graduate_programs: {
    rotulo: 'Índice de Produção — Pós-Graduação',
    categoria: 'Indicadores',
    afeta: 'Indicadores dos programas',
  },
  indprod_research_groups: {
    rotulo: 'Índice de Produção — Grupos',
    categoria: 'Indicadores',
    afeta: 'Indicadores dos grupos',
  },
  classify_researchers: {
    rotulo: 'Classificação de Pesquisadores',
    categoria: 'Consolidação',
    afeta: 'Classificação dos pesquisadores',
  },
  classify_article_themes: {
    rotulo: 'Classificação Temática de Artigos',
    categoria: 'Enriquecimento',
    afeta: 'Temas dos artigos',
  },
  search_dictionary: {
    rotulo: 'Dicionário de Busca',
    categoria: 'Busca',
    afeta: 'Termos da busca do portal',
  },
  resolve_cnpq_lattes_id: {
    rotulo: 'Resolução de Identificador Lattes10',
    categoria: 'Higienização',
    afeta: 'Identificadores Lattes',
  },
  openalex: {
    rotulo: 'Enriquecimento OpenAlex',
    categoria: 'Enriquecimento',
    afeta: 'Perfis e citações do OpenAlex',
  },
  publish_to_read_db: {
    rotulo: 'Publicação no Banco de Leitura',
    categoria: 'Publicação',
    afeta: 'Publicação dos dados para o portal',
  },
};

/**
 * Estado da execução, como o endpoint de exportação devolve.
 * `destaque` indica se a linha precisa de atenção visual.
 */
export const ESTADOS = {
  EM_ANDAMENTO: {
    rotulo: 'Em andamento',
    descricao: 'A rotina ainda está executando.',
    destaque: false,
    classes: 'bg-primary/10 text-primary',
  },
  CONCLUIDO: {
    rotulo: 'Concluído',
    descricao: 'Execução finalizada com cobertura completa.',
    destaque: false,
    classes: 'bg-success-emerald/15 text-success-emerald',
  },
  CONCLUIDO_PARCIAL: {
    rotulo: 'Concluído parcial',
    descricao: 'Finalizou, mas com falhas parciais ou varredura incompleta.',
    destaque: true,
    classes: 'bg-error-container text-on-error-container',
  },
  FALHA: {
    rotulo: 'Falha',
    descricao: 'Rotina interrompida por erro.',
    destaque: true,
    classes: 'bg-error text-on-error',
  },
};

/** Cobertura declarada pela rotina */
export const COBERTURAS = {
  FULL: 'Completa',
  PARTIAL: 'Parcial',
  NA: 'Não se aplica',
};

/**
 * Nomes amigáveis das medidas registradas em `antes` / `depois`.
 * A chave é a mesma que aparece no JSON do endpoint.
 */
export const MEDIDAS = {
  countries: 'Países',
  states: 'Estados',
  periodical_magazines: 'Periódicos',
  researchers: 'Pesquisadores',
  bibliographic_productions: 'Produções bibliográficas',
  foment_rows: 'Registros de fomento',
  articles_with_qualis: 'Artigos com Qualis',
  graduate_programs: 'Programas de pós-graduação',
  graduate_program_researchers: 'Pesquisadores dos programas',
  graduate_program_students: 'Estudantes dos programas',
  graduate_program_research_lines: 'Linhas de pesquisa',
  researcher_productions: 'Produções consolidadas',
  research_groups: 'Grupos de pesquisa',
  researcher_ind_prod: 'Indicadores de pesquisadores',
  graduate_program_ind_prod: 'Indicadores de pós-graduação',
  research_group_ind_prod: 'Indicadores de grupos',
  search_dictionary: 'Termos do dicionário',
  lattes_ids_filter_count: 'Currículos no filtro',
  unseen_pending_articles: 'Artigos pendentes (OpenAlex)',
  unseen_pending_researchers: 'Pesquisadores pendentes (OpenAlex)',
};

/** Quantidade de registros por página no histórico */
export const TAMANHO_PAGINA = 25;

/** Intervalo de atualização automática da tela (2 minutos) */
export const INTERVALO_ATUALIZACAO = 1000 * 60 * 2;
