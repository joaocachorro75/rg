import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos de dados
export interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
  description?: string;
  price?: string;
  isFeatured?: boolean;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  date: string;
}

export interface SiteContent {
  global: {
    logoUrl: string;
    whatsapp: string;
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
    highlightImage: string;
  };
  leadForm: {
    image: string;
  };
  products: Product[];
}

interface ContentContextType {
  content: SiteContent;
  leads: Lead[];
  isLoading: boolean;
  updateContent: (newContent: SiteContent) => Promise<void>;
  addLead: (name: string, rawPhone: string) => Promise<void>;
  removeLead: (id: string) => Promise<void>;
  downloadLeadsCSV: () => void;
  resetToDefaults: () => Promise<void>;
}

// Conteúdo Padrão (Fallback enquanto carrega)
const defaultContent: SiteContent = {
  global: {
    logoUrl: "",
    whatsapp: "5511999999999",
    email: "contato@rgfrios.com.br",
    address: "Rua dos Frios, 123 - Centro, São Paulo - SP",
    instagramUrl: "#",
    facebookUrl: "#"
  },
  hero: {
    title: "O Sabor Que Faz a Diferença",
    subtitle: "Carregando informações...",
    bgImage: "https://images.unsplash.com/photo-1552594619-338276166548?q=80&w=2070&auto=format&fit=crop",
    highlightText: "Qualidade Premium",
    highlightImage: "https://images.unsplash.com/photo-1621342674251-c03534d0b043?q=80&w=800"
  },
  leadForm: {
    image: "https://images.unsplash.com/photo-1630404456637-d2004d168e31?q=80&w=800&auto=format&fit=crop"
  },
  products: []
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados da API ao iniciar
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (response.ok) {
        const data = await response.json();
        if (data.content) setContent(data.content);
        if (data.leads) setLeads(data.leads);
      }
    } catch (error) {
      console.error("Erro ao conectar com servidor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = async (newContent: SiteContent) => {
    // Atualiza localmente para feedback instantâneo
    setContent(newContent);
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent)
      });
    } catch (error) {
      console.error("Erro ao salvar conteúdo:", error);
      alert("Erro ao salvar no servidor.");
    }
  };

  const addLead = async (name: string, rawPhone: string) => {
    let nums = rawPhone.replace(/\D/g, "");
    if (nums.startsWith("0")) nums = nums.substring(1);
    if (nums.length <= 11) nums = "55" + nums;

    const newLead: Lead = {
      id: Date.now().toString(),
      name,
      phone: nums,
      date: new Date().toLocaleString('pt-BR')
    };

    // Atualiza localmente
    setLeads(prev => [...prev, newLead]);

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      });
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
    }
  };

  const removeLead = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este lead?")) {
      setLeads(prev => prev.filter(l => l.id !== id));
      try {
        await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      } catch (error) {
        console.error("Erro ao remover lead:", error);
      }
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

  const resetToDefaults = async () => {
    if (confirm("Tem certeza? Isso apagará todas as edições de texto e imagens.")) {
      try {
        const res = await fetch('/api/reset', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setContent(data.content);
          window.location.reload();
        }
      } catch (error) {
        console.error("Erro ao resetar:", error);
      }
    }
  }

  return (
    <ContentContext.Provider value={{ content, leads, isLoading, updateContent, addLead, removeLead, downloadLeadsCSV, resetToDefaults }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useContent must be used within a ContentProvider");
  return context;
};