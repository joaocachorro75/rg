import React from 'react';
import { Facebook, Instagram, Phone, MapPin, Mail, Lock } from 'lucide-react';
import { Logo } from './Logo';
import { useContent } from '../context/ContentContext';

export const Footer: React.FC = () => {
  const { content } = useContent();
  const { global } = content;

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    if (target === '#catalogo' || target === '#admin') {
      window.location.hash = target.replace('#', '');
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
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-rg-dark text-white pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="-ml-2">
              <Logo variant="light" height="h-24" />
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              Referência em frios e fatiados. Nossa missão é entregar qualidade superior, higiene impecável e o melhor atendimento para sua casa ou negócio.
            </p>
            <div className="flex gap-4">
              <a href={global.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-rg-yellow hover:text-rg-blue hover:border-rg-yellow transition-all duration-300">
                <Instagram size={22} />
              </a>
              <a href={global.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-rg-yellow hover:text-rg-blue hover:border-rg-yellow transition-all duration-300">
                <Facebook size={22} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-white">Navegação</h4>
            <ul className="space-y-4">
              <li><a href="#home" onClick={(e) => handleNav(e, '#home')} className="text-gray-400 hover:text-rg-yellow transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-rg-red rounded-full"></span> Início</a></li>
              <li><a href="#qualidade" onClick={(e) => handleNav(e, '#qualidade')} className="text-gray-400 hover:text-rg-yellow transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-rg-red rounded-full"></span> Qualidade</a></li>
              <li><a href="#catalogo" onClick={(e) => handleNav(e, '#catalogo')} className="text-gray-400 hover:text-rg-yellow transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-rg-red rounded-full"></span> Produtos</a></li>
              <li><a href="#orcamento" onClick={(e) => handleNav(e, '#orcamento')} className="text-gray-400 hover:text-rg-yellow transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-rg-red rounded-full"></span> Contato</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-white">Contato</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-gray-400 group">
                <div className="w-10 h-10 rounded-lg bg-rg-blue flex items-center justify-center shrink-0 group-hover:text-rg-yellow transition-colors">
                   <Phone size={20} />
                </div>
                <div>
                  <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Telefone / WhatsApp</span>
                  <a href={`https://wa.me/${global.whatsapp}`} target="_blank" className="text-white font-medium hover:text-rg-yellow transition-colors cursor-pointer block">{global.whatsapp}</a>
                </div>
              </li>
              <li className="flex items-start gap-4 text-gray-400 group">
                <div className="w-10 h-10 rounded-lg bg-rg-blue flex items-center justify-center shrink-0 group-hover:text-rg-yellow transition-colors">
                   <Mail size={20} />
                </div>
                <div>
                   <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Email</span>
                   <a href={`mailto:${global.email}`} className="text-white font-medium hover:text-rg-yellow transition-colors cursor-pointer block">{global.email}</a>
                </div>
              </li>
            </ul>
          </div>

           {/* Location */}
           <div>
            <h4 className="font-display font-bold text-lg mb-6 text-white">Localização</h4>
            <div className="flex items-start gap-4 text-gray-400 mb-6">
                <div className="w-10 h-10 rounded-lg bg-rg-blue flex items-center justify-center shrink-0 text-rg-red">
                   <MapPin size={20} />
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {global.address}
                </p>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="flex flex-col md:flex-row gap-4 items-center">
             <p>&copy; {new Date().getFullYear()} RG Frios e Fatiados.</p>
             <a 
               href="#admin" 
               className="hover:text-rg-red transition-colors flex items-center gap-1 opacity-70 hover:opacity-100"
               onClick={(e) => handleNav(e, '#admin')}
             >
               <Lock size={12} /> Área Restrita
             </a>
          </div>
          <div className="flex gap-6 items-center md:mr-20">
             <span className="hidden md:inline text-gray-600">|</span>
             <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Privacidade</a>
             <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};