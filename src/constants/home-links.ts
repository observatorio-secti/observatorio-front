// src/constants/home-links.ts

export const quickAccessLinks = [
  { to: 'http://simcc.uesc.br/grupos-pesquisa/indicadores', title: 'Indicadores' },
  { to: 'http://simcc.uesc.br/grupos-pesquisa/grupos-pesquisa', title: 'Grupos de Pesquisa' },
  { to: 'http://simcc.uesc.br/grupos-pesquisa/listagens?tab=bolsistas', title: 'Bolsistas' },
];

export const instituicoes = [
  { id: 'dc6b3b63-2ada-49cb-bbca-f888ff31d56b', sigla: 'UFBA', nome: 'Universidade Federal da Bahia', categoria: 'Federais' },
  { id: 'COLE_O_UUID_AQUI', sigla: 'EBMSP', nome: 'Escola Bahiana de Medicina e Saúde Pública', categoria: 'Privadas' },
  { id: 'COLE_O_UUID_AQUI', sigla: 'UESB', nome: 'Universidade Estadual do Sudoeste da Bahia', categoria: 'Estaduais' },
  { id: 'COLE_O_UUID_AQUI', sigla: 'UFOB', nome: 'Universidade Federal do Oeste da Bahia', categoria: 'Federais' },
  { id: 'COLE_O_UUID_AQUI', sigla: 'UFSB', nome: 'Universidade Federal do Sul da Bahia', categoria: 'Federais' },
  { id: 'COLE_O_UUID_AQUI', sigla: 'UEFS', nome: 'Universidade Estadual de Feira de Santana', categoria: 'Estaduais' },
  { id: 'COLE_O_UUID_AQUI', sigla: 'UESC', nome: 'Universidade Estadual de Santa Cruz', categoria: 'Estaduais' },
  { id: 'COLE_O_UUID_AQUI', sigla: 'UFRB', nome: 'Universidade Federal do Recôncavo da Bahia', categoria: 'Federais' },
  { id: 'COLE_O_UUID_AQUI', sigla: 'UNEB', nome: 'Universidade do Estado da Bahia', categoria: 'Estaduais' },
  { id: 'COLE_O_UUID_AQUI', sigla: 'IFBA', nome: 'Instituto Federal da Bahia', categoria: 'Institutos' },
  { id: 'COLE_O_UUID_AQUI', sigla: 'FIOCRUZ', nome: 'Fundação Oswaldo Cruz', categoria: 'Institutos' },
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
export const instituicoesVerTodas = { to: 'https://observatoriocti.secti.ba.gov.br/instituicoes' };
export const videosCTA = { to: '/videos' };
export const dadosVerTodos = { to: '/dados' };