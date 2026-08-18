import React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSimccWordCloud } from '@/hooks/useSimccWordCloud';
import { SimccWordCloud } from '@/components/ui/SimccWordCloud';
import { SimccSearchBar } from '@/components/ui/SimccSearchBar';

export function SimccCard({ module }) {
  const { title, gridClass, isLarge, isMain, tag, link, bgImage, logo } = module;

  // Use custom hook with Tanstack Query & Axios
  const { data: words = [], isLoading, isError } = useSimccWordCloud();

  const handleSimccSearch = (text) => {
    console.log('SIMCC Search:', text);
  };

  const handleWordCloudClick = (term) => {
    if (term && term.trim()) {
      const cleanTerm = term.trim().replace(/[?.,!;:]/g, '');
      const url = `https://observatoriocti.secti.ba.gov.br/simcc/resultados?type_search=article&terms=${encodeURIComponent(cleanTerm)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div
      className={cn(
        'bento-card bg-surface-white border border-steel-blue/40 rounded-[12px] relative overflow-hidden group flex flex-col justify-between transition-all duration-300 p-6 lg:p-8',
        isMain && 'border-steel-blue shadow-sm',
        gridClass
      )}
    >
      {/* Imagem de Fundo com Transparência */}
      {bgImage && (
        <img
          src={bgImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 pointer-events-none select-none group-hover:scale-105 transition-transform duration-500"
        />
      )}

      {/* 4px vertical accent line on left */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary z-10" />

      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 relative z-10 mb-2">
        <div className="flex items-center gap-[14.4px] flex-wrap sm:flex-nowrap">
          {logo ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
              <img
                src={logo}
                alt=""
                className={cn(
                  'object-contain shrink-0 transition-transform hover:scale-105',
                  isLarge ? 'h-9 md:h-11 w-auto max-w-[180px]' : 'h-7 w-auto max-w-[120px]'
                )}
              />
            </a>
          ) : (
            <div className="rounded-full bg-surface-container flex items-center justify-center text-primary-container shrink-0 w-12 h-12">
              <span className="material-symbols-outlined text-[26px]">map</span>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-navy-deep font-bold text-xl md:text-2xl hover:text-primary transition-colors leading-tight"
            >
              {title}
            </a>

            {tag && (
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-primary-fixed text-on-primary-fixed rounded-full shadow-xs">
                {tag}
              </span>
            )}
          </div>
        </div>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 text-outline-variant hover:text-primary transition-colors shrink-0"
          aria-label="Abrir SIMCC em nova aba"
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>

      {/* Highcharts Word Cloud Container (Fixed height 300px to ensure card does not expand infinitely) */}
      <div className="relative z-10 w-full flex-grow flex items-center justify-center my-1">
        <SimccWordCloud words={words} isLoading={isLoading} isError={isError} onWordClick={handleWordCloudClick} />
      </div>

      {/* Bottom Search Bar Trigger & Centered Search Component */}
      <SimccSearchBar onSearch={handleSimccSearch} />
    </div>
  );
}
