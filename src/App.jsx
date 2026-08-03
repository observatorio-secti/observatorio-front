import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { ModulesSection } from '@/components/sections/ModulesSection';
import { InstitutionsSection } from '@/components/sections/InstitutionsSection';

export default function App() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col antialiased">
      <Header />
      <main className="flex-grow flex flex-col items-center w-full">
        <HeroSection />
        <ModulesSection />
        <InstitutionsSection />
      </main>
      <Footer />
    </div>
  );
}
