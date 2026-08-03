import React from 'react';
import { cn } from '@/lib/utils';

export function InstitutionCard({ institution }) {
  const { acronym, fullName, gridClass, isDisplayFont } = institution;

  return (
    <div
      className={cn(
        'bento-card bg-surface border border-steel-blue/40 rounded-[12px] p-4 md:p-6 flex items-center justify-center hover:bg-surface-white hover:border-steel-blue transition-all cursor-pointer group',
        gridClass
      )}
    >
      <div className="text-center flex flex-col items-center justify-center">
        <h3
          className={cn(
            'text-navy-deep font-bold group-hover:text-primary transition-colors',
            isDisplayFont ? 'font-display text-3xl md:text-4xl' : 'font-display text-xl md:text-2xl'
          )}
        >
          {acronym}
        </h3>

        {fullName && (
          <p className="font-label-sm text-xs text-on-surface-variant mt-1 max-w-[220px]">
            {fullName}
          </p>
        )}
      </div>
    </div>
  );
}
