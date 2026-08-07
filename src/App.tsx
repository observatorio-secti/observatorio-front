import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import InitialHome from './components/InitialHome';

// Mantivemos o teste da Instituição apenas se você for construir essa página aqui!
function InstituicaoTeste() {
  const [searchParams] = useSearchParams();
  const institutionId = searchParams.get('institution_id');

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Página da Instituição</h1>
      <p style={{ fontSize: '20px', marginTop: '20px' }}>ID: <strong style={{ color: 'blue' }}>{institutionId}</strong></p>
      <br />
      <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>← Voltar para a Home</a>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* A sua Home principal */}
        <Route path="/" element={<InitialHome />} />
        
        {/* Rota para o detalhe da Instituição */}
        <Route path="/instituicao" element={<InstituicaoTeste />} />
      </Routes>
    </Router>
  );
}