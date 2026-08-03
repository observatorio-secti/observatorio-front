import React, { useState, useEffect } from 'react';
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

  return (
    <header className="bg-surface/95 backdrop-blur-sm border-b border-outline-variant w-full sticky top-0 z-50 h-16 transition-all duration-300">
      <div className="flex justify-between items-center w-full px-4 md:px-16 h-full max-w-[1280px] mx-auto">
        {/* Brand Logo */}
        <a className="flex items-center h-16 py-0 overflow-hidden" href="#sobre">
          <img
            alt="Observatório Logo"
            className="h-full w-auto object-contain scale-125 origin-left"
            src="https://lh3.googleusercontent.com/aida/AP1WRLu51lMIJZ29XZY_5mHIa2bYRoXvzE_-cP0OtQ05w_jj3_qpRDMNzp7WndWUdRMV-GMm1IVmwdjCZNJMQYKbRcSXRADUNqhNePVmh9tfOQrh8-Eg0MyVTBVm4TjkoDQSDtxQjwbRNdumhh1TCT0uFrBuFurbQfXnhkYcnV6EqDL7F0O12kftRNMrtUUGxjQ8rLqriAaklNLCclFVAURc0zHvdRYxU00oizHk94PYW8d0KT2iOvV01US2wGxU"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 h-full">
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

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
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
        </div>
      )}
    </header>
  );
}
