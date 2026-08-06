import React, { useEffect, useState, useRef } from 'react';
import { GraduationCap, MapPin } from 'lucide-react';

interface Bolsista {
  modality_code: string;
}

interface Researcher {
  id: string;
  name: string;
  university: string;
  area: string;
  city: string;
  graduation: string;
  subsidy?: Bolsista[];
}

export interface FeaturedResearchersProps {
  apiBaseUrl: string;
  maxItems?: number;
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
}

export default function FeaturedResearchers({
  apiBaseUrl,
  maxItems = 40,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
}: FeaturedResearchersProps) {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResearchers = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}outstanding_researchers`);
        if (!response.ok) throw new Error('Falha ao buscar pesquisadores.');
        
        const data: Researcher[] = await response.json();
        
        // Embaralha o array e pega os primeiros maxItems
        const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, maxItems);
        setResearchers(shuffled);
      } catch (err) {
        setError('Não foi possível carregar os pesquisadores no momento.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (apiBaseUrl) {
      fetchResearchers();
    }
  }, [apiBaseUrl, maxItems]);

  // Configuração da velocidade da animação CSS
  const getSpeedDuration = () => {
    switch (speed) {
      case 'fast': return '20s';
      case 'slow': return '60s';
      default: return '40s';
    }
  };

  const animationDuration = getSpeedDuration();
  const animationDirection = direction === 'left' ? 'forwards' : 'reverse';

  // Fallback se erro de imagem
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
    e.currentTarget.parentElement!.classList.add('bg-slate-800'); // Fundo escuro alternativo
  };

  return (
    <section className="w-full bg-[#F8FAFC] py-16 border-t border-gray-200 overflow-hidden">
      
      {/* Estilos injetados para o carrossel infinito */}
      <style>
        {`
          .scroller-inner {
            display: flex;
            gap: 1.5rem;
            width: max-content;
            animation: scroll ${animationDuration} linear infinite ${animationDirection};
          }
          ${pauseOnHover ? `
          .scroller-container:hover .scroller-inner {
            animation-play-state: paused;
          }
          ` : ''}
          @keyframes scroll {
            to {
              transform: translate(calc(-50% - 0.75rem));
            }
          }
        `}
      </style>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row min-h-[400px] rounded-3xl overflow-hidden shadow-sm border border-gray-200 bg-white">
        
        {/* Lado Esquerdo: Textos e Identidade (1/3) */}
        <div className="w-full lg:w-1/3 bg-blue-800 p-8 md:p-12 flex relative overflow-hidden">
          {/* Barra vermelha lateral + linha branca */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-600"></div>
          <div className="absolute left-2 top-0 bottom-0 w-[1px] bg-white/30"></div>
          
          <div className="flex flex-col justify-center z-10 w-full pl-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">
              Pesquisadores em <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">Destaque</span>
            </h2>
            <p className="text-blue-100 text-sm md:text-base leading-relaxed opacity-90">
              Conheça os profissionais que estão impulsionando a ciência, tecnologia e inovação no estado, reconhecidos por sua produtividade e impacto acadêmico.
            </p>
          </div>
          
          {/* Elemento de background sutil */}
          <div className="absolute right-[-10%] bottom-[-10%] opacity-10 pointer-events-none">
             <span className="material-symbols-outlined text-[200px] text-white">workspace_premium</span>
          </div>
        </div>

        {/* Lado Direito: Carrossel (2/3) */}
        <div className="w-full lg:w-2/3 py-8 pl-8 md:pl-12 flex items-center overflow-hidden bg-slate-900 scroller-container relative">
          
          {/* Efeito de fade nas bordas do carrossel */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none hidden lg:block"></div>
          
          {loading ? (
            <div className="flex items-center gap-4 text-slate-400">
              <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
              <p>Carregando destaques...</p>
            </div>
          ) : error ? (
            <div className="text-red-400 font-medium px-4">{error}</div>
          ) : researchers.length === 0 ? (
            <div className="text-slate-400 font-medium px-4">Nenhum pesquisador em destaque no momento.</div>
          ) : (
            <div className="scroller w-full overflow-hidden mask-image-linear-gradient" ref={scrollerRef}>
              <div className="scroller-inner">
                {/* Duplicamos a lista para criar a ilusão de rolagem infinita */}
                {[...researchers, ...researchers].map((researcher, index) => {
                  
                  const isDT = researcher.subsidy?.[0]?.modality_code === 'DT';
                  const badgeText = isDT ? 'DT' : 'PQ';
                  const badgeColor = isDT ? 'bg-orange-500' : 'bg-blue-600';
                  const areas = researcher.area ? researcher.area.split(';').slice(0, 2) : [];

                  return (
                    <div 
                      key={`${researcher.id}-${index}`} 
                      className="w-[260px] h-[360px] flex-shrink-0 relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10"
                      // TODO: Adicionar navegação para o perfil do pesquisador ao clicar
                      // onClick={() => navigate(`/pesquisador/${researcher.id}`)}
                    >
                      {/* Foto de Fundo */}
                      <img 
                        src={`${apiBaseUrl}ResearcherData/Image?researcher_id=${researcher.id}`} 
                        alt={researcher.name}
                        onError={handleImageError}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Overlay Gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-colors duration-300 group-hover:from-black group-hover:via-black/60"></div>
                      
                      {/* Badge PQ/DT */}
                      {(researcher.subsidy && researcher.subsidy.length > 0) && (
                        <div className={`absolute top-4 right-4 ${badgeColor} text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg`}>
                          Bolsista {badgeText}
                        </div>
                      )}

                      {/* Informações (Rodapé do Card) */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2 transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                        <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                          {researcher.name}
                        </h3>
                        
                        <div className="flex flex-col gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-2 text-gray-300 text-xs">
                            <GraduationCap size={14} />
                            <span className="truncate">{researcher.graduation}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-300 text-xs">
                            <MapPin size={14} />
                            <span className="truncate">{researcher.university} • {researcher.city}</span>
                          </div>
                        </div>

                        {/* Áreas de Atuação */}
                        {areas.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                            {areas.map((area, idx) => (
                              <span key={idx} className="bg-white/20 backdrop-blur-sm text-white text-[9px] px-2 py-1 rounded-full uppercase tracking-wider font-medium truncate max-w-full">
                                {area.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}