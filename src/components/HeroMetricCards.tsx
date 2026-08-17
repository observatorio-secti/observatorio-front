import type { HomeQuantData } from '../types/home';

interface HeroMetricCardsProps {
  data?: HomeQuantData | null;
  loading?: boolean;
}

export function HeroMetricCards({ data, loading = false }: HeroMetricCardsProps) {
  // Skeleton quando carregando
  if (loading || !data) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-end mt-8 lg:mt-0">
        <div className="w-full sm:w-[190px] h-40 bg-slate-100 animate-pulse rounded-[20px] shadow-sm"></div>
        <div className="w-full sm:w-[190px] h-40 bg-slate-100 animate-pulse rounded-[20px] shadow-sm"></div>
        <div className="w-full sm:w-[190px] h-40 bg-slate-100 animate-pulse rounded-[20px] shadow-sm"></div>
      </div>
    );
  }

  const totalProducoes = data.visaoPrograma
    ? (data.visaoPrograma.article || 0) +
      (data.visaoPrograma.book || 0) +
      (data.visaoPrograma.book_chapter || 0) +
      (data.visaoPrograma.work_in_event || 0) +
      (data.visaoPrograma.patent || 0) +
      (data.visaoPrograma.software || 0) +
      (data.visaoPrograma.brand || 0)
    : 0;

  const totalPesquisadores = data.visaoPrograma ? (data.visaoPrograma.researcher || 0) : 0;

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-end mt-8 lg:mt-0">
      {/* Card 1: Instituições */}
      <div className="bg-white/90 backdrop-blur-md border border-blue-50 p-6 rounded-[20px] flex flex-col items-center justify-center min-w-[190px] flex-1 sm:flex-none shadow-2xl shadow-blue-900/5 transition-transform duration-300 hover:scale-105 hover:border-blue-200">
        <span className="material-symbols-outlined text-[36px] mb-2 text-blue-600">account_balance</span>
        <h4 className="text-3xl font-extrabold mb-3 text-[#0f4c64]">11</h4>

        <div className="relative group flex items-center justify-center w-full">
          <button
            onClick={() => {
              const element = document.getElementById('instituicoes');
              if (element) {
                const y = element.getBoundingClientRect().top + window.scrollY - 64;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }}
            className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-xl text-[11px] font-bold transition-colors shadow-md flex items-center gap-1.5 hover:-translate-y-1 duration-300 text-center"
          >
            Instituições Integradas
            <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-y-1">arrow_downward</span>
          </button>

          <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-[200px] bg-slate-800 text-white text-xs rounded-lg py-2 px-3 text-center z-50 shadow-lg font-normal">
            Universidades, Institutos Federais e Centros de Pesquisa parceiros.
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
          </div>
        </div>
      </div>

      {/* Card 2 (MEIO): Pesquisadores Ativos */}
      <div className="bg-white/90 backdrop-blur-md border border-blue-50 p-6 rounded-[20px] flex flex-col items-center justify-center min-w-[190px] flex-1 sm:flex-none shadow-2xl shadow-blue-900/5 transition-transform duration-300 hover:scale-105 hover:border-blue-200">
        <span className="material-symbols-outlined text-[36px] mb-2 text-blue-600">person_search</span>
        <h4 className="text-3xl font-extrabold mb-1 text-[#0f4c64]">{totalPesquisadores.toLocaleString('pt-BR')}</h4>

        <div className="relative group flex items-center justify-center gap-1 mt-1 cursor-help">
          <p className="text-xs text-slate-500 font-bold text-center leading-tight">Pesquisadores <br />Ativos</p>
          <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:text-blue-600 transition-colors">info</span>

          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-[200px] bg-slate-800 text-white text-xs rounded-lg py-2 px-3 text-center z-50 shadow-lg font-normal">
            Profissionais com base no currículo Lattes vinculado.
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
          </div>
        </div>
      </div>

      {/* Card 3: Produções Cadastradas */}
      <div className="bg-white/90 backdrop-blur-md border border-blue-50 p-6 rounded-[20px] flex flex-col items-center justify-center min-w-[190px] flex-1 sm:flex-none shadow-2xl shadow-blue-900/5 transition-transform duration-300 hover:scale-105 hover:border-blue-200">
        <span className="material-symbols-outlined text-[36px] mb-2 text-blue-600">science</span>
        <h4 className="text-3xl font-extrabold mb-1 text-[#0f4c64]">{totalProducoes.toLocaleString('pt-BR')}</h4>

        <div className="relative group flex items-center justify-center gap-1 mt-1 cursor-help">
          <p className="text-xs text-slate-500 font-bold text-center leading-tight">Produções <br />Cadastradas</p>
          <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:text-blue-600 transition-colors">info</span>

          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-[220px] bg-slate-800 text-white text-xs rounded-lg py-2 px-3 text-center z-50 shadow-lg font-normal">
            Soma total absoluta contemplando: artigos, livros, capítulos, trabalhos em eventos, patentes, softwares e marcas.
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroMetricCards;
