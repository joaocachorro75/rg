import React, { useState } from 'react';
import { Send, CheckCircle, Smartphone } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export const LeadForm: React.FC = () => {
  const { content, addLead } = useContent();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setSubmitted(true);
    
    // Salvar o Lead no sistema administrativo
    addLead(name, phone);

    // Formatar mensagem para WhatsApp
    const message = `Olá! Me chamo *${name}*. Gostaria de ver o catálogo da RG Frios e saber mais sobre os preços e produtos.`;
    
    // URL com número do Admin vindo do Contexto
    const whatsappUrl = `https://wa.me/${content.global.whatsapp}?text=${encodeURIComponent(message)}`;
    
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setName('');
        setPhone('');
        setSubmitted(false);
    }, 1500);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    setPhone(value);
  };

  return (
    <section id="orcamento" className="py-24 bg-rg-blue relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rg-yellow/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rg-red/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden md:flex max-w-6xl mx-auto min-h-[500px]">
          
          <div className="md:w-1/2 relative bg-gray-900">
            <img 
              src={content.leadForm?.image || "https://images.unsplash.com/photo-1630404456637-d2004d168e31?q=80&w=800&auto=format&fit=crop"}
              alt="Balcão de frios" 
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rg-blue/90 to-transparent flex flex-col justify-end p-10">
              <div className="mb-6">
                <span className="bg-rg-yellow text-rg-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Atendimento Rápido</span>
                <h3 className="text-4xl font-display font-bold text-white mb-4">Faça seu Pedido Agora</h3>
                <p className="text-gray-200 text-lg leading-relaxed">
                  Receba nosso catálogo completo e atualizado diretamente no seu WhatsApp. Preços especiais para comerciantes e grandes volumes.
                </p>
              </div>
              <div className="flex items-center gap-4 text-white/80 text-sm border-t border-white/20 pt-6">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-rg-blue"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-rg-blue"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-rg-blue"></div>
                </div>
                <p>+1000 clientes atendidos</p>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
            <div className="mb-8">
               <h2 className="text-3xl font-display font-bold text-rg-blue mb-2">
                 Fale com a gente
               </h2>
               <p className="text-gray-500">Preencha seus dados para iniciar o atendimento.</p>
            </div>
            
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-fade-in flex flex-col items-center justify-center h-64">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                   <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h4 className="text-2xl font-bold text-green-800 mb-2">Tudo Certo!</h4>
                <p className="text-green-700">Abrindo seu WhatsApp...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700 ml-1">Seu Nome</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-rg-yellow focus:ring-0 transition-all outline-none font-medium"
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-700 ml-1">Seu WhatsApp</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="w-full pl-12 pr-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-rg-yellow focus:ring-0 transition-all outline-none font-medium"
                      placeholder="(DD) 99999-9999"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-rg-red hover:bg-red-700 text-white font-bold py-5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-lg"
                >
                  <Send size={22} />
                  Solicitar Tabela de Preços
                </button>
                <p className="text-xs text-gray-400 text-center mt-4">
                  Seus dados estão seguros. Não enviamos spam.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};