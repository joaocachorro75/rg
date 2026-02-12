import React from 'react';
import { ShieldCheck, Truck, UtensilsCrossed, Clock } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-rg-blue transition-colors">
      <Icon className="text-rg-blue group-hover:text-rg-yellow transition-colors" size={28} />
    </div>
    <h3 className="text-xl font-bold text-rg-blue mb-3 font-display">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export const Features: React.FC = () => {
  return (
    <section id="qualidade" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-rg-yellow font-bold uppercase tracking-widest text-sm mb-2">Por que escolher a RG?</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-rg-blue mb-6">
            Compromisso com a <span className="text-rg-red">Qualidade</span> e Higiene
          </h3>
          <p className="text-gray-600 text-lg">
            Nossos processos garantem que você receba o produto mais fresco, com corte perfeito e sabor inigualável para o seu negócio ou sua casa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={ShieldCheck}
            title="Higiene Total"
            description="Seguimos rigorosos protocolos sanitários para garantir a segurança alimentar de todos os nossos produtos."
          />
          <FeatureCard 
            icon={UtensilsCrossed}
            title="Corte Preciso"
            description="Equipamentos de última geração para fatiados finos, uniformes e prontos para servir."
          />
          <FeatureCard 
            icon={Clock}
            title="Sempre Fresco"
            description="Reposição diária de estoque. Garantimos que o produto chegue com frescor máximo até você."
          />
          <FeatureCard 
            icon={Truck}
            title="Entrega Ágil"
            description="Logística eficiente para que seus pedidos cheguem no prazo combinado, preservando a qualidade."
          />
        </div>
      </div>
    </section>
  );
};