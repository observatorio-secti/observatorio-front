import { useState } from 'react';
import { institutionsData } from '@/data/institutionsData';
import { InstitutionCard } from '@/components/ui/InstitutionCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Landmark, GraduationCap, Building2, Award, Building } from 'lucide-react';

const CATEGORIES = [
  { id: 'todas', label: 'Todas', icon: Landmark },
  { id: 'federais', label: 'Federais', icon: GraduationCap },
  { id: 'estaduais', label: 'Estaduais', icon: Building2 },
  { id: 'institutos', label: 'Institutos', icon: Award },
  { id: 'privadas', label: 'Privadas', icon: Building },
];

export function InstitutionsSection() {
  const [activeTab, setActiveTab] = useState('todas');

  return (
    <section
      id="instituicoes"
      className="scroll-mt-16 w-full max-w-[1280px] mx-auto px-4 md:px-16 py-12 flex flex-col gap-8 min-h-screen"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-2 gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl md:text-3xl text-navy-deep font-bold tracking-tight">
            Instituições integradas
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant">
            Acesse os dados e produções de cada instituição participante.
          </p>
        </div>
      </div>

      {/* Tabs Design System Component */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col">
        {/* Horizontal ScrollArea for TabsList with Bottom Divider Line */}
        <div className="border-b border-steel-blue/30 dark:border-steel-blue/20 w-full relative">
          <ScrollArea orientation="horizontal" className="w-full pb-0.5">
            <TabsList className="bg-transparent p-0 h-auto flex items-center gap-4 min-w-max">
              {CATEGORIES.map((category) => {
                const IconComponent = category.icon;
                const count =
                  category.id === 'todas'
                    ? institutionsData.length
                    : institutionsData.filter((i) => i.category === category.id).length;

                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="p-0 border-b-2 border-b-transparent pb-3.5 data-[state=active]:border-[#719CB8] data-[state=active]:text-on-surface dark:data-[state=active]:text-white transition-all cursor-pointer m-0"
                  >
                    <Button
                      variant="ghost"
                      className="m-0 h-auto py-1 px-3 flex items-center gap-2 hover:bg-surface-container/60 rounded-lg text-sm font-medium"
                    >
                      <IconComponent className="w-4 h-4 text-primary shrink-0" />
                      <span>{category.label}</span>
                      <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-surface-container-high text-on-surface-variant">
                        {count}
                      </span>
                    </Button>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Tabs Content inside Vertical Scroll Area with px-8 Horizontal Padding */}
        {CATEGORIES.map((category) => {
          const filtered = institutionsData.filter(
            (inst) => category.id === 'todas' || inst.category === category.id
          );

          return (
            <TabsContent key={category.id} value={category.id} className="px-8 py-6 m-0">
              <div className="bento-grid transition-all duration-300">
                {filtered.map((institution) => (
                  <InstitutionCard key={institution.id} institution={institution} />
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
}
