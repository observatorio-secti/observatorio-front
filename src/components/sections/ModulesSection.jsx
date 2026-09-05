import { modulesData } from '@/data/modulesData';
import { BentoCard } from '@/components/ui/BentoCard';

export function ModulesSection() {
  return (
    <section
      id="modulos"
      className="scroll-mt-16 w-full bg-surface-container-lowest py-12 border-t border-outline-variant min-h-screen"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="font-display text-2xl md:text-3xl text-navy-deep font-bold tracking-tight">
            Módulos da Plataforma
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant">
            Explore o ecossistema integrado de informações científicas.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">
          {modulesData.map((module) => (
            <BentoCard key={module.id} module={module} />
          ))}
        </div>
      </div>
    </section>
  );
}
