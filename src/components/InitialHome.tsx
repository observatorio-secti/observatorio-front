import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importações dos dados e do novo componente
import { modulesData } from '../data/modulesData';
import FeaturedResearchers from './FeaturedResearchers';
import { useHomeQuantitativeData, HeroMetricCards, DadosDestaqueSection } from '../hooks/useHomeQuantitativeData';

// Tipagem básica para os módulos
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

export default function InitialHome() {
  const navigate = useNavigate();
  
  // Custom Hook de Dados Quantitativos da Home
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://simcc.uesc.br/v3/api/';
  const { data: quantData, loading: quantLoading } = useHomeQuantitativeData(apiBaseUrl);
  
  // Estados de UI e Navegação
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('Todas');
  const [activeSection, setActiveSection] = useState('');
  
  // Estados de Acessibilidade
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100); 
  const [isHighContrast, setIsHighContrast] = useState(false);

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

  const handleModuleClick = (link: string) => {
    if (link.startsWith('http')) {
      window.location.href = link; 
    } else {
      navigate(link); 
    }
  };

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
      <style>
        {`
          html { font-size: ${fontSize}%; transition: font-size 0.3s ease; }
          ${isHighContrast ? `html { filter: invert(1) hue-rotate(180deg) contrast(1.2) !important; background-color: #000 !important; } img, .a11y-fab, .hero-bg, .bento-bg { filter: invert(1) hue-rotate(180deg) !important; }` : ''}
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
          <section id="sobre" className="scroll-mt-16 w-full relative min-h-[calc(100vh-140px)] flex flex-col justify-center overflow-hidden py-24">
            <div className="hero-bg absolute inset-0 pointer-events-none bg-[url('/BG-OBSERVATORIO.png')] bg-no-repeat bg-center bg-cover z-0"></div>
            
            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col items-start text-left gap-8">
                <h1 className="text-4xl md:text-[56px] md:leading-[64px] text-slate-800 font-extrabold tracking-tight">
                  Observatório <br />
                  de <span className="bg-blue-800 text-white px-5 py-1 rounded-[20px] inline-flex items-center justify-center align-middle -translate-y-1 mx-1 border-b-[3px] border-red-600 shadow-sm">CT&I</span> da <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-red-600">Bahia</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
                  Explore dados integrados sobre produção científica, pesquisadores, instituições e inovações no estado da Bahia, apresentados com clareza e precisão.
                </p>
                <div className="flex gap-4">
                  <button onClick={(e) => scrollToSection(e as any, 'modulos')} className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-md flex items-center gap-2 hover:-translate-y-1 duration-300">
                    Acessar Módulos <span className="material-symbols-outlined transition-transform group-hover:translate-y-1">arrow_downward</span>
                  </button>
                </div>
              </div>
              <HeroMetricCards data={quantData} loading={quantLoading} />
            </div>
          </section>

          {/* DADOS EM DESTAQUE SECTION */}
          <section className="w-full bg-white py-12 border-y border-gray-200 relative z-20 shadow-sm -mt-6">
             <div className="max-w-[1400px] mx-auto px-6 md:px-12">
               <DadosDestaqueSection data={quantData} loading={quantLoading} />
             </div>
          </section>

          {/* Módulos da Plataforma (Bento Grid) */}
          <section id="modulos" className="scroll-mt-16 w-full py-24">
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
                  
                  if (module.id === 'simcc-mapeamento') {
                    return (
                      <div key={module.id} onClick={() => handleModuleClick(module.link)} className={`${module.gridClass} bg-white rounded-[20px] p-8 border-2 border-blue-100 shadow-sm flex flex-col relative group hover:shadow-xl hover:border-blue-600 transition-all duration-500 hover:-translate-y-1.5 cursor-pointer overflow-hidden`}>
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-700 via-blue-600 to-red-600 opacity-90 group-hover:opacity-100 group-hover:w-2 transition-all duration-300 z-20"></div>
                        
                        <div className="bento-bg absolute inset-0 opacity-15 pointer-events-none bg-[url('/BG-SIMCC.png')] bg-no-repeat bg-right-bottom bg-contain z-0 transition-transform duration-700 ease-in-out group-hover:scale-[1.08] group-hover:-translate-x-2 group-hover:-translate-y-2"></div>
                        
                        <span className="material-symbols-outlined absolute top-6 right-6 text-gray-300 group-hover:text-blue-600 transition-colors z-20 text-[20px]">open_in_new</span>
                        
                        <div className="flex items-center gap-4 mb-4 z-10 pl-2">
                          {module.logo && <img src={module.logo} alt="SIMCC" className="h-10 w-auto" />}
                          <h3 className="text-[22px] font-bold text-[#0f4c64] leading-tight" dangerouslySetInnerHTML={{ __html: module.title.replace(' de ', ' de<br/>') }}></h3>
                        </div>
                        
                        {/* NUVEM DE PALAVRAS COM TAMANHOS LEVEMENTE MAIORES E ESPAÇAMENTO EQUILIBRADO */}
                        <div className="flex-grow relative w-full h-full min-h-[160px] select-none z-10 overflow-hidden font-sans">
                           
                           {/* Centro */}
                           <div className="absolute top-[48%] left-[46%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
                             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-red-600 font-extrabold text-[52px] leading-none tracking-tight">Bahia</span>
                           </div>
                           
                           {/* Palavras próximas ao centro */}
                           <span className="absolute top-[26%] left-[27%] text-[#0f4c64] font-bold text-xl">Brasil</span>
                           <span className="absolute top-[30%] left-[38%] text-slate-400 font-bold text-base">Estudo</span>
                           <span className="absolute top-[20%] right-[30%] text-[#0f4c64] font-bold text-xl -rotate-90">Avaliacao</span>
                           <span className="absolute top-[24%] right-[20%] text-[#0f4c64] font-extrabold text-3xl -rotate-90">Educacao</span>
                           <span className="absolute bottom-[30%] left-[42%] text-[#0f4c64] font-bold text-3xl">Analise</span>
                           <span className="absolute bottom-[16%] left-[38%] text-[#0f4c64] font-bold text-base">Caso</span>
                           <span className="absolute bottom-[20%] right-[30%] text-[#0f4c64] font-extrabold text-xl">Producao</span>
                           <span className="absolute bottom-[28%] right-[24%] text-[#0f4c64] font-bold text-base">Formacao</span>
                           
                           {/* Palavras das bordas (Trazidas para perto, com tamanho um pouco maior) */}
                           <span className="absolute top-[20%] left-[14%] text-slate-400 font-medium text-sm">Desenvolvimento</span>
                           <span className="absolute top-[34%] left-[14%] text-[#0f4c64] font-bold text-base -rotate-90">Estado</span>
                           <span className="absolute top-[52%] left-[14%] text-slate-400 font-medium text-sm -rotate-90">Brazil</span>
                           <span className="absolute bottom-[16%] left-[14%] text-slate-400 font-medium text-sm -rotate-90">Experiencia</span>
                           
                           <span className="absolute bottom-[38%] left-[22%] text-[#0f4c64] font-bold text-2xl">Saude</span>
                           <span className="absolute bottom-[25%] left-[24%] text-slate-400 font-bold text-sm -rotate-90">Ensino</span>
                           <span className="absolute bottom-[12%] left-[22%] text-[#0f4c64] font-bold text-lg">Social</span>

                           <span className="absolute top-[22%] right-[14%] text-slate-400 font-medium text-sm -rotate-90">Municipio</span>
                           <span className="absolute top-[48%] right-[14%] text-slate-400 font-medium text-sm">Relato</span>
                           <span className="absolute bottom-[14%] right-[14%] text-[#0f4c64] font-bold text-sm -rotate-90">Trabalho</span>
                           <span className="absolute bottom-[10%] right-[26%] text-slate-400 font-medium text-sm">Diferentes</span>
                        </div>
                        
                        <div className="mt-auto pt-4 flex flex-col sm:flex-row items-center gap-4 justify-between z-10 pl-2">
                          <div className="flex-grow w-full bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center gap-2 border border-gray-200">
                            <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
                            <input type="text" placeholder="Pesquisar competências..." onClick={(e) => e.stopPropagation()} className="bg-transparent border-none outline-none w-full text-sm text-slate-600 placeholder-gray-400"/>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); handleModuleClick(module.link); }} className="text-gray-400 font-bold text-xs tracking-wider flex items-center gap-1 hover:text-red-600 transition-colors uppercase whitespace-nowrap bg-white/80 py-2 px-3 rounded-lg group-hover:bg-red-50 group-hover:text-red-600 duration-300">
                            MAIS <span className="material-symbols-outlined text-[16px]">expand_less</span>
                          </button>
                        </div>
                      </div>
                    );
                  }

                  if (module.id === 'vip-vitrine') {
                    return (
                      <div key={module.id} onClick={() => handleModuleClick(module.link)} className={`${module.gridClass} bg-white rounded-[20px] px-8 py-6 border-2 border-blue-100 shadow-sm flex flex-col justify-center relative group hover:shadow-xl hover:border-blue-600 transition-all duration-500 hover:-translate-y-1.5 cursor-pointer overflow-hidden`}>
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-700 via-blue-600 to-red-600 opacity-90 group-hover:opacity-100 group-hover:w-2 transition-all duration-300 z-20"></div>
                        
                        <div className="bento-bg absolute inset-0 opacity-[0.08] pointer-events-none bg-no-repeat bg-right bg-cover z-0 transition-transform duration-700 ease-in-out group-hover:scale-105 group-hover:-translate-x-3 group-hover:-translate-y-1" style={{ backgroundImage: `url(${module.bgImage})` }}></div>
                        
                        <span className="material-symbols-outlined absolute top-4 right-4 text-gray-300 group-hover:text-blue-600 transition-colors z-20 text-[20px]">open_in_new</span>
                        <div className="flex items-center gap-4 z-10 pl-2">
                          {module.logo && <img src={module.logo} alt="VIP" className="h-10 w-auto" />}
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

          {/* Institutions Showcase */}
          <section id="instituicoes" className="scroll-mt-16 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-24 flex flex-col gap-8">
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
                  onClick={() => handleModuleClick(`/instituicao/${inst.sigla.toLowerCase()}`)}
                  className={`bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[160px] ${
                    inst.rowSpan === 2 && activeTab === 'Todas' ? 'md:row-span-2' : '' 
                  }`}
                >
                  <img src={`/university-logo/LOGO-${inst.sigla}.png`} alt={`Logo ${inst.sigla}`} className="h-16 md:h-20 w-auto object-contain mb-4 group-hover:scale-110 transition-transform duration-500" />
                  <p className="text-xs md:text-sm text-slate-500 text-center font-medium group-hover:text-blue-700 transition-colors px-2">{inst.nome}</p>
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

        {/* Menu Flutuante de Acessibilidade */}
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