import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AdminPanel } from './components/AdminPanel';
import { CyberCursor } from './components/CyberCursor';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { RegistrationsProvider } from './contexts/RegistrationsContext';
import { Events } from './pages/Events';
import { Home } from './pages/Home';
import { Support } from './pages/Support';

export function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    if (!isAdminOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsAdminOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isAdminOpen]);

  return (
    <BrowserRouter>
      <RegistrationsProvider>
        <div className="relative min-h-screen w-full flex-col bg-[#030712] overflow-x-hidden text-slate-200">
          {/* Interactive Futuristic Cursor */}
          <CyberCursor />

          {/* Ambient Cyber Neural Particle Wave Background Layer */}
          <div
            className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-35 mix-blend-screen"
            style={{
              backgroundImage: 'url(/cyber-bg.jpg)',
              backgroundAttachment: 'fixed'
            }}
          />

          {/* Deep dark gradient overlay for crystal clear contrast */}
          <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-[#030712]/70 via-[#030712]/85 to-[#030712]" />

          {/* Main App Content Layout */}
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header onOpenAdmin={() => setIsAdminOpen(true)} />

            <main className="mx-auto w-full max-w-7xl flex-grow px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/support" element={<Support />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>

            <Footer />

            {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}
          </div>
        </div>
      </RegistrationsProvider>
    </BrowserRouter>
  );
}