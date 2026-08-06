import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const [activeSection, setActiveSection] = useState('sobre');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['sobre', 'modulos', 'instituicoes'];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Sobre', href: '#sobre', id: 'sobre' },
    { label: 'Módulos', href: '#modulos', id: 'modulos' },
    { label: 'Instituições', href: '#instituicoes', id: 'instituicoes' },
  ];

  const showName = activeSection !== 'sobre';

  return (
    <header className="bg-surface/95 backdrop-blur-sm border-b border-outline-variant w-full sticky top-0 z-50 h-16 transition-all duration-300">
      <div className="flex justify-between items-center w-full px-4 md:px-16 h-full max-w-[1280px] mx-auto">
        {/* Brand Logo */}
        <a className="flex items-center h-16 py-2 overflow-hidden group" href="#sobre">
          <div className="relative flex items-center h-full">
            {/* Logo Icon */}
            <img
              alt="Observatório Logo"
              className="h-10 w-auto object-contain z-10 relative shrink-0 transition-transform duration-300 group-hover:scale-105"
              src="/LOGO.png"
            />

            {/* Name sliding from under logo left-to-right on section 2 */}
            <div
              className={cn(
                'transition-all duration-500 ease-out flex items-center h-full overflow-hidden shrink-0',
                showName
                  ? 'max-w-[280px] opacity-100 translate-x-0 ml-2.5'
                  : 'max-w-0 opacity-0 -translate-x-8 ml-0 pointer-events-none'
              )}
            >
              <img
                alt="Observatório de CT&I da Bahia"
                className="h-12 md:h-16 w-auto object-contain shrink-0"
                src="/NOME.png"
              />
            </div>
          </div>
        </a>

        {/* Desktop Navigation & Apoio */}
        <div className="hidden md:flex items-center gap-6 h-full">
          <nav className="flex items-center gap-6 h-full">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={cn(
                  'font-medium text-xs md:text-sm transition-colors duration-200 py-1 border-b-2',
                  activeSection === item.id
                    ? 'text-primary border-primary font-semibold'
                    : 'text-on-surface-variant border-transparent hover:text-primary'
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="h-6 w-px bg-outline-variant/60 shrink-0" aria-hidden="true" />

          {/* Apoio section */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xs font-semibold text-on-surface-variant/80 uppercase tracking-wider select-none">
              Apoio:
            </span>
            <img
              src="/ESTADO-BAHIA.svg"
              alt="Governo do Estado da Bahia"
              className="h-12 w-auto object-contain"
            />
          </div>
        </div>

        {/* Mobile Header Right (Apoio Icon + Menu Button) */}
        <div className="flex items-center gap-3 md:hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-semibold text-on-surface-variant/70 uppercase tracking-wider select-none">
              Apoio:
            </span>
            <img
              src="/ESTADO-BAHIA.svg"
              alt="Governo do Estado da Bahia"
              className="h-6 w-auto object-contain"
            />
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors focus:outline-hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-outline-variant px-6 py-4 flex flex-col gap-3 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'text-sm py-2 px-3 rounded-md transition-colors',
                activeSection === item.id
                  ? 'bg-surface-container text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              )}
            >
              {item.label}
            </a>
          ))}
          <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant/80 uppercase tracking-wider select-none">
              Apoio:
            </span>
            <img
              src="/ESTADO-BAHIA.svg"
              alt="Governo do Estado da Bahia"
              className="h-7 w-auto object-contain"
            />
          </div>
        </div>
      )}
    </header>
  );
}
