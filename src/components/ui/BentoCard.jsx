import React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BentoCard({ module }) {
  const {
    title,
    icon,
    gridClass,
    isLarge,
    isMain,
    tag,
    link,
    status,
  } = module;

  const isInactive = status === 'inactive';

  return (
    <a
      href={isInactive ? undefined : link}
      target={isInactive ? undefined : '_blank'}
      rel={isInactive ? undefined : 'noopener noreferrer'}
      className={cn(
        'bento-card bg-surface-white border border-steel-blue/40 rounded-[12px] relative overflow-hidden group flex flex-col justify-between transition-all duration-300',
        isInactive ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-primary',
        isLarge ? 'p-6 lg:p-8' : 'p-4 lg:p-5',
        isMain && 'border-steel-blue shadow-sm',
        gridClass
      )}
      onClick={(e) => {
        if (isInactive) {
          e.preventDefault();
        }
      }}
    >
      {/* 4px vertical accent line on left (from DESIGN.md) */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1 transition-colors duration-200',
          isInactive
            ? 'bg-outline-variant'
            : isMain
            ? 'bg-primary'
            : 'bg-steel-blue group-hover:bg-primary'
        )}
      />

      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'rounded-full bg-surface-container flex items-center justify-center text-primary-container shrink-0 transition-transform group-hover:scale-105',
              isLarge ? 'w-12 h-12' : 'w-9 h-9'
            )}
          >
            <span
              className={cn(
                'material-symbols-outlined',
                isLarge ? 'text-[26px]' : 'text-[20px]'
              )}
            >
              {icon}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={cn(
                'font-display text-navy-deep font-bold leading-tight group-hover:text-primary transition-colors',
                isLarge ? 'text-xl md:text-2xl' : 'text-base md:text-lg'
              )}
            >
              {title}
            </h3>

            {tag && (
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-primary-fixed text-on-primary-fixed rounded-full shadow-xs">
                {tag}
              </span>
            )}

            {isInactive && (
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-surface-container-high text-outline rounded-full">
                Em breve
              </span>
            )}
          </div>
        </div>

        {!isInactive && (
          <ExternalLink className="w-5 h-5 text-outline-variant group-hover:text-primary transition-colors shrink-0" />
        )}
      </div>
    </a>
  );
}
