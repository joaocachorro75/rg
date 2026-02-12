import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-rg-blue p-4 rounded-full">
            <Lock className="text-rg-yellow" size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-rg-blue mb-6">Acesso Administrativo</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rg-blue focus:border-transparent outline-none"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rg-blue focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">
              Credenciais inválidas. Tente novamente.
            </div>
          )}
          
          <button 
            type="submit" 
            className="w-full bg-rg-blue text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition-colors shadow-lg"
          >
            Entrar
          </button>
        </form>
        <div className="mt-6 text-center">
            {/* Usando href="#" e manipulando o hash para evitar recarregamento quebrado */}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '';
              }} 
              className="text-gray-500 hover:text-rg-blue text-sm underline"
            >
              Voltar para o site
            </a>
        </div>
      </div>
    </div>
  );
};