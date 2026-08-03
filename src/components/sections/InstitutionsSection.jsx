import React from 'react';
import { institutionsData } from '@/data/institutionsData';
import { InstitutionCard } from '@/components/ui/InstitutionCard';
import { ArrowRight } from 'lucide-react';

export function InstitutionsSection() {
  return (
    <section
      id="instituicoes"
      className="scroll-mt-16 w-full max-w-[1280px] mx-auto px-4 md:px-16 py-12 flex flex-col gap-6 min-h-screen"
    >
      {/* Section Header */}
      <div className="flex justify-between items-end border-b border-steel-blue/40 pb-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl md:text-3xl text-navy-deep font-bold tracking-tight">
            Instituições integradas
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant">
            Acesse os dados e produções de cada instituição participante.
          </p>
        </div>

        <a
          className="text-xs md:text-sm font-semibold text-primary-container uppercase tracking-wider hover:text-navy-deep transition-colors flex items-center gap-1 group shrink-0"
          href="#instituicoes"
        >
          <span>Ver todas</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      {/* Institutions Bento Grid */}
      <div className="bento-grid">
        {institutionsData.map((institution) => (
          <InstitutionCard key={institution.id} institution={institution} />
        ))}
      </div>
    </section>
  );
}
