import React from 'react';

export function HeroSection() {
  return (
    <section
      id="sobre"
      className="scroll-mt-16 w-full relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 overflow-hidden"
    >
      {/* Background Image com transparência */}
      <img
        src="/BG-OBSERVATORIO.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40 pointer-events-none select-none"
      />

      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-16 flex flex-col items-center text-center gap-6 relative z-10">
        <h1 className="font-display text-4xl sm:text-5xl md:text-[56px] md:leading-[64px] text-navy-deep font-bold tracking-tight">
          Observatório <br />
          de <span className="bg-primary-container text-surface-white px-3 md:px-4 py-0.5 md:py-1 rounded-lg md:rounded-xl inline-block my-1 shadow-sm">CT&amp;I</span> da Bahia
        </h1>
        <p className="font-sans text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Explore dados integrados sobre produção científica, pesquisadores, instituições e
          inovações no estado da Bahia, apresentados com clareza e precisão.
        </p>
      </div>

      <a
        className="absolute bottom-8 animate-bounce text-primary-container hover:text-navy-deep transition-colors p-2 z-10"
        href="#modulos"
        aria-label="Rolar para os módulos"
      >
        <span className="material-symbols-outlined text-[40px]">expand_more</span>
      </a>
    </section>
  );
}
