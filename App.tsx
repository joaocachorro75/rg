import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Products } from './components/Products';
import { LeadForm } from './components/LeadForm';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ContentProvider } from './context/ContentContext';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { Catalog } from './components/Catalog';

export default function App() {
  const [currentHash, setCurrentHash] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check URL hash for simple "routing"
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      // Scroll to top when changing "pages" (like moving to catalog)
      if (window.location.hash === '#catalogo' || window.location.hash === '#admin') {
        window.scrollTo(0, 0);
      }
    };
    
    // Verificação inicial
    handleHashChange();

    // Listeners para mudanças
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange); // Backup para navegação do navegador
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const MainSite = () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Products />
        <LeadForm />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );

  return (
    <ContentProvider>
      {currentHash === '#admin' ? (
        isLoggedIn ? (
          <AdminDashboard onLogout={() => { setIsLoggedIn(false); window.location.hash = ''; }} />
        ) : (
          <AdminLogin onLogin={() => setIsLoggedIn(true)} />
        )
      ) : currentHash === '#catalogo' ? (
        <Catalog />
      ) : (
        <MainSite />
      )}
    </ContentProvider>
  );
}