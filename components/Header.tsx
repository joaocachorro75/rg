import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Qualidade', href: '#qualidade' },
    { name: 'Produtos', href: '#catalogo' },
    { name: 'Contato', href: '#orcamento' }
  ];

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (target === '#catalogo') {
      window.location.hash = 'catalogo';
      window.scrollTo(0, 0);
      return;
    }

    // Se estivermos no catálogo ou admin, voltamos para a home primeiro
    if (window.location.hash === '#catalogo' || window.location.hash === '#admin') {
      window.location.hash = '';
      setTimeout(() => {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // Já estamos na home
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Brand Logo */}
        <a 
          href="#home" 
          onClick={(e) => handleNav(e, '#home')}
          className="hover:opacity-95 transition-opacity block pb-4"
        >
           <Logo 
             variant={isScrolled ? 'dark' : 'light'} 
             height={isScrolled ? "h-14" : "h-20 md:h-24"} 
           />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a 
              key={item.name}
              href={item.href}
              onClick={(e) => handleNav(e, item.href)}
              className={`font-medium text-sm uppercase tracking-wide hover:text-rg-yellow transition-colors ${
                isScrolled ? 'text-gray-700' : 'text-white/95 font-semibold drop-shadow-md'
              }`}
            >
              {item.name}
            </a>
          ))}
          <a 
            href="#orcamento"
            onClick={(e) => handleNav(e, '#orcamento')}
            className="bg-rg-yellow text-rg-blue px-6 py-3 rounded-full font-bold text-sm hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Peça Agora
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className={`md:hidden ${isScrolled ? 'text-rg-blue' : 'text-white drop-shadow-md'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={32} className="text-rg-blue" /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 right-0 min-h-screen bg-white z-50 flex flex-col animate-fade-in">
          <div className="p-4 flex justify-between items-center border-b border-gray-100 bg-gray-50">
             <Logo variant="dark" height="h-16" />
             <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-rg-red">
               <X size={32} />
             </button>
          </div>
          <div className="flex flex-col p-6 gap-6">
            {navLinks.map((item) => (
              <a 
                key={item.name}
                href={item.href}
                onClick={(e) => handleNav(e, item.href)}
                className="text-rg-blue font-display font-bold text-2xl border-b border-gray-100 pb-2"
              >
                {item.name}
              </a>
            ))}
             <a 
              href="#orcamento"
              onClick={(e) => handleNav(e, '#orcamento')}
              className="bg-rg-yellow text-rg-blue px-5 py-4 rounded-xl font-bold text-lg text-center mt-4 shadow-lg hover:bg-yellow-300 transition-colors"
            >
              Solicitar Catálogo PDF
            </a>
          </div>
        </div>
      )}
    </header>
  );
};