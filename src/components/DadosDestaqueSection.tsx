import type { HomeQuantData } from '../types/home';

interface DadosDestaqueSectionProps {
  data?: HomeQuantData | null;
  loading?: boolean;
}

export function DadosDestaqueSection({ data, loading = false }: DadosDestaqueSectionProps) {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 bg-slate-100 animate-pulse rounded-[20px]"></div>
        ))}
      </div>
    );
  }

  const vp = data.visaoPrograma;

  const metrics = [
    {
      label: 'Instituições',
      value: '11',
      icon: 'account_balance',
      tooltip: 'Total de instituições de ensino e pesquisa mapeadas.',
    },
    {
      label: 'Produções',
      value: vp ? (vp.article + vp.book + vp.book_chapter).toLocaleString('pt-BR') : '0',
      icon: 'article',
      tooltip: 'Soma restrita apenas a: Artigos, Livros e Capítulos de Livros (exclui eventos).',
    },
    {
      label: 'Livros Registrados',
      value: vp ? vp.book.toLocaleString('pt-BR') : '0',
      icon: 'menu_book',
      tooltip: 'Total de livros e obras completas cadastradas.',
    },
    {
      label: 'Pesquisadores Ativos',
      value: vp ? vp.researcher.toLocaleString('pt-BR') : '0',
      icon: 'person_search',
      tooltip: 'Profissionais com base no currículo Lattes vinculado.',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="bg-white rounded-[20px] p-6 border-t-4 border-red-600 shadow-sm border-l border-r border-b border-gray-100 flex items-center gap-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-blue-700 text-[28px]">{m.icon}</span>
          </div>

          <div className="flex flex-col relative group">
            <h4 className="text-2xl font-extrabold text-[#0f4c64] leading-tight">{m.value}</h4>

            <div className="flex items-center gap-1 mt-0.5 cursor-help w-max">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide text-[10px]">{m.label}</p>
              <span className="material-symbols-outlined text-[14px] text-slate-300 group-hover:text-blue-600 transition-colors">info</span>
            </div>

            <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-[180px] bg-slate-800 text-white text-[11px] rounded py-1.5 px-2.5 z-50 shadow-lg normal-case font-normal tracking-normal leading-tight">
              {m.tooltip}
              <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DadosDestaqueSection;
