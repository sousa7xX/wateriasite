import React, { useState } from 'react';
import { User as UserIcon, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { authService } from '../services/authService';
import { User, AppView } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  setView: (view: AppView) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, setView }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    try {
      const user = await authService.login(username);
      onLogin(user);
      setView(AppView.GENERATOR);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/60 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-xl animate-float" style={{ animationDuration: '6s' }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <UserIcon className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Entrar no Hub</h2>
          <p className="text-slate-400 text-sm mt-2">Crie uma conta temporária para salvar seus scripts.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="Ex: ScripterPro2024"
              required
            />
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full text-lg py-3">
            Entrar <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Não é necessário senha. Isso é uma simulação de conta local.
        </p>
      </div>
    </div>
  );
};