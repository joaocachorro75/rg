import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos de dados
export interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
  description?: string;
  price?: string;
  isFeatured?: boolean; // Se true, aparece na Home page
}

export interface Lead {
  id: string;
  name: string;
  phone: string; // Formato 5511999999999
  date: string;
}

export interface SiteContent {
  global: {
    logoUrl: string;
    whatsapp: string; // Apenas números
    email: string;
    address: string;
    instagramUrl: string;
    facebookUrl: string;
  };
  hero: {
    title: string;
    subtitle: string;
    bgImage: string;
    highlightText: string;
    highlightImage: string; // Imagem da Tábua Gourmet/Destaque
  };
  leadForm: {
    image: string; // Imagem lateral do formulário
  };
  products: Product[];
}

interface ContentContextType {
  content: SiteContent;
  leads: Lead[];
  updateContent: (newContent: SiteContent) => void;
  addLead: (name: string, rawPhone: string) => void;
  removeLead: (id: string) => void;
  downloadLeadsCSV: () => void;
  resetToDefaults: () => void;
}

// Conteúdo Padrão Inicial
const defaultContent: SiteContent = {
  global: {
    logoUrl: "/logo.png",
    whatsapp: "5511999999999",
    email: "contato@rgfrios.com.br",
    address: "Rua dos Frios, 123 - Centro, São Paulo - SP",
    instagramUrl: "#",
    facebookUrl: "#"
  },
  hero: {
    title: "O Sabor Que Faz a Diferença",
    subtitle: "A RG Frios e Fatiados traz para sua mesa e seu negócio a melhor seleção de frios, com cortes precisos e frescor garantido todos os dias.",
    bgImage: "https://images.unsplash.com/photo-1552594619-338276166548?q=80&w=2070&auto=format&fit=crop",
    highlightText: "Qualidade Premium Garantida",
    highlightImage: "https://images.unsplash.com/photo-1621342674251-c03534d0b043?q=80&w=800"
  },
  leadForm: {
    image: "https://images.unsplash.com/photo-1630404456637-d2004d168e31?q=80&w=800&auto=format&fit=crop"
  },
  products: [
    { id: 1, name: "Mussarela Fatiada", image: "https://images.unsplash.com/photo-1624806992098-b861295e8656?q=80&w=600&auto=format&fit=crop", category: "Queijos", description: "Mussarela de primeira qualidade, fatiada na hora.", price: "R$ 45,90/kg", isFeatured: true },
    { id: 2, name: "Presunto Cozido", image: "https://images.unsplash.com/photo-1606850827253-67845772392b?q=80&w=600&auto=format&fit=crop", category: "Fatiados", description: "Presunto suculento e magro.", price: "R$ 39,90/kg", isFeatured: true },
    { id: 3, name: "Salame Italiano", image: "https://images.unsplash.com/photo-1525286102393-863a6e9a7e0d?q=80&w=600&auto=format&fit=crop", category: "Embutidos", description: "Sabor intenso e cura perfeita.", price: "R$ 89,90/kg", isFeatured: true },
    { id: 4, name: "Peito de Peru", image: "https://images.unsplash.com/photo-1587394073380-6060c5da8826?q=80&w=600&auto=format&fit=crop", category: "Light", description: "Opção leve e saudável para seus lanches.", price: "R$ 65,00/kg", isFeatured: true },
    { id: 5, name: "Mortadela Defumada", image: "https://images.unsplash.com/photo-1619864205510-7561219b678f?q=80&w=600&auto=format&fit=crop", category: "Tradicional", description: "O clássico do café da manhã.", price: "R$ 29,90/kg", isFeatured: true },
    { id: 6, name: "Queijo Prato", image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=600&auto=format&fit=crop", category: "Queijos", description: "Derrete fácil, ideal para sanduíches.", price: "R$ 48,90/kg", isFeatured: true }
  ]
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [leads, setLeads] = useState<Lead[]>([]);

  // Carregar do LocalStorage ao iniciar
  useEffect(() => {
    const savedContent = localStorage.getItem('rg_site_content');
    const savedLeads = localStorage.getItem('rg_site_leads');

    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent);
        // Merge cuidadoso para garantir que novos campos (como highlightImage e leadForm) existam mesmo se o localStorage for antigo
        setContent(prev => ({
          ...defaultContent,
          ...parsed,
          hero: { ...defaultContent.hero, ...(parsed.hero || {}) },
          leadForm: { ...defaultContent.leadForm, ...(parsed.leadForm || {}) },
          global: { ...defaultContent.global, ...(parsed.global || {}) }
        }));
      } catch (e) {
        console.error("Erro ao carregar conteúdo salvo", e);
      }
    }
    
    if (savedLeads) {
      try {
        setLeads(JSON.parse(savedLeads));
      } catch (e) {
        console.error("Erro ao carregar leads", e);
      }
    }
  }, []);

  const updateContent = (newContent: SiteContent) => {
    setContent(newContent);
    localStorage.setItem('rg_site_content', JSON.stringify(newContent));
  };

  const addLead = (name: string, rawPhone: string) => {
    // Formatar telefone para padrão internacional (55 + DDD + Numero)
    // Remove tudo que não for número
    let nums = rawPhone.replace(/\D/g, "");
    
    // Se começar com 0, remove
    if (nums.startsWith("0")) nums = nums.substring(1);
    
    // Se não tiver 55 (DDI Brasil), adiciona. Assumindo que se tiver < 12 dígitos, falta o DDI
    // Ex: 11999999999 (11 digitos) -> adiciona 55
    if (nums.length <= 11) {
      nums = "55" + nums;
    }

    const newLead: Lead = {
      id: Date.now().toString(),
      name,
      phone: nums,
      date: new Date().toLocaleString('pt-BR')
    };

    const updatedLeads = [...leads, newLead];
    setLeads(updatedLeads);
    localStorage.setItem('rg_site_leads', JSON.stringify(updatedLeads));
  };

  const removeLead = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este lead?")) {
      const updatedLeads = leads.filter(l => l.id !== id);
      setLeads(updatedLeads);
      localStorage.setItem('rg_site_leads', JSON.stringify(updatedLeads));
    }
  };

  const downloadLeadsCSV = () => {
    const header = ["Nome", "WhatsApp (Internacional)", "Data de Cadastro"];
    const rows = leads.map(lead => [lead.name, lead.phone, lead.date]);
    
    const csvContent = [
      header.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_rg_frios_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetToDefaults = () => {
    if (confirm("Tem certeza? Isso apagará todas as edições de texto e imagens (Leads serão mantidos).")) {
      updateContent(defaultContent);
    }
  }

  return (
    <ContentContext.Provider value={{ content, leads, updateContent, addLead, removeLead, downloadLeadsCSV, resetToDefaults }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useContent must be used within a ContentProvider");
  return context;
};