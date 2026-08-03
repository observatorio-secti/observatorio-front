import React from 'react';
import { cn } from '@/lib/utils';

export function InstitutionCard({ institution }) {
  const { acronym, fullName, logo, gridClass } = institution;

  return (
    <div
      className={cn(
        'bento-card bg-surface border border-steel-blue/40 rounded-[12px] p-5 md:p-6 flex flex-col items-center justify-center hover:bg-surface-white hover:border-steel-blue transition-all cursor-pointer group min-h-[140px]',
        gridClass
      )}
    >
      <div className="text-center flex flex-col items-center justify-center w-full h-full gap-3 my-auto">
        {logo ? (
          <img
            src={logo}
            alt={acronym}
            className="max-h-12 md:max-h-16 w-auto max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <h3 className="text-navy-deep font-bold font-display text-2xl md:text-3xl group-hover:text-primary transition-colors">
            {acronym}
          </h3>
        )}

        {fullName && (
          <p className="font-sans text-xs md:text-sm font-medium text-on-surface-variant leading-snug text-center max-w-[240px]">
            {fullName}
          </p>
        )}
      </div>
    </div>
  );
}
