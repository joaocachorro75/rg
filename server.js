import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Middleware
app.use(cors());
// Aumentado para 500mb para garantir que o arquivo db.json possa crescer
// com muitas imagens sem bloquear o salvamento (Erro 413 Payload Too Large)
app.use(express.json({ limit: '500mb' })); 
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Dados padrão iniciais
const defaultData = {
  content: {
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
  },
  leads: []
};

// Inicializar DB
async function initDB() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DB_FILE);
    } catch {
      await fs.writeFile(DB_FILE, JSON.stringify(defaultData, null, 2));
    }
  } catch (error) {
    console.error('Erro ao inicializar DB:', error);
  }
}

// Ler DB
async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo estiver corrompido ou vazio, retorna o padrão
    return defaultData;
  }
}

// Escrever DB
async function writeDB(data) {
  // Escreve com indentação para facilitar debug se necessário
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// API Routes
app.get('/api/data', async (req, res) => {
  const data = await readDB();
  res.json(data);
});

app.post('/api/content', async (req, res) => {
  try {
    const currentData = await readDB();
    const newContent = req.body;
    
    // Mantém os leads existentes, atualiza apenas o conteúdo
    const dataToSave = {
        ...currentData,
        content: newContent
    };
    
    await writeDB(dataToSave);
    res.json({ success: true, content: dataToSave.content });
  } catch (error) {
    console.error('Erro ao salvar:', error);
    res.status(500).json({ error: 'Falha ao salvar conteúdo' });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const currentData = await readDB();
    const newLead = req.body;
    
    // Garante que leads seja um array
    if (!Array.isArray(currentData.leads)) {
        currentData.leads = [];
    }
    
    currentData.leads.push(newLead);
    await writeDB(currentData);
    res.json({ success: true, leads: currentData.leads });
  } catch (error) {
    console.error('Erro ao salvar lead:', error);
    res.status(500).json({ error: 'Falha ao salvar lead' });
  }
});

app.delete('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const currentData = await readDB();
    
    if (Array.isArray(currentData.leads)) {
        currentData.leads = currentData.leads.filter(l => l.id !== id);
        await writeDB(currentData);
    }
    
    res.json({ success: true, leads: currentData.leads });
  } catch (error) {
    res.status(500).json({ error: 'Falha ao remover lead' });
  }
});

app.post('/api/reset', async (req, res) => {
  try {
    const currentData = await readDB();
    // Mantém os leads, reseta o conteúdo para o padrão
    const newData = {
      ...defaultData,
      leads: currentData.leads || []
    };
    await writeDB(newData);
    res.json({ success: true, content: newData.content });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao resetar' });
  }
});

// Servir arquivos estáticos do React (Production)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback para React Router (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Inicializar e rodar
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Dados salvos em: ${DB_FILE}`);
  });
});