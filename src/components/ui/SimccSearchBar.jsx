import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';

const defaultHandleSimccSearch = (text) => {
  console.log('SIMCC Search:', text);
};

const SUGGESTED_TERMS = ['Bahia', 'Educação', 'Análise', 'Ensino', 'Saúde', 'Brasil'];

export function SimccSearchBar({ onSearch = defaultHandleSimccSearch }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCenteredModal, setIsCenteredModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const modalInputRef = useRef(null);

  // Focus modal input when modal opens
  useEffect(() => {
    if (isCenteredModal) {
      const timer = setTimeout(() => {
        modalInputRef.current?.focus();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isCenteredModal]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCenteredModal) {
        setIsCenteredModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCenteredModal]);

  const handleSubmit = (e, customQuery = null) => {
    if (e) e.preventDefault();
    const queryToSearch = customQuery !== null ? customQuery : searchText;
    if (queryToSearch && queryToSearch.trim()) {
      onSearch(queryToSearch.trim());
      setIsCenteredModal(false);
    }
  };

  const handleSelectSuggestion = (term) => {
    setSearchText(term);
    handleSubmit(null, term);
  };

  const modalContent = isCenteredModal ? (
    <div
      className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center bg-navy-deep/60 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={() => setIsCenteredModal(false)}
    >
      <div
        className="w-full max-w-2xl bg-surface-white rounded-2xl shadow-2xl border border-steel-blue/30 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200 mt-12 sm:mt-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container bg-surface-container-lowest/60">
          <div className="flex items-center gap-2.5 text-navy-deep font-display font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-primary-fixed/50 flex items-center justify-center text-primary">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Pesquisar no SIMCC</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCenteredModal(false)}
            className="p-2 rounded-xl text-outline hover:text-navy-deep hover:bg-surface-container transition-colors cursor-pointer"
            aria-label="Fechar busca"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Search Form */}
        <div className="p-6 flex flex-col gap-5">
          <form onSubmit={handleSubmit} className="relative flex items-center w-full">
            <Search className="w-5 h-5 text-primary absolute left-4 pointer-events-none" />
            <input
              ref={modalInputRef}
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Digite um termo, área de estudo ou pesquisador..."
              className="w-full bg-surface-container-lowest border-2 border-primary/20 focus:border-primary rounded-xl pl-12 pr-28 py-3.5 text-base font-sans text-on-surface outline-none transition-all shadow-xs focus:shadow-md"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-primary hover:bg-navy-deep text-on-primary font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Buscar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Suggestions */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Termos populares
            </span>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_TERMS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleSelectSuggestion(term)}
                  className="px-3 py-1.5 text-xs font-medium bg-surface-container hover:bg-primary-fixed/40 hover:text-primary border border-steel-blue/20 rounded-lg text-on-surface-variant transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Bottom section in card */}
      <div
        className="w-full relative z-20 mt-auto pt-2 min-h-[48px] flex flex-col justify-end"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Unexpanded Pill Indicator */}
        <div
          className={`w-full flex items-center justify-center transition-all duration-300 ${
            isHovered
              ? 'opacity-0 scale-95 pointer-events-none absolute bottom-0 inset-x-0'
              : 'opacity-100 scale-100 pointer-events-auto'
          }`}
          onClick={() => setIsCenteredModal(true)}
        >
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-surface-container/60 hover:bg-surface-container border border-steel-blue/20 text-navy-deep text-xs font-semibold transition-all cursor-pointer shadow-xs group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
              <span>Pesquisar competências...</span>
            </div>
            <div className="flex items-center text-primary-container">
              <ChevronUp className="w-3.5 h-3.5 animate-bounce" />
            </div>
          </button>
        </div>

        {/* Sliding Search Bar on Hover */}
        <div
          className={`w-full transition-all duration-300 transform ${
            isHovered
              ? 'translate-y-0 opacity-100 pointer-events-auto relative'
              : 'translate-y-2 opacity-0 pointer-events-none absolute bottom-0 left-0 right-0'
          }`}
        >
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center w-full bg-surface-white border border-primary/40 focus-within:border-primary rounded-xl shadow-md transition-all overflow-hidden"
          >
            <Search className="w-4 h-4 text-primary absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => setIsCenteredModal(true)}
              onClick={() => setIsCenteredModal(true)}
              placeholder="Digite para pesquisar no SIMCC..."
              className="w-full bg-transparent border-none outline-none pl-9 pr-20 py-2.5 text-xs text-on-surface placeholder:text-outline font-sans cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setIsCenteredModal(true)}
              className="absolute right-1.5 px-3 py-1 bg-primary hover:bg-navy-deep text-on-primary text-xs font-medium rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>

      {/* Render modal directly on document.body using Portal */}
      {typeof document !== 'undefined' && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
