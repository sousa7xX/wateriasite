import React from 'react';
import { Zap, Shield, Laptop, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { AppView } from '../types';

interface HomeProps {
  onChangeView: (view: AppView) => void;
}

export const Home: React.FC<HomeProps> = ({ onChangeView }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-8 animate-float">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          Gemini 3.0 Pro Powered
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Crie Scripts <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Luau</span> <br />
          com Inteligência Artificial
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
          O Water IA Hub gera código otimizado para Roblox em segundos. Compatível com Xeno, Fluxus e outros executores. Sem Key System. Totalmente gratuito.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={() => onChangeView(AppView.GENERATOR)} className="w-full sm:w-auto text-lg py-4">
            Começar Agora <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="secondary" onClick={() => onChangeView(AppView.LIBRARY)} className="w-full sm:w-auto text-lg py-4">
            Ver Biblioteca
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-6xl mx-auto w-full">
        <FeatureCard 
          icon={<Zap className="w-8 h-8 text-yellow-400" />}
          title="Instantâneo"
          description="Geração de código em tempo real usando modelos de IA avançados."
        />
        <FeatureCard 
          icon={<Shield className="w-8 h-8 text-green-400" />}
          title="Seguro & Clean"
          description="Scripts otimizados para não crashar e evitar detecções simples."
        />
        <FeatureCard 
          icon={<Laptop className="w-8 h-8 text-purple-400" />}
          title="Compatibilidade"
          description="Funciona perfeitamente em executores mobile e PC modernos."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-6 rounded-2xl bg-slate-800/30 border border-white/5 hover:border-cyan-500/30 transition-all hover:bg-slate-800/50 backdrop-blur-sm">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </div>
);