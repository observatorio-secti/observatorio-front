// src/constants/home-links.js

export const quickAccessLinks = [
  { to: 'https://observatoriocti.secti.ba.gov.br/simcc/grupos-pesquisa/indicadores', title: 'Indicadores' },
  { to: 'https://observatoriocti.secti.ba.gov.br/simcc/grupos-pesquisa/grupos-pesquisa', title: 'Grupos de Pesquisa' },
  { to: 'https://observatoriocti.secti.ba.gov.br/simcc/grupos-pesquisa/listagens?tab=bolsistas', title: 'Bolsistas' },
];

export const instituicoes = [
  { id: 'dc6b3b63-2ada-49cb-bbca-f888ff31d56b', sigla: 'UFBA', nome: 'Universidade Federal da Bahia', categoria: 'Federais' },
  { id: 'id-temp-ebmsp', sigla: 'EBMSP', nome: 'Escola Bahiana de Medicina e Saúde Pública', categoria: 'Privadas' },
  { id: 'id-temp-uesb', sigla: 'UESB', nome: 'Universidade Estadual do Sudoeste da Bahia', categoria: 'Estaduais' },
  { id: 'id-temp-ufob', sigla: 'UFOB', nome: 'Universidade Federal do Oeste da Bahia', categoria: 'Federais' },
  { id: 'id-temp-ufsb', sigla: 'UFSB', nome: 'Universidade Federal do Sul da Bahia', categoria: 'Federais' },
  { id: 'id-temp-uefs', sigla: 'UEFS', nome: 'Universidade Estadual de Feira de Santana', categoria: 'Estaduais' },
  { id: 'id-temp-uesc', sigla: 'UESC', nome: 'Universidade Estadual de Santa Cruz', categoria: 'Estaduais' },
  { id: 'id-temp-ufrb', sigla: 'UFRB', nome: 'Universidade Federal do Recôncavo da Bahia', categoria: 'Federais' },
  { id: 'id-temp-uneb', sigla: 'UNEB', nome: 'Universidade do Estado da Bahia', categoria: 'Estaduais' },
  { id: 'id-temp-ifba', sigla: 'IFBA', nome: 'Instituto Federal da Bahia', categoria: 'Institutos' },
  { id: 'id-temp-fiocruz', sigla: 'FIOCRUZ', nome: 'Fundação Oswaldo Cruz', categoria: 'Institutos' },
];

export const categoriasAbas = [
  { value: 'Todas' },
  { value: 'Federais' },
  { value: 'Estaduais' },
  { value: 'Institutos' },
  { value: 'Privadas' },
];

export const filtrarInstituicoes = (categoriaAba) => {
  if (categoriaAba === 'Todas') return instituicoes;
  return instituicoes.filter((inst) => inst.categoria === categoriaAba);
};

export const heroCTA = { to: '/sobre' };
export const instituicoesVerTodas = { to: 'https://observatoriocti.secti.ba.gov.br/instituicoes' };
export const videosCTA = { to: '/videos' };
export const dadosVerTodos = { to: '/dados' };
