// src/components/InitialHome.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { modulesData } from '../data/modulesData';
import { 
  instituicoes,  
  filtrarInstituicoes, 
  instituicoesVerTodas
} from '../constants/home-links';

import FeaturedResearchers from './FeaturedResearchers';
import { useHomeQuantitativeData, HeroMetricCards } from '../hooks/useHomeQuantitativeData';

interface ModuleData {
  id: string;
  title: string;
  link: string;
  icon?: string;
  gridClass: string;
  isLarge?: boolean;
  isMain?: boolean;
  bgImage?: string;
  logo?: string;
  status?: string;
}

// Tipagem e opções para os tipos de produção/busca do SIMCC
export interface SimccSearchType {
  id: string;
  label: string;
  color: string;
  type_search: string;
}

export const SIMCC_SEARCH_TYPES: SimccSearchType[] = [
  { id: 'todos', label: 'Todos os tipos', color: '#94A3B8', type_search: 'article' },
  { id: 'artigos', label: 'Artigos', color: '#3B82F6', type_search: 'article' },
  { id: 'livros', label: 'Livros e capítulos', color: '#EC4899', type_search: 'book' },
  { id: 'patentes', label: 'Patentes', color: '#06B6D4', type_search: 'patent' },
  { id: 'nome', label: 'Nome', color: '#EF4444', type_search: 'name' },
  { id: 'areas', label: 'Áreas', color: '#22C55E', type_search: 'area' },
  { id: 'resumo', label: 'Resumo', color: '#EAB308', type_search: 'abstract' },
  { id: 'eventos', label: 'Participação em eventos', color: '#F97316', type_search: 'speaker' },
];

