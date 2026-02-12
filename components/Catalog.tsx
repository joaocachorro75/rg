import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { Logo } from './Logo';
import { Search, ArrowLeft, Filter, ShoppingBag } from 'lucide-react';
import { Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';

export const Catalog: React.FC = () => {
  const { content } = useContent();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique categories
    const cats = ['Todos', ...new Set(content.products.map(p => p.category))];
    setCategories(cats);
    
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [content.products]);

  const filteredProducts = content.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOrder = (productName: string) => {
    const message = `Olá! Gostaria de fazer um pedido do item: *${productName}* que vi no Catálogo Online.`;
    const url = `https://wa.me/${content.global.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const goHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.hash = '';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Catalog Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <a 
              href="#home" 
              onClick={goHome}
              className="flex items-center gap-2 text-gray-600 hover:text-rg-blue transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              Voltar ao Início
            </a>
            <Logo height="h-12" />
            <div className="w-20"></div> {/* Spacer for center logo balance */}
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
             <h1 className="text-2xl font-display font-bold text-rg-blue flex items-center gap-2">
               <ShoppingBag className="text-rg-yellow" />
               Catálogo Completo
             </h1>
             
             <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar produtos..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-rg-yellow focus:ring-2 focus:ring-rg-yellow/20"
                />
             </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="border-t border-gray-100 overflow-x-auto">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 py-3 min-w-max">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'bg-rg-blue text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col">
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-rg-blue z-10">
                    {product.category}
                  </span>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay Action */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => handleOrder(product.name)}
                      className="bg-rg-yellow text-rg-blue font-bold px-6 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg"
                    >
                      Pedir Agora
                    </button>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="mb-auto">
                    <h3 className="text-lg font-bold text-rg-blue mb-1 line-clamp-1" title={product.name}>{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2 min-h-[2.5rem]">
                      {product.description || "Produto fresco e de alta qualidade selecionado para você."}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-4">
                    <span className="text-lg font-bold text-rg-red">
                      {product.price || "Consulte"}
                    </span>
                    <button 
                      onClick={() => handleOrder(product.name)}
                      className="text-sm font-semibold text-rg-blue hover:text-rg-yellow transition-colors underline"
                    >
                      Pedir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <Filter size={48} className="text-gray-300 mb-4" />
             <h3 className="text-xl font-bold text-gray-600">Nenhum produto encontrado</h3>
             <p className="text-gray-400">Tente buscar por outro termo ou mude a categoria.</p>
             <button 
               onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); }}
               className="mt-4 text-rg-blue font-bold hover:underline"
             >
               Limpar Filtros
             </button>
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};