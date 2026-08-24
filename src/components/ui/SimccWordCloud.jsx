import { useMemo } from 'react';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';

/**
 * Design Tokens & Palette inspired by DESIGN.md
 * Principal colors: Deep Navy, Principal Interactive Blue, Steel Blue, Strong Blue
 */
const PALETTE = [
  '#024A60', // Deep Navy (Institutional weight)
  '#07677e', // Primary Surface Tint
  '#1D4ED8', // Strong Blue Highlight
  '#37637d', // Secondary Blue
  '#559fb8', // Principal Interactive Blue
  '#2b657c', // Tertiary Blue
  '#719CB8', // Steel Blue
  '#004e60', // On-primary fixed variant
  '#084d63', // On-tertiary fixed variant
  '#1c4b64', // On-secondary fixed variant
];

export function SimccWordCloud({
  words = [],
  isLoading = false,
  isError = false,
  onWordClick,
  className = '',
  height = 280,
}) {
  // Normalize and sort incoming words data
  const formattedWords = useMemo(() => {
    if (!Array.isArray(words) || words.length === 0) return [];

    return words
      .map((item, index) => {
        const text = item.term || item.name || item.word || item.text || '';
        const value = Number(item.among ?? item.weight ?? item.freq ?? item.count ?? item.value ?? 1);

        // Special highlight for regional anchor keyword "Bahia" or top term
        const isBahia = text.trim().toLowerCase() === 'bahia';
        const color = isBahia
          ? '#DC2626' // Bold Red break as specified in DESIGN.md for Bahia / Regional Highlights
          : PALETTE[index % PALETTE.length];

        return {
          text: text.trim(),
          value,
          color,
        };
      })
      .filter((item) => item.text.length > 0 && !isNaN(item.value) && item.value > 0)
      .slice(0, 45); // Top 45 words for optimal clarity and data density
  }, [words]);

  const options = useMemo(
    () => ({
      colors: PALETTE,
      deterministic: true,
      fontFamily: 'Lexend, sans-serif',
      fontSizes: [12, 28],
      fontStyle: 'normal',
      fontWeight: '600',
      padding: 3,
      rotations: 1,
      rotationAngles: [0, 0], // Horizontal orientation ensures optimal academic legibility
      scale: 'sqrt',
      spiral: 'rectangular',
      transitionDuration: 500,
      enableTooltip: true,
      tooltipOptions: {
        allowHTML: true,
        animation: 'scale',
        theme: 'simcc',
        arrow: false,
      },
    }),
    []
  );

  const callbacks = useMemo(
    () => ({
      getWordColor: (word) =>
        word.color || (word.text.toLowerCase() === 'bahia' ? '#DC2626' : PALETTE[0]),
      getWordTooltip: (word) => {
        const formattedWeight = new Intl.NumberFormat('pt-BR').format(word.value);
        const isRegional = word.text.toLowerCase() === 'bahia';

        return `
          <div style="padding: 10px 14px; font-family: Lexend, sans-serif; min-width: 140px; text-align: left; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(2, 74, 96, 0.1);">
            <div style="font-size: 13px; font-weight: 700; color: ${isRegional ? '#DC2626' : '#024A60'}; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between; gap: 6px;">
              <span>${word.text}</span>
              ${isRegional ? '<span style="background: #fee2e2; color: #dc2626; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 9999px;">Destaque</span>' : ''}
            </div>
            <div style="font-size: 12px; color: #3f484c; font-family: Ubuntu, sans-serif; display: flex; align-items: baseline; gap: 4px;">
              <span style="font-size: 14px; font-weight: 700; color: #07677e;">${formattedWeight}</span>
              <span style="color: #6f787d; font-size: 11px;">ocorrências</span>
            </div>
            <div style="font-size: 10px; color: #559fb8; margin-top: 6px; font-weight: 500; border-top: 1px solid #f1f5f9; padding-top: 4px; display: flex; align-items: center; justify-content: space-between;">
              <span>Pesquisar no SIMCC</span>
              <span style="font-size: 12px;">↗</span>
            </div>
          </div>
        `;
      },
      onWordClick: (word) => {
        if (onWordClick && word && word.text) {
          onWordClick(word.text, word);
        }
      },
    }),
    [onWordClick]
  );

  // Loading State
  if (isLoading) {
    return (
      <div
        className={`w-full flex flex-col items-center justify-center gap-3 p-6 text-slate-400 select-none ${className}`}
        style={{ minHeight: `${height}px` }}
      >
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        </div>
        <p className="text-xs font-medium text-slate-500 font-display">Carregando competências...</p>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div
        className={`w-full flex flex-col items-center justify-center gap-2 p-6 text-center select-none ${className}`}
        style={{ minHeight: `${height}px` }}
      >
        <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-error">
          <AlertCircle className="w-5 h-5" />
        </div>
        <p className="text-xs font-medium text-slate-600 font-display">
          Não foi possível carregar a nuvem de palavras.
        </p>
      </div>
    );
  }

  // Empty Data State
  if (!formattedWords || formattedWords.length === 0) {
    return (
      <div
        className={`w-full flex flex-col items-center justify-center gap-2 p-6 text-center text-slate-400 select-none ${className}`}
        style={{ minHeight: `${height}px` }}
      >
        <Sparkles className="w-6 h-6 text-steel-blue/60" />
        <p className="text-xs font-medium text-slate-500 font-display">
          Nenhuma competência encontrada.
        </p>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .tippy-box[data-theme~='simcc'] {
            background-color: transparent !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
          }
          .tippy-box[data-theme~='simcc'] > .tippy-content {
            padding: 0 !important;
          }
          .tippy-box[data-theme~='simcc'] > .tippy-arrow {
            display: none !important;
          }
        `}
      </style>

      <div
        className={`w-full h-full relative flex items-center justify-center select-none ${className}`}
        style={{ height: `${height}px`, minHeight: `${height}px` }}
      >
        <ReactWordcloud
          words={formattedWords}
          options={options}
          callbacks={callbacks}
          minSize={[100, 100]}
        />
      </div>
    </>
  );
}

export default SimccWordCloud;