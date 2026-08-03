import React, { useState } from 'react';
import { institutionsData } from '@/data/institutionsData';
import { InstitutionCard } from '@/components/ui/InstitutionCard';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { id: 'todas', label: 'Todas' },
  { id: 'federais', label: 'Federais' },
  { id: 'estaduais', label: 'Estaduais' },
  { id: 'institutos', label: 'Institutos' },
  { id: 'privadas', label: 'Privadas' },
];

export function InstitutionsSection() {
  const [activeTab, setActiveTab] = useState('todas');

  const filteredInstitutions = institutionsData.filter(
    (inst) => activeTab === 'todas' || inst.category === activeTab
  );

  return (
    <section
      id="instituicoes"
      className="scroll-mt-16 w-full max-w-[1280px] mx-auto px-4 md:px-16 py-12 flex flex-col gap-8 min-h-screen"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-steel-blue/40 pb-4 gap-4">
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

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((category) => {
          const count =
            category.id === 'todas'
              ? institutionsData.length
              : institutionsData.filter((i) => i.category === category.id).length;

          const isActive = activeTab === category.id;

          return (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-navy-deep text-surface-white shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-navy-deep'
              }`}
            >
              <span>{category.label}</span>
              <span
                className={`px-1.5 py-0.5 text-[11px] rounded-full font-bold ${
                  isActive
                    ? 'bg-primary-container text-surface-white'
                    : 'bg-surface-dim text-on-surface-variant'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Institutions Bento Grid */}
      <div className="bento-grid transition-all duration-300">
        {filteredInstitutions.map((institution) => (
          <InstitutionCard key={institution.id} institution={institution} />
        ))}
      </div>
    </section>
  );
}
