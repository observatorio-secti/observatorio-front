// src/pages/AuthCallback.jsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleAuthCallback } = useAuth();
  const processedRef = React.useRef(false);

  const code = searchParams.get('code');
  const token = searchParams.get('token');
  const error = searchParams.get('error');

  let decodedError = null;
  if (error) {
    try {
      decodedError = decodeURIComponent(error);
    } catch {
      decodedError = error;
    }
  }

  const initialError = error
    ? decodedError || 'Houve um problema durante o processo de autenticação externa.'
    : !code && !token
      ? 'Nenhum código ou token de autorização foi identificado no retorno do provedor.'
      : null;

  const [status, setStatus] = useState(initialError ? 'error' : 'loading');
  const [errorMessage, setErrorMessage] = useState(initialError);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    // Erros de retorno (ou ausência de credenciais) já são exibidos pelo estado inicial.
    if (initialError) return;

    const processLogin = async () => {
      try {
        const redirectUrl = await handleAuthCallback({ code, token });
        setStatus('success');
        const target = redirectUrl && !redirectUrl.includes('/auth/callback') ? redirectUrl : '/';
        // Redireciona com substituição no histórico
        window.location.replace(target);
      } catch (err) {
        console.error('Erro no callback de autenticação:', err);
        setStatus('error');
        setErrorMessage(
          err?.response?.data?.detail ||
            err?.message ||
            'Não foi possível validar as credenciais de acesso recebidas.'
        );
      }
    };

    processLogin();
  }, [code, token, initialError, handleAuthCallback]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#F8FAFC] text-slate-800">
      <div className="w-full max-w-md p-8 bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col items-center text-center space-y-6">
        <div className="flex items-center gap-2">
          <img src="/LOGO.png" alt="Observatório" className="h-10 w-auto object-contain" />
          <img src="/NOME.png" alt="Observatório CT&I" className="h-9 w-auto object-contain" />
        </div>

        {status === 'loading' && (
          <div className="space-y-4 flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-[#024A60] animate-spin" />
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-slate-900">Autenticando...</h2>
              <p className="text-xs text-slate-500">
                Validando suas credenciais com o Observatório IdP.
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 flex flex-col items-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-slate-900">Login realizado!</h2>
              <p className="text-xs text-slate-500">Redirecionando você de volta ao portal...</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 flex flex-col items-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-slate-900">Falha na autenticação</h2>
              <p className="text-xs text-red-600 max-w-xs">{errorMessage}</p>
            </div>
            <button
              onClick={() => navigate('/', { replace: true })}
              className="mt-2 text-xs px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Voltar para a página inicial
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