export default function InitialHome() {
  const navigate = useNavigate();

  // Custom Hook de Dados Quantitativos da Home
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://simcc.uesc.br/v3/api/';
  const { data: quantData, loading: quantLoading } = useHomeQuantitativeData(apiBaseUrl);

  // Estados de UI e Navegação
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('Todas');
  const [activeSection, setActiveSection] = useState('');

  // Estado e handler da busca SIMCC
  const [isSimccModalOpen, setIsSimccModalOpen] = useState(false);
  const [simccSearchQuery, setSimccSearchQuery] = useState('');
  const [selectedSearchType, setSelectedSearchType] = useState<SimccSearchType>(SIMCC_SEARCH_TYPES[0]);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  // Autocompletar da API secondWord
  const [secondWordSuggestions, setSecondWordSuggestions] = useState<Array<{ word: string; freq: number }>>([]);
  const [isSecondWordLoading, setIsSecondWordLoading] = useState(false);

  const handleSubmitSimcc = (term: string, type: SimccSearchType = selectedSearchType) => {
    if (term && term.trim()) {
      const cleanTerm = term.trim().replace(/[?.,!;:]/g, '');
      const url = `https://simcc.uesc.br/resultados?type_search=${type.type_search}&terms=${encodeURIComponent(cleanTerm)}`;
      window.open(url, '_blank');
    }
    setIsSimccModalOpen(false);
    setIsTypeDropdownOpen(false);
  };

  const handleWordCloudClick = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    if (term && term.trim()) {
      const cleanTerm = term.trim().replace(/[?.,!;:]/g, '');
      const url = `https://simcc.uesc.br/resultados?type_search=article&terms=${encodeURIComponent(cleanTerm)}`;
      window.open(url, '_blank');
    }
  };

  // Efeito para buscar autocompletar na API (secondWord) quando > 3 caracteres
  useEffect(() => {
    const query = simccSearchQuery.trim();
    if (query.length > 3) {
      setIsSecondWordLoading(true);
      const controller = new AbortController();
      const timer = setTimeout(() => {
        fetch(`https://simcc.uesc.br/v3/api/secondWord?term=${encodeURIComponent(query)}`, {
          signal: controller.signal
        })
          .then((res) => res.json())
          .then((data: Array<{ word: string; freq: number }>) => {
            if (Array.isArray(data)) {
              // Normalizar palavras e somar frequências repetidas
              const frequencyMap = new Map<string, number>();
              data.forEach((item) => {
                const normalized = item.word ? item.word.replace(/[?.,!;:]/g, '').trim().toLowerCase() : '';
                if (normalized) {
                  frequencyMap.set(normalized, (frequencyMap.get(normalized) || 0) + (item.freq || 1));
                }
              });

              const list = Array.from(frequencyMap.entries())
                .map(([word, freq]) => ({ word, freq }))
                .sort((a, b) => b.freq - a.freq);

              setSecondWordSuggestions(list);
            } else {
              setSecondWordSuggestions([]);
            }
            setIsSecondWordLoading(false);
          })
          .catch((err) => {
            if (err.name !== 'AbortError') {
              setSecondWordSuggestions([]);
              setIsSecondWordLoading(false);
            }
          });
      }, 250);

      return () => {
        clearTimeout(timer);
        controller.abort();
      };
    } else {
      setSecondWordSuggestions([]);
      setIsSecondWordLoading(false);
    }
  }, [simccSearchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSimccModalOpen) {
        setIsSimccModalOpen(false);
        setIsTypeDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSimccModalOpen]);

  // Estados de Acessibilidade
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [isHighContrast, setIsHighContrast] = useState(false);

  const toggleHighContrast = () => setIsHighContrast(!isHighContrast);
  const increaseText = () => setFontSize(prev => (prev < 150 ? prev + 10 : prev));
  const decreaseText = () => setFontSize(prev => (prev > 80 ? prev - 10 : prev));
  const resetText = () => setFontSize(100);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-80px 0px -40% 0px' }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => sections.forEach((sec) => observer.unobserve(sec));
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleModuleClick = (link: string) => {
    if (link.startsWith('http')) {
      window.location.href = link;
    } else {
      navigate(link);
    }
  };

  const filteredInstitutions = filtrarInstituicoes(activeTab);

  return (
    <>
      <style>
        {`
          html { font-size: ${fontSize}%; transition: font-size 0.3s ease; }
          ${isHighContrast ? `
            html { filter: invert(1) hue-rotate(180deg) contrast(1.2) !important; background-color: #000 !important; } 
            img, .a11y-fab, .hero-bg, .bento-bg { filter: invert(1) hue-rotate(180deg) !important; }
            .inst-logo { background-color: #ffffff !important; padding: 10px !important; border-radius: 12px !important; }
          ` : ''}
        `}
      </style>

      <div className="font-body-md text-slate-800 bg-[#F8FAFC] min-h-screen flex flex-col relative transition-colors duration-300">

        {/* TopNavBar */}
        <header className={`bg-white border-b border-gray-200 w-full sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'h-14 shadow-sm' : 'h-16'}`}>
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-700 via-blue-500 to-red-600"></div>
          <div className="flex justify-between items-center w-full px-6 md:px-12 h-full max-w-[1400px] mx-auto mt-[1px]">
            <a className="flex items-center h-full py-0 gap-3" href="#" onClick={(e) => scrollToSection(e, 'sobre')}>
              <img alt="Símbolo Observatório" className="h-10 w-auto object-contain z-10 relative" src="/LOGO.png" />
              <div className={`transition-all duration-500 ease-in-out flex items-center overflow-hidden ${isScrolled ? 'max-w-0 opacity-0 -translate-x-8' : 'max-w-[400px] opacity-100 translate-x-0'}`}>
                <img alt="Nome Observatório" className="h-9 md:h-11 w-auto object-contain" src="/NOME.png" />
              </div>
            </a>
            <nav className="hidden md:flex items-center gap-8 h-full">
              <a href="#sobre" onClick={(e) => scrollToSection(e, 'sobre')} className={`font-medium text-sm h-full flex items-center border-b-[3px] transition-all duration-300 ${activeSection === 'sobre' ? 'text-blue-700 border-blue-700 font-bold' : 'text-slate-500 border-transparent hover:text-blue-700 hover:border-blue-200'}`}>Sobre</a>
              <a href="#modulos" onClick={(e) => scrollToSection(e, 'modulos')} className={`font-medium text-sm h-full flex items-center border-b-[3px] transition-all duration-300 ${activeSection === 'modulos' ? 'text-blue-700 border-blue-700 font-bold' : 'text-slate-500 border-transparent hover:text-blue-700 hover:border-blue-200'}`}>Módulos</a>
              <a href="#instituicoes" onClick={(e) => scrollToSection(e, 'instituicoes')} className={`font-medium text-sm h-full flex items-center border-b-[3px] transition-all duration-300 ${activeSection === 'instituicoes' ? 'text-blue-700 border-blue-700 font-bold' : 'text-slate-500 border-transparent hover:text-blue-700 hover:border-blue-200'}`}>Instituições</a>
            </nav>
            <div className="flex items-center gap-4">
              <button className="md:hidden text-slate-500">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center w-full">

          {/* HERO SECTION */}
          <section id="sobre" className="scroll-mt-16 w-full relative min-h-[calc(100vh-64px)] flex flex-col justify-between items-center overflow-hidden pt-12 pb-8">
            <div className="hero-bg absolute inset-0 pointer-events-none bg-[url('/BG-OBSERVATORIO.png')] bg-no-repeat bg-center bg-cover z-0"></div>

            <div className="my-auto relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col items-start text-left gap-8">
                <h1 className="text-4xl md:text-[56px] md:leading-[64px] text-slate-800 font-extrabold tracking-tight">
                  Observatório <br />
                  de <span className="bg-blue-800 text-white px-5 py-1 rounded-[20px] inline-flex items-center justify-center align-middle -translate-y-1 mx-1 border-b-[3px] border-red-600 shadow-sm">CT&I</span> da <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-red-600">Bahia</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
                  Explore dados integrados sobre produção científica, pesquisadores, institutions e inovações no estado da Bahia, apresentados com clareza e precisão.
                </p>
                
                {/* Botão principal limpo (sem "Sobre o Projeto" e sem "Acesso Rápido") */}
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <button onClick={(e) => scrollToSection(e as any, 'modulos')} className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-md flex items-center gap-2 hover:-translate-y-1 duration-300">
                      Acessar Módulos <span className="material-symbols-outlined transition-transform group-hover:translate-y-1">arrow_downward</span>
                    </button>
                  </div>
                </div>

              </div>
              <HeroMetricCards data={quantData} loading={quantLoading} />
            </div>

            {/* Indicação animada de scroll */}
            <a
              href="#modulos"
              onClick={(e) => scrollToSection(e, 'modulos')}
              className="relative z-10 flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors cursor-pointer group mt-4"
              aria-label="Rolar para explorar os módulos"
            >
              <span className="material-symbols-outlined text-[36px] animate-bounce">keyboard_arrow_down</span>
            </a>
          </section>

          <section id="modulos" className="scroll-mt-16 w-full py-24 border-t border-gray-200/60 bg-white">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <div className="flex flex-col gap-2 mb-12">
                <h2 className="text-3xl text-slate-800 font-bold tracking-tight">
                  Módulos da Plataforma
                </h2>
                <p className="text-base text-slate-500">
                  Explore o ecossistema integrado de informações científicas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto md:auto-rows-[240px]">
                {(modulesData as ModuleData[]).map((module) => {

                  // 1. O CARD MAIOR DO MAPEAMENTO (Nuvem de palavras)
                  if (module.id === 'simcc-mapeamento') {
                    return (
                      <div key={module.id} onClick={() => handleModuleClick(module.link)} className={`${module.gridClass} bg-white rounded-[20px] p-8 border-2 border-blue-100 shadow-sm flex flex-col relative group hover:shadow-xl hover:border-blue-600 transition-all duration-500 hover:-translate-y-1.5 cursor-pointer overflow-hidden`}>
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-700 via-blue-600 to-red-600 opacity-90 group-hover:opacity-100 group-hover:w-2 transition-all duration-300 z-20"></div>

                        <div className="bento-bg absolute inset-0 opacity-15 pointer-events-none bg-[url('/BG-SIMCC.png')] bg-no-repeat bg-right-bottom bg-contain z-0 transition-transform duration-700 ease-in-out group-hover:scale-[1.08] group-hover:-translate-x-2 group-hover:-translate-y-2"></div>

                        <span className="material-symbols-outlined absolute top-6 right-6 text-gray-300 group-hover:text-blue-600 transition-colors z-20 text-[20px]">open_in_new</span>

                        <div className="flex items-center gap-4 mb-2 z-10 pl-2">
                          {module.logo && <img src={module.logo} alt="SIMCC" className="h-10 w-auto" />}
                          <div>
                            <h3 className="text-[22px] font-bold text-[#0f4c64] leading-tight" dangerouslySetInnerHTML={{ __html: module.title.replace(' de ', ' de<br/>') }}></h3>
                            <span className="text-[11px] font-semibold text-slate-400 tracking-wide block mt-0.5">
                              Principais palavras chave da plataforma
                            </span>
                          </div>
                        </div>

                        {/* NUVEM DE PALAVRAS COM CLIQUE DIRETO PARA BUSCA EM ARTIGOS */}
                        <div className="flex-grow relative w-full h-full min-h-[160px] select-none z-10 overflow-hidden font-sans">

                          {/* Centro */}
                          <div
                            onClick={(e) => handleWordCloudClick(e, 'Bahia')}
                            className="absolute top-[48%] left-[46%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                            title="Buscar artigos sobre Bahia"
                          >
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-red-600 font-extrabold text-[52px] leading-none tracking-tight">Bahia</span>
                          </div>

                          {/* Palavras próximas ao centro */}
                          <span onClick={(e) => handleWordCloudClick(e, 'Brasil')} className="absolute top-[26%] left-[27%] text-[#0f4c64] font-bold text-xl cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Brasil">Brasil</span>
                          <span onClick={(e) => handleWordCloudClick(e, 'Estudo')} className="absolute top-[30%] left-[38%] text-slate-400 font-bold text-base cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Estudo">Estudo</span>
                          <span onClick={(e) => handleWordCloudClick(e, 'Avaliação')} className="absolute top-[20%] right-[30%] text-[#0f4c64] font-bold text-xl -rotate-90 cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Avaliação">Avaliacao</span>
                          <span onClick={(e) => handleWordCloudClick(e, 'Educação')} className="absolute top-[24%] right-[20%] text-[#0f4c64] font-extrabold text-3xl -rotate-90 cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Educação">Educacao</span>
                          <span onClick={(e) => handleWordCloudClick(e, 'Análise')} className="absolute bottom-[30%] left-[42%] text-[#0f4c64] font-bold text-3xl cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Análise">Analise</span>
                          <span onClick={(e) => handleWordCloudClick(e, 'Caso')} className="absolute bottom-[16%] left-[38%] text-slate-400 font-bold text-base cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Caso">Caso</span>
                          <span onClick={(e) => handleWordCloudClick(e, 'Produção')} className="absolute bottom-[20%] right-[30%] text-[#0f4c64] font-extrabold text-xl cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Produção">Producao</span>
                          <span onClick={(e) => handleWordCloudClick(e, 'Formação')} className="absolute bottom-[28%] right-[24%] text-[#0f4c64] font-bold text-base cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Formação">Formacao</span>

                          {/* Palavras das bordas */}
                          <span onClick={(e) => handleWordCloudClick(e, 'Desenvolvimento')} className="absolute top-[20%] left-[14%] text-slate-400 font-medium text-sm cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Desenvolvimento">Desenvolvimento</span>
                          <span onClick={(e) => handleWordCloudClick(e, 'Estado')} className="absolute top-[34%] left-[14%] text-[#0f4c64] font-bold text-base -rotate-90 cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Estado">Estado</span>
                          <span onClick={(e) => handleWordCloudClick(e, 'Brasil')} className="absolute top-[52%] left-[14%] text-slate-400 font-medium text-sm -rotate-90 cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Brasil">Brazil</span>
                          <span onClick={(e) => handleWordCloudClick(e, 'Experiência')} className="absolute bottom-[16%] left-[14%] text-slate-400 font-medium text-sm -rotate-90 cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Experiência">Experiencia</span>

                          <span onClick={(e) => handleWordCloudClick(e, 'Saúde')} className="absolute bottom-[38%] left-[22%] text-[#0f4c64] font-bold text-2xl cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Saúde">Saude</span>
                          <span onClick={(e) => handleWordCloudClick(e, 'Ensino')} className="absolute bottom-[25%] left-[24%] text-slate-400 font-bold text-sm -rotate-90 cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Ensino">Ensino</span>
                          <span onClick={(e) => handleWordCloudClick(e, 'Social')} className="absolute bottom-[12%] left-[22%] text-[#0f4c64] font-bold text-lg cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Social">Social</span>

                          <span onClick={(e) => handleWordCloudClick(e, 'Município')} className="absolute top-[22%] right-[14%] text-slate-400 font-medium text-sm -rotate-90 cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Município">Municipio</span>
                          <span onClick={(e) => handleWordCloudClick(e, 'Relato')} className="absolute top-[48%] right-[14%] text-slate-400 font-medium text-sm cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Relato">Relato</span>
                          <span onClick={(e) => handleWordCloudClick(e, 'Trabalho')} className="absolute bottom-[14%] right-[14%] text-[#0f4c64] font-bold text-sm -rotate-90 cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Trabalho">Trabalho</span>
                          <span onClick={(e) => handleWordCloudClick(e, 'Diferentes')} className="absolute bottom-[10%] right-[26%] text-slate-400 font-medium text-sm cursor-pointer hover:text-blue-600 hover:scale-110 transition-all" title="Buscar artigos sobre Diferentes">Diferentes</span>
                        </div>

                        {/* Indicação animada na borda inferior do cartão */}
                        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-blue-200 shadow-xs opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                          <span className="material-symbols-outlined text-[20px] animate-bounce text-blue-600">keyboard_arrow_up</span>
                        </div>

                        {/* BARRA DE BUSCA QUE DESLISA DA PARTE INFERIOR DO CARTÃO */}
                        <div
                          className="absolute bottom-0 inset-x-0 p-4 sm:p-6 z-30 transition-all duration-300 transform translate-y-full opacity-0 pointer-events-none group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto bg-gradient-to-t from-white via-white/95 to-transparent pt-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsSimccModalOpen(true);
                          }}
                        >
                          <div className="w-full bg-white rounded-xl px-4 py-3 flex items-center justify-between gap-2 border-2 border-blue-500 shadow-xl cursor-pointer group/search hover:bg-blue-50/50 transition-all">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <span className="material-symbols-outlined text-blue-600 text-[20px] group-hover/search:scale-110 transition-transform shrink-0">search</span>
                              <span className="text-sm font-medium text-slate-700 select-none truncate">Pesquisar competências...</span>
                            </div>
                            <span className="material-symbols-outlined text-blue-600 text-[18px] group-hover/search:translate-x-1 transition-transform shrink-0">arrow_forward</span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (module.id === 'vip-vitrine' || module.id === 'clube-ciencia' || module.logo) {
                    return (
                      <div key={module.id} onClick={() => handleModuleClick(module.link)} className={`${module.gridClass} bg-white rounded-[20px] px-8 py-6 border-2 border-blue-100 shadow-sm flex flex-col justify-center relative group hover:shadow-xl hover:border-blue-600 transition-all duration-500 hover:-translate-y-1.5 cursor-pointer overflow-hidden`}>
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-700 via-blue-600 to-red-600 opacity-90 group-hover:opacity-100 group-hover:w-2 transition-all duration-300 z-20"></div>

                        {/* Se o card tiver bgImage (como a vitrine), renderiza o parallax */}
                        {module.bgImage && (
                          <div className="bento-bg absolute inset-0 opacity-[0.08] pointer-events-none bg-no-repeat bg-right bg-cover z-0 transition-transform duration-700 ease-in-out group-hover:scale-105 group-hover:-translate-x-3 group-hover:-translate-y-1" style={{ backgroundImage: `url(${module.bgImage})` }}></div>
                        )}

                        <span className="material-symbols-outlined absolute top-4 right-4 text-gray-300 group-hover:text-blue-600 transition-colors z-20 text-[20px]">open_in_new</span>

                        <div className="flex items-center gap-4 z-10 pl-2">
                          <img src={module.logo} alt={module.title} className="h-10 w-auto object-contain" />
                          <h3 className="text-xl font-bold text-[#0f4c64] leading-tight">{module.title}</h3>
                        </div>
                      </div>
                    );
                  }

                  if (module.status === 'inactive') {
                    return (
                      <div key={module.id} className={`${module.gridClass} bg-white rounded-[20px] p-6 border-2 border-gray-100 shadow-sm flex flex-col justify-center relative group cursor-default overflow-hidden`}>
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gray-300 z-20"></div>
                        <div className="flex items-center gap-4 pr-6 pl-2">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-gray-400 text-[24px]">{module.icon}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <h3 className="font-bold text-gray-400 text-sm leading-tight">{module.title}</h3>
                            <span className="bg-gray-200 text-gray-500 text-[9px] font-bold px-2 py-0.5 rounded w-max uppercase tracking-wider">Em breve</span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={module.id} onClick={() => handleModuleClick(module.link)} className={`${module.gridClass} bg-white rounded-[20px] p-6 border-2 border-blue-100 shadow-sm flex flex-col justify-center relative group cursor-pointer hover:shadow-lg hover:border-blue-600 transition-all duration-500 hover:-translate-y-1 overflow-hidden`}>
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-700 via-blue-600 to-red-600 opacity-90 group-hover:opacity-100 group-hover:w-2 transition-all duration-300 z-20"></div>
                      <span className="material-symbols-outlined absolute top-4 right-4 text-blue-200 group-hover:text-blue-600 transition-colors text-[20px]">open_in_new</span>
                      <div className="flex items-center gap-4 pr-6 pl-2 z-10">
                        <div className="w-12 h-12 rounded-full bg-[#e6f0f5] flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors duration-300">
                          <span className="material-symbols-outlined text-[#0f4c64] text-[24px] group-hover:text-blue-700 transition-colors duration-300">{module.icon}</span>
                        </div>
                        <h3 className="font-bold text-[#0f4c64] text-sm leading-tight" dangerouslySetInnerHTML={{ __html: module.title.replace(' e ', ' e<br/>').replace(' de ', ' de<br/>').replace(' - ', ' -<br/>') }}></h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* COMPONENTE PESQUISADORES EM DESTAQUE IMPORTADO AQUI */}
          <FeaturedResearchers
            apiBaseUrl={apiBaseUrl}
            maxItems={20}
            direction="left"
            speed="normal"
            pauseOnHover={true}
          />

          <section id="instituicoes" className="scroll-mt-16 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-24 flex flex-col gap-8 border-t border-gray-100">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-4 gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl text-slate-800 font-bold tracking-tight">Instituições integradas</h2>
                <p className="text-base text-slate-500">Acesse os dados e produções de cada instituição participante.</p>
              </div>

              <button 
                onClick={() => handleModuleClick(instituicoesVerTodas.to)}
                className="text-red-600 hover:text-red-700 hover:underline font-bold text-sm flex items-center gap-1 transition-colors"
              >
                Ver todas <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2">
              {[
                { name: 'Todas', count: instituicoes.length, icon: 'account_balance' },
                { name: 'Federais', count: instituicoes.filter(i => i.categoria === 'Federais').length, icon: 'account_balance' },
                { name: 'Estaduais', count: instituicoes.filter(i => i.categoria === 'Estaduais').length, icon: 'account_balance' },
                { name: 'Institutos', count: instituicoes.filter(i => i.categoria === 'Institutos').length, icon: 'business' },
                { name: 'Privadas', count: instituicoes.filter(i => i.categoria === 'Privadas').length, icon: 'domain' }
              ].map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.name ? 'border-blue-700 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                  <span className="font-bold text-sm">{tab.name}</span>
                  <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold">{tab.count}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
              {filteredInstitutions.map((inst) => (
                <div
                  key={inst.id}
                  // Link dinâmico usando a URL externa do Observatório
                  onClick={() => handleModuleClick(`https://observatoriocti.secti.ba.gov.br/instituicao?institution_id=${inst.id}&pagina=producoes`)}
                  className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                >
                  <img src={`/university-logo/LOGO-${inst.sigla}.png`} alt={`Logo ${inst.sigla}`} className="inst-logo h-16 md:h-20 w-auto object-contain mb-4 group-hover:scale-110 transition-transform duration-500" />
                  <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">{inst.nome}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="snap-start bg-slate-900 w-full mt-auto scroll-mt-16 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-700 via-slate-800 to-red-600"></div>
          <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-12 max-w-[1400px] mx-auto gap-y-8 w-full mt-1">
            <div className="text-xl font-bold text-white tracking-widest uppercase flex items-center gap-2">Observatório</div>
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <a className="text-sm font-medium text-slate-400 hover:text-white transition-colors" href="#">Privacidade</a>
              <a className="text-sm font-medium text-slate-400 hover:text-white transition-colors" href="#">Termos de Uso</a>
              <a className="text-sm font-medium text-slate-400 hover:text-white transition-colors" href="#">Contato</a>
              <a className="text-sm font-medium text-slate-400 hover:text-white transition-colors" href="#">Sobre o Simcc</a>
            </nav>
            <div className="text-sm text-slate-500 text-center md:text-right">Observatório de CT&I da Bahia</div>
          </div>
        </footer>

        <div className="a11y-fab fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          <div
            className={`bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right ${isAccessibilityOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-4 pointer-events-none'
              }`}
            style={{ width: '220px' }}
          >
            <div className="bg-blue-700 text-white p-4 font-bold text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">accessibility_new</span>
              Acessibilidade
            </div>
            <div className="flex flex-col">
              <button onClick={toggleHighContrast} className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm transition-colors border-b border-gray-100 text-left w-full group ${isHighContrast ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'}`}>
                <span className={`material-symbols-outlined text-[20px] transition-colors ${isHighContrast ? 'text-blue-700' : 'text-slate-400 group-hover:text-blue-600'}`}>contrast</span>
                Alto Contraste
              </button>
              <button onClick={increaseText} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 text-sm text-slate-700 transition-colors border-b border-gray-100 text-left w-full group" disabled={fontSize >= 150}>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-blue-600 transition-colors">text_increase</span>
                  Aumentar
                </div>
                {fontSize > 100 && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">{fontSize}%</span>}
              </button>
              <button onClick={decreaseText} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 text-sm text-slate-700 transition-colors text-left w-full group" disabled={fontSize <= 80}>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-blue-600 transition-colors">text_decrease</span>
                  Diminuir
                </div>
                {fontSize < 100 && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">{fontSize}%</span>}
              </button>
              <button onClick={resetText} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 text-sm text-slate-700 transition-colors text-left w-full group" disabled={fontSize === 100}>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-blue-600 transition-colors">text_format</span>
                  Tamanho Padrão
                </div>
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
            className={`text-white p-3.5 rounded-full shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center ${isAccessibilityOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-700 hover:bg-blue-800'
              }`}
            aria-label="Menu de Acessibilidade"
          >
            <span className="material-symbols-outlined text-[28px] transition-transform duration-300">
              {isAccessibilityOpen ? 'close' : 'accessibility_new'}
            </span>
          </button>
        </div>
      </div>

      {/* MODAL DE BUSCA CENTRALIZADO SIMCC */}
      {isSimccModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => {
            setIsSimccModalOpen(false);
            setIsTypeDropdownOpen(false);
          }}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col relative animate-in zoom-in-95 duration-200 mt-12 sm:mt-0 overflow-visible"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
              <div className="flex items-center gap-2.5 text-[#0f4c64] font-bold text-lg">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <span>Pesquisar no SIMCC</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSimccModalOpen(false);
                  setIsTypeDropdownOpen(false);
                }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Fechar busca"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmitSimcc(simccSearchQuery); }} className="p-6 flex flex-col gap-4 relative overflow-visible">

              {/* Overlay transparente para fechar o dropdown ao clicar fora dele */}
              {isTypeDropdownOpen && (
                <div
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setIsTypeDropdownOpen(false)}
                />
              )}

              <div className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full relative z-50">

                {/* Botão Seletor de Tipo (Lado Esquerdo) */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                    className="h-full w-full sm:w-auto px-3.5 py-3.5 bg-gray-50 hover:bg-gray-100 border-2 border-blue-100 rounded-xl flex items-center justify-between sm:justify-start gap-2.5 text-xs font-semibold text-gray-700 transition-colors cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-sm shrink-0 shadow-xs" style={{ backgroundColor: selectedSearchType.color }} />
                      <span className="truncate max-w-[130px] text-left">{selectedSearchType.label}</span>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-gray-400">unfold_more</span>
                  </button>

                  {/* Menu Dropdown sem corte de overflow */}
                  {isTypeDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3.5 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
                        Selecione o tipo de produção
                      </div>
                      {SIMCC_SEARCH_TYPES.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => {
                            setSelectedSearchType(type);
                            setIsTypeDropdownOpen(false);
                          }}
                          className={`w-full px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer ${selectedSearchType.id === type.id ? 'bg-blue-50/80 text-blue-700 font-bold' : 'text-gray-700'
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-3.5 h-3.5 rounded-sm shrink-0 shadow-xs" style={{ backgroundColor: type.color }} />
                            <span>{type.label}</span>
                          </div>
                          {selectedSearchType.id === type.id && (
                            <span className="material-symbols-outlined text-[16px] text-blue-600">check</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Input de Busca */}
                <div className="relative flex-grow flex items-center">
                  <span className="material-symbols-outlined text-blue-600 absolute left-4 text-[22px] pointer-events-none">search</span>
                  <input
                    type="text"
                    autoFocus
                    value={simccSearchQuery}
                    onChange={(e) => setSimccSearchQuery(e.target.value)}
                    placeholder={selectedSearchType.id === 'todos' ? 'Digite um termo, área de estudo ou pesquisador...' : `Pesquisar em ${selectedSearchType.label.toLowerCase()}...`}
                    className="w-full bg-gray-50 border-2 border-blue-100 focus:border-blue-600 focus:bg-white rounded-xl pl-12 pr-28 py-3.5 text-base font-sans text-gray-800 outline-none transition-all shadow-xs"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span>Buscar</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Termos Sugeridos da Nuvem de Palavras ou resultados da API secondWord quando > 3 caracteres */}
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {simccSearchQuery.trim().length > 3
                      ? `Sugestões relacionadas para "${simccSearchQuery.trim()}"`
                      : 'Termos da Nuvem de Palavras'}
                  </span>
                  {isSecondWordLoading && (
                    <span className="flex items-center gap-1.5 text-blue-600 text-xs font-medium">
                      <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                      Buscando termos...
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                  {simccSearchQuery.trim().length > 3 ? (
                    isSecondWordLoading ? (
                      <div className="py-3 text-xs text-slate-400 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] animate-spin text-blue-600">progress_activity</span>
                        <span>Pesquisando termos no SIMCC...</span>
                      </div>
                    ) : secondWordSuggestions.length > 0 ? (
                      secondWordSuggestions.map((item) => (
                        <button
                          key={item.word}
                          type="button"
                          onClick={() => {
                            setSimccSearchQuery(item.word);
                            handleSubmitSimcc(item.word);
                          }}
                          className="px-3 py-1.5 text-xs font-medium bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg text-blue-800 border border-blue-200/80 transition-all cursor-pointer shadow-2xs hover:shadow-xs flex items-center gap-1.5 group/sug"
                        >
                          <span className="material-symbols-outlined text-[14px] text-blue-600 group-hover/sug:text-white">search</span>
                          <span className="capitalize">{item.word}</span>
                          {item.freq > 0 && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-blue-200/60 group-hover/sug:bg-white/20 text-blue-900 group-hover/sug:text-white rounded-full font-bold">
                              {item.freq}
                            </span>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="py-2 text-xs text-slate-400 italic">
                        Nenhum termo relacionado encontrado. Pressione Enter para buscar "{simccSearchQuery.trim()}".
                      </div>
                    )
                  ) : (
                    [
                      'Bahia', 'Brasil', 'Educação', 'Saúde', 'Análise', 'Estudo',
                      'Desenvolvimento', 'Ensino', 'Social', 'Formação', 'Produção',
                      'Trabalho', 'Estado', 'Avaliação', 'Caso', 'Experiência', 'Município', 'Relato'
                    ].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setSimccSearchQuery(term);
                          handleSubmitSimcc(term);
                        }}
                        className="px-3 py-1.5 text-xs font-medium bg-gray-100/90 hover:bg-blue-100 hover:text-blue-700 rounded-lg text-gray-700 border border-gray-200/80 transition-all cursor-pointer shadow-2xs hover:shadow-xs flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[14px] text-blue-500">search</span>
                        <span>{term}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}