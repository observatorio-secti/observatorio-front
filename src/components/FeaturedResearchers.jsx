import { useRef } from 'react';
import { GraduationCap, MapPin } from 'lucide-react';
import { useFeaturedResearchers } from '../hooks/useFeaturedResearchers';
import { getResearcherImageUrl } from '../services/researcherService';

export default function FeaturedResearchers({
  apiBaseUrl,
  maxItems = 30,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
}) {
  const { data: researchers = [], isLoading, isError } = useFeaturedResearchers(maxItems);
  const scrollerRef = useRef(null);

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
  const handleImageError = (e) => {
    e.currentTarget.style.display = 'none';
    e.currentTarget.parentElement?.classList.add('bg-slate-800'); // Fundo escuro alternativo
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
        <div className="w-full lg:w-1/3 bg-white p-8 md:p-12 flex relative overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-100">
          {/* Barra com gradiente forte lateral indicando destaque e quebra */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-700 via-blue-600 to-red-600"></div>

          <div className="flex flex-col justify-center z-10 w-full pl-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight mb-4 tracking-tight">
              Ciência <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-red-600">em Movimento</span>
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Pesquisadores da Bahia que atualizaram recentemente seus currículos Lattes. Acompanhe quem está produzindo conhecimento e mantenha um olhar atualizado sobre a ciência, tecnologia e inovação no estado.
            </p>
          </div>

          {/* Elemento de background sutil */}
          <div className="absolute right-[-5%] bottom-[-5%] opacity-[0.03] pointer-events-none">
            <span className="material-symbols-outlined text-[180px] text-blue-900">update</span>
          </div>
        </div>

        {/* Lado Direito: Carrossel (2/3) */}
        <div className="w-full lg:w-2/3 py-8 pl-8 md:pl-12 flex items-center overflow-hidden bg-[#f8f9fb] scroller-container relative">

          {/* Efeito de fade nas bordas do carrossel */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#f8f9fb] to-transparent z-10 pointer-events-none hidden lg:block"></div>

          {isLoading ? (
            <div className="flex items-center gap-4 text-slate-400">
              <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
              <p>Carregando atualizações...</p>
            </div>
          ) : isError ? (
            <div className="text-red-400 font-medium px-4">Não foi possível carregar as atualizações no momento.</div>
          ) : researchers.length === 0 ? (
            <div className="text-slate-400 font-medium px-4">Nenhuma atualização recente no momento.</div>
          ) : (
            <div className="scroller w-full overflow-hidden mask-image-linear-gradient" ref={scrollerRef}>
              <div className="scroller-inner">
                {/* Duplicamos a lista para criar a ilusão de rolagem infinita */}
                {[...researchers, ...researchers].map((researcher, index) => {

                  const isDT = researcher.subsidy?.[0]?.modality_code === 'DT';
                  const badgeText = isDT ? 'DT' : 'PQ';
                  const badgeColor = isDT ? 'bg-orange-500' : 'bg-blue-600';
                  const areas = researcher.area ? researcher.area.split(';').slice(0, 2) : [];

                  const lattesId = researcher.lattes_id || researcher.id;
                  const profileUrl = `https://observatoriocti.secti.ba.gov.br/researcher?lattes_id=${lattesId}`;

                  return (
                    <a
                      key={`${researcher.id}-${index}`}
                      href={profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-[260px] h-[360px] flex-shrink-0 relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10 block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label={`Ver perfil de ${researcher.name} no SIMCC`}
                    >
                      {/* Foto de Fundo */}
                      <img
                        src={getResearcherImageUrl(researcher.id, apiBaseUrl)}
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
                    </a>
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
