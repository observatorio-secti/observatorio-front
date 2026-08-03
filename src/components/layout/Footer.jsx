import React from 'react';

export function Footer() {
  return (
    <footer className="bg-navy-deep w-full mt-auto scroll-mt-16 text-surface-white">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-16 py-8 max-w-[1280px] mx-auto gap-y-6 w-full">
        {/* Brand Logo in Footer */}
        <div className="font-display text-2xl font-bold tracking-widest uppercase flex items-center gap-2">
          Observatório
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a
            className="text-xs text-surface-variant/80 hover:text-primary-fixed hover:opacity-100 transition-opacity underline-offset-4 hover:underline"
            href="#privacidade"
          >
            Privacidade
          </a>
          <a
            className="text-xs text-surface-variant/80 hover:text-primary-fixed hover:opacity-100 transition-opacity underline-offset-4 hover:underline"
            href="#termos"
          >
            Termos de Uso
          </a>
          <a
            className="text-xs text-surface-variant/80 hover:text-primary-fixed hover:opacity-100 transition-opacity underline-offset-4 hover:underline"
            href="#contato"
          >
            Contato
          </a>
          <a
            className="text-xs text-surface-variant/80 hover:text-primary-fixed hover:opacity-100 transition-opacity underline-offset-4 hover:underline"
            href="#sobre"
          >
            Sobre o Simcc
          </a>
        </nav>

        {/* Copyright */}
        <div className="text-xs text-surface-variant/60 text-center md:text-right">
          © {new Date().getFullYear()} Observatório da Ciência da Bahia - Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
