import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InitialHome() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('Todas');
  const [activeSection, setActiveSection] = useState('');
  
  // Estados de Acessibilidade
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100); 
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Lógicas de Acessibilidade
  const toggleHighContrast = () => setIsHighContrast(!isHighContrast);
  const increaseText = () => setFontSize(prev => (prev < 150 ? prev + 10 : prev));
  const decreaseText = () => setFontSize(prev => (prev > 80 ? prev - 10 : prev));

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

  const handleNavigation = (path: string) => navigate(path);

  const institutionsData = [
    { id: 'ufba', sigla: 'UFBA', nome: 'Universidade Federal da Bahia', category: 'Federais', rowSpan: 1 },
    { id: 'uesb', sigla: 'UESB', nome: 'Universidade Estadual do Sudoeste da Bahia', category: 'Estaduais', rowSpan: 1 },
    { id: 'ufsb', sigla: 'UFSB', nome: 'Universidade Federal do Sul da Bahia', category: 'Federais', rowSpan: 1 },
    { id: 'ufrb', sigla: 'UFRB', nome: 'Universidade Federal do Recôncavo da Bahia', category: 'Federais', rowSpan: 2 },
    { id: 'uneb', sigla: 'UNEB', nome: 'Universidade do Estado da Bahia', category: 'Estaduais', rowSpan: 1 },
    { id: 'uefs', sigla: 'UEFS', nome: 'Universidade Estadual de Feira de Santana', category: 'Estaduais', rowSpan: 1 },
    { id: 'fiocruz', sigla: 'FIOCRUZ', nome: 'Fundação Oswaldo Cruz', category: 'Institutos', rowSpan: 1 },
    { id: 'ufob', sigla: 'UFOB', nome: 'Universidade Federal do Oeste da Bahia', category: 'Federais', rowSpan: 1 },
    { id: 'uesc', sigla: 'UESC', nome: 'Universidade Estadual de Santa Cruz', category: 'Estaduais', rowSpan: 1 },
    { id: 'ifba', sigla: 'IFBA', nome: 'Instituto Federal da Bahia', category: 'Institutos', rowSpan: 1 },
    { id: 'ebmsp', sigla: 'EBMSP', nome: 'Escola Bahiana de Medicina e Saúde Pública', category: 'Privadas', rowSpan: 1 },
  ];

  const filteredInstitutions = institutionsData.filter((inst) => {
    if (activeTab === 'Todas') return true;
    return inst.category === activeTab;
  });

  return (
    <>
      {/* Estilos Globais Injetados para Acessibilidade Funcional */}
      <style>
        {`
          html {
            font-size: ${fontSize}%;
            transition: font-size 0.3s ease;
          }
          ${isHighContrast ? `
            html {
              filter: invert(1) hue-rotate(180deg) contrast(1.2) !important;
              background-color: #000 !important;
            }
            img, .a11y-fab, .hero-bg, .bento-bg {
              filter: invert(1) hue-rotate(180deg) !important;
            }
          ` : ''}
        `}
      </style>

      <div className="font-body-md text-slate-800 bg-white min-h-screen flex flex-col relative transition-colors duration-300">
        
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

        {/* Main Canvas */}
        <main className="flex-grow flex flex-col items-center w-full">
          
          {/* Hero Section */}
          <section id="sobre" className="scroll-mt-16 w-full relative h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden">
            <div className="hero-bg absolute inset-0 pointer-events-none bg-[url('/BG-OBSERVATORIO.png')] bg-no-repeat bg-center bg-cover z-0"></div>

            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col items-center text-center gap-8">
              <h1 className="text-4xl md:text-[56px] md:leading-[64px] text-slate-800 font-extrabold max-w-4xl tracking-tight">
                Observatório <br />
                de <span className="bg-blue-800 text-white px-5 py-1 rounded-[20px] inline-flex items-center justify-center align-middle -translate-y-1 mx-1 border-b-[3px] border-red-600 shadow-sm">CT&I</span> da <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-red-600">Bahia</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl">
                Explore dados integrados sobre produção científica, pesquisadores, instituições e inovações no estado da Bahia, apresentados com clareza e precisão.
              </p>
            </div>
            
            <a className="absolute bottom-12 text-slate-300 hover:text-blue-700 transition-colors cursor-pointer z-10" onClick={(e) => scrollToSection(e, 'modulos')}>
              <span className="material-symbols-outlined text-[24px]">keyboard_arrow_down</span>
            </a>
          </section>

          {/* Módulos da Plataforma */}
          <section id="modulos" className="scroll-mt-16 w-full bg-[#F8FAFC] py-24 border-t border-gray-200 min-h-screen">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              
              <div className="flex flex-col gap-2 mb-12">
                <h2 className="text-3xl text-slate-800 font-bold tracking-tight">
                  Módulos da Plataforma
                </h2>
                <p className="text-base text-slate-500">
                  Explore o ecossistema integrado de informações científicas.
                </p>
              </div>

              {/* Grid Bento - Layout Idêntico ao Print */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-fr">
                
                {/* LINHA 1 e 2 - Card SIMCC (2 colunas, 2 linhas de altura) */}
                <div onClick={() => handleNavigation('/resultados')} className="md:col-span-2 md:row-span-2 bg-white rounded-[20px] p-8 border border-gray-200 shadow-sm flex flex-col relative group hover:shadow-md hover:border-blue-300 transition-all cursor-pointer overflow-hidden">
                  <div className="bento-bg absolute inset-0 opacity-15 pointer-events-none bg-[url('/BG-SIMCC.png')] bg-no-repeat bg-right-bottom bg-contain z-0"></div>
                  <span className="material-symbols-outlined absolute top-6 right-6 text-gray-300 group-hover:text-blue-600 transition-colors z-20 text-[20px]">open_in_new</span>
                  
                  <div className="flex items-center gap-4 mb-4 z-10">
                    <img src="/LOGO-SIMCC.svg" alt="SIMCC" className="h-10 w-auto" />
                    <h3 className="text-[22px] font-bold text-[#0f4c64] leading-tight">Mapeamento de<br/>Competências</h3>
                  </div>
                  
                  <div className="flex-grow relative w-full min-h-[220px] select-none py-6 z-10 overflow-hidden">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-red-600 font-extrabold text-5xl bg-white/80 px-4 py-1 rounded-xl backdrop-blur-sm border border-white/40 shadow-sm">Bahia</span>
                     </div>
                     <span className="absolute top-4 left-[15%] text-[#0f4c64] font-bold text-2xl">Brasil</span>
                     <span className="absolute top-2 left-[2%] text-slate-400 text-sm">Desenvolvimento</span>
                     <span className="absolute bottom-6 left-[22%] text-[#0f4c64] font-bold text-xl">Saúde</span>
                     <span className="absolute bottom-14 left-[8%] text-gray-400 -rotate-90 text-lg tracking-wide">Experiência</span>
                     <span className="absolute bottom-6 left-[2%] text-[#0f4c64] font-bold -rotate-90 text-sm">Social</span>
                     <span className="absolute top-[45%] left-[2%] text-slate-400 text-sm">Ensino</span>
                     <span className="absolute top-8 right-[25%] text-[#0f4c64] font-medium rotate-90 text-lg tracking-widest">Educação</span>
                     <span className="absolute top-4 right-[8%] text-slate-400 text-sm">Estudo</span>
                     <span className="absolute bottom-8 right-[18%] text-[#0f4c64] font-semibold text-lg">Análise</span>
                     <span className="absolute bottom-3 right-[35%] text-[#0f4c64] text-sm font-medium">Formação</span>
                     <span className="absolute bottom-10 right-[6%] text-gray-400 text-sm rotate-90">Trabalho</span>
                     <span className="absolute bottom-2 right-[2%] text-slate-400 text-xs">Município</span>
                     <span className="absolute top-[40%] right-[2%] text-[#0f4c64] text-sm -rotate-90 font-medium">Avaliação</span>
                  </div>

                  <div className="mt-auto pt-4 flex flex-col sm:flex-row items-center gap-4 justify-between z-10">
                    <div className="flex-grow w-full bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center gap-2 border border-gray-200">
                      <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
                      <input type="text" placeholder="Pesquisar competências..." onClick={(e) => e.stopPropagation()} className="bg-transparent border-none outline-none w-full text-sm text-slate-600 placeholder-gray-400"/>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleNavigation('/resultados'); }} className="text-gray-400 font-bold text-xs tracking-wider flex items-center gap-1 hover:text-red-600 transition-colors uppercase whitespace-nowrap bg-white/80 py-2 px-3 rounded-lg">
                      MAIS <span className="material-symbols-outlined text-[16px]">expand_less</span>
                    </button>
                  </div>
                </div>

                {/* LINHA 1 - Lado Direito (Indicadores e Programas) */}
                <div onClick={() => handleNavigation('/indicadores')} className="md:col-span-1 md:row-span-1 bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm flex flex-col justify-center relative group cursor-pointer hover:shadow-md hover:border-blue-300 transition-all">
                  <span className="material-symbols-outlined absolute top-4 right-4 text-gray-300 group-hover:text-blue-600 transition-colors text-[20px]">open_in_new</span>
                  <div className="flex items-center gap-4 pr-6">
                    <div className="w-12 h-12 rounded-full bg-[#e6f0f5] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#0f4c64] text-[24px]">bar_chart</span>
                    </div>
                    <h3 className="font-bold text-[#0f4c64] text-sm leading-tight">Indicadores<br/>Institucionais e<br/>Pós-graduação</h3>
                  </div>
                </div>

                <div onClick={() => handleNavigation('/pos-graduacao')} className="md:col-span-1 md:row-span-1 bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm flex flex-col justify-center relative group cursor-pointer hover:shadow-md hover:border-blue-300 transition-all">
                  <span className="material-symbols-outlined absolute top-4 right-4 text-gray-300 group-hover:text-blue-600 transition-colors text-[20px]">open_in_new</span>
                  <div className="flex items-center gap-4 pr-6">
                    <div className="w-12 h-12 rounded-full bg-[#e6f0f5] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#0f4c64] text-[24px]">school</span>
                    </div>
                    <h3 className="font-bold text-[#0f4c64] text-sm leading-tight">Programas de<br/>Pós-Graduação</h3>
                  </div>
                </div>

                {/* LINHA 2 - Lado Direito (Produção Técnica - Ocupa 2 colunas) */}
                <div onClick={() => handleNavigation('/producoes-recentes')} className="md:col-span-2 md:row-span-1 bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm flex flex-col justify-center relative group cursor-pointer hover:shadow-md hover:border-blue-300 transition-all">
                  <span className="material-symbols-outlined absolute top-4 right-4 text-gray-300 group-hover:text-blue-600 transition-colors text-[20px]">open_in_new</span>
                  <div className="flex items-center gap-4 pr-6">
                    <div className="w-12 h-12 rounded-full bg-[#e6f0f5] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#0f4c64] text-[24px]">lightbulb</span>
                    </div>
                    <h3 className="font-bold text-[#0f4c64] text-[15px] leading-tight">Produção Técnica e Inovação</h3>
                  </div>
                </div>

                {/* LINHA 3 - (4 cards lado a lado) */}
                <div onClick={() => handleNavigation('/grupos-pesquisa')} className="md:col-span-1 md:row-span-1 bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm flex flex-col justify-center relative group cursor-pointer hover:shadow-md hover:border-blue-300 transition-all">
                  <span className="material-symbols-outlined absolute top-4 right-4 text-gray-300 group-hover:text-blue-600 transition-colors text-[20px]">open_in_new</span>
                  <div className="flex items-center gap-4 pr-6">
                    <div className="w-12 h-12 rounded-full bg-[#e6f0f5] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#0f4c64] text-[24px]">groups</span>
                    </div>
                    <h3 className="font-bold text-[#0f4c64] text-sm leading-tight">Grupos de<br/>Pesquisa</h3>
                  </div>
                </div>

                <div onClick={() => handleNavigation('/incites')} className="md:col-span-1 md:row-span-1 bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm flex flex-col justify-center relative group cursor-pointer hover:shadow-md hover:border-blue-300 transition-all">
                  <span className="material-symbols-outlined absolute top-4 right-4 text-gray-300 group-hover:text-blue-600 transition-colors text-[20px]">open_in_new</span>
                  <div className="flex items-center gap-4 pr-6">
                    <div className="w-12 h-12 rounded-full bg-[#e6f0f5] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#0f4c64] text-[24px]">account_balance</span>
                    </div>
                    <h3 className="font-bold text-[#0f4c64] text-sm leading-tight">INCITE -<br/>Institutos de<br/>C&amp;T&amp;I</h3>
                  </div>
                </div>

                <div onClick={() => handleNavigation('/indice-pesquisador')} className="md:col-span-1 md:row-span-1 bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm flex flex-col justify-center relative group cursor-pointer hover:shadow-md hover:border-blue-300 transition-all">
                  <span className="material-symbols-outlined absolute top-4 right-4 text-gray-300 group-hover:text-blue-600 transition-colors text-[20px]">open_in_new</span>
                  <div className="flex items-center gap-4 pr-6">
                    <div className="w-12 h-12 rounded-full bg-[#e6f0f5] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#0f4c64] text-[24px]">workspace_premium</span>
                    </div>
                    <h3 className="font-bold text-[#0f4c64] text-sm leading-tight">Bolsistas de<br/>Produtividade</h3>
                  </div>
                </div>

                <div className="md:col-span-1 md:row-span-1 bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm flex flex-col justify-center relative group cursor-default">
                  <div className="flex items-center gap-4 pr-6">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-gray-400 text-[24px]">psychology</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-[#0f4c64] text-sm leading-tight">Busca por IA</h3>
                      <span className="bg-gray-200 text-gray-500 text-[9px] font-bold px-2 py-0.5 rounded w-max uppercase tracking-wider">Em breve</span>
                    </div>
                  </div>
                </div>

                {/* LINHA 4 - Clube de Ciência (1 Coluna) e VIP (3 Colunas) */}
                <div onClick={() => handleNavigation('/resultados')} className="md:col-span-1 md:row-span-1 bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm flex flex-col justify-center relative group cursor-pointer hover:shadow-md hover:border-blue-300 transition-all">
                  <span className="material-symbols-outlined absolute top-4 right-4 text-gray-300 group-hover:text-blue-600 transition-colors text-[20px]">open_in_new</span>
                  <div className="flex items-center gap-4 pr-6">
                    <div className="w-12 h-12 rounded-full bg-[#e6f0f5] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#0f4c64] text-[24px]">hub</span>
                    </div>
                    <h3 className="font-bold text-[#0f4c64] text-sm leading-tight">Clube de<br/>Ciência</h3>
                  </div>
                </div>

                <div onClick={() => handleNavigation('/paines-dados-externos')} className="md:col-span-3 md:row-span-1 bg-white rounded-[20px] px-8 py-6 border border-gray-200 shadow-sm flex flex-col justify-center relative group hover:shadow-md hover:border-blue-300 transition-all cursor-pointer overflow-hidden">
                  <div className="bento-bg absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('/BG-VIP.png')] bg-no-repeat bg-right bg-cover z-0"></div>
                  <span className="material-symbols-outlined absolute top-4 right-4 text-gray-300 group-hover:text-blue-600 transition-colors z-20 text-[20px]">open_in_new</span>
                  <div className="flex items-center gap-4 z-10">
                    <img src="/LOGO-VIP.svg" alt="VIP" className="h-10 w-auto" />
                    <h3 className="text-xl font-bold text-[#0f4c64] leading-tight">Vitrine de Infraestrutura</h3>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Institutions Showcase */}
          <section id="instituicoes" className="scroll-mt-16 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-24 flex flex-col gap-8 min-h-screen">
            <div className="flex flex-col gap-6 border-b border-gray-200 pb-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl text-slate-800 font-bold tracking-tight">Instituições integradas</h2>
                <p className="text-base text-slate-500">Acesse os dados e produções de cada instituição participante.</p>
              </div>
              
              <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                {[
                  { name: 'Todas', count: institutionsData.length, icon: 'account_balance' },
                  { name: 'Federais', count: institutionsData.filter(i => i.category === 'Federais').length, icon: 'account_balance' },
                  { name: 'Estaduais', count: institutionsData.filter(i => i.category === 'Estaduais').length, icon: 'account_balance' },
                  { name: 'Institutos', count: institutionsData.filter(i => i.category === 'Institutos').length, icon: 'business' },
                  { name: 'Privadas', count: institutionsData.filter(i => i.category === 'Privadas').length, icon: 'domain' }
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
              {filteredInstitutions.map((inst) => (
                <div 
                  key={inst.id}
                  onClick={() => handleNavigation(`/instituicao/${inst.id}`)}
                  className={`bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group min-h-[160px] ${
                    inst.rowSpan === 2 && activeTab === 'Todas' ? 'md:row-span-2' : '' 
                  }`}
                >
                  <img src={`/university-logo/LOGO-${inst.sigla}.png`} alt={`Logo ${inst.sigla}`} className="h-16 md:h-20 w-auto object-contain mb-4 group-hover:scale-105 transition-transform duration-300" />
                  <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-slate-700 transition-colors px-2">{inst.nome}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
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
            <div className="text-sm text-slate-500 text-center md:text-right">© 2026 Observatório da Ciência da Bahia.</div>
          </div>
        </footer>

        {/* Aba de Acessibilidade Flutuante */}
        <div className="a11y-fab fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          <div 
            className={`bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right ${
              isAccessibilityOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-4 pointer-events-none'
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
            </div>
          </div>
          
          <button 
            onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
            className={`text-white p-3.5 rounded-full shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center ${
              isAccessibilityOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-700 hover:bg-blue-800'
            }`}
            aria-label="Menu de Acessibilidade"
          >
            <span className="material-symbols-outlined text-[28px] transition-transform duration-300">
              {isAccessibilityOpen ? 'close' : 'accessibility_new'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}