import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export const Hero: React.FC = () => {
  const { content } = useContent();
  const { hero } = content;

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    if (target === '#catalogo') {
      window.location.hash = 'catalogo';
      window.scrollTo(0, 0);
    } else {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={hero.bgImage} 
          alt="Banner Principal" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-rg-dark via-rg-blue/90 to-rg-blue/40"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-white space-y-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1]">
            {hero.title}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 max-w-lg leading-relaxed whitespace-pre-line">
            {hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a 
              href="#orcamento"
              onClick={(e) => handleNav(e, '#orcamento')}
              className="bg-rg-yellow text-rg-blue px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center justify-center gap-2 group transform hover:-translate-y-1"
            >
              Fazer Pedido
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#catalogo"
              onClick={(e) => handleNav(e, '#catalogo')}
              className="px-8 py-4 rounded-xl font-bold text-lg text-white border-2 border-white/20 hover:bg-white/10 hover:border-white transition-all flex items-center justify-center backdrop-blur-sm"
            >
              Ver Produtos
            </a>
          </div>
        </div>

        {/* Visual Element */}
        <div className="hidden md:block relative">
            <div className="absolute -inset-4 bg-rg-yellow/20 rounded-full blur-3xl animate-pulse"></div>
            
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500 max-w-sm ml-auto">
                <div className="relative overflow-hidden rounded-xl mb-6 shadow-lg">
                  <img 
                    src={hero.highlightImage || content.products[0]?.image || "https://images.unsplash.com/photo-1621342674251-c03534d0b043?q=80&w=800"}
                    alt="Destaque"
                    className="w-full object-cover hover:scale-110 transition-transform duration-700 aspect-square"
                  />
                  <div className="absolute top-2 right-2 bg-rg-red text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Mais Vendido
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-white">
                   <div>
                     <p className="text-sm text-rg-yellow font-medium mb-1">Seleção do Mês</p>
                     <h3 className="text-2xl font-display font-bold">Tábua Gourmet</h3>
                   </div>
                   <div className="bg-white p-3 rounded-full shadow-lg">
                     <ArrowRight className="text-rg-blue" />
                   </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};