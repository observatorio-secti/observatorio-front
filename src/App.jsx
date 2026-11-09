// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import InitialHome from './components/InitialHome';
import AuthCallback from './pages/AuthCallback';
import VerificacaoConsistencia from './pages/VerificacaoConsistencia';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos padrão
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<InitialHome />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/verificacao-consistencia" element={<VerificacaoConsistencia />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
