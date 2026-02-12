import React from 'react';
import { useContent } from '../context/ContentContext';
import { ArrowRight } from 'lucide-react';

export const Products: React.FC = () => {
  const { content } = useContent();

  // Filter only featured products, or take the first 6 if none are marked (fallback)
  const featuredProducts = content.products.filter(p => p.isFeatured);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : content.products.slice(0, 6);

  const goToCatalog = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.hash = 'catalogo';
    window.scrollTo(0, 0);
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="produtos" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-rg-red font-bold uppercase tracking-widest text-sm mb-2 block">Nosso Catálogo</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-rg-blue mb-4">
              Os Favoritos da Casa
            </h2>
            <p className="text-gray-600 text-lg">Confira nossa seleção de produtos mais pedidos. Temos uma variedade enorme esperando por você com frescor garantido.</p>
          </div>
          <a 
            href="#catalogo" 
            onClick={goToCatalog}
            className="inline-flex items-center gap-2 text-rg-blue font-bold hover:text-rg-red transition-colors group px-6 py-3 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200"
          >
            Ver Catálogo Completo 
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="relative h-72 overflow-hidden bg-gray-200">
                <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm text-rg-blue text-xs font-bold px-4 py-1.5 rounded-full z-10 shadow-sm uppercase tracking-wider">
                  {product.category}
                </div>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
              </div>
              <div className="p-8 relative">
                <div className="absolute -top-6 right-6 w-12 h-12 bg-rg-yellow rounded-full flex items-center justify-center text-rg-blue shadow-lg group-hover:scale-110 transition-transform cursor-pointer hover:bg-yellow-300">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
                <h3 className="text-2xl font-bold text-rg-blue mb-2 font-display">{product.name}</h3>
                <p className="text-gray-500 mb-4 line-clamp-2">
                    {product.description || "Ideal para lanches, tábuas de frios e receitas especiais. Sabor marcante."}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> Em estoque
                  </span>
                  <a 
                    href="#orcamento" 
                    onClick={(e) => handleScroll(e, '#orcamento')}
                    className="text-sm font-bold text-rg-red hover:underline"
                  >
                    {product.price || "Solicitar Preço"}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
            <a 
            href="#catalogo"
            onClick={goToCatalog} 
            className="inline-block w-full bg-rg-blue text-white font-bold px-6 py-4 rounded-xl shadow-lg hover:bg-rg-dark transition-colors"
          >
            Ver Catálogo Completo 
          </a>
        </div>
      </div>
    </section>
  );
};