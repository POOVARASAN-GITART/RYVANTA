import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AdminPanel } from './components/AdminPanel';
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
        <div className="flex min-h-screen w-full flex-col bg-gunmetal">
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
      </RegistrationsProvider>
    </BrowserRouter>);

}