import { useState, useEffect } from 'react';
import { Menu, X, LogIn, LogOut, ExternalLink, ChevronDown, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('sobre');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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

          {/* Autenticação SSO Observatório IdP */}
          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-outline-variant hover:border-primary/50 bg-surface-container-lowest hover:bg-surface-container-low transition-all"
                  title={user.name}
                >
                  <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-on-surface max-w-[120px] truncate hidden lg:inline-block">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface rounded-xl shadow-xl border border-outline-variant py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-outline-variant/50">
                      <p className="text-xs font-semibold text-on-surface truncate">{user.name}</p>
                      <p className="text-[11px] text-on-surface-variant truncate">{user.email || ''}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary rounded">
                          Administrador
                        </span>
                      )}
                    </div>

                    <a
                      href="/verificacao-consistencia"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-on-surface-variant" />
                      <span>Verificação de consistência</span>
                    </a>

                    <a
                      href="/simcc"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-on-surface-variant" />
                      <span>Acessar SimCC</span>
                    </a>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-error hover:bg-error-container/20 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair da conta</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => login()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant hover:border-primary hover:bg-primary/5 text-on-surface hover:text-primary text-xs font-semibold transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-primary" />
                <span>Entrar</span>
              </button>
            )}
          </div>

          <div className="h-6 w-px bg-outline-variant/60 shrink-0" aria-hidden="true" />

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="https://www.ba.gov.br/secti/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity flex items-center cursor-pointer"
              title="Secretaria de Ciência, Tecnologia e Inovação - Governo da Bahia"
            >
              <img
                src="/ESTADO-BAHIA.svg"
                alt="SECTI - Governo do Estado da Bahia"
                className="h-12 w-auto object-contain"
              />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href="https://www.ba.gov.br/secti/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity flex items-center cursor-pointer"
              title="Secretaria de Ciência, Tecnologia e Inovação - Governo da Bahia"
            >
              <img
                src="/ESTADO-BAHIA.svg"
                alt="SECTI - Governo do Estado da Bahia"
                className="h-6 w-auto object-contain"
              />
            </a>
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
          <div className="pt-3 border-t border-outline-variant/60 flex flex-col gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[10px] uppercase">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span className="text-xs font-medium text-on-surface truncate max-w-[160px]">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-xs text-error font-medium"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  login();
                }}
                className="text-xs text-primary font-semibold flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar no Observatório</span>
              </button>
            )}

            <div className="flex items-center justify-between">
              <a
                href="https://www.ba.gov.br/secti/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity flex items-center cursor-pointer"
                title="Secretaria de Ciência, Tecnologia e Inovação - Governo da Bahia"
              >
                <img
                  src="/ESTADO-BAHIA.svg"
                  alt="SECTI - Governo do Estado da Bahia"
                  className="h-7 w-auto object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
