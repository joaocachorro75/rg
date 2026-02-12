import React, { useState } from 'react';
import { useContent, SiteContent, Product } from '../context/ContentContext';
import { Save, Download, RefreshCw, LogOut, Plus, Trash, Image as ImageIcon, Upload, Star } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { content, updateContent, leads, removeLead, downloadLeadsCSV, resetToDefaults } = useContent();
  const [activeTab, setActiveTab] = useState<'content' | 'products' | 'leads'>('content');
  
  // Local state for form editing
  const [formData, setFormData] = useState<SiteContent>(content);
  const [isSaved, setIsSaved] = useState(false);

  // Helper to handle product updates specifically
  const handleProductChange = (id: number, field: keyof Product, value: any) => {
    const updatedProducts = formData.products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    );
    setFormData({ ...formData, products: updatedProducts });
  };

  const handleSave = () => {
    updateContent(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleGlobalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      global: { ...formData.global, [e.target.name]: e.target.value }
    });
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      hero: { ...formData.hero, [e.target.name]: e.target.value }
    });
  };

  // Generic File Upload Handler
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    callback: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addProduct = () => {
    const newId = Math.max(...formData.products.map(p => p.id), 0) + 1;
    const newProduct: Product = {
      id: newId,
      name: "Novo Produto",
      category: "Geral",
      image: "https://via.placeholder.com/600",
      price: "",
      description: "",
      isFeatured: false
    };
    // Add to beginning of list
    setFormData({ ...formData, products: [newProduct, ...formData.products] });
  };

  const removeProduct = (id: number) => {
    if (confirm("Remover este produto?")) {
      setFormData({ 
        ...formData, 
        products: formData.products.filter(p => p.id !== id) 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm sticky top-0 z-50">
          <div>
              <h1 className="text-2xl font-display font-bold text-rg-blue">Painel Administrativo</h1>
              <p className="text-xs text-gray-500">Gerencie conteúdo, catálogo e leads.</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={handleSave} 
                className={`px-6 py-2 rounded-lg font-bold shadow transition-all flex items-center gap-2 ${isSaved ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-rg-blue text-white hover:bg-blue-900'}`}
            >
                <Save size={18} />
                {isSaved ? "Salvo!" : "Salvar Tudo"}
            </button>
            <button onClick={onLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-100">
                <LogOut size={18} /> Sair
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'content' ? 'bg-white text-rg-blue shadow-md border-l-4 border-rg-yellow' : 'bg-transparent text-gray-500 hover:bg-white/50'}`}
          >
            Conteúdo Geral
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'products' ? 'bg-white text-rg-blue shadow-md border-l-4 border-rg-yellow' : 'bg-transparent text-gray-500 hover:bg-white/50'}`}
          >
            Gerenciar Catálogo ({formData.products.length})
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'leads' ? 'bg-white text-rg-blue shadow-md border-l-4 border-rg-yellow' : 'bg-transparent text-gray-500 hover:bg-white/50'}`}
          >
            Leads Capturados ({leads.length})
          </button>
        </div>

        {activeTab === 'content' && (
          <div className="space-y-8 animate-fade-in">
             <div className="flex justify-end">
                <button onClick={resetToDefaults} className="text-gray-500 hover:text-rg-red text-sm flex items-center gap-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                    <RefreshCw size={14} /> Resetar Padrões de Fábrica
                </button>
            </div>

            {/* Global Settings */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold text-rg-blue mb-4 border-b pb-2">Configurações Globais</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logomarca do Site</label>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                            {formData.global.logoUrl ? (
                                <img src={formData.global.logoUrl} className="w-full h-full object-contain" alt="Preview" />
                            ) : (
                                <span className="text-gray-400 text-xs">Sem logo</span>
                            )}
                        </div>
                        <div className="flex-1 w-full">
                           <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-full md:w-auto inline-block mb-3">
                              <Upload size={16} />
                              <span className="text-sm">Fazer Upload da Logo</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleFileUpload(e, (base64) => setFormData({...formData, global: {...formData.global, logoUrl: base64}}))} 
                                className="hidden" 
                              />
                           </label>
                           <p className="text-xs text-gray-500">Recomendado: Imagem PNG com fundo transparente.</p>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (Apenas números)</label>
                    <input type="text" name="whatsapp" value={formData.global.whatsapp} onChange={handleGlobalChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contato</label>
                    <input type="text" name="email" value={formData.global.email} onChange={handleGlobalChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                    <input type="text" name="address" value={formData.global.address} onChange={handleGlobalChange} className="w-full p-2 border rounded" />
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold text-rg-blue mb-4 border-b pb-2">Seção Principal (Topo)</h2>
              <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título Principal</label>
                    <input type="text" name="title" value={formData.hero.title} onChange={handleHeroChange} className="w-full p-2 border rounded font-display font-bold" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                    <textarea name="subtitle" value={formData.hero.subtitle} onChange={handleHeroChange} className="w-full p-2 border rounded h-24" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Texto de Destaque (Badge)</label>
                    <input type="text" name="highlightText" value={formData.hero.highlightText} onChange={handleHeroChange} className="w-full p-2 border rounded" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de Fundo (Banner)</label>
                        <div className="flex flex-col gap-3">
                            <div className="w-full h-32 bg-gray-100 rounded overflow-hidden border border-gray-200">
                                 <img src={formData.hero.bgImage} className="w-full h-full object-cover" alt="Hero BG" />
                            </div>
                            <label className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-full">
                                <Upload size={16} />
                                <span className="text-sm">Alterar Banner</span>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => handleFileUpload(e, (base64) => setFormData({...formData, hero: {...formData.hero, bgImage: base64}}))} 
                                    className="hidden" 
                                />
                            </label>
                        </div>
                    </div>
                    
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de Destaque (Tábua Gourmet)</label>
                        <div className="flex flex-col gap-3">
                            <div className="w-full h-32 bg-gray-100 rounded overflow-hidden border border-gray-200 flex items-center justify-center">
                                 {formData.hero.highlightImage ? (
                                    <img src={formData.hero.highlightImage} className="w-full h-full object-cover" alt="Highlight" />
                                 ) : (
                                    <ImageIcon className="text-gray-300" />
                                 )}
                            </div>
                            <label className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-full">
                                <Upload size={16} />
                                <span className="text-sm">Alterar Tábua</span>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => handleFileUpload(e, (base64) => setFormData({...formData, hero: {...formData.hero, highlightImage: base64}}))} 
                                    className="hidden" 
                                />
                            </label>
                        </div>
                    </div>
                </div>
              </div>
            </div>

            {/* Lead Form Section */}
             <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold text-rg-blue mb-4 border-b pb-2">Formulário de Contato</h2>
              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Imagem Lateral do Formulário</label>
                    <div className="flex flex-col gap-3">
                        <div className="w-full h-40 bg-gray-100 rounded overflow-hidden border border-gray-200">
                             {formData.leadForm?.image ? (
                                <img src={formData.leadForm.image} className="w-full h-full object-cover" alt="Lead Form" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">Sem imagem</div>
                             )}
                        </div>
                        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-full">
                            <Upload size={16} />
                            <span className="text-sm">Alterar Imagem Lateral</span>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleFileUpload(e, (base64) => setFormData({...formData, leadForm: { ...formData.leadForm, image: base64 }}))} 
                                className="hidden" 
                            />
                        </label>
                    </div>
                </div>
                <div className="flex items-center">
                   <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                      Esta imagem aparece ao lado do formulário de contato na parte inferior do site. Escolha uma imagem vertical ou quadrada de alta qualidade.
                   </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'products' && (
            <div className="animate-fade-in">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-rg-blue">Catálogo de Produtos</h2>
                        <p className="text-sm text-gray-500">Adicione, edite ou remova produtos do catálogo completo.</p>
                    </div>
                    <button onClick={addProduct} className="bg-rg-blue text-white px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-900 shadow-lg transform hover:-translate-y-0.5 transition-all w-full md:w-auto justify-center">
                        <Plus size={18} /> Adicionar Novo Produto
                    </button>
                </div>

                <div className="grid gap-6">
                    {formData.products.map((product) => (
                        <div key={product.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-white hover:shadow-md transition-all relative grid md:grid-cols-[150px_1fr] gap-6">
                            
                            {/* Image Section */}
                            <div className="flex flex-col gap-2">
                                <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden relative group">
                                    <img src={product.image} className="w-full h-full object-cover" alt="Preview" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-xs">Alterar</span>
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e) => handleFileUpload(e, (base64) => handleProductChange(product.id, 'image', base64))} 
                                        className="absolute inset-0 opacity-0 cursor-pointer" 
                                    />
                                </div>
                                <button onClick={() => removeProduct(product.id)} className="text-red-500 text-xs flex items-center justify-center gap-1 hover:text-red-700 py-1 border border-red-200 rounded bg-white">
                                    <Trash size={12} /> Remover
                                </button>
                            </div>

                            {/* Info Section */}
                            <div className="grid gap-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Nome do Produto</label>
                                        <input 
                                            type="text" 
                                            value={product.name} 
                                            onChange={(e) => handleProductChange(product.id, 'name', e.target.value)} 
                                            className="w-full p-2 border rounded text-sm font-semibold" 
                                            placeholder="Ex: Mussarela"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Categoria</label>
                                        <input 
                                            type="text" 
                                            value={product.category} 
                                            onChange={(e) => handleProductChange(product.id, 'category', e.target.value)} 
                                            className="w-full p-2 border rounded text-sm" 
                                            placeholder="Ex: Queijos"
                                            list="categories"
                                        />
                                        <datalist id="categories">
                                            <option value="Queijos" />
                                            <option value="Fatiados" />
                                            <option value="Embutidos" />
                                            <option value="Tradicional" />
                                        </datalist>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Descrição Curta</label>
                                    <input 
                                        type="text" 
                                        value={product.description || ''} 
                                        onChange={(e) => handleProductChange(product.id, 'description', e.target.value)} 
                                        className="w-full p-2 border rounded text-sm" 
                                        placeholder="Breve descrição do produto..."
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 items-center">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Preço (Opcional)</label>
                                        <input 
                                            type="text" 
                                            value={product.price || ''} 
                                            onChange={(e) => handleProductChange(product.id, 'price', e.target.value)} 
                                            className="w-full p-2 border rounded text-sm" 
                                            placeholder="R$ 0,00 ou Consulte"
                                        />
                                    </div>
                                    <div className="flex items-center pt-4">
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input 
                                                type="checkbox" 
                                                checked={!!product.isFeatured} 
                                                onChange={(e) => handleProductChange(product.id, 'isFeatured', e.target.checked)}
                                                className="w-5 h-5 text-rg-yellow rounded focus:ring-rg-yellow border-gray-300" 
                                            />
                                            <span className={`text-sm font-bold flex items-center gap-1 ${product.isFeatured ? 'text-rg-yellow' : 'text-gray-400'}`}>
                                                <Star size={16} fill={product.isFeatured ? "currentColor" : "none"} />
                                                Destacar na Home
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            </div>
        )}

        {activeTab === 'leads' && (
          <div className="bg-white p-6 rounded-xl shadow-sm animate-fade-in">
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-rg-blue">Base de Leads</h2>
                    <p className="text-gray-500 text-sm">Contatos capturados através da Landing Page</p>
                </div>
                <button 
                    onClick={downloadLeadsCSV}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700 transition-colors"
                >
                    <Download size={18} /> Baixar Planilha (CSV)
                </button>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="p-4 font-bold text-gray-600 text-sm">Data</th>
                            <th className="p-4 font-bold text-gray-600 text-sm">Nome</th>
                            <th className="p-4 font-bold text-gray-600 text-sm">WhatsApp (Internacional)</th>
                            <th className="p-4 font-bold text-gray-600 text-sm text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.length > 0 ? (
                            leads.map((lead) => (
                                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4 text-sm text-gray-500">{lead.date}</td>
                                    <td className="p-4 font-medium text-rg-blue">{lead.name}</td>
                                    <td className="p-4 font-mono text-sm text-gray-600">{lead.phone}</td>
                                    <td className="p-4 text-center">
                                       <div className="flex items-center justify-center gap-3">
                                          <a 
                                              href={`https://wa.me/${lead.phone}`} 
                                              target="_blank" 
                                              className="text-green-600 hover:text-green-800 text-sm font-bold border border-green-200 bg-green-50 px-3 py-1 rounded"
                                          >
                                              Chamar
                                          </a>
                                          <button 
                                              onClick={() => removeLead(lead.id)}
                                              className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                                              title="Excluir Lead"
                                          >
                                              <Trash size={18} />
                                          </button>
                                       </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-400 italic">
                                    Nenhum lead capturado ainda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};