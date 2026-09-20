// src/components/InitialHome.jsx

import { useEffect, useState } from 'react';

import {
  instituicoes,
  filtrarInstituicoes,
  instituicoesVerTodas
} from '../constants/home-links';

import FeaturedResearchers from './FeaturedResearchers';
import HeroMetricCards from './HeroMetricCards';
import { useHomeQuantitativeData } from '../hooks/useHomeQuantitativeData';
import { useSimccWordCloud } from '../hooks/useSimccWordCloud';
import { SimccWordCloud } from './ui/SimccWordCloud';
import { getSecondWordSuggestions } from '../services/homeService';
import { SIMCC_SEARCH_TYPES } from '../constants/simccSearch';

export default function InitialHome() {

  // Custom Hook de Dados Quantitativos da Home (React Query + Axios)
  const { data: quantData, isLoading: quantLoading } = useHomeQuantitativeData();
  const { data: wordCloudData = [], isLoading: wordCloudLoading, isError: wordCloudError } = useSimccWordCloud();

  // Estados de UI e Navegação
  const [isScrolled, setIsScrolled] = useState(false);

  // Abas dos Módulos (Inicializa com o nome completo)
  const [activeModuleTab, setActiveModuleTab] = useState('Sistema de Mapeamento de Competências Científicas');

  // Abas das Instituições
  const [activeTab, setActiveTab] = useState('Todas');
  const [activeSection, setActiveSection] = useState('');

  // Estado e handler da busca SIMCC
  const [isSimccModalOpen, setIsSimccModalOpen] = useState(false);
  const [simccSearchQuery, setSimccSearchQuery] = useState('');
  const [selectedSearchType, setSelectedSearchType] = useState(SIMCC_SEARCH_TYPES[0]);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  // Autocompletar da API secondWord
  const [secondWordSuggestions, setSecondWordSuggestions] = useState([]);
  const [isSecondWordLoading, setIsSecondWordLoading] = useState(false);

  const handleSubmitSimcc = (term, type = selectedSearchType) => {
    if (term && term.trim()) {
      const cleanTerm = term.trim().replace(/[?.,!;:]/g, '');
      const url = `https://observatoriocti.secti.ba.gov.br/simcc/resultados?type_search=${type.type_search}&terms=${encodeURIComponent(cleanTerm)}`;
      window.open(url, '_blank');
    }
    setIsSimccModalOpen(false);
    setIsTypeDropdownOpen(false);
  };

  const handleWordCloudClick = (term) => {
    if (term && term.trim()) {
      const cleanTerm = term.trim().replace(/[?.,!;:]/g, '');
      const url = `https://observatoriocti.secti.ba.gov.br/simcc/resultados?type_search=article&terms=${encodeURIComponent(cleanTerm)}`;
      window.open(url, '_blank');
    }
  };

  // Efeito para buscar autocompletar na API (secondWord)
  useEffect(() => {
    const query = simccSearchQuery.trim();
    const controller = new AbortController();
    const timer = setTimeout(() => {
      if (query.length <= 3) {
        setSecondWordSuggestions([]);
        setIsSecondWordLoading(false);
        return;
      }

      setIsSecondWordLoading(true);
      getSecondWordSuggestions(query, controller.signal)
        .then((data) => {
          if (Array.isArray(data)) {
            const frequencyMap = new Map();
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
          if (err.name !== 'AbortError' && err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
            setSecondWordSuggestions([]);
            setIsSecondWordLoading(false);
          }
        });
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [simccSearchQuery]);

  useEffect(() => {
    const handleKeyDown = (e) => {
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
  const increaseText = () => setFontSize((prev) => (prev < 150 ? prev + 10 : prev));
  const decreaseText = () => setFontSize((prev) => (prev > 80 ? prev - 10 : prev));
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

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleModuleClick = (link) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const filteredInstitutions = filtrarInstituicoes(activeTab);

  const moduleTabs = [
    { name: 'Sistema de Mapeamento de Competências Científicas', label: 'Sistema de Mapeamento<br/>de Competências Científicas', icon: 'map' },
    { name: 'Vitrine de Infraestrutura', label: 'Vitrine de<br/>Infraestrutura', icon: 'domain' },
    { name: 'Clube de Ciência', label: 'Clube de<br/>Ciência', icon: 'biotech' },
    { name: 'Institutos de CT&I', label: 'Institutos<br/>de CT&I', icon: 'account_balance' },
    { name: 'Infográficos', label: 'Infográficos', icon: 'insert_chart' }
  ];

  const infograficos = [
    {
      id: 'ciencia-em-numeros',
      title: 'A ciência baiana em números',
      description: 'Um retrato do que a Bahia produz em conhecimento, pesquisa e inovação.',
      highlights: [
        { value: '+11 mil', label: 'pesquisadores ativos' },
        { value: '156 mil', label: 'produções científicas registradas' },
        { value: '1.429', label: 'grupos de pesquisa' },
        { value: '192', label: 'programas de pós-graduação' },
        { value: '410', label: 'bolsistas de produtividade' },
        { value: '2.116', label: 'produções técnicas' }
      ],
      period: '(2021-2026)',
      updatedAt: '31 ago 2026',
      image: '/infograficos/ciencia-em-numeros.png',
      download: '/infograficos/ciencia-em-numeros.png'
    },
    {
      id: 'quanto-bahia-produz',
      title: 'Quanto a Bahia produz',
      description: 'Da produção científica à patente.',
      highlights: [
        { value: '+156 mil', label: 'produção científica' },
        { value: '70.068', label: 'artigos científicos' },
        { value: '48.726', label: 'trabalhos em eventos' },
        { value: '2.116', label: 'produção técnica' },
        { value: '377', label: 'depósitos de patentes' }
      ],
      period: '(2021-2026)',
      updatedAt: '31 ago 2026',
      image: '/infograficos/quanto-bahia-produz.png',
      download: '/infograficos/quanto-bahia-produz.png'
    },
    {
      id: 'quem-faz-ciencia-aqui',
      title: 'Quem faz ciência aqui',
      description: 'A ciência baiana é feita por uma comunidade altamente qualificada.',
      highlights: [
        { value: '+11 mil', label: 'pesquisadores ativos na Bahia' },
        { value: '71,7%', label: 'têm doutorado' },
        { value: '8.244', label: 'doutores' },
        { value: '2.100', label: 'mestres' },
        { value: '844', label: 'especialistas' }
      ],
      period: '(2021-2026)',
      updatedAt: '31 ago 2026',
      image: '/infograficos/quem-faz-ciencia-aqui.png',
      download: '/infograficos/quem-faz-ciencia-aqui.png'
    },
    {
      id: 'ciencia-que-vira-tecnologia',
      title: 'Ciência que vira tecnologia',
      description: 'Da pesquisa para a sociedade.',
      highlights: [
        { value: '2.116', label: 'produções técnicas registradas' },
        { value: '1.031', label: 'relatórios técnicos' },
        { value: '672', label: 'programas de computador' },
        { value: '377', label: 'depósitos de patentes' },
        { value: '36', label: 'registros de marcas' }
      ],
      period: '(2021-2026)',
      updatedAt: '31 ago 2026',
      image: '/infograficos/ciencia-que-vira-tecnologia.png',
      download: '/infograficos/ciencia-que-vira-tecnologia.png'
    },
    {
      id: 'excelencia-reconhecida',
      title: 'Excelência reconhecida',
      description: 'Talento baiano que transforma o futuro.',
      highlights: [
        { value: '410', label: 'pesquisadores com bolsa de produtividade' },
        { value: '383', label: 'produtividade em pesquisa (PQ)' },
        { value: '27', label: 'desenvolvimento tecnológico (DT)' }
      ],
      period: '(2021-2026)',
      updatedAt: '31 ago 2026',
      image: '/infograficos/excelencia-reconhecida.png',
      download: '/infograficos/excelencia-reconhecida.png'
    }
  ];

  // Carrossel de Infográficos em Destaque
  const [activeInfographic, setActiveInfographic] = useState(0);
  const currentInfographic = infograficos[activeInfographic];
  const prevInfographic = () => setActiveInfographic((prev) => (prev === 0 ? infograficos.length - 1 : prev - 1));
  const nextInfographic = () => setActiveInfographic((prev) => (prev === infograficos.length - 1 ? 0 : prev + 1));

  // Lightbox de Infográficos (visualização em tela cheia)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxId, setLightboxId] = useState(null);
  const lightboxItem = infograficos.find((item) => item.id === lightboxId);

  const openLightbox = (id) => {
    setLightboxId(id);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxId(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        closeLightbox();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

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

        <header className={`bg-white border-b border-gray-200 w-full sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'h-14 shadow-sm' : 'h-16'}`}>
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-700 via-blue-500 to-red-600"></div>
          <div className="flex justify-between items-center w-full px-6 md:px-12 h-full max-w-[1400px] mx-auto mt-[1px]">
            <div className="flex items-center h-full gap-4 md:gap-6">
              <div className="hidden md:flex items-center gap-2 border-r border-gray-200 pr-4 md:pr-6 h-10">
                <a
                  href="https://www.ba.gov.br/secti/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity flex items-center h-full cursor-pointer"
                  title="Secretaria de Ciência, Tecnologia e Inovação - Governo da Bahia"
                >
                  <img src="/ESTADO-BAHIA.svg" alt="SECTI - Governo do Estado da Bahia" className="h-8 md:h-10 w-auto object-contain" />
                </a>
              </div>
              <a className="flex items-center h-full py-0 gap-3" href="#" onClick={(e) => scrollToSection(e, 'sobre')}>
                <img alt="Símbolo Observatório" className="h-9 md:h-10 w-auto object-contain z-10 relative" src="/LOGO.png" />
                <div className={`transition-all duration-500 ease-in-out flex items-center overflow-hidden ${isScrolled ? 'max-w-0 opacity-0 -translate-x-8' : 'max-w-[400px] opacity-100 translate-x-0'}`}>
                  <img alt="Nome Observatório" className="h-8 md:h-11 w-auto object-contain" src="/NOME.png" />
                </div>
              </a>
            </div>

            <div className="flex items-center gap-8 h-full">
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

          </div>
        </header>

        <main className="flex-grow flex flex-col items-center w-full">
          <section id="sobre" className="scroll-mt-16 w-full relative min-h-[calc(100vh-64px)] flex flex-col justify-between items-center overflow-hidden pt-12 pb-8">
            <div className="hero-bg absolute inset-0 pointer-events-none bg-[url('/BG-OBSERVATORIO.png')] bg-no-repeat bg-center bg-cover z-0"></div>
            <div className="my-auto relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col items-start text-left gap-8">
                <h1 className="text-4xl md:text-[56px] md:leading-[64px] text-slate-800 font-extrabold tracking-tight">
                  Observatório <br />
                  de <span className="bg-blue-800 text-white px-5 py-1 rounded-[20px] inline-flex items-center justify-center align-middle -translate-y-1 mx-1 border-b-[3px] border-red-600 shadow-sm">CT&I</span> da <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-red-600">Bahia</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
                  Explore dados integrados sobre produção científica, pesquisadores, instituições e inovações no estado da Bahia, apresentados com clareza e precisão.
                </p>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-4">
                    <button onClick={(e) => scrollToSection(e, 'modulos')} className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-md flex items-center gap-2 hover:-translate-y-1 duration-300">
                      Acessar Módulos <span className="material-symbols-outlined transition-transform group-hover:translate-y-1">arrow_downward</span>
                    </button>
                    <button
                      onClick={(e) => { setActiveModuleTab('Infográficos'); scrollToSection(e, 'modulos'); }}
                      className="bg-white hover:bg-blue-50/50 text-blue-700 border-2 border-blue-200 hover:border-blue-400 px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 hover:-translate-y-1 duration-300"
                    >
                      Explorar infográficos <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </button>
                  </div>

                  <div
                    onClick={(e) => { setActiveModuleTab('Infográficos'); scrollToSection(e, 'modulos'); }}
                    className="mt-2 w-full max-w-[580px] bg-white border border-blue-100 shadow-md rounded-[20px] p-5 flex items-center gap-5 cursor-pointer group hover:shadow-lg hover:border-blue-400 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative shrink-0 w-36 sm:w-40 bg-white border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
                      <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-700 via-blue-500 to-red-600 z-10"></div>
                      <img src="/infograficos/ciencia-em-numeros.png" alt="Infográfico A ciência baiana em números" className="h-36 w-full object-cover object-top" />
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-blue-700 tracking-[0.15em] uppercase">Infográficos</span>
                      <h3 className="text-lg md:text-xl font-extrabold text-slate-800 leading-tight">Bahia em dados</h3>
                      <p className="text-xs md:text-sm text-slate-500 leading-snug">Indicadores que revelam a força da ciência, tecnologia e inovação no estado.</p>
                      <span className="text-red-600 font-bold text-sm flex items-center gap-1 mt-1 group-hover:gap-2 transition-all duration-300">
                        Ver infográfico <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <HeroMetricCards data={quantData} loading={quantLoading} />
            </div>

            <a
              href="#modulos"
              onClick={(e) => scrollToSection(e, 'modulos')}
              className="relative z-10 flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors cursor-pointer group mt-4"
              aria-label="Rolar para explorar os módulos"
            >
              <span className="material-symbols-outlined text-[36px] animate-bounce">keyboard_arrow_down</span>
            </a>
          </section>

          {/* SEÇÃO DE MÓDULOS */}
          <section id="modulos" className="scroll-mt-16 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-24 flex flex-col gap-6 border-t border-gray-100 bg-[#F8FAFC]">

            <div className="flex flex-col gap-2">
              <h2 className="text-3xl text-slate-800 font-bold tracking-tight">Módulos da Plataforma</h2>
              <p className="text-base text-slate-500">Explore o ecossistema integrado de informações científicas.</p>
            </div>

            {/* Menu de Abas dos Módulos COM LINHA DE SEPARAÇÃO E FLEX-WRAP (sem barra de scroll) */}
            <div className="flex items-center gap-6 md:gap-8 flex-wrap border-b border-gray-200 mb-6 w-full">
              {moduleTabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveModuleTab(tab.name)}
                  className={`flex items-center gap-2 pb-4 border-b-[3px] transition-all cursor-pointer text-left -mb-[2px] ${activeModuleTab === tab.name ? 'border-blue-700 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-gray-300'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                  <span className="font-bold text-sm leading-tight" dangerouslySetInnerHTML={{ __html: tab.label }}></span>
                </button>
              ))}
            </div>

            {/* Conteúdo Renderizado da Aba */}
            <div className="w-full">
              {activeModuleTab === 'Sistema de Mapeamento de Competências Científicas' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full items-stretch">

                  {/* ESQUERDA: Grid com os Cartões */}
                  <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">

                    {/* 1. Módulo Principal da Aba (SIMCC) */}
                    <div
                      onClick={() => handleModuleClick('https://observatoriocti.secti.ba.gov.br/simcc/')}
                      className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                    >
                      <img src="/LOGO-SIMCC.svg" alt="SIMCC" className="h-16 md:h-20 w-auto object-contain mb-4 group-hover:scale-110 transition-transform duration-500" />
                      <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">Plataforma SIMCC</p>
                    </div>

                    {/* 2. Indicadores Institucionais e Pós-graduação */}
                    <div
                      onClick={() => handleModuleClick('https://observatoriocti.secti.ba.gov.br/simcc/indicadores')}
                      className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50/60 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500">
                        <span className="material-symbols-outlined text-[#0f4c64] text-[32px] md:text-[40px] group-hover:text-blue-700 transition-colors duration-300">bar_chart</span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">Indicadores Institucionais<br />e Pós-graduação</p>
                    </div>

                    {/* 3. Programas de Pós-Graduação */}
                    <div
                      onClick={() => handleModuleClick('https://observatoriocti.secti.ba.gov.br/simcc/pos-graduacao')}
                      className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50/60 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500">
                        <span className="material-symbols-outlined text-[#0f4c64] text-[32px] md:text-[40px] group-hover:text-blue-700 transition-colors duration-300">school</span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">Programas de<br />Pós-Graduação</p>
                    </div>

                    {/* 4. Produção Técnica e Inovação */}
                    <div
                      onClick={() => handleModuleClick('https://observatoriocti.secti.ba.gov.br/simcc/listagens?tab=patent')}
                      className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50/60 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500">
                        <span className="material-symbols-outlined text-[#0f4c64] text-[32px] md:text-[40px] group-hover:text-blue-700 transition-colors duration-300">lightbulb</span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">Produção Técnica<br />e Inovação</p>
                    </div>

                    {/* 5. Grupos de Pesquisa */}
                    <div
                      onClick={() => handleModuleClick('https://observatoriocti.secti.ba.gov.br/simcc/grupos-pesquisa')}
                      className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50/60 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500">
                        <span className="material-symbols-outlined text-[#0f4c64] text-[32px] md:text-[40px] group-hover:text-blue-700 transition-colors duration-300">groups</span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">Grupos de<br />Pesquisa</p>
                    </div>

                    {/* 6. Bolsistas de Produtividade */}
                    <div
                      onClick={() => handleModuleClick('https://observatoriocti.secti.ba.gov.br/simcc/listagens?tab=bolsistas')}
                      className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50/60 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500">
                        <span className="material-symbols-outlined text-[#0f4c64] text-[32px] md:text-[40px] group-hover:text-blue-700 transition-colors duration-300">workspace_premium</span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">Bolsistas de<br />Produtividade</p>
                    </div>
                  </div>

                  {/* DIREITA: Nuvem de Palavras e Barra de Pesquisa */}
                  <div className="xl:col-span-1 bg-white border border-blue-100 shadow-sm rounded-[20px] flex flex-col relative overflow-hidden min-h-[400px] h-full group hover:shadow-lg hover:border-blue-400 transition-all duration-300">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-700 via-blue-600 to-red-600 opacity-90 z-20"></div>
                    <div className="bento-bg absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('/BG-SIMCC.png')] bg-no-repeat bg-right-bottom bg-contain z-0 transition-transform duration-700 ease-in-out group-hover:scale-105"></div>

                    <div className="p-6 pb-0 z-10 flex flex-col items-start">
                      <h3 className="text-xl font-bold text-[#0f4c64] leading-tight">Pesquise por Competência</h3>
                      <span className="text-[11px] font-semibold text-slate-400 tracking-wide mt-1">Busque por pesquisadores ou explore a nuvem de palavras</span>
                    </div>

                    <div className="flex-1 w-full flex items-center justify-center p-2 z-10 relative">
                      <SimccWordCloud words={wordCloudData} isLoading={wordCloudLoading} isError={wordCloudError} onWordClick={handleWordCloudClick} />
                    </div>

                  </div>

                </div>
              )}

              {activeModuleTab === 'Vitrine de Infraestrutura' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 auto-rows-fr">

                  {/* 1. Módulo Principal da Aba (VIP) */}
                  <div
                    onClick={() => handleModuleClick('https://vip.uesc.br/')}
                    className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                  >
                    <img src="/LOGO-VIP.svg" alt="VIP" className="h-16 md:h-20 w-auto object-contain mb-4 group-hover:scale-110 transition-transform duration-500" />
                    <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">Vitrine de<br />Infraestrutura</p>
                  </div>

                  {/* 2. Instituições */}
                  <div
                    onClick={() => handleModuleClick('https://vip.uesc.br/pesquisar/I')}
                    className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50/60 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500">
                      <span className="material-symbols-outlined text-[#0f4c64] text-[32px] md:text-[40px] group-hover:text-blue-700 transition-colors duration-300">account_balance</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">Instituições</p>
                  </div>

                  {/* 3. Laboratórios */}
                  <div
                    onClick={() => handleModuleClick('https://vip.uesc.br/pesquisar/L')}
                    className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50/60 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500">
                      <span className="material-symbols-outlined text-[#0f4c64] text-[32px] md:text-[40px] group-hover:text-blue-700 transition-colors duration-300">science</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">Laboratórios</p>
                  </div>

                  {/* 4. Equipamentos */}
                  <div
                    onClick={() => handleModuleClick('https://vip.uesc.br/pesquisar/E')}
                    className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50/60 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500">
                      <span className="material-symbols-outlined text-[#0f4c64] text-[32px] md:text-[40px] group-hover:text-blue-700 transition-colors duration-300">biotech</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">Equipamentos</p>
                  </div>

                  {/* 5. Pesquisadores */}
                  <div
                    onClick={() => handleModuleClick('https://vip.uesc.br/pesquisar/P')}
                    className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50/60 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500">
                      <span className="material-symbols-outlined text-[#0f4c64] text-[32px] md:text-[40px] group-hover:text-blue-700 transition-colors duration-300">groups</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">Pesquisadores</p>
                  </div>

                </div>
              )}

              {activeModuleTab === 'Clube de Ciência' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                  {/* 1. Módulo Principal da Aba (Clube de Ciência) */}
                  <div
                    onClick={() => handleModuleClick('http://simcc.uesc.br/ictite/v1/web/')}
                    className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                  >
                    <img src="/LOGO-CLUBE.png" alt="Clube de Ciência" className="h-16 md:h-20 w-auto object-contain mb-4 group-hover:scale-110 transition-transform duration-500" />
                    <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">Clube de<br />Ciência</p>
                  </div>

                  {/* 2. Objetivos dos Clubes de Ciência */}
                  <div
                    onClick={() => handleModuleClick('http://simcc.uesc.br/ictite/v1/web/clubes')}
                    className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50/60 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500">
                      <span className="material-symbols-outlined text-[#0f4c64] text-[32px] md:text-[40px] group-hover:text-blue-700 transition-colors duration-300">hub</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">Objetivos dos<br />Clubes de Ciência</p>
                  </div>

                  {/* 3. Escolas */}
                  <div
                    onClick={() => handleModuleClick('http://simcc.uesc.br/ictite/v1/web/escolas')}
                    className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50/60 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500">
                      <span className="material-symbols-outlined text-[#0f4c64] text-[32px] md:text-[40px] group-hover:text-blue-700 transition-colors duration-300">school</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">Escolas</p>
                  </div>

                  {/* 4. Gráficos Estatísticos */}
                  <div
                    onClick={() => handleModuleClick('https://simcc.uesc.br/ictite/v1/web/estatisticas/')}
                    className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50/60 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500">
                      <span className="material-symbols-outlined text-[#0f4c64] text-[32px] md:text-[40px] group-hover:text-blue-700 transition-colors duration-300">bar_chart</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">Gráficos<br />Estatísticos</p>
                  </div>
                </div>
              )}

              {activeModuleTab === 'Institutos de CT&I' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">

                  {/* 1. Módulo Principal da Aba (INCITE) */}
                  <div
                    onClick={() => handleModuleClick('https://observatoriocti.secti.ba.gov.br/simcc/incites')}
                    className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50/60 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500">
                      <span className="material-symbols-outlined text-[#0f4c64] text-[32px] md:text-[40px] group-hover:text-blue-700 transition-colors duration-300">account_balance</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">Institutos de<br />CT&I</p>
                  </div>

                  {/* 2. INCITE Indústria 4.0 */}
                  <div
                    onClick={() => handleModuleClick('https://simcc.uesc.br/incite/industria4/')}
                    className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50/60 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500">
                      <span className="material-symbols-outlined text-[#0f4c64] text-[32px] md:text-[40px] group-hover:text-blue-700 transition-colors duration-300">factory</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">INCITE<br />Indústria 4.0</p>
                  </div>

                  {/* 3. INCITE Agricultura Familiar */}
                  <div
                    onClick={() => handleModuleClick('https://simcc.uesc.br/incite/agricultura-familiar/')}
                    className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50/60 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500">
                      <span className="material-symbols-outlined text-[#0f4c64] text-[32px] md:text-[40px] group-hover:text-blue-700 transition-colors duration-300">eco</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">INCITE<br />Agricultura Familiar</p>
                  </div>

                  {/* 4. INCITE Agroindústria */}
                  <div
                    onClick={() => handleModuleClick('https://simcc.uesc.br/incite/agroindustria/')}
                    className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px]"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50/60 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500">
                      <span className="material-symbols-outlined text-[#0f4c64] text-[32px] md:text-[40px] group-hover:text-blue-700 transition-colors duration-300">agriculture</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">INCITE<br />Agroindústria</p>
                  </div>

                </div>
              )}

              {activeModuleTab === 'Infográficos' && (
                <div className="flex flex-col gap-4 w-full">
                  {/* Mini visualizador */}
                  <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden flex flex-col w-full">
                    <div className="h-[4px] bg-gradient-to-r from-blue-700 via-blue-500 to-red-600"></div>
                    <div className="p-4 md:p-5 flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <h4 className="text-lg font-extrabold text-slate-800 leading-tight">{currentInfographic.title}</h4>
                        <p className="text-sm text-slate-500 leading-snug">{currentInfographic.description}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                        <img
                          src={currentInfographic.image}
                          alt={currentInfographic.title}
                          className="w-full max-h-[380px] object-contain mx-auto rounded-xl border border-gray-100 bg-slate-50"
                        />
                        <div className="bg-slate-50 border border-gray-100 rounded-xl p-4 flex flex-col gap-3">
                          <span className="text-[11px] font-bold text-slate-400 tracking-[0.15em] uppercase">Resumo</span>
                          <ul className="flex flex-col gap-2.5">
                            {currentInfographic.highlights.map((item) => (
                              <li key={item.label} className="flex items-baseline gap-2">
                                <span className="text-lg font-extrabold text-blue-700 whitespace-nowrap">{item.value}</span>
                                <span className="text-xs text-slate-500">{item.label}</span>
                              </li>
                            ))}
                          </ul>
                          {currentInfographic.updatedAt && (
                            <span className="flex items-center gap-1.5 text-xs text-slate-400 mt-auto pt-2">
                              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                              Atualizado em {currentInfographic.updatedAt}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => openLightbox(currentInfographic.id)}
                            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            Explorar
                          </button>
                          <a
                            href={currentInfographic.download || currentInfographic.image}
                            download
                            className="bg-white hover:bg-blue-50 text-slate-700 border border-gray-200 px-4 py-2 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            Baixar
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={prevInfographic}
                            className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-slate-500 hover:text-blue-700 hover:border-blue-300 transition-colors cursor-pointer"
                            aria-label="Infográfico anterior"
                          >
                            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                          </button>
                          <span className="text-xs font-bold text-slate-700 tabular-nums">{String(activeInfographic + 1).padStart(2, '0')} / {String(infograficos.length).padStart(2, '0')}</span>
                          <button
                            onClick={nextInfographic}
                            className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-slate-500 hover:text-blue-700 hover:border-blue-300 transition-colors cursor-pointer"
                            aria-label="Próximo infográfico"
                          >
                            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {infograficos.map((item, index) => (
                            <button
                              key={item.id}
                              onClick={() => setActiveInfographic(index)}
                              className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${index === activeInfographic ? 'bg-blue-700' : 'bg-gray-200 hover:bg-gray-300'}`}
                              aria-label={`Ir para ${item.title}`}
                            ></button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mini grade dos 5 infográficos */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {infograficos.map((item, index) => (
                      <div
                        key={item.id}
                        onClick={() => setActiveInfographic(index)}
                        className={`bg-white border-2 rounded-2xl p-3 flex flex-col gap-2 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${index === activeInfographic ? 'border-blue-700 shadow-sm' : 'border-gray-200 hover:border-blue-300'}`}
                      >
                        <div className="w-full h-20 rounded-lg overflow-hidden border border-gray-100">
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover object-top" />
                        </div>
                        <span className={`text-[11px] font-bold text-center leading-tight ${index === activeInfographic ? 'text-blue-700' : 'text-slate-500'}`}>{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </section>

          {/* COMPONENTE PESQUISADORES EM DESTAQUE IMPORTADO AQUI */}
          <FeaturedResearchers
            maxItems={30}
            direction="left"
            speed="normal"
            pauseOnHover={true}
          />

          {/* SEÇÃO DE INSTITUIÇÕES */}
          <section id="instituicoes" className="scroll-mt-16 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-24 flex flex-col gap-6 border-t border-gray-100">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl text-slate-800 font-bold tracking-tight">Instituições integradas</h2>
                <p className="text-base text-slate-500">Acesse os dados e produções de cada instituição participante.</p>
              </div>

              <button
                onClick={() => handleModuleClick('https://observatoriocti.secti.ba.gov.br/simcc/instituicao')}
                className="text-red-600 hover:text-red-700 hover:underline font-bold text-sm flex items-center gap-1 transition-colors pb-2"
              >
                Ver todas <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            {/* Menu de Abas das Instituições COM LINHA DE SEPARAÇÃO E FLEX-WRAP (sem barra de scroll) */}
            <div className="flex items-center gap-6 md:gap-8 flex-wrap border-b border-gray-200 mb-6 w-full">
              {[
                { name: 'Todas', count: instituicoes.length, icon: 'account_balance' },
                { name: 'Federais', count: instituicoes.filter((i) => i.categoria === 'Federais').length, icon: 'account_balance' },
                { name: 'Estaduais', count: instituicoes.filter((i) => i.categoria === 'Estaduais').length, icon: 'account_balance' },
                { name: 'Institutos', count: instituicoes.filter((i) => i.categoria === 'Institutos').length, icon: 'business' },
                { name: 'Privadas', count: instituicoes.filter((i) => i.categoria === 'Privadas').length, icon: 'domain' }
              ].map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-2 pb-4 border-b-[3px] transition-all whitespace-nowrap cursor-pointer text-left -mb-[2px] ${activeTab === tab.name ? 'border-blue-700 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-gray-300'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                  <span className="font-bold text-sm">{tab.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${activeTab === tab.name ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{tab.count}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
              {filteredInstitutions.map((inst) => (
                <div
                  key={inst.id}
                  // 👇 NAVEGAÇÃO LOCAL PARA O MÓDULO DA INSTITUIÇÃO APLICADA AQUI 👇
                  onClick={() => window.open(`https://observatoriocti.secti.ba.gov.br/simcc/instituicao/${inst.sigla}`, '_blank')}
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

      {/* LIGHTBOX DE INFOGRÁFICO (TELA CHEIA) */}
      {isLightboxOpen && lightboxItem && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">insert_chart</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm text-slate-800 truncate">{lightboxItem.title}</span>
                  <span className="text-[10px] text-slate-400">Observatório de CT&I da Bahia</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Fechar infográfico"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 flex justify-center p-4">
              <img src={lightboxItem.image} alt={lightboxItem.title} className="max-w-full h-auto rounded-lg shadow-md" />
            </div>
          </div>
        </div>
      )}

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
