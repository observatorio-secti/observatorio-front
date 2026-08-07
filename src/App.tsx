import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InitialHome from './components/InitialHome';
// importe as outras páginas dos módulos aqui se já tiver criado

export default function App() {
  return (
    <Router>
      <Routes>
        {/* A sua nova Home completa fica na rota raiz */}
        <Route path="/" element={<InitialHome />} />
        
        {/* Rotas dos módulos que os cards redirecionam */}
        <Route path="/resultados" element={<div>Página de Resultados / Mapeamento</div>} />
        <Route path="/indicadores" element={<div>Página de Indicadores</div>} />
        <Route path="/pos-graduacao" element={<div>Página de Pós-Graduação</div>} />
        <Route path="/producoes-recentes" element={<div>Página de Produções</div>} />
        <Route path="/grupos-pesquisa" element={<div>Página de Grupos de Pesquisa</div>} />
        <Route path="/incites" element={<div>Página de INCITES</div>} />
        <Route path="/indice-pesquisador" element={<div>Página de Bolsistas</div>} />
        <Route path="/paines-dados-externos" element={<div>Página de Vitrine de Infraestrutura</div>} />
        <Route path="/instituicao/:id" element={<div>Página Detalhe da Instituição</div>} />
      </Routes>
    </Router>
  );
}