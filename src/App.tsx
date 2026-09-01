import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Header } from './components/Header';
import { RegistrationsProvider } from './contexts/RegistrationsContext';
import { Events } from './pages/Events';
import { Home } from './pages/Home';
import { Support } from './pages/Support';

export function App() {
  return (
    <BrowserRouter>
      <RegistrationsProvider>
        <div className="flex min-h-screen w-full flex-col bg-gunmetal">
          <Header />

          <main className="mx-auto w-full max-w-7xl flex-grow px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/support" element={<Support />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

        </div>
      </RegistrationsProvider>
    </BrowserRouter>
  );
}