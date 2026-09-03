import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AdminPanel } from './components/AdminPanel';
import { FloatingSupportWidget } from './components/FloatingSupportWidget';
import { TechConstellationBackground } from './components/TechConstellationBackground';
import { RyvantaIntroLoader } from './components/RyvantaIntroLoader';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { RegistrationsProvider } from './contexts/RegistrationsContext';
import { Events } from './pages/Events';
import { Home } from './pages/Home';
import { Support } from './pages/Support';

export function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoadingIntro, setIsLoadingIntro] = useState(true);
  const keyBuffer = useRef('');

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // 1. Close on Escape
      if (event.key === 'Escape' && isAdminOpen) {
        setIsAdminOpen(false);
        return;
      }

      // Ignore input fields
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }

      // 2. Secret Keyboard Shortcut: Ctrl + Shift + A or Cmd + Shift + A or F2
      if (
        ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === 'A' || event.key === 'a')) ||
        event.key === 'F2'
      ) {
        event.preventDefault();
        setIsAdminOpen((prev) => !prev);
        return;
      }

      // 3. Secret Sequence: Typing "admin" on keyboard
      if (/^[a-zA-Z]$/.test(event.key)) {
        keyBuffer.current = (keyBuffer.current + event.key.toLowerCase()).slice(-5);
        if (keyBuffer.current === 'admin') {
          keyBuffer.current = '';
          setIsAdminOpen(true);
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isAdminOpen]);

  return (
    <BrowserRouter>
      <RegistrationsProvider>
        {/* Full-Screen Unique Edge-Slide Intro Loading Animation */}
        {isLoadingIntro && (
          <RyvantaIntroLoader onComplete={() => setIsLoadingIntro(false)} />
        )}

        <div className="relative min-h-screen w-full flex-col bg-[#FFFFFF] overflow-x-hidden text-[#1E293B] selection:bg-[#0EA5E9] selection:text-white">
          {/* Interactive Living Tech Constellation Canvas Background (Enlarged & Cinematic) */}
          <TechConstellationBackground />

          {/* Persistent Floating Support Widget */}
          <FloatingSupportWidget />

          {/* Main App Content Layout */}
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header onOpenAdmin={() => setIsAdminOpen(true)} />

            <main className="mx-auto w-full max-w-7xl flex-grow px-4 sm:px-6 lg:px-8 py-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/support" element={<Support />} />
                <Route path="/admin" element={<AdminDirectView />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>

            <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

            {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}
          </div>
        </div>
      </RegistrationsProvider>
    </BrowserRouter>
  );
}

function AdminDirectView() {
  return (
    <div className="py-12 text-center">
      <AdminPanel onClose={() => window.history.back()} />
    </div>
  );
}

export default App;