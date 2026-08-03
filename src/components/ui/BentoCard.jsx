import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BentoCard({ module }) {
  const {
    title,
    description,
    actionText,
    icon,
    gridClass,
    isLarge,
    isMain,
    tag,
    link,
  } = module;

  return (
    <div
      className={cn(
        'bento-card bg-surface-white border border-steel-blue/40 rounded-[12px] relative overflow-hidden group cursor-pointer flex flex-col justify-between transition-all duration-300',
        isLarge ? 'p-6 lg:p-8' : 'p-4 lg:p-5',
        isMain && 'border-steel-blue shadow-sm hover:border-primary',
        gridClass
      )}
      onClick={() => {
        if (link) {
          if (link.startsWith('#')) {
            const el = document.querySelector(link);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.open(link, '_blank');
          }
        }
      }}
    >
      {/* 4px vertical accent line on left (from DESIGN.md) */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1 transition-colors duration-200",
        isMain ? "bg-primary" : "bg-steel-blue group-hover:bg-primary"
      )} />

      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "rounded-full bg-surface-container flex items-center justify-center text-primary-container shrink-0 transition-transform group-hover:scale-105",
              isLarge ? "w-12 h-12" : "w-9 h-9"
            )}
          >
            <span className={cn("material-symbols-outlined", isLarge ? "text-[26px]" : "text-[20px]")}>
              {icon}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <h3
              className={cn(
                "font-display text-navy-deep font-bold leading-tight group-hover:text-primary transition-colors",
                isLarge ? "text-xl md:text-2xl" : "text-base md:text-lg"
              )}
            >
              {title}
            </h3>

            {tag && (
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-primary-fixed text-on-primary-fixed rounded-full shadow-xs">
                {tag}
              </span>
            )}
          </div>
        </div>

        {isLarge && (
          <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-xl">
            open_in_new
          </span>
        )}
      </div>

      {/* Content & Action */}
      <div className={cn("mt-4 flex flex-col justify-between", isLarge && "flex-grow")}>
        <p
          className={cn(
            "text-on-surface-variant font-normal leading-relaxed",
            isLarge ? "text-base" : "text-sm"
          )}
        >
          {description}
        </p>

        <div className="bento-content">
          <button
            type="button"
            className="mt-3 text-xs font-semibold text-primary-container uppercase tracking-wider flex items-center gap-1 hover:text-navy-deep transition-colors"
          >
            <span>{actionText}</span>
            <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
              arrow_right_alt
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
