import React, { useState, useEffect } from 'react';

// --- TIPAGENS ---
export interface VisaoPrograma {
  article: number;
  book: number;
  book_chapter: number;
  brand: number;
  patent: number;
  researcher: number;
  software: number;
  work_in_event: number;
}

export interface RtData {
  teachers: { count: number; rt: string }[];
  technician: { count: number; rt: string }[];
}

export interface ScholarshipMetrics {
  modality_code: string;
  category_level_code: string;
  count: number;
}

export interface HomeQuantData {
  visaoPrograma: VisaoPrograma | null;
  rtData: RtData | null;
  scholarships: ScholarshipMetrics[] | null;
}

// --- HOOK PRINCIPAL ---
export function useHomeQuantitativeData(apiBaseUrl: string) {
  const [data, setData] = useState<HomeQuantData>({
    visaoPrograma: null,
    rtData: null,
    scholarships: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiBaseUrl) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [resVisao, resRt, resScholarships] = await Promise.all([
          fetch(`${apiBaseUrl}graduate_program_production?graduate_program_id=0&year=1900`),
          fetch(`${apiBaseUrl}departament/rt`),
          fetch(`${apiBaseUrl}metrics/researcher/scholarship`)
        ]);

        const visaoPrograma = resVisao.ok ? await resVisao.json() : null;
        const rtData = resRt.ok ? await resRt.json() : null;
        const scholarships = resScholarships.ok ? await resScholarships.json() : null;

        const parsedVisao = Array.isArray(visaoPrograma) ? visaoPrograma[0] : visaoPrograma;

        setData({
          visaoPrograma: parsedVisao,
          rtData,
          scholarships,
        });
      } catch (err) {
        setError('Erro ao carregar dados quantitativos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiBaseUrl]);

  return { data, loading, error };
}

// --- COMPONENTES DE EXIBIÇÃO ---

export function HeroMetricCards({ data, loading }: { data: HomeQuantData; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row gap-6 w-full justify-center lg:justify-end mt-8 lg:mt-0">
        <div className="w-full sm:w-[220px] h-40 bg-slate-100 animate-pulse rounded-[20px] shadow-sm"></div>
        <div className="w-full sm:w-[220px] h-40 bg-slate-100 animate-pulse rounded-[20px] shadow-sm"></div>
      </div>
    );
  }

  const totalProducoes = data.visaoPrograma
    ? data.visaoPrograma.article + data.visaoPrograma.book + data.visaoPrograma.book_chapter + data.visaoPrograma.work_in_event
    : 0;

  return (
    <div className="flex flex-col sm:flex-row gap-6 w-full justify-center lg:justify-end mt-8 lg:mt-0">
      
      {/* Card 1: Instituições */}
      <div className="bg-white/90 backdrop-blur-md border border-blue-50 p-6 rounded-[20px] flex flex-col items-center justify-center min-w-[220px] shadow-2xl shadow-blue-900/5 transition-transform duration-300 hover:scale-105 hover:border-blue-200">
        <span className="material-symbols-outlined text-[40px] mb-2 text-blue-600">account_balance</span>
        <h4 className="text-4xl font-extrabold mb-1 text-[#0f4c64]">11</h4>
        
        {/* Tooltip Group */}
        <div className="relative group flex items-center justify-center gap-1 mt-1 cursor-help">
          <p className="text-sm text-slate-500 font-bold text-center">Instituições Integradas</p>
          <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-blue-600 transition-colors">info</span>
          
          {/* Tooltip Box */}
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-[200px] bg-slate-800 text-white text-xs rounded-lg py-2 px-3 text-center z-50 shadow-lg">
            Universidades, Institutos Federais e Centros de Pesquisa parceiros.
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
          </div>
        </div>
      </div>
      
      {/* Card 2: Produções Cadastradas */}
      <div className="bg-white/90 backdrop-blur-md border border-blue-50 p-6 rounded-[20px] flex flex-col items-center justify-center min-w-[220px] shadow-2xl shadow-blue-900/5 transition-transform duration-300 hover:scale-105 hover:border-blue-200">
        <span className="material-symbols-outlined text-[40px] mb-2 text-blue-600">science</span>
        <h4 className="text-4xl font-extrabold mb-1 text-[#0f4c64]">{totalProducoes.toLocaleString('pt-BR')}</h4>
        
        {/* Tooltip Group */}
        <div className="relative group flex items-center justify-center gap-1 mt-1 cursor-help">
          <p className="text-sm text-slate-500 font-bold text-center">Produções Cadastradas</p>
          <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-blue-600 transition-colors">info</span>
          
          {/* Tooltip Box */}
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-[220px] bg-slate-800 text-white text-xs rounded-lg py-2 px-3 text-center z-50 shadow-lg font-normal">
            Soma total absoluta contemplando: artigos, livros, capítulos e trabalhos em eventos.
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
          </div>
        </div>
      </div>

    </div>
  );
}

export function DadosDestaqueSection({ data, loading }: { data: HomeQuantData; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-slate-100 animate-pulse rounded-[20px]"></div>)}
      </div>
    );
  }

  const vp = data.visaoPrograma;
  
  // Array de métricas com os tooltips adicionados
  const metrics = [
    { 
      label: 'Instituições', 
      value: '11', 
      icon: 'account_balance', 
      tooltip: 'Total de instituições de ensino e pesquisa mapeadas.' 
    },
    { 
      label: 'Produções', 
      value: vp ? (vp.article + vp.book + vp.book_chapter).toLocaleString('pt-BR') : '0', 
      icon: 'article', 
      tooltip: 'Soma restrita apenas a: Artigos, Livros e Capítulos de Livros (exclui eventos).' 
    },
    { 
      label: 'Livros Registrados', 
      value: vp ? vp.book.toLocaleString('pt-BR') : '0', 
      icon: 'menu_book', 
      tooltip: 'Total de livros e obras completas cadastradas.' 
    },
    { 
      label: 'Pesquisadores Ativos', 
      value: vp ? vp.researcher.toLocaleString('pt-BR') : '0', 
      icon: 'person_search', 
      tooltip: 'Profissionais com base no currículo Lattes vinculado.' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {metrics.map((m, i) => (
        <div key={i} className="bg-white rounded-[20px] p-6 border-t-4 border-red-600 shadow-sm border-l border-r border-b border-gray-100 flex items-center gap-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
           <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-blue-700 text-[28px]">{m.icon}</span>
           </div>
           
           <div className="flex flex-col relative group">
             <h4 className="text-2xl font-extrabold text-[#0f4c64] leading-tight">{m.value}</h4>
             
             {/* Wrapper para o Label + Ícone de info */}
             <div className="flex items-center gap-1 mt-0.5 cursor-help w-max">
               <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide text-[10px]">{m.label}</p>
               <span className="material-symbols-outlined text-[14px] text-slate-300 group-hover:text-blue-600 transition-colors">info</span>
             </div>
             
             {/* Tooltip Box Flutuante */}
             <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-[180px] bg-slate-800 text-white text-[11px] rounded py-1.5 px-2.5 z-50 shadow-lg normal-case font-normal tracking-normal leading-tight">
                {m.tooltip}
                {/* Setinha apontando pra baixo */}
                <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800"></div>
             </div>
           </div>
        </div>
      ))}
    </div>
  );
}