// src/constants/home-links.ts

export const platformModules = [
  { to: '/simcc', title: 'Mapeamento de Competências', linkText: 'ACESSAR PAINEL' },
  { to: '/indicadores', title: 'Indicadores Institucionais', linkText: 'ACESSAR PAINEL' },
  { to: '/vip', title: 'Vitrine de Infraestrutura', linkText: 'ACESSAR PAINEL' },
  { to: '/pos-graduacao', title: 'Programas de Pós-Graduação', linkText: 'ACESSAR PAINEL' },
  { to: '/producao-tecnica', title: 'Produção Técnica e Inovação', linkText: 'ACESSAR PAINEL' },
  { to: '/grupos-pesquisa', title: 'Grupos de Pesquisa', linkText: 'ACESSAR PAINEL' },
  { to: '/incite', title: 'Institutos de C&T&I', linkText: 'ACESSAR PAINEL' },
  { to: '/bolsistas', title: 'Bolsistas de Produtividade', linkText: 'ACESSAR PAINEL' },
  { to: '/busca-ia', title: 'Busca por IA', linkText: 'ACESSAR PAINEL' },
  { to: '/clube-ciencia', title: 'Clube de Ciência', linkText: 'ACESSAR PAINEL' },
  { to: '/dicionario', title: 'Dicionário CTI', linkText: 'CONSULTAR TERMOS' },
  { to: '/producao-cientifica', title: 'Produção Científica', linkText: 'ANALISAR GRÁFICOS' },
];

export const quickAccessLinks = [
  { to: 'https://observatoriocti.secti.ba.gov.br/indicadores', title: 'Indicadores' },
  { to: 'https://observatoriocti.secti.ba.gov.br/grupos-pesquisa', title: 'Grupos de Pesquisa' },
  { to: 'https://observatoriocti.secti.ba.gov.br/listagens?tab=bolsistas', title: 'Bolsistas' },
];

// FIOCRUZ adicionada com o ID 11
export const instituicoes = [
  { id: 1, sigla: 'UFBA', nome: 'Universidade Federal da Bahia', categoria: 'Federais' },
  { id: 2, sigla: 'EBMSP', nome: 'Escola Bahiana de Medicina e Saúde Pública', categoria: 'Privadas' },
  { id: 3, sigla: 'UESB', nome: 'Universidade Estadual do Sudoeste da Bahia', categoria: 'Estaduais' },
  { id: 4, sigla: 'UFOB', nome: 'Universidade Federal do Oeste da Bahia', categoria: 'Federais' },
  { id: 5, sigla: 'UFSB', nome: 'Universidade Federal do Sul da Bahia', categoria: 'Federais' },
  { id: 6, sigla: 'UEFS', nome: 'Universidade Estadual de Feira de Santana', categoria: 'Estaduais' },
  { id: 7, sigla: 'UESC', nome: 'Universidade Estadual de Santa Cruz', categoria: 'Estaduais' },
  { id: 8, sigla: 'UFRB', nome: 'Universidade Federal do Recôncavo da Bahia', categoria: 'Federais' },
  { id: 9, sigla: 'UNEB', nome: 'Universidade do Estado da Bahia', categoria: 'Estaduais' },
  { id: 10, sigla: 'IFBA', nome: 'Instituto Federal da Bahia', categoria: 'Institutos' },
  { id: 11, sigla: 'FIOCRUZ', nome: 'Fundação Oswaldo Cruz', categoria: 'Institutos' },
];

export const categoriasAbas = [
  { value: 'Todas' },
  { value: 'Federais' },
  { value: 'Estaduais' },
  { value: 'Institutos' },
  { value: 'Privadas' },
];

export const filtrarInstituicoes = (categoriaAba: string) => {
  if (categoriaAba === 'Todas') return instituicoes;
  return instituicoes.filter((inst) => inst.categoria === categoriaAba);
};

export const heroCTA = { to: '/sobre' };
export const instituicoesVerTodas = { to: '/instituicoes' };
export const videosCTA = { to: '/videos' };
export const dadosVerTodos = { to: '/dados' };